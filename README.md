# GoFloww Dashboard

A modern, responsive web dashboard for comprehensive task and user profile management, built with React, TypeScript, Vite, Supabase, and Tailwind CSS.

---

## 📑 Table of Contents
1. [Features](#features)
2. [Tech Stack & Libraries](#tech-stack--libraries)
3. [Project Structure](#project-structure)
4. [Key Components & Utilities](#key-components--utilities)
5. [Getting Started](#getting-started)
6. [Supabase Setup](#supabase-setup)
7. [Deployment](#deployment)
8. [Performance & Accessibility](#performance--accessibility)
9. [Testing](#testing)
10. [Contributing](#contributing)
11. [License & Acknowledgments](#license--acknowledgments)

---

## 🚀 Features
- **Authentication**: Email/password login, registration, and session management (Supabase Auth)
- **Profile Management**: Editable user profiles, avatar upload, real-time updates
- **Task Management**: Add, edit, delete, mark complete, real-time sync, timestamps
- **Statistics & Analytics**: Live completion tracking, progress bars, charts
- **Modern UI/UX**: Responsive, dark/light mode, accessible, animated, mobile-first

---

## 🛠️ Tech Stack & Libraries

### Core
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Utility-first CSS

### UI & Components
- **shadcn/ui**: Accessible, customizable UI components (Radix UI based)
- **Radix UI**: Low-level UI primitives
- **Lucide React**: Icon library
- **Embla Carousel**: Carousel/slider
- **Recharts**: Charting
- **React Hook Form**: Form state/validation
- **Zod**: Schema validation

### Data & State
- **@tanstack/react-query**: Server state, caching
- **Supabase JS**: Backend (auth, DB, storage)

### Utilities
- **clsx**: Class name utility
- **class-variance-authority**: Tailwind class variants
- **date-fns**: Date utilities
- **dotenv**: Env variables

### Dev Experience
- **ESLint & Prettier**: Linting/formatting

---

## 📁 Project Structure

```
GoFloww Dashboard/
├── public/                  # Static assets (favicon, images, etc.)
├── src/
│   ├── components/
│   │   ├── auth/            # Auth UI & logic (AuthPage)
│   │   ├── dashboard/       # Dashboard, Profile, Tasks, Statistics
│   │   ├── ui/              # Reusable UI components (Accordion, Dialog, etc.)
│   │   ├── ThemeProvider.tsx# Theme context
│   │   └── ThemeToggle.tsx  # Theme toggle button
│   ├── contexts/            # React context providers (AuthContext)
│   ├── integrations/
│   │   └── supabase/        # Supabase client & types
│   ├── hooks/               # Custom React hooks (use-mobile, use-toast)
│   ├── lib/                 # Utility functions (utils.ts)
│   ├── pages/               # Top-level pages (Index, NotFound)
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── index.html               # HTML template
├── package.json             # Project metadata & scripts
└── ...                      # Config files, README, etc.
```

---

## 🧩 Key Components & Utilities

### Authentication & Context
- **AuthContext**: Provides authentication state and methods
- **AuthPage**: Login, registration, and validation UI

### Dashboard & Sections
- **Dashboard**: Main layout, orchestrates sections
- **ProfileSection**: User profile management
- **TasksSection**: Task CRUD, real-time updates
- **StatisticsSection**: Live stats, analytics, charts

### UI Components
- **components/ui/**: Custom and shadcn-based UI (Accordion, Dialog, Sheet, Toast, Tooltip, etc.)
- **ThemeProvider & ThemeToggle**: Dark/light mode context and toggle
- **Toaster**: Toast notifications

### Utilities & Hooks
- **cn**: Class name merging utility (lib/utils.ts)
- **Custom Hooks**: use-mobile (responsive), use-toast (notifications)

### Supabase Integration
- **client.ts**: Supabase client initialization
- **types.ts**: TypeScript types for Supabase

---

## 🏁 Getting Started

### Prerequisites
- Node.js 18+
- npm
- Supabase account & project

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/JainamOswal18/go-floww_task.git
   cd go-floww_task
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```
3. **Environment Setup**
   Create a `.env` file in the root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. **Start Development Server**
   ```bash
   npm run dev
   ```
5. **Build for Production**
   ```bash
   npm run build
   ```

---

## 🗄️ Supabase Setup
- **Database**: Profiles & tasks tables, RLS policies, triggers for profile creation
- **Storage**: Avatars bucket (public access)
- **Real-time**: Task changes sync live across sessions
- **Migrations**: See `supabase/migrations/`

---

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy (auto on push to main)

### Netlify
1. Build: `npm run build`
2. Deploy `dist/` folder
3. Add environment variables in Netlify settings

---

## ⚡ Performance & Accessibility
- **Code Splitting**: Route-based
- **Lazy Loading**: On-demand components
- **Optimistic Updates**: UI updates instantly
- **Caching**: Tanstack Query
- **Image Optimization**: Efficient avatar loading
- **Accessibility**: ARIA, keyboard nav, color contrast, focus management
- **Responsive**: Mobile-first, flexible layouts

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch
3. Commit & push
4. Open a pull request

---

## 📄 License & Acknowledgments
- **MIT License** (see LICENSE)
- Thanks: Supabase, shadcn/ui, Vercel, React, Tailwind CSS

---

**Live Demo**: https://goflow.jainamoswal.tech/

**Repository**: https://github.com/JainamOswal18/go-floww_task.git

Built with ❤️ for the Floww Frontend Intern Assignment
