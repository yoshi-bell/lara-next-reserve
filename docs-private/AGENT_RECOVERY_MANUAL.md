# AI Agent Recovery Manual

## 1. Purpose
This document provides instructions for a new AI agent to quickly understand the current state of the "Rese" project, enabling a swift recovery and continuation of development in case of a context loss (e.g., agent crash).

## 2. Recovery Procedure
A new agent should perform the following steps:

### Step 1: Analyze High-Level Documents
Read and analyze the contents of the following documentation files to understand the project's goals, plans, and history.

- Project Requirements Google Sheet: https://docs.google.com/spreadsheets/d/1UC0eOFVqejIyeVc9782ox9MVYrekaPh3Ulp3oi4WTLs/edit?gid=935968078#gid=935968078
- `lara-next-reserve/docs-private/DEVELOPMENT_PLAN.md`
- `lara-next-reserve/docs-private/DEV_LOG.md`
- `lara-next-reserve/docs-private/_Web開発上級 小野江礼行様用案件シート - 機能一覧.csv`
- `lara-next-reserve/docs-private/_Web開発上級 小野江礼行様用案件シート - テーブル仕様書.csv`

### Step 2: Analyze Key Source Code
Read and analyze the contents of the following key source code files and directories to understand the implementation details.

**Backend (Laravel):**
- List directory: `lara-next-reserve/laravel-next-app/database/migrations/`
- List directory: `lara-next-reserve/laravel-next-app/app/Models/`
- Read file: `lara-next-reserve/laravel-next-app/app/Models/User.php`
- Read file: `lara-next-reserve/laravel-next-app/app/Models/Shop.php`
- Read file: `lara-next-reserve/laravel-next-app/app/Models/Reservation.php`
- Read file: `lara-next-reserve/laravel-next-app/app/Models/ReservationSlot.php`

**Frontend (Next.js):**
- List directory: `lara-next-reserve/next-frontend-app/src/app/`

### Step 3: Analyze UI/UX Design
Analyze the UI mockup images located in the following directory to understand the visual and user experience requirements.

- `yoyaku_ui/`

## 3. Expected Conclusion (as of 2026-01-16)
After completing the analysis, the agent should reach the following conclusion about the project's status:

*   **Backend (Phase 2: Database and Model Definition) is COMPLETE:** The database schema (migrations) and Eloquent models are fully implemented according to the development plan. Critical features like composite unique keys and soft deletes are correctly in place.
*   **Backend (Phase 3: Shop Feature API Implementation) is COMPLETE:** `ShopController` (index and show methods with search) and its corresponding API routes (`GET /api/shops`, `GET /api/shops/{shop}`) are fully implemented.
*   **Backend (Phase 4: Authentication) is PARTIALLY IMPLEMENTED:** The `/api/user` route is already defined and protected by `auth:sanctum`.
*   **Frontend (Phase 3 onwards) has NOT STARTED:** The Next.js project is still in its initial state, with no custom pages or components created yet.
*   **Next Task:** The immediate next step is to continue with **Phase 4: 認証機能の実装** (Authentication Feature Implementation), specifically implementing the `/login` and `/logout` routes in `routes/web.php` in the Laravel project.

---
*This manual should be checked and updated as necessary whenever `DEV_LOG.md` is updated.*
