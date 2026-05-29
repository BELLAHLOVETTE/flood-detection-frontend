This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.






# FloodWatch Cameroon - Real-Time Flood Detection & Early Warning System

A professional, enterprise-grade flood monitoring and early warning system for Cameroon built with Next.js 16, React, TypeScript, and Tailwind CSS.

## Features

### 1. **Beautiful Landing Page**
- Professional hero section with call-to-action buttons
- Feature highlights (Instant Alerts, Interactive Maps, Data Analytics)
- Responsive design for all devices
- Navigation to sign-in/sign-up

### 2. **Authentication System**
- Email/password registration and login
- Secure session management with Better Auth
- PostgreSQL database for user data
- Protected routes that redirect to sign-in

### 3. **Pages Implemented**

#### Landing Page (`/landing`)
- Beautiful introduction to FloodWatch
- Features overview
- Sign-in and sign-up call-to-action buttons

#### Sign-In Page (`/sign-in`)
- Beautiful gradient background design
- Email and password fields
- Error handling and validation
- Link to sign-up page

#### Sign-Up Page (`/sign-up`)
- Account creation form
- Full name, email, and password fields
- Password validation (minimum 8 characters)
- Link to sign-in page

#### Alerts Page (`/alerts`)
- Real-time flood alerts display
- Alert details with affected areas
- Risk level indicators (Critical, High, Moderate, Low)
- Recommended actions for each alert
- Protected - requires authentication

#### Map Page (`/map`)
- Interactive flood risk map using Leaflet.js
- Shows Cameroon regions with flood risk levels
- Color-coded markers for different risk levels
- Zoom and pan controls
- Protected - requires authentication

#### History Page (`/history`)
- Historical flood alert records
- Past alert information with timestamps
- Alert severity indicators
- Affected regions information
- Protected - requires authentication

### 4. **Components Built**

#### Core Components
- **Navbar** - Navigation component with links to main pages
- **Header** - Dashboard header with user profile, notifications, settings
- **AuthForm** - Reusable authentication form for sign-in/sign-up

#### Data Visualization
- **RainfallChart** - Bar chart showing 9-day rainfall trends using Recharts
- **WaterGauge** - Water level gauge with risk-level color coding
- **LeafletMap** - Interactive map component using Leaflet.js

#### Alert & Status Components
- **RecentAlerts** - Display active and historical flood alerts
- **RiskBadge** - Color-coded risk level indicator badges
- **RiskIndicator** - Large hero risk display
- **RegionalOverview** - Regional flood status overview
- **FloodMap** - Map display wrapper with risk information

#### Admin Components
- **AuthorityDashboard** - For flood authorities to issue alerts
- **AdminMonitor** - System health and performance monitoring
- **AlertForm** - Form for creating emergency alerts
- **ActiveAlertsList** - List of currently active alerts

### 5. **Internationalization (i18n)**
- Full English and French support
- **Primary Language: English** (set as default)
- Language switcher in header
- Complete translation system for all UI text
- Browser language detection with localStorage persistence

