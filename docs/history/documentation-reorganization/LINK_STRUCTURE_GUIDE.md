# Documentation Link Structure - Visual Reference

**Purpose:** Visual guide showing correct paths for all key documentation files after the February 2026 reorganization.

---

## 📁 Current Directory Structure

```
Era-Manifesto/
│
├── README.md                           ← Main project overview
├── DOCUMENTATION_INDEX.md              ← Documentation hub/index
├── PROJECT_DIRECTION.md                ← Project vision
├── PERFORMANCE_GUIDE.md                ← Performance guide
├── CONTRIBUTING.md                     ← Contribution guidelines
├── CHANGELOG.md                        ← Version history
│
├── docs/                               ← 📚 Main documentation directory
│   │
│   ├── README.md                       ← Documentation directory hub
│   │
│   ├── getting-started/                ← 🎯 Installation & setup
│   │   ├── README.md
│   │   ├── INSTALLATION_CHECKLIST.md   ← Step-by-step setup
│   │   └── FIREBASE_SETUP.md           ← Firebase configuration
│   │
│   ├── architecture/                   ← 🏗️ System design
│   │   ├── README.md
│   │   ├── VISUAL_ARCHITECTURE.md      ← High-level overview
│   │   ├── APP_ARCHITECTURE.md         ← Detailed architecture
│   │   ├── app_architecture_2.md       ← Alternative designs
│   │   └── SCHEMA_CONTRACTS.md         ← Data schemas
│   │
│   ├── features/                       ← 🎨 Feature documentation
│   │   ├── README.md
│   │   ├── TODAY_DASHBOARD_README.md   ← Today/Dashboard guide
│   │   └── MOBILE_GUIDE.md             ← Mobile/PWA features
│   │
│   ├── development/                    ← 🛠️ Developer guides
│   │   ├── README.md
│   │   ├── REACT_ROUTER_GUIDE.md       ← Routing guide
│   │   ├── QUICK_REFERENCE.md          ← Code patterns
│   │   ├── APP_ANALYSIS_RECOMMENDATIONS.md
│   │   └── REMAINING_TODO.md           ← Outstanding tasks
│   │
│   ├── deployment/                     ← 🚀 Deployment guides
│   │   ├── README.md                   ← Deployment hub
│   │   ├── web.md                      ← Web platforms
│   │   ├── android.md                  ← Android PWA
│   │   └── VISUAL_GUIDE.md             ← Visual deployment guide
│   │
│   ├── qa/                            ← 🧪 Testing & QA
│   │   ├── README.md
│   │   ├── TESTING_GUIDE.md           ← Comprehensive tests
│   │   ├── PRE_QA_CHECKLIST.md        ← Pre-commit checklist
│   │   ├── E2E_TESTING.md             ← [deprecated]
│   │   └── E2E_TESTING_QUICK_REF.md   ← [deprecated]
│   │
│   └── history/                        ← 📜 Historical archives
│       ├── README.md
│       ├── e2e-testing/               ← Deprecated E2E docs
│       │   ├── README.md
│       │   ├── E2E_TO_UNIT_MIGRATION.md
│       │   └── [other E2E docs]
│       │
│       ├── phases/                    ← Phase completions
│       │   ├── README.md
│       │   ├── PHASE6_COMPLETE.md
│       │   ├── PHASE7_COMPLETE.md
│       │   ├── ANDROID_IMPLEMENTATION_SUMMARY.md
│       │   └── [other phase docs]
│       │
│       └── documentation-reorganization/  ← Reorganization docs
│           ├── README.md
│           ├── DOCUMENTATION_CLEANUP_START_HERE.md
│           └── [other cleanup docs]
│
└── tests/                              ← 🧪 Unit tests
    ├── README.md
    ├── taskLogic.test.js
    └── utils.test.js
```

---

## 🔗 Correct Link Paths Reference

### From Root Files

When linking **FROM** root-level files (README.md, DOCUMENTATION_INDEX.md):

