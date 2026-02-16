# Changelog

All notable changes to Era Manifesto will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive documentation reorganization (Feb 2026)
- Documentation index and navigation structure
- Section-specific README files for all docs categories
- Performance guide consolidating optimization strategies
- Deployment hub with web and Android PWA guides
- React Router comprehensive guide

### Changed
- Organized documentation into clear categorical structure
- Moved documentation from root to organized `docs/` subdirectories
- Consolidated duplicate documentation files
- Updated README with corrected documentation links
- Archived historical and deprecated documentation

### Deprecated
- E2E testing with Playwright (replaced by unit tests)

## [Previous Releases]

### Performance Optimization (Phase 7)
- Code splitting and lazy loading
- List virtualization with react-window
- Component memoization
- 58% reduction in initial bundle size
- 50% improvement in load time

### React Router Integration
- Hash-based routing with backwards compatibility
- Hybrid approach supporting legacy routes
- Route-based code splitting
- Comprehensive routing documentation

### Today/Dashboard Enhancement
- Enhanced Today view with task filtering
- Source-based task aggregation
- Improved task dashboard
- Quick actions and notifications

### Testing Migration
- Migrated from E2E to unit tests
- Faster test execution (<5 seconds)
- More reliable and maintainable tests
- Better CI/CD integration

### Android PWA Support
- Progressive Web App functionality
- Install as native-like app on Android
- Offline-first architecture
- Service worker caching

### Core Features (Initial Release)
- Song and version tracking
- Release management (albums, singles, EPs)
- Video production tracking
- Event planning and management
- Task management with auto-generation
- Progress tracking system
- Budget and financial management
- Eras and stages organization
- Multiple view types (Calendar, Timeline, Dashboard)
- Team member management
- PDF export functionality
- Firebase cloud sync
- Dark mode and theming
- Punk/brutalist design system

---

## Version History Notes

Era Manifesto has evolved through several development phases:

- **Phase 6**: Today/Dashboard enhancements, task aggregation
- **Phase 7**: Performance optimization, code splitting, virtualization
- **React Router**: Navigation system with backwards compatibility
- **Testing Evolution**: Migration from E2E to unit tests
- **Android PWA**: Progressive Web App capabilities
- **Documentation Overhaul**: Comprehensive reorganization (Feb 2026)

For detailed historical information, see [docs/history/](docs/history/).

---

*For the complete list of changes and development history, see the [Git commit history](https://github.com/jxburros/Era-Manifesto/commits/) and [docs/history/phases/](docs/history/phases/).*
