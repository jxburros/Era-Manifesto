# Era Manifesto

A comprehensive web application for musicians to manage album creation, release campaigns, and project tracking. Keep tabs on songs, versions, releases, videos, events, tasks, budgets, team members, and more -- all in one place.

## Features

### Core Content Management
- **Songs & Versions**: Track songs with multiple versions, writers, composers, instruments, and musicians
- **Releases**: Manage albums, singles, EPs, and compilations with tracklists and release dates
- **Videos**: Track song-attached and standalone video productions with type support (lyric, music, visualizer, live, loop, custom)
- **Events**: Plan shows, announcements, and other events with locations, dates, and custom tasks
- **Global Tasks**: Standalone task management with categories and Kanban board view

### Task & Progress Tracking
- **Auto-generated Tasks**: Tasks automatically created for songs, versions, videos, releases, and events
- **Manual Override**: Edit, customize, or disable any auto-generated task
- **Progress System**: Point-based progress tracking (Complete=1, In-Progress/Waiting=0.5)
- **Status Tracking**: Not Started, In-Progress, Waiting on Someone Else, Paid But Not Complete, Complete But Not Paid, Complete, Other (legacy values like Delayed are still recognized)
- **Task Dashboard**: Overview of overdue, due soon, and in-progress tasks with notifications

### Budget & Financial Management
- **Three-tier Cost System**: Estimated, Quoted, and Paid costs on every task
- **Cost Precedence**: Paid > Quoted > Estimated for effective cost calculations
- **Financials View**: Filter and analyze costs by source type, era, stage, tag, and status
- **Expense Tracking**: Standalone expense management with status tracking
- **Team Cost Allocation**: Track budget per team member across assignments

### Organization & Filtering
- **Eras**: Group items by campaign/album era with era mode filtering
- **Stages**: Workflow categorization (Recording, Production, etc.)
- **Tags**: Custom categorization for items and tasks
- **Focus Mode**: Simplified UI without punk styling

### Views
- **Today**: Dashboard with upcoming tasks and quick actions
- **Songs/Releases/Videos/Events/Tasks/Expenses**: Dedicated list/grid views with detail pages
- **Calendar**: Month view with tasks, events, releases, and songs
- **Timeline**: Combined Gantt-style timeline with filtering
- **Dashboard**: Task statistics, category breakdowns, and notifications
- **Financials**: Budget analysis with filtering
- **Progress**: Progress metrics across all items
- **Active Tasks**: Focus on overdue, due soon, in-progress, and unpaid items
- **Gallery**: Photo management with upload/download
- **Files**: File management
- **Team**: Team member directory with musician tracking
- **Archive**: Archived/deleted item management
- **Settings**: Theme, cloud sync, artist info configuration

### Team & Collaboration
- **Team Members**: Individuals, Groups, and Organizations with cross-linking
- **Musician Tracking**: Flag musicians with instrument lists and song/version assignments
- **Task Assignment**: Assign multiple team members to tasks with cost allocation

### Export & Reports
- **PDF Export**: Generate reports for songs, videos, releases, and eras
- **Data Export/Import**: Full data backup and restore with version tracking

### Design & Theming
- **Dark Mode**: Full dark mode support with Tailwind CSS
- **Accent Colors**: Pink, Cyan, Lime, Violet color schemes
- **Punk/Brutalist Design**: Bold 4px borders, hard shadows, uppercase typography
- **Responsive**: Mobile-first design with floating action button for quick mobile actions

### Cloud & Storage
- **Offline-First**: Full functionality with local storage only
- **Firebase Cloud Sync**: Optional real-time sync across devices
- **Anonymous Auth**: No account required for cloud sync
- **Photo/File Storage**: Firebase Storage for media uploads

## Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/jxburros/Era-Manifesto.git
   cd Era-Manifesto
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   - Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Cross-Platform Access

Era Manifesto works seamlessly across devices:

- **Desktop**: Any modern web browser (Chrome, Firefox, Safari, Edge)
- **Mobile**: Android and iOS browsers with responsive design
- **Android App**: Install as a PWA for a native app experience
- **Tablet**: Fully responsive layout
- **Offline**: Works offline with service worker caching

### Setting Up Cloud Sync

To access your data across multiple devices:

1. Follow the **[Firebase Setup Guide](FIREBASE_SETUP.md)**
2. Configure Firebase in your project
3. Connect from each device using the same Firebase config
4. Your data will sync automatically

**No Firebase?** The app works with local storage only -- no cloud setup required.

## Deployment

You can deploy Era Manifesto to various platforms:

- **Firebase Hosting** (Recommended)
- **Netlify**
- **Vercel**
- **GitHub Pages**

The app is fully PWA-ready for Android installation!

📦 **[Deployment Hub](docs/deployment/)** - Complete deployment documentation
- **[Web Deployment](docs/deployment/web.md)** - Deploy to Firebase, Netlify, Vercel, GitHub Pages
- **[Android PWA](docs/deployment/android.md)** - Install as native-like app on Android

### Quick Deploy to Firebase

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

## Documentation

### Setup & Deployment
- **[Firebase Setup Guide](FIREBASE_SETUP.md)** - Set up cloud sync across devices
- **[Deployment Hub](docs/deployment/)** - Complete deployment guide for web and Android
- **[Mobile Guide](MOBILE_GUIDE.md)** - Mobile access and PWA installation

### Architecture & Development
- **[App Architecture](docs/APP_ARCHITECTURE.md)** - Core data models and system design
- **[Page Architecture](docs/app_architecture_2.md)** - Page types and UI specifications
- **[Project Direction](PROJECT_DIRECTION.md)** - Project vision and feature details
- **[Remaining TODO](docs/REMAINING_TODO.md)** - Implementation status and roadmap
- **[Schema Contracts](docs/SCHEMA_CONTRACTS.md)** - Locked behavior for statuses, dates, and cost precedence
- **[Pre-QA Checklist](docs/PRE_QA_CHECKLIST.md)** - Readiness gate and smoke scenarios

### React Router Integration

- **[React Router Integration](docs/REACT_ROUTER_INTEGRATION.md)** - Technical overview of routing system
- **[React Router Dev Guide](docs/REACT_ROUTER_DEV_GUIDE.md)** - Guide for adding new routes
- **[React Router Test Plan](docs/REACT_ROUTER_TEST_PLAN.md)** - Comprehensive testing checklist
- **[React Router Quick Ref](docs/REACT_ROUTER_QUICK_REF.md)** - Quick reference card

### Today/Dashboard Enhancements

- **[Today Dashboard README](TODAY_DASHBOARD_README.md)** - Enhanced task views with source filtering
- **[Enhancement Summary](ENHANCEMENT_SUMMARY.md)** - Technical specifications
- **[Testing Guide](TESTING_GUIDE.md)** - Task aggregation testing
- **[Quick Reference](QUICK_REFERENCE.md)** - Developer reference

### Performance Optimization

- **[Performance README](PERFORMANCE_README.md)** - Performance improvements overview
- **[Performance Optimization](PERFORMANCE_OPTIMIZATION.md)** - Technical details
- **[Performance Testing](PERFORMANCE_TESTING.md)** - Testing procedures
- **[Performance Quick Ref](PERFORMANCE_QUICK_REFERENCE.md)** - Developer guide

### Testing

- **[Test Suite](tests/README.md)** - Unit testing guide and best practices
- **[Test Migration](E2E_TO_UNIT_MIGRATION.md)** - Migration from E2E to unit tests
- **[Test Summary](TEST_REPLACEMENT_SUMMARY.md)** - Complete testing approach

**Note:** Previous E2E tests were replaced with fast, reliable unit tests. See migration docs for details.

## Quality Checks

```bash
# Linting
npm run lint

# Production build
npm run build

# Unit tests (fast, <5 seconds)
npm test
```

## Tech Stack

- **Frontend**: React 18 + Vite 5
- **Routing**: React Router v7 with hybrid hash-based fallback
- **Styling**: TailwindCSS with custom punk/brutalist design system
- **State Management**: React Context API
- **Performance**: React.memo, react-window virtualization, code splitting
- **Cloud Sync**: Firebase (Firestore + Anonymous Authentication + Storage)
- **Testing**: Node.js native test runner + Playwright E2E
- **Icons**: Lucide React
- **Charts**: Recharts
- **PDF Export**: jsPDF (lazy-loaded)
- **Build Tool**: Vite 5 with optimized chunking

## Privacy & Security

- **Local-First**: All data is stored locally by default
- **Optional Cloud**: You control if/when to enable cloud sync
- **Anonymous Auth**: No personal information required
- **Secure**: Firebase security rules protect your data

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Issues & Support

If you encounter any issues or have questions:

1. Check the [Firebase Setup Guide](FIREBASE_SETUP.md) and [Deployment Hub](docs/deployment/)
2. Review existing GitHub Issues
3. Open a new issue with details

---

*Made for musicians by JX Holdings, LLC and Jeffrey Guntly.*