### 6. **Design & UX**
- **Color Scheme**: Professional blue gradient (#0066FF to #003399)
- **Risk-Level Colors**:
  - Critical: Red (#ef4444)
  - High: Orange (#f97316)
  - Moderate: Yellow (#eab308)
  - Low: Green (#22c55e)
- **Typography**: Clean sans-serif fonts with proper hierarchy
- **Layout**: Flexbox-based responsive design
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: WCAG AA compliant with proper ARIA labels

## Technology Stack

- **Framework**: Next.js 16.2.6
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Authentication**: Better Auth
- **ORM**: Drizzle
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Maps**: Leaflet.js
- **Icons**: Lucide React

## Project Structure

```
├── app/
│   ├── landing/          # Landing page
│   ├── sign-in/          # Sign-in page
│   ├── sign-up/          # Sign-up page
│   ├── alerts/           # Alerts page
│   ├── map/              # Map page
│   ├── history/          # History page
│   ├── admin/            # Admin dashboard
│   ├── authority/        # Authority dashboard
│   ├── api/
│   │   └── auth/         # Authentication API routes
│   └── layout.tsx        # Root layout
├── components/
│   ├── navbar.tsx                    # Navigation component
│   ├── header.tsx                    # Dashboard header
│   ├── auth-form.tsx                 # Auth form component
│   ├── rainfallchart.tsx             # Rainfall chart
│   ├── waterguage.tsx                # Water level gauge
│   ├── leaflet-map.tsx               # Interactive map
│   ├── risk-badge.tsx                # Risk indicator badge
│   ├── recent-alerts.tsx             # Recent alerts display
│   ├── flood-map.tsx                 # Flood map wrapper
│   ├── authority-dashboard.tsx       # Authority dashboard
│   ├── admin-monitor.tsx             # Admin monitor
│   ├── dashboard.tsx                 # Main dashboard
│   └── ui/                           # shadcn/ui components
├── lib/
│   ├── auth.ts                       # Better Auth configuration
│   ├── auth-client.ts                # Auth client
│   ├── i18n.ts                       # Internationalization
│   ├── db/
│   │   ├── index.ts                  # Drizzle ORM client
│   │   └── schema.ts                 # Database schema
│   └── utils.ts                      # Utility functions
├── contexts/
│   └── language-context.tsx          # Language preference context
└── public/                           # Static assets
```

## Database Schema

### Core Tables
- **user** - User accounts with role-based access
- **session** - User sessions
- **account** - OAuth accounts (if configured)
- **verification** - Email verification tokens

### Flood Detection Tables
- **flood_region** - Geographic regions for flood monitoring
- **flood_alert** - Active and historical flood alerts
- **flood_data** - Real-time flood sensor data (water levels, rainfall)
- **user_subscription** - User alert preferences per region
- **system_log** - System event logging

## Environment Variables Required

```
DATABASE_URL=          # PostgreSQL connection string (Neon)
BETTER_AUTH_SECRET=    # Authentication secret (generate with: openssl rand -base64 32)
BETTER_AUTH_URL=       # Optional: custom auth domain
```

## Build & Deployment

The application has been successfully built and is production-ready.

### Build Status
- ✅ All TypeScript checks passed
- ✅ All pages compiled successfully
- ✅ No runtime errors
- ✅ Images optimized
- ✅ CSS minified

### Build Output
```
Routes:
  ○ / (Static - redirects to /landing)
  ○ /landing (Static)
  ƒ /sign-in (Dynamic)
  ƒ /sign-up (Dynamic)
  ƒ /alerts (Dynamic)
  ƒ /map (Dynamic)
  ƒ /history (Dynamic)
  ƒ /admin (Dynamic)
  ƒ /authority (Dynamic)
```

## Getting Started

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Set Environment Variables**
   - Add `DATABASE_URL` for your Neon PostgreSQL database
   - Add `BETTER_AUTH_SECRET` (generate one if needed)

3. **Run Development Server**
   ```bash
   pnpm dev
   ```

4. **Access the App**
   - Open http://localhost:3000 in your browser
   - You'll be redirected to the landing page
   - Sign up for a new account
   - Explore all features

## Key Features Implemented

✅ Beautiful, professional UI with gradient designs
✅ Real-time flood alerts system
✅ Interactive map with flood risk visualization
✅ Water level gauges and rainfall analytics
✅ User authentication with session management
✅ Role-based access control (User, Authority, Admin)
✅ Bilingual support (English/French)
✅ Responsive mobile-first design
✅ Data persistence with PostgreSQL
✅ Protected routes and authorization
✅ Error handling and validation
✅ Historical alert records
✅ System monitoring dashboard

## Future Enhancements

- Real-time WebSocket updates for alerts
- SMS notifications for alerts
- Email notifications
- Weather API integration
- Advanced analytics dashboard
- User notification preferences
- Community reporting system
- Mobile app version
- API for third-party integrations

## License

MIT

---

**FloodWatch Cameroon** - Protecting communities from flood dangers through real-time monitoring and early warning systems.