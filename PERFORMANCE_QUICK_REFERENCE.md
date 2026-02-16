# Performance Optimization Quick Reference

## For Developers

### When to Use Virtualization

Use `react-window` virtualization when:
- ✅ List has > 50 items
- ✅ List items are uniform height
- ✅ Performance is critical (scrolling lag)

Don't use virtualization when:
- ❌ List has < 50 items (overhead not worth it)
- ❌ Items have variable heights
- ❌ Complex nested interactions needed

### Example: Add Virtualization to New List

```javascript
import { FixedSizeList as List } from 'react-window';

const MyVirtualizedList = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={60}
      width="100%"
    >
      {Row}
    </List>
  );
};
```

### When to Use React.memo

Wrap components in `React.memo` when:
- ✅ Rendered repeatedly in lists
- ✅ Props change infrequently
- ✅ Render is expensive

```javascript
export const MyListItem = memo(function MyListItem({ item, onClick }) {
  return <div onClick={() => onClick(item)}>{item.name}</div>;
});
```

### When to Use useMemo

Use `useMemo` for:
- ✅ Expensive calculations (sorting, filtering)
- ✅ Derived data that doesn't change often
- ✅ Object/array creation to prevent re-renders

```javascript
const filteredItems = useMemo(() => {
  return items.filter(item => item.status === 'active')
    .sort((a, b) => a.date.localeCompare(b.date));
}, [items]); // Only recalculate when items change
```

### When to Lazy Load

Use `React.lazy` for:
- ✅ Heavy components (charts, visualizations)
- ✅ Rarely used features (PDF export)
- ✅ Route-level code splitting

```javascript
const HeavyChart = lazy(() => import('./HeavyChart'));

function MyComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <HeavyChart data={data} />
    </Suspense>
  );
}
```

### Code Splitting Patterns

#### Route-based Splitting
```javascript
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
```

#### Feature-based Splitting
```javascript
const exportPDF = async () => {
  const { generatePDF } = await import('./pdfUtils');
  return generatePDF(data);
};
```

#### Component-based Splitting
```javascript
const Chart = lazy(() => 
  import('./components').then(m => ({ default: m.Chart }))
);
```

### Bundle Size Optimization

#### Check current bundle size
```bash
npm run build
# Look for file sizes in dist/assets/
```

#### Analyze bundle composition
```bash
npm install -D rollup-plugin-visualizer
# Add to vite.config.js
# Run build to see interactive treemap
```

#### Reduce bundle size:
1. Remove unused dependencies
2. Use tree-shakeable imports
3. Lazy load heavy modules
4. Enable code splitting

### Performance Profiling

#### Chrome DevTools Performance
1. Open DevTools → Performance
2. Click Record
3. Perform actions
4. Stop recording
5. Analyze flame graph

**Look for**:
- Long tasks (> 50ms)
- Frequent re-renders
- Memory leaks

#### React DevTools Profiler
1. Install React DevTools extension
2. Open Profiler tab
3. Click Record
4. Interact with app
5. Stop recording

**Look for**:
- Components rendering too often
- Expensive render times
- Unnecessary re-renders

### Common Performance Issues

#### Issue: List scrolling is laggy
**Solution**: Add virtualization with react-window

#### Issue: Component re-renders too often
**Solution**: Wrap in React.memo or optimize parent

#### Issue: Expensive calculation on every render
**Solution**: Wrap in useMemo

#### Issue: Large initial bundle size
**Solution**: Add lazy loading and code splitting

#### Issue: Slow first page load
**Solution**: 
- Enable code splitting
- Lazy load non-critical features
- Optimize images/assets

### Performance Best Practices

1. **Memoize expensive computations**
   ```javascript
   const result = useMemo(() => expensiveCalc(data), [data]);
   ```

2. **Virtualize long lists**
   ```javascript
   <List height={600} itemCount={items.length} itemSize={50}>
     {Row}
   </List>
   ```

3. **Lazy load heavy modules**
   ```javascript
   const Heavy = lazy(() => import('./Heavy'));
   ```

4. **Use React.memo for list items**
   ```javascript
   const ListItem = memo(function ListItem({ item }) { ... });
   ```

5. **Debounce expensive operations**
   ```javascript
   const debouncedSearch = useMemo(
     () => debounce(handleSearch, 300),
     []
   );
   ```

6. **Avoid inline object/array creation**
   ```javascript
   // Bad
   <Component style={{ margin: 10 }} />
   
   // Good
   const style = useMemo(() => ({ margin: 10 }), []);
   <Component style={style} />
   ```

7. **Use keys properly in lists**
   ```javascript
   {items.map(item => <Item key={item.id} item={item} />)}
   ```

### Testing Performance

#### Manual Testing
1. Open DevTools → Performance
2. Record 6 seconds of interaction
3. Check FPS stays above 50
4. Look for long tasks

#### Automated Testing
```javascript
import { measurePerformance } from './testUtils';

test('list scrolls smoothly', async () => {
  const metrics = await measurePerformance(async () => {
    // Scroll list
    await scrollList();
  });
  
  expect(metrics.fps).toBeGreaterThan(50);
});
```

### Debugging Performance

#### Enable React Profiling
```javascript
// In development
if (process.env.NODE_ENV === 'development') {
  const { Profiler } = require('react');
  // Wrap app in Profiler
}
```

#### Log Slow Renders
```javascript
useEffect(() => {
  const start = performance.now();
  return () => {
    const duration = performance.now() - start;
    if (duration > 16) { // 60fps = 16ms per frame
      console.warn(`Slow render: ${duration}ms`);
    }
  };
});
```

### Performance Checklist

Before deploying:
- [ ] Bundle size < 500 KB gzipped
- [ ] No console errors
- [ ] Lists with 100+ items scroll smoothly
- [ ] Page loads < 3 seconds
- [ ] No memory leaks
- [ ] All lazy loading works
- [ ] Dark mode performs well
- [ ] Mobile performs well

### Resources

- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [React Window Documentation](https://react-window.vercel.app/)
- [Vite Code Splitting](https://vitejs.dev/guide/build.html#chunking-strategy)
- [Web Vitals](https://web.dev/vitals/)

---

**Quick Reference Version**: 1.0
**Last Updated**: 2024
