from fastapi import FastAPI, APIRouter, Request, BackgroundTasks
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import httpx


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Bookafy API config
BOOKAFY_API_KEY = os.environ.get('BOOKAFY_API_KEY', '')
BOOKAFY_API_BASE = "https://app.bookafy.com"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# A/B Test Tracking Models
class VariantVisit(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    variant: str  # "A" or "B"
    email: Optional[str] = None
    session_id: str
    page: str  # "vsl" or "schedule"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    converted: bool = False  # Set to True when booking is made

class VariantVisitCreate(BaseModel):
    variant: str
    session_id: str
    page: str
    email: Optional[str] = None

class BookingConversion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    variant: str
    customer_email: str
    customer_name: str
    appointment_id: str
    appointment_date: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# ============================================
# A/B TEST TRACKING ENDPOINTS
# ============================================

@api_router.post("/track-variant")
async def track_variant_visit(visit: VariantVisitCreate):
    """Track when a user visits with a specific variant"""
    visit_obj = VariantVisit(**visit.model_dump())
    doc = visit_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    await db.variant_visits.insert_one(doc)
    logger.info(f"Tracked variant visit: {visit.variant} on {visit.page} (session: {visit.session_id})")
    return {"status": "tracked", "id": visit_obj.id}

@api_router.post("/bookafy/webhook")
async def bookafy_webhook(request: Request):
    """Receive webhook from Bookafy when appointment is created"""
    try:
        payload = await request.json()
        logger.info(f"Bookafy webhook received: {payload}")
        
        # Extract appointment data - Bookafy sends it under 'object' key
        appointment = payload.get('object', payload.get('appointment', payload))
        customer_info = appointment.get('appointment_customer_info', {})
        customer = appointment.get('customer', {})
        
        # Get customer details
        customer_email = customer_info.get('email') or customer.get('customer_detail_hstore', {}).get('email', '')
        customer_name = customer_info.get('name') or customer.get('customer_detail_hstore', {}).get('name', '')
        appointment_id = str(appointment.get('id', ''))
        appointment_date = appointment.get('appointment_date', '')
        
        if customer_email:
            # Find the most recent variant visit for this email or recent session
            recent_visit = await db.variant_visits.find_one(
                {"email": customer_email, "converted": False},
                sort=[("timestamp", -1)]
            )
            
            # If no email match, find most recent unconverted schedule page visit (within last hour)
            if not recent_visit:
                from datetime import timedelta
                one_hour_ago = (datetime.now(timezone.utc) - timedelta(hours=1)).isoformat()
                recent_visit = await db.variant_visits.find_one(
                    {"page": "schedule", "converted": False, "timestamp": {"$gte": one_hour_ago}},
                    sort=[("timestamp", -1)]
                )
            
            variant = recent_visit.get('variant', 'unknown') if recent_visit else 'unknown'
            
            # Record the conversion
            conversion = BookingConversion(
                variant=variant,
                customer_email=customer_email,
                customer_name=customer_name,
                appointment_id=appointment_id,
                appointment_date=appointment_date
            )
            doc = conversion.model_dump()
            doc['timestamp'] = doc['timestamp'].isoformat()
            await db.booking_conversions.insert_one(doc)
            
            # Mark the visit as converted
            if recent_visit:
                await db.variant_visits.update_one(
                    {"id": recent_visit['id']},
                    {"$set": {"converted": True}}
                )
            
            logger.info(f"Booking conversion recorded: {customer_email} from Variant {variant}")
            return {"status": "conversion_recorded", "variant": variant}
        
        return {"status": "received", "note": "no customer email found"}
        
    except Exception as e:
        logger.error(f"Bookafy webhook error: {str(e)}")
        return {"status": "error", "message": str(e)}

@api_router.get("/ab-stats")
async def get_ab_stats():
    """Get A/B test statistics"""
    # Get conversion counts by variant
    conversions = await db.booking_conversions.find({}, {"_id": 0}).to_list(1000)
    visits = await db.variant_visits.find({"page": "schedule"}, {"_id": 0}).to_list(1000)
    
    stats = {
        "variant_a": {
            "visits": len([v for v in visits if v.get('variant') == 'A']),
            "conversions": len([c for c in conversions if c.get('variant') == 'A'])
        },
        "variant_b": {
            "visits": len([v for v in visits if v.get('variant') == 'B']),
            "conversions": len([c for c in conversions if c.get('variant') == 'B'])
        },
        "recent_conversions": conversions[-10:] if conversions else []
    }
    
    # Calculate conversion rates
    for v in ['variant_a', 'variant_b']:
        visits_count = stats[v]['visits']
        conv_count = stats[v]['conversions']
        stats[v]['conversion_rate'] = f"{(conv_count/visits_count*100):.1f}%" if visits_count > 0 else "0%"
    
    return stats

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()