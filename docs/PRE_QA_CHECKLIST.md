# Pre-QA Hardening Checklist

This checklist defines the minimum readiness gate before full regression testing.

## P0 (must be green)
- [ ] `npm run lint` passes with zero warnings.
- [ ] `npm run build` passes.
- [ ] `npm test` passes.
- [ ] Core data logic contract verified (status points, date resolution, cost precedence).
- [ ] Manual smoke run complete using `docs/qa_seed_dataset.json`.

## Manual smoke scenarios
1. **Song → Version → Release flow**
   - Create song, ensure core version exists.
   - Add release and attach song/version.
   - Verify timeline + dashboard surface related tasks.
2. **Auto task + override flow**
   - Confirm auto tasks generated.
   - Edit one auto task title/date/status.
   - Re-open detail page and verify override persisted.
3. **Cost precedence flow**
   - Enter estimated, quoted, then paid values.
   - Validate effective cost uses paid > quoted > estimated.
4. **Global tasks + team assignments**
   - Create standalone task.
   - Assign multiple team members with split costs.
5. **Backup / restore flow**
   - Create backup in settings.
   - Mutate data.
   - Restore backup and validate rollback.

## P1 (should follow immediately)
- [ ] Performance pass on bundle size and route-level code splitting plan.
- [ ] Add E2E smoke automation for top 3 user journeys.
- [ ] Add accessibility pass for keyboard + focus workflows.

## P2 (next sprint)
- [ ] Dashboard widget customization.
- [ ] Saved filter presets.
- [ ] Financial charts completion.
