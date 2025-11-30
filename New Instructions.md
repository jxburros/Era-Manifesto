# Task: Fix Song Edit / More Info Page and Task Handling

You are a GitHub Copilot Agent working on a Music Tracker app.

This task is **NOT** to redesign anything.  
Your job is to **fix specific mismatches** between the implementation and the existing spec for the **Song Edit / More Info Page**, **Tasks**, **Videos**, and **Instruments/Musicians**.

Do **not** change my design choices.  
Do **not** introduce new UX concepts.  
Only align the implementation with the issues and rules described below.

---

## Context (High Level)

- There is a **Song Edit / More Info Page** with sections:
  - Display Only
  - Song Information
  - Versions
  - Tasks

- Songs, Versions, Tasks, Instruments, Musicians, and Videos are already part of a **unified Item + Task system** (as per existing specs).

- **Songs & Versions** should share the same underlying model for Instruments/Musicians, Tasks, and Video linkage.

---

## Problems To Fix (One by One)

### 1. Video selection on Song Information

**Issue:**
- Videos are currently **unable to be selected** in the Song Information section.

**Expected:**
- The Video checkboxes (Music Video, Lyric Video, etc.) must be selectable.
- When a checkbox is checked:
  - Create or link the appropriate **Video Item**.
- When unchecked:
  - Prompt the user that the Video Item will be deleted.
  - If user confirms, delete the associated Video Item.

**Action:**
- Fix the binding / onChange logic so that:
  - Checkboxes are clickable and reflect actual state.
  - They call the existing Video creation/deletion logic.


### 2. Instrument system only allows adding 1 instrument

**Issue:**
- The Song Instrument system only allows adding a **single** Instrument.

**Expected:**
- Multiple Instruments can be added for a Song.
- Each Instrument can have multiple Musicians attached.

**Action:**
- Update the UI and data model binding so:
  - The user can add multiple Instrument rows.
  - Each row can add multiple Musicians (Team Members flagged as Musicians).


### 3. No Display-Only Core Version in the Versions list

**Issue:**
- The Versions list does **not** show a **display-only Core Version** at the top.

**Expected:**
- The Versions section must always:
  - Show the **Core Version** at the top.
  - Core Version is **display-only**.
  - Its values are fed from **Song Information** (not editable here).

**Action:**
- Add a display-only entry at the top of the Versions list.
- Make sure its data is pulled from the Song’s Core fields.
- Do not allow editing of Core Version from the Versions list.


### 4. Instruments/Musicians system is inconsistent between Song and Versions

**Issue:**
- The **Instruments / Musicians** UI for Song Information is different from the one used in Versions.
- The Version-side Musicians UI is closer to the desired design.

**Expected:**
- Song and Version Instrument/Musician UI should use the **same system**.
- **Musicians and Instruments should be one coherent item model**:
  - Add **Instrument** entries.
  - Attach **Musicians** to those Instruments.

**Action:**
- Use the Version-side Musicians UI as the reference implementation.
- Refactor the Song Information Instruments/Musicians section to:
  - Use the same component or same pattern as Versions.
  - Allow multiple instruments.
  - Allow multiple Musicians per Instrument.
- Ensure the underlying data structures are consistent between Song and Version.


### 5. Instruments/Musicians are not editable once added

**Issue:**
- After adding Instruments/Musicians, they **cannot be edited**.

**Expected:**
- User must be able to:
  - Edit Instrument Name.
  - Add/remove Musicians under each Instrument.
  - Remove Instruments entirely.

**Action:**
- Add edit/remove controls to Instrument rows and associated Musicians.
- Ensure these operations update the underlying data and trigger the related Task logic (see below).


### 6. Instrument → Task linkage (AutoTasks)

**Reminder (from spec, not a new design):**
- Whenever an Instrument is added:
  - Create a Task: **“Record (Instrument Name)”**.
  - Attach the Musician(s) associated with that Instrument to the Task.
- When the Instrument is removed:
  - Remove the associated AutoTask if it still exists.
- If the user manually deletes the AutoTask:
  - Prompt them that deleting this AutoTask will delete the Instrument as well.
  - If they confirm, delete the Instrument.

**Action:**
- Verify and correct the Instrument ↔ Task behavior to match this logic.

---

### 7. Custom Task Button in Tasks section doesn’t work

**Issue:**
- The **Custom Task** button in the Tasks section does nothing or fails.

