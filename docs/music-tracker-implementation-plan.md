# Music Tracker App – Implementation Plan

This plan converts the new page-architecture specifications into incremental engineering work. It focuses on UI-level features first, with enough backend notes to keep data consistent.

## 1) Cross-cutting Foundations
- **Information architecture & routing**: Define routes for Item pages (Songs, Videos, Releases, Events, Expenses, Global Tasks), View pages (Dashboard, Financials, Tasks, Progress), Team Members, and Settings. Ensure deep links for Item More/Edit and Task More/Edit dialogs.
- **Data model alignment**: Confirm schemas for Items, Tasks, Versions, Stages, Eras, Tags, Team Members, cost fields (Estimated/Quoted/Amount Paid + Partial flag), and relationships (Item → Versions → Tasks, Task → Team Members, Task → Version/Item/Standalone).
- **UI composition patterns**: Create shared layout components for grid/list toggles, module sections (Basic Info, Display Info, Tasks, Notes, Item-specific module slot), filters, and sortable tables. Target reusability across Item and Task pages.
- **State management**: Choose/store query state for filters, sorting, pagination, and module edit buffers (e.g., React Query + local form state). Standardize optimistic updates and error handling.
- **Permissions/visibility rules**: Ensure Settings-driven visibility toggles (e.g., dashboard widgets, filtering defaults) are respected in component guards and queries.

## 2) Item Pages
- **Shared list behavior**: Build an ItemList template supporting grid/list switch, Add New, and row click to open Edit/More Info. Wire up for all Item types; hide Expense-specific details by using invisible Items for expense Tasks.
- **Per-type extras**:
  - Songs: include Versions count and quick link to Versions module.
  - Releases: show Release Stage/Era and Tracklist progress summary.
  - Events: show date/location chips and status.
  - Global Tasks: surface Category badge (fallback to invisible uncategorized category).
  - Expenses: ensure Add New opens Task-based expense flow (invisible Item records).

## 3) Item More/Edit Info Pages
- **Universal modules**: Implement Basic Information (editable fields), Display Information (read-only linked data), Tasks (list + sorting/filtering + Add Custom Task), and Notes.
- **Item-specific module slot**: Support plug-ins per Item type (e.g., Song Versions module, Release Tracklist, Event Date/Location, Video Platform/Exclusivity).
- **Task linking**: When opened from an Item, the Tasks module filters to that Item/Version and supports adding custom Tasks with the Item preselected.

## 4) Task More/Edit Info Pages
- **Field coverage**: Implement streamlined edit form with Task Name, Due Date, Status, Assigned Team Members (multi-select), cost trio (Estimated, Quoted, Amount Paid) with Partial Payment flag, cost splitting, Eras/Stages/Tags, Notes.
- **Parent context**: Support linking to Item, Version, or Standalone tasks; preserve breadcrumb/back-navigation to originating page.
- **Cost precedence**: Apply Amount Paid > Quoted > Estimated ordering in display/aggregation components.

## 5) View Pages
- **Dashboard**: Show in-progress/due-soon Tasks, upcoming Events, global cost metrics (totals and paid), total progress, optional random Item spotlight.
- **Financials**: Build filter panel for Stage/Era/Release/Song/Version/Item Type + paid/quoted/projected toggles; render tables and charts based on cost precedence.
- **Tasks**: Global Task table with sorting (due date, cost, status, Item type) and filtering (status, era, stage, tag, team member) plus summary counts by state.
- **Progress**: Display progress using 0 / 0.5 / 1 model with filters for Era, Stage, Tags, Item Type, Release/Song/Version.

## 6) Team Member Pages
- **Profile layout**: Show core fields (name, phone, email, notes, type). Subsections vary by type: Roles/Work mode/Musician/Instruments for Individuals; Group metadata and memberships; Organization details and membership lists.
- **Task integration**: List Tasks attached to the member and include "New Standalone Task" with member prefilled. Support cost splitting display when relevant.

## 7) Settings Pages
- **Config forms**: Manage auto-generated task definitions, auto-deadline formulas, default Stage/Era, cost calculation rules, visibility rules, dashboard customization, and filtering rules.
- **Propagation**: Ensure Settings drive defaults and UI toggles across Item lists, Task creation flows, and dashboards.

## 8) Cost & Calculation System
- **Aggregation**: Item cost = sum of Task costs; use precedence (Amount Paid, else Quoted, else Estimated). Partial Payment flag is informational (no partial sums).
- **Reporting**: Financials and dashboard metrics rely on the same aggregation helpers to keep totals consistent.

## 9) Delivery Phases
1. **Scaffold & routing**: Build routes/layout shells and shared components for list grids, module sections, and filter panels.
2. **Task & cost engine**: Implement Task form, cost precedence helpers, and aggregation utilities; integrate with Item cost computation.
3. **Item detail modules**: Flesh out Item More/Edit pages with universal modules and per-type plug-ins.
4. **View pages**: Implement Dashboard, Tasks, Financials, and Progress views using shared tables and filters.
5. **Team & Settings**: Build Team Member pages and Settings controls; wire their effects into existing flows.
6. **Polish & validation**: Add empty states, loading/error UI, accessibility, and regression tests for cost calculations and filters.

## 10) Open Questions / Risks
- Do we need offline support or heavy caching for mobile?
- Are there role-based permissions affecting visibility rules?
- Should Expenses as invisible Items surface anywhere for auditing?
- Are there preferred charting/visualization libraries for the Financials and Progress views?
