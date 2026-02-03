# Analysis Task: Generics & Logic Extraction

- [ ] Analyze Type Definitions
    - [ ] Check `src/types/index.ts` for repetitive response structures.
    - [ ] Propose `ApiResponse<T>` or similar generic interfaces.
- [ ] Analyze Custom Hooks
    - [ ] Check `useShops`, `useMyReservations`, etc. for repeated fetcher logic.
    - [ ] Identify opportunity for a generic `useApi<T>` hook.
- [ ] Analyze Utility Logic
    - [ ] Check for repeated `URLSearchParams` construction or error handling.
- [ ] Report Findings
    - [ ] Summarize reachable improvements without implementing them.
