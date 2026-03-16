# Engineering Plan: Settings Menu Enhancements

## Core Intent
Expose recently implemented backend logic (`taskOffsets.js`, `costModels.js`, and `dataIntegrity.js`) to the UI while providing granular control over automation, financials, and dashboard customization.

---

## Phase 1: Automation & Task Logic (P0)
**Goal:** Transition from hardcoded auto-generation to user-defined templates.

* **Granular Task Toggles**: Replace the global `autoGenerateTasks` toggle with a hierarchical checklist.
    * Enable/disable by category: Song Core, Versioning, Video Production, Physical Production.
* **Deadline Offset Manager**: Implement a UI for `src/settings/taskOffsets.js`.
    * Input fields for `daysBeforeRelease` per task type (e.g., "Mastering: -14 days", "Art: -30 days").
* **Workflow Templates**: Allow users to save "Project Types" (e.g., "Acoustic Single" vs. "Deluxe Album") that determine which auto-tasks are triggered upon creation.

## Phase 2: Financial Configuration (P1)
**Goal:** Expose the flexible cost calculation engine to the end-user.

* **Cost Model Selector**: A dropdown menu to select the active model from `src/settings/costModels.js`:
    1.  `actual-first` (Paid > Quoted > Estimated).
    2.  `paid-only`.
    3.  `quoted-only`.
    4.  `estimated-only`.
    5.  `custom-precedence`.
* **Currency Settings**: Global input for currency symbol (e.g., $, €, £) used in `calculateTotalBudget`.
* **Privacy Mode**: Toggle to blur or hide financial totals across the Dashboard and Financials views.

## Phase 3: Dashboard & UX Personalization (P1)
**Goal:** Reduce UI clutter and improve readability for different device types.

* **Widget Manager**: Checkbox list to show/hide Dashboard modules:
    * Notifications / Upcoming Tasks.
    * Random Item Spotlight.
    * Financial Overviews.
* **Typography Controls**: Add settings for the "Punk/Brutalist" design system:
    * Toggle `uppercase` styling (Disable for improved readability).
    * Adjustable font weight for dense list views.
* **Navigation Persistence**: Settings to clear the navigation cache or adjust the TTL (Time-to-Live) for unsaved form drafts.

## Phase 4: Data Maintenance & Exports (P2)
**Goal:** Utilize diagnostic utilities and expand reporting capabilities.

* **Diagnostic Tools**: A "Data Health" section to trigger functions from `src/utils/dataIntegrity.js`:
    * `runDiagnostics()`: Scan for orphaned tasks or broken relational links.
    * `repairData()`: Safe mutation to fix detected inconsistencies.
* **Audit Log View**: A read-only history of changes to task statuses, costs, and team assignments.
* **Advanced Exports**: Dedicated buttons for specific data slices:
    * `CSV Export`: Financial Summary.
    * `CSV Export`: Master Task List.
    * `PDF Export`: Complete Era Manifesto Report.

---

## Technical Implementation Notes for AI
* **Storage**: All settings must persist in `localStorage` or `IndexedDB` via the `Store.jsx` actions `saveTaskOffsets()` and `saveCostModel()`.
* **Reactivity**: Use the existing `memoization.js` logic to ensure that changing a cost model or offset immediately triggers a recalculation of aggregate progress and budgets across the app.
* **Styling**: Maintain the 4px border, hard shadow, and high-contrast color palette (Pink, Cyan, Lime, Violet) in all new settings components.
