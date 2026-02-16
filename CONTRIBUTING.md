# Contributing to Era Manifesto

Thank you for your interest in contributing to Era Manifesto! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to maintain a respectful, collaborative, and inclusive environment for all contributors.

## Getting Started

### Prerequisites

Before you begin, ensure you have:
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Git** for version control
- A modern web browser for testing

### Development Setup

1. **Fork and Clone**
   ```bash
   # Fork the repository on GitHub, then:
   git clone https://github.com/YOUR-USERNAME/Era-Manifesto.git
   cd Era-Manifesto
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Copy `.firebaserc.template` to `.firebaserc` (if using Firebase)
   - Copy `firebase-config.template.json` to `src/firebase-config.json` (if using Firebase)
   - See [Firebase Setup Guide](docs/getting-started/FIREBASE_SETUP.md) for details

4. **Start Development Server**
   ```bash
   npm run dev
   ```
   Open http://localhost:5173 in your browser

5. **Explore the Code**
   - Review [Architecture Documentation](docs/architecture/)
   - Check [Development Guides](docs/development/)
   - Read [Quick Reference](docs/development/QUICK_REFERENCE.md)

## Development Workflow

### Before Starting Work

1. **Check Existing Issues** - Look for related issues or create one to discuss your idea
2. **Review Documentation** - Read relevant docs in [docs/](docs/)
3. **Create a Branch** - Use descriptive branch names
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

### Making Changes

1. **Follow Coding Standards**
   - Use existing patterns from [Quick Reference](docs/development/QUICK_REFERENCE.md)
   - Follow component structure from [Architecture Docs](docs/architecture/)
   - Use Tailwind CSS for styling
   - Add PropTypes for components
   - Use meaningful variable and function names

2. **Write Tests**
   - Add unit tests for new functionality
   - Follow patterns in `tests/` directory
   - See [Testing Guide](docs/qa/TESTING_GUIDE.md)
   - Run tests with `npm test`

3. **Update Documentation**
   - Update relevant documentation in `docs/`
   - Add code comments for complex logic
   - Update README.md if adding major features
   - Add entries to CHANGELOG.md

4. **Run Quality Checks**
   ```bash
   # Linting
   npm run lint
   
   # Tests
   npm test
   
   # Build
   npm run build
   ```

### Commit Guidelines

Use clear, descriptive commit messages:

```
feat: Add task filtering to Today view
fix: Resolve calendar date range bug
docs: Update React Router guide
style: Improve mobile responsiveness
refactor: Extract utility functions
test: Add tests for task aggregation
chore: Update dependencies
```

### Pull Request Process

1. **Complete Pre-QA Checklist**
   - Review [Pre-QA Checklist](docs/qa/PRE_QA_CHECKLIST.md)
   - Ensure all tests pass
   - Verify no console errors
   - Test in multiple browsers

2. **Create Pull Request**
   - Provide a clear title and description
   - Reference related issues (#123)
   - Explain what changed and why
   - Add screenshots for UI changes
   - List any breaking changes

3. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Related Issue
   Fixes #123
   
   ## Changes Made
   - Change 1
   - Change 2
   
   ## Testing
   - [ ] Tested locally
   - [ ] Added/updated tests
   - [ ] Tested in multiple browsers
   - [ ] Updated documentation
   
   ## Screenshots
   (if applicable)
   ```

4. **Review Process**
   - Address review feedback promptly
   - Make requested changes in new commits
   - Keep discussion focused and respectful

## Code Style Guidelines

### JavaScript/React

- Use functional components with hooks
- Use arrow functions consistently
- Destructure props and state
- Use PropTypes for type checking
- Keep components focused and small
- Extract reusable logic into hooks

**Example:**
```javascript
import { memo } from 'react';
import PropTypes from 'prop-types';

export const TaskCard = memo(function TaskCard({ task, onComplete }) {
  // Component logic here
  
  return (
    <div className="border-4 border-black">
      {/* Component JSX */}
    </div>
  );
});

TaskCard.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
};
```

### Styling

- Use Tailwind CSS utility classes
- Follow the punk/brutalist design system:
  - 4px borders (`border-4`)
  - Hard shadows (no soft shadows)
  - Uppercase labels
  - High contrast colors
- Maintain responsive design (mobile-first)
- Use theme colors from Tailwind config

### File Organization

```
src/
├── components/        # Reusable components
├── contexts/          # React contexts
├── hooks/            # Custom hooks
├── pages/            # Page components
├── services/         # Firebase and other services
├── utils/            # Utility functions
└── App.jsx           # Main app component
```

## Testing

### Unit Tests
- Write tests for new features
- Test edge cases and error conditions
- Mock Firebase services
- Keep tests fast (<5 seconds total)
- See [Testing Guide](docs/qa/TESTING_GUIDE.md)

### Manual Testing
- Test in Chrome, Firefox, Safari, and Edge
- Test on mobile devices
- Test offline functionality
- Test with Firebase sync enabled/disabled
- Follow [Testing Guide](docs/qa/TESTING_GUIDE.md) test cases

## Documentation

### When to Update Docs
- Adding new features
- Changing existing behavior
- Fixing bugs (if not obvious)
- Improving code organization

### Where to Update
- **README.md** - For major features or setup changes
- **docs/development/** - For developer guides and patterns
- **docs/features/** - For user-facing features
- **docs/architecture/** - For architectural changes
- **CHANGELOG.md** - For all notable changes

## Performance

Consider performance when contributing:
- Use `React.memo` for expensive components
- Use `react-window` for long lists (>50 items)
- Lazy load heavy components
- Optimize bundle size
- See [Performance Guide](PERFORMANCE_GUIDE.md)

## Questions?

- Check the [Documentation Index](DOCUMENTATION_INDEX.md)
- Review [Development Guides](docs/development/)
- Ask in GitHub Issues
- Review existing code for patterns

## Recognition

Contributors will be recognized in:
- Git commit history
- GitHub contributors list
- Special thanks in major releases

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

### Contributor License Agreement

When you submit contributions to this project:

1. **License Terms**: Your contributions are automatically licensed under the same Apache License 2.0 terms as the project.

2. **Commercial Use Rights**: You acknowledge and agree that the project owner (Jeffrey Guntly / JX Holdings, LLC) retains the right to use your contributions in future commercial versions of the application. This ensures that the project can be monetized while maintaining a clear path for commercial development.

3. **Your Rights**: You retain copyright ownership of your contributions, but grant the project owner a perpetual, worldwide, non-exclusive license to use, modify, and distribute your contributions in both open-source and commercial versions.

4. **Attribution**: Significant contributions will be recognized in the project's contributors list and release notes.

---

Thank you for contributing to Era Manifesto! 🎵
