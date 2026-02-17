# Era Manifesto Documentation Index

## 📚 Complete Documentation Guide

Welcome to the Era Manifesto documentation! This index provides a comprehensive guide to all documentation organized by purpose.

## 🚀 Quick Start

**New to Era Manifesto?**
1. Read the [Main README.md](README.md) - Project overview
2. Follow [Getting Started Guides](docs/getting-started/) - Installation and setup
3. Check [Features Documentation](docs/features/) - Learn what the app can do

**Developer?**
1. Start with [Getting Started](docs/getting-started/)
2. Review [Architecture Documentation](docs/architecture/)
3. Explore [Development Guides](docs/development/)
4. Follow [Testing Guide](docs/qa/TESTING_GUIDE.md)

**Deploying?**
- See [Deployment Guides](docs/deployment/) for all platforms

---

## 📖 Documentation Structure

### 🎯 [Getting Started](docs/getting-started/)
Essential guides for installation and initial setup:
- **[Installation Checklist](docs/getting-started/INSTALLATION_CHECKLIST.md)** - Step-by-step setup
- **[Firebase Setup](docs/getting-started/FIREBASE_SETUP.md)** - Configure Firebase integration

👉 **Start here** if setting up Era Manifesto for the first time

---

### 🏗️ [Architecture](docs/architecture/)
System design and technical architecture:
- **[Visual Architecture](docs/architecture/VISUAL_ARCHITECTURE.md)** - High-level system overview
- **[App Architecture](docs/architecture/APP_ARCHITECTURE.md)** - Detailed architecture docs
- **[Schema Contracts](docs/architecture/SCHEMA_CONTRACTS.md)** - Data models and schemas
- **[App Architecture v2](docs/architecture/app_architecture_2.md)** - Alternative designs

👉 **Read this** to understand how the system is structured

---

### 🎨 [Features](docs/features/)
Documentation for specific features and capabilities:
- **[Today Dashboard](docs/features/TODAY_DASHBOARD_README.md)** - Daily view and dashboard
- **[Mobile Guide](docs/features/MOBILE_GUIDE.md)** - PWA and mobile features

👉 **Explore this** to learn about Era Manifesto's features

---

### 🛠️ [Development](docs/development/)
Guides and references for developers:
- **[React Router Guide](docs/development/REACT_ROUTER_GUIDE.md)** - Navigation and routing
- **[Quick Reference](docs/development/QUICK_REFERENCE.md)** - Code patterns and utilities
- **[Analysis & Recommendations](docs/development/APP_ANALYSIS_RECOMMENDATIONS.md)** - Code quality insights
- **[TODO / Implementation Plan](docs/development/TODO.md)** - Outstanding tasks and implementation roadmap
- **[Remaining TODO](docs/development/REMAINING_TODO.md)** - Detailed remaining feature analysis

👉 **Use these** when building features and making changes

---

### 🚀 [Deployment](docs/deployment/)
Guides for deploying to various platforms:
- **[Deployment Hub](docs/deployment/README.md)** - Main deployment guide
- **[Web Deployment](docs/deployment/web.md)** - Firebase, Netlify, Vercel, GitHub Pages
- **[Android PWA](docs/deployment/android.md)** - Progressive Web App installation
- **[Android Deployment Ready](docs/deployment/ANDROID_DEPLOYMENT_READY.md)** - Native Android (Capacitor) setup and checklist

👉 **Follow these** to deploy Era Manifesto

---

### 🧪 [QA & Testing](docs/qa/)
Testing guides and quality assurance:
- **[Testing Guide](docs/qa/TESTING_GUIDE.md)** - Comprehensive test cases (27+ tests)
- **[Pre-QA Checklist](docs/qa/PRE_QA_CHECKLIST.md)** - Developer self-check
- **[E2E Testing](docs/qa/E2E_TESTING.md)** - ⚠️ Deprecated (kept for reference)

👉 **Use these** for thorough testing before deployment

---

### ⚡ [Performance](PERFORMANCE_GUIDE.md)
Performance optimization guide:
- Code splitting and lazy loading
- List virtualization
- Memoization patterns
- Performance metrics and testing

