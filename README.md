<div align="center">

# 🎓 D-Campus App (v1.0.0)

**Autonomous Retro-Dark Web & Mobile Workstation Suite for COER University Students**

[![Version](https://img.shields.io/badge/version-1.0.0-fbbf24?style=flat-square&labelColor=000000)](https://github.com/AkaPranav/D-Campus_app)
[![Framework](https://img.shields.io/badge/Next.js-16.3.6_(Turbopack)-10b981?style=flat-square&labelColor=000000)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.2.8-06b6d4?style=flat-square&labelColor=000000)](https://react.dev)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4.0-a855f7?style=flat-square&labelColor=000000)](https://tailwindcss.com)
[![Deployment](https://img.shields.io/badge/Vercel-Deploy_Ready-f43f5e?style=flat-square&labelColor=000000)](https://vercel.com)
[![License](https://img.shields.io/badge/license-MIT-64748b?style=flat-square&labelColor=000000)](./LICENSE)

<p align="center">
  A high-performance progressive web app (PWA) and responsive desktop workstation suite designed to modernize, augment, and streamline the COER University ERP portal. Features zero-CAPTCHA background authentication, dynamic safe bunking calculations, multi-track elective switching, real-time timetable tracking, and direct problem file downloads.
</p>

[Quick Start](#-quick-start) • [Key Features](#-key-features) • [Deploy on Vercel](#-deploy-on-vercel) • [Architecture](#-architecture) • [Security & Privacy](#-security--privacy)

---

</div>

## ✨ Key Features

### ⚡ Autonomous Zero-CAPTCHA Authentication
- **100% Serverless Pure-JavaScript OCR:** Ported directly into Node.js serverless functions with zero external OCR APIs and zero heavy Python/C++ dependencies.
- **Sub-2ms Solving Time:** Binary luminance thresholding, 8-directional connected-component BFS, and 20×24 bitmask IoU template matching solve the portal's distorted noise CAPTCHA instantly.
- **Zero-Friction User Experience:** CAPTCHA input is never presented to the student. Login is automatic and seamless.

### 📊 Attendance Analytics & Safe Bunking Calculator
- **Retro Radial SVG KPI Gauge:** Real-time percentage indicator with color-coded university thresholds (≥75% Emerald, 70–75% Gold, <70% Rose).
- **Exact Safe Bunking Formula:** Implements $Y = \lfloor\frac{4P - 3T}{3}\rfloor$ to tell students exactly how many consecutive lectures they can safely miss without breaching the mandatory 75.00% exam threshold.
- **Shortfall Warning:** Calculates the exact number of consecutive classes required to recover from debarment.
- **Subject Search & Breakdown:** Instant filtering across enrolled subjects, faculty names, and course codes.

### 📅 Real-Time Weekly Class Timetable
- **Mon–Fri Academic Scope:** Customized strictly for COER University's 5-day academic calendar.
- **Live Class Tracking:** Real-time period status indicators (`NOW RUNNING`, `COMPLETED`, `UPCOMING`).
- **Weekend Campus-Off Guard:** Special off-duty status for Saturdays and Sundays.
- **Interactive Multi-Track Elective Selector:** Dynamic in-card dropdown allowing students to switch between tracks (GATE, CAT, Study Abroad, Competitive Coding) with persistent local memory.
- **Faculty Substitution Badges:** Distinct visual styling (`⚡ SUBSTITUTE`) highlighting substitute professors and original faculty names.

### 📂 Assignment & Study Material Management
- **Segmented Dual-View:** Instant toggle between active pending assignments and lecture notes/study materials.
- **Priority Due First Queue:** Nearest upcoming deadlines surfaced at the top with status badges (`⚡ DUE: <Date>`).
- **Status Filter Module:** Filter assignments by `⚡ Active Due`, `📂 All Records`, and `🔒 Submission Closed`.
- **Direct Base64 Downloader:** Resolves direct server-side document endpoints (`GetAssignmentImage`) using `detailId` and `assignId` fallbacks.
- **Pre-Flight Submission Safety Shield:** Protective modal with hazard warning stripes and confirmation locks preventing accidental submissions.

### 🖥️ Desktop, Tablet & Mobile Fluid Responsive UX
- **Adaptive Navigation:** Displays a tactile horizontal retro navbar on desktop/tablet (`md:flex`) and switches to an ergonomic 64px bottom thumb bar on mobile.
- **Multi-Column Cockpit:** Utilizes 12-column grids on desktop and responsive 3-column card layouts with uniform flex height alignment.
- **Strict Retro-Dark Neo-Brutalist Theme:** Hard 2px `#000000` tactile borders, monospace data scales, zero neon effects, and calibrated color tokens.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org) (v18.18.0 or later recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/AkaPranav/D-Campus_app.git
cd D-Campus_app

# 2. Install dependencies
npm install

# 3. Start local development server (Turbopack)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
# Compile optimized production bundle
npm run build

# Start production server
npm run start
```

---

## ☁️ Deploy on Vercel

D-Campus App is pre-configured for seamless zero-configuration deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FAkaPranav%2FD-Campus_app)

### Deployment Steps:
1. Push this repository to your GitHub account.
2. Go to [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New Project"**.
3. Import the `D-Campus_app` repository.
4. **Environment Variables:** None required! The app operates client-side with session-authenticated proxy routes.
5. Click **Deploy**. Vercel will build and deploy the Next.js App Router application in under 60 seconds.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
| :--- | :--- |
| **Framework** | [Next.js 16.3](https://nextjs.org/) (App Router, Turbopack) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (Neo-Brutalist Retro Dark Design System) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **OCR Image Parser** | [`pngjs`](https://github.com/lukeapage/pngjs) (Pure JavaScript PNG decoder with zero native binaries) |
| **OCR Segmentation** | Custom 8-directional connected-component BFS & adaptive valley bisection |
| **Template Matching** | 20×24 bitmask population-count Intersection-over-Union (IoU) dictionary |
| **Target Portal** | COER University ERP (`https://erp.coeruniversity.in`) |

---

## 📁 Project Structure

```
D-Campus_app/
├── public/                 # Static assets, PWA manifest, and app icons
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/login/ # Zero-CAPTCHA background authentication API
│   │   │   ├── download/   # Direct assignment/document downloader API
│   │   │   └── sync/       # Multi-module concurrent synchronization API
│   │   ├── globals.css     # Retro color tokens and Neo-Brutalist utility classes
│   │   ├── layout.tsx      # Root application layout and PWA metadata
│   │   └── page.tsx        # Main application state machine & container
│   ├── components/
│   │   ├── AssignmentsView.tsx      # Assignments & lecture notes module
│   │   ├── AttendanceView.tsx       # Attendance gauge & safe bunking calculator
│   │   ├── BottomNav.tsx            # Mobile thumb navigation bar
│   │   ├── ChaiModal.tsx            # "Buy me a Chai" creator support modal
│   │   ├── LoginView.tsx            # One-time credential onboarding view
│   │   ├── SettingsView.tsx         # Session manager & student profile
│   │   ├── SkeletonLayout.tsx       # Cyberpunk shimmer skeleton loader
│   │   ├── SubmissionSafetyModal.tsx# Irreversible upload pre-flight confirmation
│   │   ├── TimetableView.tsx        # Weekly timetable & elective track switcher
│   │   └── TopHUD.tsx               # Responsive desktop navbar & system status bar
│   └── lib/
│       ├── captchaSolver.ts         # Sub-2ms serverless CAPTCHA OCR engine
│       └── erpClient.ts             # University ERP scraping & cookie session client
├── next.config.ts          # Turbopack and build configuration
├── package.json            # Project manifest (v1.0.0)
├── tsconfig.json           # TypeScript strict configuration
└── README.md
```

---

## 🔒 Security & Privacy

- **Zero Remote Credential Storage:** Student credentials and session cookies are stored **exclusively on-device** in the user's browser `localStorage`.
- **No Third-Party Analytics / Trackers:** Zero third-party telemetry, tracking scripts, or ad networks.
- **Isolated Session Proxying:** API routes act solely as transparent, authenticated HTTPS proxies between the student's browser and `erp.coeruniversity.in` to bypass browser CORS restrictions.

---

## ☕ Support the Project

If D-Campus has saved you time or made your college routine smoother, consider supporting development:

- **UPI ID:** `6396950805@slc`
- **Contributor:** [Pranav Pandey](https://github.com/AkaPranav)

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  <sub>Built with 🖤 for the students of COER University.</sub>
</div>
