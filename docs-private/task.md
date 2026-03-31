# TypeScript Refactoring Candidates

- [x] Investigate Error Handling
    - [x] Check if `unknown` is used in catch blocks instead of `any`.
    - [x] Propose `isApiError` type guard.
- [x] Investigate Component Props
    - [x] Check if `ComponentProps` or `Pick/Omit` are used.
    - [x] Propose stricter component interfaces.
- [x] Investigate State Management
    - [x] Check usage of Discriminated Unions for loading/error states.
- [x] Prepare Proposal
    - [x] Summarize findings and impact on skill score.
    - [ ] **Review Improvement Proposal** (`docs-private/SKILL_IMPROVEMENT_PROPOSAL.md`)
- [ ] Phase 4: Expert TypeScript (Skill Boost)
    - [ ] [Branded Types] Define `Brand<K, T>` utility.
    - [ ] [Branded Types] Convert ID types (UserId, ShopId) to Branded Types.
    - [ ] [Schema Inference] Refactor types to use `z.infer` from schemas.
    - [ ] [Polymorphic UI] specific implementation plan for `Box` or `Text` component.
