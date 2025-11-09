# RozKaam Design Guidelines

## Design Approach
**Hybrid Approach**: Drawing inspiration from Airbnb's marketplace aesthetics for consumer-facing pages (landing, worker listings) combined with Material Design principles for dashboard/data-heavy sections. This balances trust-building visual appeal with functional efficiency.

**Key Design Principles**:
- Trust-first design with prominent verification indicators
- Clear role-based visual hierarchy
- Mobile-optimized for on-the-go service booking
- Information density without clutter

## Typography

**Font Stack**: 
- Primary: 'Inter' (Google Fonts) - for UI elements, dashboards, data
- Display: 'Poppins' (Google Fonts) - for headings, CTAs, landing page

**Hierarchy**:
- H1 (Landing hero): Poppins, 3.5rem (56px), font-bold
- H2 (Section headers): Poppins, 2.5rem (40px), font-semibold
- H3 (Card titles): Inter, 1.5rem (24px), font-semibold
- H4 (Subsections): Inter, 1.25rem (20px), font-medium
- Body: Inter, 1rem (16px), font-normal
- Small/Meta: Inter, 0.875rem (14px), font-normal
- Buttons: Inter, 1rem, font-semibold

## Layout System

**Spacing Scale**: Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24
- Component padding: p-4 to p-6
- Section spacing: py-16 to py-24
- Card gaps: gap-6 to gap-8
- Element margins: mb-4, mb-8, mb-12

**Grid Structure**:
- Desktop max-width: max-w-7xl
- Content sections: max-w-6xl
- Text content: max-w-4xl
- Multi-column grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Landing Page
**Hero Section** (80vh):
- Large hero image showing local workers/household services (warm, authentic photography)
- Centered content with blurred-background overlay
- H1 headline: "RozKaam — Verified Workers, Trusted Households"
- Subheading: "Connecting local communities with verified service professionals"
- Two prominent CTAs side-by-side: "Login as Worker" (primary) / "Login as Household" (secondary)

**Features Section** (3-column grid on desktop):
- Icon + Title + Description cards
- Features: "Police Verified Workers", "5% Simple Commission", "Local & Trusted"
- Cards with subtle shadow, rounded corners (rounded-lg)

**How It Works** (2-column alternating layout):
- For Workers / For Households sections
- Step-by-step numbered process
- Supporting illustrations/icons

### Authentication Pages
- Centered card layout (max-w-md)
- Role indicator badge at top showing selected role
- Form fields with labels above inputs
- Password visibility toggle
- "Forgot password?" link
- Primary CTA button full-width
- Social login options below (Google, etc. via Replit Auth)

### Worker Dashboard
**Header**:
- Profile section: Avatar (left) + Name + Verification Badge (green checkmark if verified, yellow pending, red if rejected)
- Availability toggle (prominent switch component)
- "Edit Profile" button

**Main Content** (2-column on desktop):
- Left column (60%): 
  - "Active Bookings" cards with household info, service type, date
  - Each booking card has "Mark Complete" button
- Right column (40%):
  - Profile summary card
  - Earnings overview (total, pending, completed)
  - Verification status card with upload option

### Household Dashboard
**Search & Filter Bar**:
- Sticky at top, full-width
- Search input with icon
- Filter dropdowns: Service Type, Location/Pincode, Price Range
- Results count display

**Worker Grid** (3-column on desktop, 2 on tablet):
- Worker cards with:
  - Profile photo (rounded-full)
  - Name + Verification badge (prominent)
  - Service tags (pill badges)
  - Hourly rate (large, bold)
  - Availability indicator (green dot + "Available Now")
  - "Hire Now" button (full-width within card)
- Cards with hover elevation effect

### Admin Dashboard
**Navigation Tabs**: "Workers" | "Bookings" | "Earnings"

**Workers Tab**:
- Table layout with columns: Name, Service, Verification Status, Actions
- Status badges with approve/reject buttons
- Filter by verification status

**Bookings Tab**:
- Timeline view or list of all bookings
- Status indicators (Pending, Active, Completed)

**Earnings Tab**:
- Summary cards (Total Commission, This Month, Pending)
- Transaction list with worker name, amount, commission calculated

### Shared Components

**Cards**:
- Shadow: shadow-md
- Border radius: rounded-lg
- Padding: p-6
- Hover state: hover:shadow-lg transition

**Buttons**:
- Primary: Solid, rounded-md, px-6 py-3
- Secondary: Outlined, same dimensions
- Blurred backgrounds when on images

**Badges**:
- Verification: Pill shape (rounded-full), px-3 py-1
- Status indicators: Small circular dot + text
- Service tags: Rounded-md, px-2 py-1

**Form Inputs**:
- Border radius: rounded-md
- Height: h-12
- Border width: border-2
- Focus ring: ring-2 ring-offset-2

**Navigation**:
- Desktop: Horizontal top nav with logo left, links center, user menu right
- Mobile: Hamburger menu collapsing to slide-out drawer
- Dashboard: Sidebar on desktop (w-64), bottom nav on mobile

### Images

**Landing Page Hero**: Full-width background image showing diverse local workers (plumber, cleaner, electrician) interacting positively with households. Warm, professional photography with natural lighting.

**Feature Section**: Icon-based, no images needed

**How It Works**: Simple illustration-style graphics or icons for each step

**Worker Cards**: Profile photos (required for each worker)

**Dashboard**: No decorative images, focus on data and functionality

## Animations

**Minimal Motion**:
- Card hover elevations (transform + shadow)
- Button press feedback (scale-95)
- Page transitions: Simple fade
- Loading states: Spinner only when necessary
- No auto-playing animations or complex scroll effects