👉 **Read this** to optimize application performance

---

### 📜 [Historical Documentation](docs/history/)
Archived documentation and development history:
- **[E2E Testing Archive](docs/history/e2e-testing/)** - Deprecated E2E test docs
- **[Phase Completions](docs/history/phases/)** - Development milestone summaries

👉 **Refer to these** for historical context and past decisions
---

## 🎯 Reading Paths

### For New Users
```
1. README.md (project overview)
2. docs/getting-started/INSTALLATION_CHECKLIST.md
3. docs/getting-started/FIREBASE_SETUP.md
4. docs/features/ (learn what you can do)
```

### For Developers
```
1. docs/getting-started/ (setup)
2. docs/architecture/ (understand the system)
3. docs/development/QUICK_REFERENCE.md
4. docs/development/REACT_ROUTER_GUIDE.md
5. docs/qa/TESTING_GUIDE.md (before committing)
```

### For Deployers
```
1. docs/deployment/README.md (overview)
2. docs/deployment/web.md (web platforms)
   OR
   docs/deployment/android.md (PWA installation)
```

### For Testers/QA
```
1. docs/qa/PRE_QA_CHECKLIST.md
2. docs/qa/TESTING_GUIDE.md (comprehensive tests)
3. PERFORMANCE_GUIDE.md (performance testing)
```

---

## 📊 Documentation Organization

### Root Directory (Key Documents Only)
- **README.md** - Main project overview
- **DOCUMENTATION_INDEX.md** - This file (documentation hub)
- **PROJECT_DIRECTION.md** - Project vision and roadmap
- **PERFORMANCE_GUIDE.md** - Performance optimization

### docs/ Subdirectory (Organized by Category)
```
docs/
├── getting-started/    - Installation and setup
├── architecture/       - System design and structure
├── features/          - Feature-specific documentation
├── development/       - Developer guides and references
├── deployment/        - Deployment guides (all platforms)
├── qa/               - Testing and quality assurance
└── history/          - Archived and historical docs
```

---

## 🔍 Finding Documentation

### By Topic
- **Setup & Installation** → docs/getting-started/
- **System Design** → docs/architecture/
- **Features & Usage** → docs/features/
- **Development** → docs/development/
- **Deployment** → docs/deployment/
- **Testing** → docs/qa/
- **Performance** → PERFORMANCE_GUIDE.md
- **Project Vision** → PROJECT_DIRECTION.md
- **History** → docs/history/

### By Role
- **New User** → README.md, docs/getting-started/, docs/features/
- **Developer** → docs/development/, docs/architecture/, docs/qa/
- **Deployer** → docs/deployment/
- **QA/Tester** → docs/qa/, PERFORMANCE_GUIDE.md
- **Architect** → docs/architecture/, PROJECT_DIRECTION.md

---

## 📝 Documentation Standards

### When Adding New Documentation
1. **Place in appropriate directory** based on category
2. **Update section README** in that directory
3. **Update this index** to reference the new document
4. **Follow existing patterns** for structure and style
5. **Include practical examples** where applicable

### Documentation Quality
- ✅ Clear, concise writing
- ✅ Code examples for technical docs
- ✅ Table of contents for long documents
- ✅ Cross-references to related docs
- ✅ Keep it up-to-date

---

## 🎉 Documentation Reorganization (Feb 2026)

This documentation structure was reorganized in February 2026 to:
- **Reduce clutter** - Root directory reduced by 90%
- **Improve navigation** - Clear categorical organization
- **Consolidate duplicates** - Single source of truth
- **Archive history** - Preserve but separate historical docs
- **Enhance discoverability** - Easy to find information

For details on the reorganization:
- See [docs/history/documentation-reorganization/](docs/history/documentation-reorganization/)
- See [docs/history/](docs/history/) for archived content

---

## 💡 Need Help?

- **Can't find something?** Check the directory structure above
- **Something outdated?** Please update it and submit a PR
- **Missing documentation?** Create it following the standards above
- **Questions?** Check PROJECT_DIRECTION.md or README.md

---

*Last Updated: February 2026*
*Documentation Structure: v2.0*
