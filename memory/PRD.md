# VSL Landing Page - Product Requirements Document

## Original Problem Statement
Build a VSL (Video Sales Letter) landing page for Visibility Pixel / Anonymous Buyer Reveal System with:
- Vimeo video embed
- Long-form VSL with CTAs throughout
- Booking page with Bookafy calendar embed
- Styling based on TalkingHeads.com (later updated to clean white/light premium theme per Tab 5)

## User Personas
- **Primary**: B2B Business Owners, CMOs, Marketing Directors
- **Traffic Profile**: Spending $10K+/month on SEO/PPC/ads
- **Product Type**: High-ticket offers requiring multi-touch sales cycles
- **Visitor Volume**: 3,000+ monthly website visitors

## Core Requirements (Static)
1. Hero section with Vimeo VSL video embed
2. Long-form sales copy with CTAs throughout every section
3. Big 97% stat section with animated counter
4. Split comparison block (What You See vs What You Could See)
5. 3-step process cards (Install, Monitor, Reveal)
6. FAQ accordion section
7. Dark final CTA section
8. Booking page with Bookafy calendar integration

## What's Been Implemented (Feb 2026)
- [x] VSL Page with all sections from Tab 4 content
- [x] Vimeo video embed (https://vimeo.com/1167050545/8067fe9053)
- [x] Animated 97% counter with scroll trigger
- [x] Split comparison block (Today vs With Visibility)
- [x] Minimal 3-step cards
- [x] FAQ accordion (5 items)
- [x] Alternating white/gray backgrounds
- [x] Dark final CTA section
- [x] Schedule page with Bookafy calendar embed
- [x] Responsive design (mobile, tablet, desktop)
- [x] Framer Motion animations
- [x] Premium typography (Outfit + Inter fonts)

## Architecture
- **Frontend**: React 19 + Tailwind CSS + Framer Motion
- **Backend**: FastAPI (minimal - no backend required for VSL)
- **UI Components**: Shadcn/UI (Accordion)
- **Calendar**: Bookafy (https://websitetalkingheads.bookafy.com)

## Prioritized Backlog

### P0 - Complete
- All core VSL functionality implemented

### P1 - Enhancement Ideas
- Add video completion tracking (analytics)
- A/B testing for different CTA copy
- Exit intent popup with email capture

### P2 - Nice to Have
- Social proof logos section (grayscale, muted)
- Testimonials carousel
- Cookie consent banner

## Next Tasks
1. User to review and approve design
2. Consider adding UTM tracking for marketing attribution
3. Optional: Add Google Analytics/conversion tracking
