# Documentation Link Fixes - Quick Reference

**Date:** February 2026  
**Status:** Ready to Apply

This document provides the exact fixes needed for broken documentation links identified in the validation report.

---

## Fix #1: DOCUMENTATION_INDEX.md - Line 214

### Current (Broken):
```markdown
- See [DOCUMENTATION_CLEANUP_START_HERE.md](DOCUMENTATION_CLEANUP_START_HERE.md)
```

### Fixed:
```markdown
- See [DOCUMENTATION_CLEANUP_START_HERE.md](docs/history/documentation-reorganization/DOCUMENTATION_CLEANUP_START_HERE.md)
```

---

## Fix #2: docs/deployment/README.md - Line 58

### Current (Broken):
```markdown
- [ ] Firebase configuration set up (see `FIREBASE_SETUP.md` in project root)
```

### Fixed:
```markdown
- [ ] Firebase configuration set up (see [Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md))
```

---

## Fix #3: docs/deployment/README.md - Line 136

### Current (Broken):
```markdown
### In Project Root
- `FIREBASE_SETUP.md` - Firebase configuration guide
- `MOBILE_GUIDE.md` - Mobile usage instructions
- `README.md` - Project overview
```

### Fixed:
```markdown
### In Project Root
- [Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md) - Firebase configuration guide
- [Mobile Guide](../features/MOBILE_GUIDE.md) - Mobile usage instructions
- `README.md` - Project overview
```

---

## Fix #4: DOCUMENTATION_INDEX.md - Remove Duplicate Content

### Issue:
Lines 105-498 contain duplicate/legacy "Today Dashboard Enhancement" documentation index that's no longer relevant after the February 2026 reorganization.

### Action:
Delete lines 105-498 (everything after the first "Last Updated: February 2026" marker)

### Keep:
- Lines 1-104: Current reorganized documentation structure

### Remove:
- Lines 105-498: Legacy documentation index content

---

## Verification Commands

After applying fixes, run these to verify:

```bash
# 1. Verify DOCUMENTATION_CLEANUP_START_HERE.md exists
test -f docs/history/documentation-reorganization/DOCUMENTATION_CLEANUP_START_HERE.md && echo "✓ File exists" || echo "✗ File missing"

# 2. Verify FIREBASE_SETUP.md location
test -f docs/getting-started/FIREBASE_SETUP.md && echo "✓ File exists" || echo "✗ File missing"

# 3. Verify MOBILE_GUIDE.md location
test -f docs/features/MOBILE_GUIDE.md && echo "✓ File exists" || echo "✗ File missing"

# 4. Check that old files don't exist in root
test ! -f FIREBASE_SETUP.md && echo "✓ Not in root (correct)" || echo "✗ Found in root (check needed)"
test ! -f MOBILE_GUIDE.md && echo "✓ Not in root (correct)" || echo "✗ Found in root (check needed)"
```

---

## Quick Apply Script

If you want to apply all fixes at once, use this script:

```bash
#!/bin/bash
# apply-link-fixes.sh

echo "Applying documentation link fixes..."

# Fix #1: DOCUMENTATION_INDEX.md line 214
sed -i '214s|DOCUMENTATION_CLEANUP_START_HERE.md|docs/history/documentation-reorganization/DOCUMENTATION_CLEANUP_START_HERE.md|' DOCUMENTATION_INDEX.md

# Fix #2: docs/deployment/README.md line 58
sed -i '58s|see `FIREBASE_SETUP.md` in project root|see [Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md)|' docs/deployment/README.md

# Fix #3a: docs/deployment/README.md line 136 - Firebase
sed -i '136s|`FIREBASE_SETUP.md` - Firebase configuration guide|[Firebase Setup Guide](../getting-started/FIREBASE_SETUP.md) - Firebase configuration guide|' docs/deployment/README.md

# Fix #3b: docs/deployment/README.md line 137 - Mobile (line number may shift)
sed -i 's|`MOBILE_GUIDE.md` - Mobile usage instructions|[Mobile Guide](../features/MOBILE_GUIDE.md) - Mobile usage instructions|' docs/deployment/README.md

echo "✓ Link fixes applied"
echo ""
echo "⚠ Manual action required:"
echo "   Remove lines 105-498 from DOCUMENTATION_INDEX.md"
echo ""
echo "Run verification commands to confirm fixes."
```

**Note:** Fix #4 (removing duplicate content) must be done manually or with a text editor, as it involves removing a large block of content.

---

## Files to Edit

1. ✏️ **DOCUMENTATION_INDEX.md**
   - Line 214: Update path
   - Lines 105-498: Delete duplicate content

2. ✏️ **docs/deployment/README.md**
   - Line 58: Update Firebase reference
   - Line 136: Update Firebase reference
   - Line 137: Update Mobile Guide reference

---

## Testing Checklist

After applying fixes:

- [ ] All links in DOCUMENTATION_INDEX.md resolve correctly
- [ ] All links in docs/deployment/README.md resolve correctly
- [ ] No duplicate content remains in DOCUMENTATION_INDEX.md
- [ ] Click through key navigation paths manually
- [ ] Verify with the commands in "Verification Commands" section

---

## Impact Assessment

### Low Risk Changes ✅
All fixes are simple path corrections with no functional changes to the application.

### Affected Users
- Documentation readers
- New contributors following setup guides
- Developers navigating documentation structure

### Rollback
If issues arise, revert the commits containing these changes.

---

**Ready to Apply:** Yes  
**Estimated Time:** 10-15 minutes  
**Testing Time:** 5 minutes  
**Total Time:** ~20 minutes

---

*For detailed analysis, see LINK_VALIDATION_REPORT.md*
