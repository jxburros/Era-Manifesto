# 🚀 Era Manifesto Usability Implementation Plan

---

## 1. Navigation & Context Retention

- [x] **Implement Route-Backed Navigation** ✅  
  Transition from state-based tabs to URL-addressable routes using React Router.
  *Completed: React Router implemented in App.jsx with routes for all entity types.*

- [x] **Enable Deep-Linking** ✅  
  Ensure primary list and detail views (e.g., `/songs/:id`) are directly accessible via URL.
  *Completed: useRouteSync hook handles deep-linking for all entity types.*

- [x] **Add Breadcrumb Navigation** ✅  
  Implement a "Parent-Child" navigation trail at the top of detail views (e.g., `Song > Version > Task`).
  *Completed: Breadcrumb component added to Components.jsx and integrated into all detail views (Songs, Releases, Events, Expenses, Videos, Tasks).*

- [ ] **Persistence Layer**  
  Ensure scroll positions and unsaved field states are preserved when a user navigates away and returns to a detail view.

---

## 2. Task Management Optimization

- [ ] **(Optional) Contextual Task Visibility**  
  Add a toggle in Settings to enable "Stage-gate" visibility, hiding future tasks (like "Release") until prerequisites (like "Recording") are met.

- [ ] **Custom Project Templates**  
  Create a system for users to define templates (e.g., "Single" vs "EP") to prevent the auto-generation of unnecessary tasks.

- [ ] **Batch Editing Actions**  
  Implement a multi-select "Bulk Actions" bar for list views to change Status, Era, or Stage for multiple tasks at once.

---

## 3. Dashboard & "Today" View Enhancements

- [x] **Task Source Badges** ✅  
  Add visual indicators (icons or text labels) to tasks in the "Today" view to show their origin (Song, Video, Event, etc.).
  *Completed: Enhanced ActiveView (Today view) with visual source badges using icons and colors. Each task now displays an icon badge showing its source type (Song, Video, Release, Event, Global Task, etc.) with appropriate colors.*

- [x] **"Next Best Action" Widget** ✅  
  Create a prominent dashboard component that uses due dates and progress logic to suggest the single most important task for the user to focus on.
  *Completed: Smart widget added to TaskDashboardView that prioritizes tasks by: 1) Overdue tasks, 2) Tasks due today/tomorrow, 3) In-progress tasks, 4) Upcoming tasks, 5) Not started tasks. Shows task details, source, status, due date, and cost.*

- [x] **Aggregation Unification** ✅  
  Ensure the "Today" view captures upcoming/overdue tasks from all sources, not just global tasks.
  *Completed: ActiveView now uses the centralized collectAllTasks() function which aggregates tasks from all sources: Songs, Versions, Releases, Videos, Events, and Global Tasks.*

---

## 4. Design & Accessibility (Focus Mode)

- [ ] **Enhanced Focus Mode**  
  Expand the existing "Focus Mode" to include standard typography settings (disabling forced uppercase) for better readability of dense data.

- [x] **Semantic Color Overlays** ✅  
  Integrate Green (Complete) and Red (Overdue) status colors into the brutalist UI borders for instant recognition.
  *Completed: Added getTaskStatusColors() utility function that provides consistent semantic color scheme based on task status and due date. Integrated into ActiveView (Today view) TaskCard component with color-coded left borders and backgrounds: Red for overdue, Green for complete, Blue for in-progress, Orange for delayed, Gray for not started.*

---

## 5. Data Entry Efficiency

- [ ] **Quick-Add Wizards**  
  Implement a simplified creation flow for Songs and Releases that only requires a name/Era to start, deferring detailed metadata.

- [ ] **Inline List Editing**  
  Enable direct editing of task names, dates, and costs within the list/grid views to eliminate unnecessary navigation to detail screens.

---

## 6. System Integrity & Performance

- [ ] **Data Integrity Diagnostics**  
  Add lightweight checks for orphan tasks or invalid statuses to prevent UI errors.

- [ ] **Selector Memoization**  
  Optimize performance for large datasets by memoizing expensive derived data (like total budget calculations).
