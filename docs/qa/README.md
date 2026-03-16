# Era Manifesto QA & Testing Documentation

This directory contains testing guides, checklists, and quality assurance documentation for Era Manifesto.

## 📚 Testing Guides

### [TESTING_GUIDE.md](TESTING_GUIDE.md)
Comprehensive testing guide with detailed test cases:
- 27+ detailed test cases
- Feature testing procedures
- Edge cases
- Performance testing
- Browser compatibility
- Testing workflows

**Start here** for thorough testing before deployment.

### [PRE_QA_CHECKLIST.md](PRE_QA_CHECKLIST.md)
Pre-QA checklist for developers:
- Code quality checks
- Self-testing checklist
- Pre-commit verification
- Documentation requirements
- Common issues to check

**Use this** before submitting code for QA.

### [E2E_TESTING.md](E2E_TESTING.md)
⚠️ **Note**: E2E testing with Playwright has been replaced by unit tests (Feb 2026).

This document is kept for reference but describes deprecated testing approaches.

### [E2E_TESTING_QUICK_REF.md](E2E_TESTING_QUICK_REF.md)
⚠️ **Note**: Quick reference for deprecated E2E testing.

For historical reference only. Current testing uses unit tests.

## 🧪 Testing Approach

### Current Testing Strategy
- **Unit Tests** - Primary testing approach (Node.js native test runner)
- **Manual Testing** - Following [TESTING_GUIDE.md](TESTING_GUIDE.md)
- **Pre-QA Checks** - Using [PRE_QA_CHECKLIST.md](PRE_QA_CHECKLIST.md)

### Why We Moved Away from E2E
In February 2026, we transitioned from E2E testing to unit tests for:
- **Performance** - Much faster test execution
- **Reliability** - Less flaky tests
- **Maintainability** - Easier to maintain and debug
- **CI/CD** - Better integration with pipelines
- **Development** - Faster feedback loop

See [E2E to Unit Migration](../history/e2e-testing/E2E_TO_UNIT_MIGRATION.md) for details.

## 🔍 Testing Workflows

### For Developers
1. Write code following [Development Guides](../development/)
2. Run unit tests in `tests/` directory
3. Complete [PRE_QA_CHECKLIST.md](PRE_QA_CHECKLIST.md)
4. Submit for review

### For QA
1. Follow [TESTING_GUIDE.md](TESTING_GUIDE.md) test cases
2. Test all major features
3. Verify browser compatibility
4. Check performance metrics
5. Document issues found

### Before Deployment
- ✅ All unit tests pass
- ✅ [PRE_QA_CHECKLIST.md](PRE_QA_CHECKLIST.md) complete
- ✅ Manual testing from [TESTING_GUIDE.md](TESTING_GUIDE.md) done
- ✅ Browser compatibility verified
- ✅ Performance acceptable
- ✅ No critical issues

## 📖 Test Coverage Areas

The testing guides cover:
- ✅ **Today/Dashboard** - Daily view functionality
- ✅ **Timeline** - Event and task timeline
- ✅ **Calendar** - Calendar view and interactions
- ✅ **Tasks** - Task CRUD operations
- ✅ **Events** - Event management
- ✅ **Financials** - Budget tracking
- ✅ **Progress** - Progress monitoring
- ✅ **Mobile/PWA** - Mobile experience
- ✅ **Offline** - Offline functionality
- ✅ **Sync** - Firebase synchronization

## 📖 Related Documentation

- **Development** - See [Development Guides](../development/)
- **Features** - See [Features Documentation](../features/)
- **Architecture** - See [Architecture Docs](../architecture/)
- **Performance** - See [PERFORMANCE_GUIDE.md](../../PERFORMANCE_GUIDE.md)

## 📜 Historical Testing Documentation

For historical context on E2E testing:
- [E2E Testing Archive](../history/e2e-testing/)
- [E2E to Unit Migration Guide](../history/e2e-testing/E2E_TO_UNIT_MIGRATION.md)

---

*For the complete documentation index, see [DOCUMENTATION_INDEX.md](../../DOCUMENTATION_INDEX.md)*
