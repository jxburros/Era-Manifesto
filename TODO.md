# 🚀 Era Manifesto — Implementation To-Do List

Purpose: Structured engineering tasks for AI coding agent.
Scope: Core logic, workflow efficiency, UI enhancements, data auditing, performance optimization.

Priority Legend:
P0 = Core System / Integrity
P1 = Workflow & UX
P2 = Enhancements / Optimization

---

# ✅ P0 — Core System & Logic Configuration

## [ ] Migrate Hardcoded Deadline Logic to Settings

### Problem
Auto-deadline offset formulas are hardcoded.

### Required Changes
- Move deadline offset formulas into a configurable settings module.
- Create:
  `settings/taskOffsets.ts`
- Support user-defined offsets per:
  - Stage
  - Task Type
  - Project Type

### Acceptance Criteria
- No hardcoded offset logic remains in task engine.
- User settings override defaults.
- Backwards compatibility maintained.

---

## [ ] Implement Cost Calculation Flexibility

### Problem
Cost precedence logic is fixed.

### Required Changes
- Add configuration UI to choose calculation model:
  - Paid-first
  - Quoted-first
  - Custom precedence
- Store preference in user settings.
- Update cost aggregation selectors to respect configuration.

### Acceptance Criteria
- Users can switch cost models without data mutation.
- Totals update dynamically based on selected model.

---

## [ ] Develop Data Integrity Diagnostics

### Problem
No automated validation of:
- Orphaned tasks
- Invalid statuses
- Broken references

### Required Changes
- Create diagnostic utility:
  `utils/dataIntegrity.ts`
- Implement checks for:
  - Task without parent
  - Invalid stage/status combinations
  - Broken relational links
- Provide:
  - Report summary
  - Optional auto-repair

### Acceptance Criteria
- Diagnostics run safely without mutation by default.
- Repair mode fixes detected inconsistencies.

---

## [ ] Implement Navigation Persistence Layer

### Problem
Scroll positions and unsaved form state are lost during navigation.

### Required Changes
- Persist:
  - Scroll position per route
  - Unsaved form draft state
- Use:
  - In-memory cache OR sessionStorage
- Restore state when returning to detail view.

### Acceptance Criteria
- Returning to a detail view restores:
  - Scroll location
  - Unsaved inputs
- No stale data leakage between routes.

---

# ⚙️ P1 — Efficiency & Workflow Enhancements

## [ ] Build Quick-Add Wizards

### Goal
Allow minimal metadata creation for:
- Songs
- Releases

### Required Changes
- Implement simplified creation modal:
  - Name
  - Era
- Defer advanced metadata to later editing.

### Acceptance Criteria
- Creation requires ≤ 2 required fields.
- Auto-generated tasks respect project template.

---

## [ ] Enable Inline Editing in List/Grid Views

### Goal
Reduce navigation overhead.

### Required Changes
- Support inline editing for:
  - Task name
  - Due date
  - Cost fields
- Implement optimistic updates.

### Acceptance Criteria
- Edits persist without navigating to detail view.
- No data corruption during rapid edits.

---

## [ ] Implement Batch Actions Bar

### Goal
Update multiple tasks simultaneously.

### Required Changes
- Multi-select capability.
- Bulk update options:
  - Status
  - Era
  - Stage

### Acceptance Criteria
- Single state update per bulk action.
- UI reflects changes instantly.

---

## [ ] Implement Task Visibility Logic

### Subtask A — Custom Project Templates

#### Required Changes
- Create template system:
  - Single
  - EP
  - Album
- Prevent auto-generation of irrelevant tasks.

#### Acceptance Criteria
- Templates determine initial task structure.
- No unnecessary tasks created.

---

### Subtask B — Stage-Gate Visibility Toggle

#### Required Changes
- Add toggle in Settings:
  `Enable Stage-Gate`
- Hide future tasks (e.g., Release) until prerequisites complete.

#### Acceptance Criteria
- Hidden tasks remain in data but not rendered.
- Toggle updates visibility without mutation.

---

# 🎨 P2 — UI, UX & Visualization Enhancements

## [ ] Expand Enhanced Focus Mode

### Required Changes
- Add typography controls:
  - Disable forced uppercase
  - Adjustable font weight
- Maintain brutalist styling consistency.

### Acceptance Criteria
- Focus Mode improves readability of dense views.
- User preference persists.

---

## [ ] Add Dashboard Customization Toggles

### Required Changes
- Add settings toggles for:
  - Notifications widget
  - Progress bars
  - Financial summaries
- Persist layout preferences.

### Acceptance Criteria
- Widgets can be shown/hidden dynamically.
- No layout breakage.

---

## [ ] Integrate Financial Charts

### Required Changes
- Add:
  - Pie chart for cost breakdown by source type
  - Bar chart comparing Estimated vs Paid totals
- Memoize derived financial data.

### Acceptance Criteria
- Charts update reactively.
- No performance degradation on large datasets.

---

## [ ] Implement Filter Presets

### Required Changes
- Allow users to:
  - Save named filter configurations
  - Restore saved filters across views
- Persist presets in user settings.

### Acceptance Criteria
- Filters restore correctly across sessions.
- Presets editable and deletable.

---

# 📊 P2 — Data Management & Auditing

## [ ] Implement Activity Logging

### Required Changes
- Track changes to:
  - Task status
  - Budget values
  - Team assignments
- Store timestamp + user context (if applicable).
- Provide read-only audit log UI.

### Acceptance Criteria
- All mutations generate log entries.
- Log view sortable and filterable.

---

## [ ] Add CSV Export — Financial Summaries

### Required Changes
- Export:
  - Budget totals
  - Paid vs Estimated
  - Cost breakdowns
- Generate downloadable CSV.

### Acceptance Criteria
- CSV opens correctly in Excel/Sheets.
- Values match UI totals.

---

## [ ] Add CSV Export — Task Lists

### Required Changes
- Enable CSV export from:
  - Timeline view
  - Global Tasks view

### Acceptance Criteria
- Export respects current filters.
- Column headers standardized.

---

## [ ] Enhance Team Member Detail

### Required Changes
- Update team summaries to include:
  - Cost splitting data
  - Group/organization membership lists
- Display aggregate financial contribution per member.

### Acceptance Criteria
- Accurate cost distribution shown.
- Groups display full membership list.

---

# 🚀 P2 — Performance Optimization

## [ ] Implement Selector Memoization

### Problem
Derived data recalculated unnecessarily.

### Required Changes
- Memoize expensive selectors:
  - Total budget
  - Aggregate progress
  - Financial summaries
- Use:
  `useMemo`
  OR
  memoized selector utilities

### Acceptance Criteria
- Large projects render smoothly.
- No unnecessary recomputation on unrelated state updates.
