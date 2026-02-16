# Era Manifesto Architecture Documentation

This directory contains architectural documentation, system design, and technical specifications for Era Manifesto.

## 📚 Architecture Documents

### [VISUAL_ARCHITECTURE.md](VISUAL_ARCHITECTURE.md)
Visual overview of the application architecture:
- Component hierarchy
- Data flow diagrams
- Module relationships
- System overview

**Start here** for a high-level understanding of the system.

### [APP_ARCHITECTURE.md](APP_ARCHITECTURE.md)
Detailed application architecture documentation:
- Technical stack
- Component structure
- State management
- Data layer design
- Integration patterns

**Read this** for comprehensive architectural details.

### [app_architecture_2.md](app_architecture_2.md)
Additional architectural documentation and design decisions:
- Alternative designs
- Evolution of architecture
- Technical trade-offs
- Future considerations

### [SCHEMA_CONTRACTS.md](SCHEMA_CONTRACTS.md)
Data schema definitions and contracts:
- Database schemas
- Data models
- API contracts
- Type definitions
- Validation rules

**Reference this** when working with data structures.

## 🏗️ Key Architectural Concepts

### Technology Stack
- **Frontend**: React + Vite
- **State Management**: Context API + Local Storage
- **Backend**: Firebase (Firestore, Authentication)
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

### Core Principles
1. **Offline-First** - Local storage with Firebase sync
2. **Component-Based** - Modular, reusable components
3. **Type-Safe** - PropTypes validation
4. **Performance** - Code splitting, lazy loading, virtualization
5. **Progressive Enhancement** - Works offline, syncs when online

## 📖 Related Documentation

- **Development** - See [Development Guides](../development/)
- **Features** - See [Features Documentation](../features/)
- **Getting Started** - See [Getting Started](../getting-started/)
- **Testing** - See [QA Documentation](../qa/)

## 🔄 Architecture Updates

For historical architecture changes and evolution, see:
- [Phase Completion Summaries](../history/phases/)
- [Implementation Summaries](../history/phases/)

---

*For the complete documentation index, see [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)*