**Expected:**
- Clicking **Add Custom Task** must:
  - Create a new Task for this Song (or initialize a new Task object).
  - Open the Song Task Edit/More Info Page (Task edit dialog/screen).
  - Use the **unified Task system**.

**Action:**
- Wire the button to:
  - Use the global Task creation flow.
  - Navigate/open the Task Edit/More Info Page scoped to this Song.


### 8. Custom Tasks section should be removed

**Issue:**
- There is a separate **Custom Tasks section**.

**Expected:**
- Custom Tasks should be fully integrated into the **main Tasks module**.
- There should be **no separate Custom Tasks section**.

**Action:**
- Remove the separate Custom Tasks section from the UI.
- Ensure all Custom Tasks are created, displayed, and edited through the main Tasks list and Task edit dialog.


### 9. Custom Tasks MUST use the unified Task system

**Issue:**
- Custom Tasks are using a separate or custom system.

**Expected:**
- All Tasks (auto-generated or custom) must:
  - Use the same Task model.
  - Use the same Task edit page.
  - Appear in the same Tasks list.
  - Participate in the same progress and cost calculations.

**Action:**
- Migrate Custom Tasks to the unified Task model.
- Remove any bespoke “custom task” data structures or UI paths.


### 10. Clickable Task rows (open Edit/More Info)

**Issue:**
- Tasks can’t be opened by clicking anywhere on the row.

**Expected:**
- On the Song Edit/More Info Page:
  - Clicking anywhere on a Task row opens the Task Edit/More Info Page.

**Action:**
- Add row-level clickable behavior.
- Ensure it correctly opens the existing Task edit dialog/screen for that Task.


### 11. Autotask field behavior (Name & Due Date)

**Issue:**
- Task Due Date and Name are fully editable for Autotasks.

**Expected:**
- If a Task is an **Autotask**:
  - **Name** and **Due Date** are **display-only** by default.
  - Provide a **checkbox to override**.
    - When checked:
      - Warn the user:  
        > “If you override these fields, this Task will no longer be treated as an AutoTask and will not auto-update.”
      - After confirmation, convert to non-AutoTask behavior and allow editing.

**Action:**
- Add/check AutoTask flag handling in the Task edit UI.
- Lock editing of Name/Due Date for Autotasks until override is confirmed.


### 12. Remove Task Category

**Issue:**
- Tasks currently have a **Category** field.

**Expected:**
- Category for Tasks should be removed from this context.

**Action:**
- Remove Task Category from the Song Edit/More Info UI and Task Edit UI.
- If needed elsewhere, keep only at the global/unified Task level (but NOT visible here).


### 13. Duplicate date columns in Tasks list

**Issue:**
- Two date columns are present in the Tasks list.

**Expected:**
- Only **Due Date** should be shown in the list.
- Due Date must not be editable for Autotasks unless overridden (see #11).

**Action:**
- Remove the extra date column.
- Ensure the remaining date column is Due Date.
- Lock Due Date editing for Autotasks until override is enabled.


### 14. Editable fields in the Tasks list

**Issue:**
- Too many editable fields are exposed directly in the Tasks list.

**Expected:**
- On the **Song Edit/More Info Page**, within the Tasks list:
  - **Status** should be the ONLY directly editable field.
  - All other fields (costs, team members, etc.) should be edited via the Task Edit/More Info Page.

**Action:**
- Restrict inline editing to Status only.
- Ensure all other edits require opening the Task edit view.


### 15. Remove Cost Summary module

**Issue:**
- There is a separate **Cost Summary module**.

**Expected:**
- Cost summary has been moved to the **Display Module**.
- The separate Cost Summary module on the Song Edit/More Info Page should be removed.

**Action:**
- Remove the redundant Cost Summary module component/section.
- Verify that cost summary is still correctly displayed in the Display-only section.

---

## Acceptance Criteria

The implementation is considered correct when:

- Video checkboxes are usable and properly create/delete Video Items.
- Multiple Instruments and multiple Musicians per Instrument can be added and edited on Songs and Versions with a unified system.
- A display-only Core Version appears at the top of the Versions list.
- Custom Tasks are fully integrated into the main Tasks system and UI.
- Clicking on a Task row opens the Task Edit/More Info Page.
- Autotasks protect their Name and Due Date unless explicitly overridden with a user-confirmed checkbox.
- Only Status is inline-editable in the Tasks list.
- Cost Summary is only shown in the Display section and not as a separate module.
- No custom or divergent systems remain for Videos, Instruments/Musicians, or Custom Tasks.

Please make these changes while preserving existing styling and overall layout as much as possible.