| Target File | Correct Path |
|-------------|--------------|
| Getting Started README | `docs/getting-started/` |
| Installation Checklist | `docs/getting-started/INSTALLATION_CHECKLIST.md` |
| Firebase Setup | `docs/getting-started/FIREBASE_SETUP.md` |
| Architecture README | `docs/architecture/` |
| Visual Architecture | `docs/architecture/VISUAL_ARCHITECTURE.md` |
| Features README | `docs/features/` |
| Today Dashboard Guide | `docs/features/TODAY_DASHBOARD_README.md` |
| Mobile Guide | `docs/features/MOBILE_GUIDE.md` |
| Development README | `docs/development/` |
| React Router Guide | `docs/development/REACT_ROUTER_GUIDE.md` |
| Quick Reference | `docs/development/QUICK_REFERENCE.md` |
| Deployment README | `docs/deployment/` |
| Web Deployment | `docs/deployment/web.md` |
| Android Deployment | `docs/deployment/android.md` |
| QA README | `docs/qa/` |
| Testing Guide | `docs/qa/TESTING_GUIDE.md` |
| Pre-QA Checklist | `docs/qa/PRE_QA_CHECKLIST.md` |
| History README | `docs/history/` |
| E2E Migration | `docs/history/e2e-testing/E2E_TO_UNIT_MIGRATION.md` |
| Phase Summaries | `docs/history/phases/` |
| Reorganization Docs | `docs/history/documentation-reorganization/DOCUMENTATION_CLEANUP_START_HERE.md` |

### From docs/ Directory

When linking **FROM** files inside `docs/` to root:

| Target File | Correct Path |
|-------------|--------------|
| Root README | `../README.md` |
| Documentation Index | `../DOCUMENTATION_INDEX.md` |
| Project Direction | `../PROJECT_DIRECTION.md` |
| Performance Guide | `../PERFORMANCE_GUIDE.md` |
| Contributing Guide | `../CONTRIBUTING.md` |

### From Section READMEs (e.g., docs/getting-started/)

When linking **FROM** section README files to other sections:

| From Section | To Section | Example Path |
|--------------|------------|--------------|
| getting-started | architecture | `../architecture/` |
| getting-started | features | `../features/` |
| getting-started | development | `../development/` |
| features | development | `../development/REACT_ROUTER_GUIDE.md` |
| development | qa | `../qa/TESTING_GUIDE.md` |
| deployment | getting-started | `../getting-started/FIREBASE_SETUP.md` |
| deployment | features | `../features/MOBILE_GUIDE.md` |
| qa | history | `../history/e2e-testing/` |

---

## ❌ Common Mistakes to Avoid

### Mistake 1: Referencing Old Root Locations
```markdown
❌ WRONG: See `FIREBASE_SETUP.md` in project root
✅ RIGHT: See [Firebase Setup](docs/getting-started/FIREBASE_SETUP.md)
```

### Mistake 2: Incorrect Relative Paths
```markdown
❌ WRONG (from docs/deployment/): See `docs/getting-started/FIREBASE_SETUP.md`
✅ RIGHT (from docs/deployment/): See `../getting-started/FIREBASE_SETUP.md`
```

### Mistake 3: Missing Path Segments
```markdown
❌ WRONG: See [Setup](FIREBASE_SETUP.md)
✅ RIGHT: See [Setup](docs/getting-started/FIREBASE_SETUP.md)
```

### Mistake 4: Using Absolute Paths
```markdown
❌ AVOID: See [Guide](/docs/getting-started/FIREBASE_SETUP.md)
✅ PREFER: See [Guide](docs/getting-started/FIREBASE_SETUP.md)
```

---

## ✅ Link Patterns by Location

### Pattern 1: From Root → docs/
```markdown
Format: docs/[section]/[file].md

Examples:
- [Installation](docs/getting-started/INSTALLATION_CHECKLIST.md)
- [Architecture](docs/architecture/VISUAL_ARCHITECTURE.md)
- [Testing](docs/qa/TESTING_GUIDE.md)
```

