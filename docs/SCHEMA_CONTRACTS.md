# Core Schema & Behavior Contracts

This file locks early-stage behavior that tests and future changes must preserve.

## Task status contract
Canonical statuses:
- Not Started
- In-Progress
- Waiting on Someone Else
- Paid But Not Complete
- Complete But Not Paid
- Complete
- Other

Legacy aliases still accepted:
- Done (alias of Complete)
- In Progress (alias of In-Progress)
- Delayed

## Progress scoring contract
- Complete = 1.0
- In-Progress / Waiting on Someone Else / Paid But Not Complete / Complete But Not Paid = 0.5
- All others = 0

Item progress = total points / total tasks.

## Date resolution contract
Primary date resolution order:
1. `primary_date`
2. `primaryDate`
3. `primaryDateOverride`
4. `releaseDate`
5. earliest `releaseOverrides` date
6. earliest attached release date
7. fallback `date`
8. fallback `exclusiveStartDate`
9. fallback `exclusiveEndDate`

## Cost precedence contract
Effective cost precedence order:
1. `actualCost`
2. `amount_paid` / `paidCost` / `amountPaid`
3. `partially_paid` / `partiallyPaidAmount` / `partialPaidCost`
4. `quoted_cost` / `quotedCost`
5. `estimated_cost` / `estimatedCost`

These contracts are validated in `tests/taskLogic.test.js`.
