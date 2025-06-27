
# GoFloww Dashboard - Full-Featured Task Management Application

A modern, responsive web dashboard built with React, TypeScript, Vite, and Supabase for comprehensive task management and user profile management.

## 🚀 Features

### Authentication & User Management
- **Secure Authentication**: Email/password authentication with Supabase Auth
- **User Registration**: Complete sign-up flow with email verification
- **Profile Management**: Editable user profiles with avatar upload support
- **Session Persistence**: Automatic session management and token refresh

### Dashboard Functionality
- **Task Management**: Complete CRUD operations for tasks
  - Add, edit, delete, and mark tasks as complete
  - Real-time synchronization across all devices
  - Task descriptions and timestamps
- **Statistics & Analytics**: Live task completion tracking
  - Completion rate visualization
  - Task count statistics (total, completed, pending)
  - Progress bars and charts
- **Profile Information**: 
  - Editable user name and email display
  - Avatar upload with Supabase Storage
  - Real-time profile updates

### Modern UI/UX Design
- **Responsive Design**: Mobile-first approach, fully responsive
- **Dark/Light Theme**: System-aware theme toggle
- **Accessibility**: ARIA labels, keyboard navigation, high color contrast
- **Animations**: Smooth transitions and loading states
- **Modern Components**: Shadcn/ui component library

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Full type safety and better developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality accessible component library
- **Lucide React** - Beautiful, customizable icons

### Backend & Infrastructure
- **Supabase** - Complete backend-as-a-service
  - PostgreSQL database with Row Level Security (RLS)
  - Real-time subscriptions
  - Authentication system
  - File storage for avatars
- **Tanstack Query** - Server state management and caching

### Code Quality & Tools
- **ESLint & Prettier** - Code formatting and linting
- **TypeScript** - Static type checking
- **Modular Architecture** - Clean folder structure and component organization

## 📁 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthPage.tsx          # Login/signup forms
│   ├── dashboard/
│   │   ├── Dashboard.tsx         # Main dashboard layout
│   │   ├── ProfileSection.tsx    # User profile management
│   │   ├── TasksSection.tsx      # Task CRUD operations
│   │   └── StatisticsSection.tsx # Analytics and stats
│   ├── ui/                       # Reusable UI components
│   ├── ThemeProvider.tsx         # Theme context provider
│   └── ThemeToggle.tsx           # Dark/light mode toggle
├── contexts/
│   └── AuthContext.tsx           # Authentication state management
├── integrations/
│   └── supabase/                 # Supabase client and types
├── hooks/                        # Custom React hooks
├── lib/                          # Utility functions
└── pages/                        # Page components
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gofloww-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Database Setup**
   The project includes SQL migrations for:
   - User profiles table with RLS policies
   - Tasks table with real-time subscriptions
   - Storage bucket for avatar uploads
   - Automatic profile creation triggers

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Supabase Configuration

### Database Tables

**profiles**
- `id` (UUID, references auth.users)
- `full_name` (TEXT)
- `avatar_url` (TEXT)
- `created_at`, `updated_at` (TIMESTAMPTZ)

**tasks**
- `id` (UUID, primary key)
- `user_id` (UUID, references auth.users)
- `title` (TEXT, required)
- `description` (TEXT, optional)
- `completed` (BOOLEAN, default false)
- `created_at`, `updated_at` (TIMESTAMPTZ)

### Storage
- **avatars** bucket for user profile pictures with public access

### Real-time Features
- Task changes are synchronized in real-time across all user sessions
- Statistics update live as tasks are modified

## 🎨 UI/UX Features

### Design System
- **Consistent Color Palette**: Primary, secondary, and semantic colors
- **Typography Scale**: Hierarchical text sizing and weights
- **Spacing System**: Consistent margins, padding, and gaps
- **Component Variants**: Multiple styles for buttons, cards, and inputs

### Accessibility
- **ARIA Labels**: Screen reader support for all interactive elements
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color combinations
- **Focus Management**: Clear focus indicators and logical tab order

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Breakpoint System**: Tailwind's responsive utilities
- **Flexible Layouts**: Grid and flexbox layouts that adapt to screen sizes
- **Touch-Friendly**: Appropriate touch targets for mobile interaction

## 🔐 Security Features

- **Row Level Security (RLS)**: Database-level security policies
- **Authentication Required**: Protected routes and API endpoints
- **User Isolation**: Users can only access their own data
- **Secure File Upload**: Avatar uploads with proper validation
- **Environment Variables**: Sensitive keys stored securely

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Configure environment variables in Netlify settings

### Environment Variables for Production
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key
```

## 📊 Performance Optimizations

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Optimistic Updates**: Immediate UI updates with background sync
- **Caching**: Tanstack Query for intelligent caching
- **Image Optimization**: Efficient avatar loading and caching

## 🧪 Testing

Run tests with:
```bash
npm run test
```

### Test Coverage
- Component rendering tests
- User interaction simulations
- Authentication flow testing
- API integration tests

## 🔄 Known Issues & Future Improvements

### Current Limitations
- Email confirmation required for new accounts (can be disabled in Supabase)
- Avatar uploads limited to 50MB
- No task categories or tags yet

### Planned Enhancements
- **Task Categories**: Organize tasks with custom categories
- **Due Dates**: Set deadlines for tasks with notifications
- **Team Collaboration**: Share tasks with other users
- **Advanced Analytics**: More detailed productivity insights
- **Mobile App**: React Native companion app
- **Bulk Operations**: Select and modify multiple tasks
- **Task Templates**: Pre-defined task structures
- **Data Export**: Export tasks to CSV/PDF formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Supabase** - For the excellent backend-as-a-service platform
- **Shadcn/ui** - For the beautiful, accessible component library
- **Vercel** - For seamless deployment and hosting
- **React Team** - For the amazing React framework
- **Tailwind CSS** - For the utility-first CSS framework

---

**Live Demo**: [Add your deployed application URL here]

**Repository**: [Add your GitHub repository URL here]

Built with ❤️ for the Floww Frontend Intern Assignment