### Pattern 2: From docs/ → Root
```markdown
Format: ../[file].md

Examples:
- [Main README](../README.md)
- [Performance](../PERFORMANCE_GUIDE.md)
- [Contributing](../CONTRIBUTING.md)
```

### Pattern 3: From Section → Section
```markdown
Format: ../[section]/[file].md

Examples:
- [Firebase Setup](../getting-started/FIREBASE_SETUP.md)
- [Mobile Guide](../features/MOBILE_GUIDE.md)
- [Testing Guide](../qa/TESTING_GUIDE.md)
```

### Pattern 4: Within Same Section
```markdown
Format: [file].md

Examples:
- [Installation](INSTALLATION_CHECKLIST.md)
- [Firebase](FIREBASE_SETUP.md)
- [Quick Ref](QUICK_REFERENCE.md)
```

---

## 🎯 Quick Validation

Test if a link is correct by answering:

1. **Where is my current file?**
   - Root? Use `docs/section/file.md`
   - In docs/? Use `../` to go up, then navigate
   - In section? Use `../other-section/file.md`

2. **Where is the target file?**
   - Root? Navigate with `../` as needed
   - Different section? Use `../target-section/`
   - Same section? Use filename directly

3. **Does the path work?**
   - Count the `../` - each goes up one level
   - Verify the file exists at that location
   - Test by clicking or using a link checker

---

## 🔍 Link Validation Checklist

Before committing documentation changes:

- [ ] All links use correct relative paths
- [ ] No references to files in old locations (e.g., FIREBASE_SETUP.md in root)
- [ ] Links from root use `docs/section/file.md` format
- [ ] Links from docs sections use `../` correctly
- [ ] All target files actually exist at the specified paths
- [ ] No duplicate content or outdated information
- [ ] Cross-references between sections are accurate

---

## 📚 Key Files That Moved in Feb 2026

These files were relocated during the documentation reorganization:

| Old Location (Wrong) | New Location (Correct) |
|---------------------|------------------------|
| `FIREBASE_SETUP.md` (root) | `docs/getting-started/FIREBASE_SETUP.md` |
| `MOBILE_GUIDE.md` (root) | `docs/features/MOBILE_GUIDE.md` |
| `TESTING_GUIDE.md` (root) | `docs/qa/TESTING_GUIDE.md` |
| `REACT_ROUTER_GUIDE.md` (root) | `docs/development/REACT_ROUTER_GUIDE.md` |
| `E2E_TESTING.md` (root) | `docs/qa/E2E_TESTING.md` [deprecated] |
| Various phase docs (root) | `docs/history/phases/` |
| Various E2E docs (root) | `docs/history/e2e-testing/` |

**Important:** Always use the NEW locations when creating links!

---

## 🛠️ Tools for Validation

### Manual Check
```bash
# From root directory, test a link:
test -f docs/getting-started/FIREBASE_SETUP.md && echo "✓ Link valid" || echo "✗ Link broken"
```

### Automated Check
```bash
# Install markdown-link-check
npm install -g markdown-link-check

# Check a file
markdown-link-check README.md

# Check all markdown files
find . -name "*.md" -not -path "./node_modules/*" -exec markdown-link-check {} \;
```

---

## 📋 Summary

**Golden Rules:**
1. From root → use `docs/section/file.md`
2. From docs/ → use `../` to go up to root
3. Between sections → use `../other-section/file.md`
4. Within section → use `file.md` directly
5. Always verify the file exists at the target location

**Remember:**
- ✅ Relative paths, not absolute
- ✅ Verify files exist at target location
- ✅ Use new locations after Feb 2026 reorganization
- ✅ Test links before committing

---

*This guide reflects the structure after the February 2026 documentation reorganization.*  
*Keep this reference handy when creating or updating documentation links!*
