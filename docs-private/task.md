# TypeScript Refactoring Candidates

- [ ] Investigate Error Handling
    - [ ] Check if `unknown` is used in catch blocks instead of `any`.
    - [ ] Propose `isApiError` type guard.
- [ ] Investigate Component Props
    - [ ] Check if `ComponentProps` or `Pick/Omit` are used.
    - [ ] Propose stricter component interfaces.
- [ ] Investigate State Management
    - [ ] Check usage of Discriminated Unions for loading/error states.
- [ ] Prepare Proposal
    - [ ] Summarize findings and impact on skill score.
- [ ] Phase 4: Expert TypeScript (Skill Boost)
    - [ ] [Branded Types] Define `Brand<K, T>` utility.
    - [ ] [Branded Types] Convert ID types (UserId, ShopId) to Branded Types.
    - [ ] [Schema Inference] Refactor types to use `z.infer` from schemas.
    - [ ] [Polymorphic UI] specific implementation plan for `Box` or `Text` component.
