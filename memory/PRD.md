# VisiFinder™ VSL Landing Page - Product Requirements Document

## Original Problem Statement
Build a VSL (Video Sales Letter) landing page for VisiFinder (Visibility Pixel / Anonymous Buyer Reveal System) with:
- Vimeo video embed
- Long-form VSL with CTAs throughout
- Booking page with Bookafy calendar embed
- Styling based on TalkingHeads.com brand colors
- A/B testing for headline variations
- "See the Difference" visual section with user-provided comparison image

## Product Name
**VisiFinder™** - Your Invisible Traffic, Finally Visible

## Iterations
- **v1**: Clean white/light theme per Tab 5 guidelines
- **v2**: Major redesign with TalkingHeads brand colors, pain-focused hook, visual graphs
- **v3**: "Wow factor" redesign with glassmorphism, floating cards, 3D transforms
- **v4 (Current)**: Added A/B testing + "See the Difference" visual section

## User Personas
- **Primary**: B2B, B2C, and DTC Business Owners, CMOs, Marketing Directors
- **Traffic Profile**: Spending $10K+/month on SEO/PPC/ads
- **Product Type**: High-ticket offers requiring multi-touch sales cycles
- **Visitor Volume**: 3,000+ monthly website visitors

## What's Been Implemented (Feb 2026)
- [x] Strong pain-focused hook: "97% walking out the door"
- [x] TalkingHeads brand colors (Gold #EAA73F, Blue #589DFD)
- [x] Pain bar graph visualization (100% spend vs 3% leads)
- [x] Before/after comparison cards with images
- [x] Animated 97% counter on dark background
- [x] Golden gradient CTAs throughout
- [x] Vimeo video embed with gold border
- [x] 3-step reveal section
- [x] FAQ accordion
- [x] Schedule page with Bookafy calendar
- [x] Fully responsive design
- [x] A/B testing system for main headline (configurable via JSON)
- [x] "See the Difference" visual section with user-provided image
- [x] Labels positioned below comparison image (verified Feb 23, 2026)

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **UI Components**: Shadcn/UI (Accordion)
- **Calendar**: Bookafy (https://websitetalkingheads.bookafy.com)
- **Video**: Vimeo embed
- **A/B Testing**: Client-side via `abTest.js` config, URL param override (`?variant=A` or `?variant=B`)

## Key Files
- `frontend/src/pages/VSLPage.jsx` - Main VSL page (all sections)
- `frontend/src/pages/SchedulePage.jsx` - Bookafy calendar embed
- `frontend/src/config/abTest.js` - A/B test headline configuration
- `frontend/src/index.css` - Global styles & CSS variables

## Brand Colors
- Primary Gold: #EAA73F
- Accent Blue: #589DFD
- Dark: #0a0a0a
- Red (pain): #ef4444

## 3rd Party Integrations
- Vimeo (video embed)
- Bookafy.com (calendar scheduling)
- Google Fonts (Outfit, Inter)

## Next Tasks / Backlog
1. Refactor VSLPage.jsx into smaller components (HeroSection, DifferenceSection, etc.)
2. Optional: Add exit-intent popup
3. Optional: Analytics/tracking for A/B test conversions
