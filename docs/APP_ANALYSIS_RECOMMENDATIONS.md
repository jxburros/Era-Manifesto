# Era Manifesto App Analysis & Recommendations

## 1) What the app is doing well

- **Strong domain breadth**: The app models songs, versions, releases, videos, events, standalone tasks, expenses, team, and metadata systems (eras/stages/tags) in one tool.
- **Offline-first default** with optional Firebase sync and anonymous auth is practical for independent artists and small teams.
- **Cross-cutting consistency**: Cost precedence and progress scoring are defined centrally and reused in views.
- **User guidance present**: onboarding checklist, command palette, and mobile FAB reduce first-run friction.

## 2) Functional architecture snapshot

### Core state and data model

- App-wide state is centralized in `StoreProvider` with collections for songs, releases, events, global tasks, expenses, team, and settings.
- The code includes **unified schema helpers** (`createUnifiedItem`, `createUnifiedTask`, normalization functions) while preserving legacy camelCase aliases.
- There is a **bounded undo stack** (max 15 snapshots), implying mutation safety focus.

### Business rules

- **Progress model**: status-to-points mapping with canonical + legacy aliases.
- **Cost model**: paid > quoted > estimated precedence.
- **Auto-generated task model** is configurable via settings toggles but appears partially hardcoded in generation logic.

### UI composition

- Single-shell app with a tab-based router in `App.jsx` (not URL routes).
- Navigation uses Sidebar + top quick tiles + command palette (`Ctrl/Cmd+K`) + mobile FAB.
- Detail flows are stateful selections (`songDetail`, `releaseDetail`, etc.) rather than deep-linked routes.

## 3) User flow analysis

## Entry and setup

1. User lands in the shell and can navigate via sidebar.
2. Onboarding checklist nudges initial configuration (artist/album, first song/release/event/task).
3. User can create entities from list views, quick actions, command palette, and FAB.

**Assessment**: Good discoverability for creation actions, especially on mobile.

## Core working loop

1. Create Song/Release/Event/Task.
2. Enter detail view.
3. Track generated and custom tasks.
4. Monitor via Today/Dashboard/Financials/Progress/Timeline.

**Assessment**: The loop is coherent and centered on tasks/progress/cost outcomes.

## Operational controls

- Undo + toast actions provide confidence for edits.
- Optional cloud mode supports multi-device continuity.
- Archive and export/import support lifecycle and backup.

**Assessment**: Strong operational reliability for a solo/team production tracker.

## 4) Gaps / friction points observed

1. **Navigation is not URL-addressable** (tab state only).
   - Limits deep linking, refresh resilience, and collaboration workflows.
2. **Schema duality overhead** (underscore + camelCase + legacy fields).
   - Increases maintenance risk and can cause subtle bugs during migrations.
3. **Partial settings completeness** versus architecture goals.
   - Dashboard customization, filter presets, and configurable cost rules are still incomplete.
4. **Today view appears global-task heavy**.
   - It can under-represent non-global task obligations from songs/releases/events.
5. **Potential scale concerns** in client-side derived computations.
   - As projects grow, broad in-memory filters/sorts may affect perceived performance.

## 5) Priority recommendations

## P0 (high impact, low/medium effort)

1. **Introduce route-backed navigation** (React Router + tab compatibility layer).
   - Add URL paths for list/detail views and preserve current stateful behavior while migrating.
2. **Unify canonical schema reads/writes**.
   - Adopt one internal source of truth (prefer unified snake_case internally), normalize at boundaries only.
3. **Upgrade Today dashboard aggregation**.
   - Include upcoming/overdue tasks from all sources (song/version/video/release/event/global) with source badges.

## P1 (productiveness / quality)

4. **Finish settings-driven customization**.
   - Dashboard widget toggles, saved filter presets, and deadline offset editors.
5. **Observability for data integrity**.
   - Add lightweight diagnostics: invalid task status counts, orphan task checks, migration version markers.
6. **Performance hygiene for large datasets**.
   - Memoize expensive selectors, use virtualized tables for long lists, and centralize derived selectors.

## P2 (advanced reporting and collaboration)

7. **Expand reporting**.
   - Financial charts and CSV exports for tasks/financials as first reporting increment.
8. **Improve collaboration semantics**.
   - Add conflict hints in cloud mode and “last edited by/at” fields for shared projects.

## 6) Suggested implementation roadmap (4 sprints)

- **Sprint 1**: Route-backed navigation + deep-link support for primary list/detail pages.
- **Sprint 2**: Today aggregation unification + selector refactor for task sources.
- **Sprint 3**: Settings completeness (dashboard toggles + filter presets + deadline editor).
- **Sprint 4**: Reporting package (CSV + charts) + data quality diagnostics.

## 7) Success metrics to track

- Time-to-first-entry completion (first song/release/task).
- % sessions using Today/Dashboard vs. entity pages.
- Average weekly overdue task count per active project.
- Export usage (CSV/PDF) and return usage.
- Rate of undo actions (proxy for accidental edits/friction).

