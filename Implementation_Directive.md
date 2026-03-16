# Implementation Directive: System Optimization & Feature Expansion

## 1. Code & Module Consolidation
Objective: Reduce logic duplication and standardize data handling across the application.

* Standardized Task Engine:
    * Consolidate task handling for Songs, Versions, Videos, Releases, and Events into a unified TaskEngine module.
    * Centralize auto-generation logic, cost precedence rules (Paid > Quoted > Estimated), and progress point calculations (0.5 for in-progress, 1.0 for complete).
* Schema & Naming Unification:
    * Migrate all UI components and database operations to use the unified underscore_case schema (e.g., primary_date).
    * Deprecate and remove legacy camelCase aliases (e.g., primaryDate) once UI consistency is verified.
* Performance Optimization:
    * Centralize all cost and progress calculations within src/utils/memoization.js.
    * Refactor the Store context to expose only these memoized values to prevent redundant heavy calculations.

## 2. Customer Experience (UX) Smoothing
Objective: Enhance workflow automation and provide better visual feedback.

* Automated Era Synchronization:
    * Implement a background prompt or "Sync Era" button that automatically propagates Era changes from parent items to all children and linked tasks.
* Contextual Theming:
    * Expand "Focus Mode" to include "Era-Specific Themes".
    * Automatically shift UI accent colors based on the themeColor or metadata of the active Era to provide immediate environmental context.
* Dynamic Scheduling (Smart Deadlines):
    * Implement "Dependency Tracking" for auto-deadlines.
    * When a Release Date is modified, automatically shift all "upstream" production tasks while preserving manual user overrides.

## 3. Functionality Expansion
Objective: Fill gaps in project blueprints, financial tracking, and multi-user management.

* Release Blueprints Library:
    * Develop a centralized library for "Release Blueprints" (e.g., Social Media Heavy, Physical-Only) to allow users to swap global task templates quickly.
* Team Financial Dashboard (Payables):
    * Implement a "Payables" view to aggregate "Amount Owed" per Team Member across all songs, videos, and tasks.
    * Ensure cost allocation data from tasks is correctly summarized in this view.
* Multi-User Role Permissions:
    * Enhance the "Manager Mode" security rules beyond Anonymous Auth.
    * Define specific permission levels for "Manager," "Artist," and "Band Member" to control data access and edit rights.
