# SecureBank UI — Premium React + TypeScript Banking Experience

A production-style, interactive banking dashboard built to demonstrate React frontend engineering for BFSI/FinTech use cases.

## What this project demonstrates

- Premium responsive banking dashboard UI
- React + TypeScript component architecture
- Smart account balance visibility interaction
- Quick-action banking shortcuts
- Light/dark theme interaction
- Financial overview with spending categories and rule-based insights
- Functional transfer workflow: beneficiary → amount → validation → review → confirmation → success/failure
- Transaction search across merchant, category and transaction ID
- Transaction type and status filters with derived state via `useMemo`
- Pagination with reset-on-filter/search behavior
- Transaction detail dialog
- Loading, error and retry states
- Runtime validation at the API/service boundary
- Frontend-generated idempotency keys with duplicate-request protection in the demo service
- Responsive desktop, tablet and mobile layouts
- Semantic HTML and keyboard-visible focus states
- Accessible status, alert, dialog and table patterns
- Automated UI and service tests with Vitest + React Testing Library
- ESLint, strict TypeScript checks, GitHub Actions and Dependabot

## Premium UI experience

The dashboard is intentionally designed as a realistic fintech product rather than a static collection of cards.

### Interactive experience

- Hide/show available balance.
- Switch between light and dark themes.
- Open the transfer workflow from the hero CTA or Quick Actions.
- Search and filter transaction activity.
- Open transaction details without duplicating transaction state.
- Review spending categories and rule-based financial insights.
- Responsive navigation collapses into a mobile menu.

### Smart dashboard

The financial overview derives insights from the existing transaction source of truth:

- Income versus spending snapshot
- Estimated savings rate
- Spending by category
- Rule-based spending guidance
- Upcoming/attention-oriented banking information through dashboard summary states

These insights are intentionally deterministic demo logic, not a claim of AI processing. A production application could replace the insight calculation with a backend analytics or AI service.

## Architecture

```text
Premium UI
   ↓
Reusable React Components
   ↓
UI State + Derived State
   ↓
Service / Domain Layer
   ↓
Runtime Response Validation
   ↓
REST API / Banking Backend
```

The current repository uses small mock services to keep the portfolio application self-contained. Runtime guards demonstrate a key production boundary: TypeScript protects compile-time code, while API responses still need validation at runtime. A production integration can replace the mock service with authenticated REST calls without coupling API logic to the UI.

## Transfer workflow

1. Open **Transfer money**.
2. Select a saved beneficiary.
3. Enter an INR amount.
4. Validate beneficiary, amount, transfer limit and available balance.
5. Review the transfer.
6. Confirm and show a processing state.
7. Send a unique idempotency key with the transfer request.
8. Display a success receipt or recoverable failure state.
9. Update the demo dashboard balance and transaction list locally after success.

The demo service rejects a previously processed idempotency key so repeated submissions are visible in tests. In a real banking system, the server must own idempotency enforcement, authorization, transaction limits, audit logging and final transaction execution; the frontend key is only part of that contract.

## Transaction experience

The transaction table keeps the original transaction collection as the source of truth and derives the visible result from UI state. Users can:

- Search by merchant, category or transaction ID.
- Filter by debit, credit or all transaction types.
- Filter by success, pending or failed status.
- Navigate paginated results.
- Open an individual transaction detail dialog.

This provides practical interview examples for `useMemo`, derived state, stable keys, pagination boundaries and accessible UI state.

## Testing strategy

The suite covers dashboard rendering, accessible filtering, transaction search/detail behavior, pagination, transfer validation, transfer confirmation, idempotency and runtime API response validation.

Run locally:

```bash
npm test
npm run test:watch
npm run lint
npm run typecheck
npm run build
```

## Suggested production API contract

- `GET /api/accounts`
- `GET /api/transactions?page=1&pageSize=25&type=DEBIT&status=SUCCESS&search=amazon`
- `GET /api/notifications`
- `GET /api/beneficiaries`
- `POST /api/transfers`

Example transfer payload:

```ts
interface TransferRequest {
  sourceAccountId: string;
  beneficiaryId: string;
  amount: number;
  currency: "INR";
  idempotencyKey: string;
}
```

## Security considerations

This is a portfolio/demo UI and does not process real money or store credentials. In production, authorization, validation, transaction limits, idempotency, audit logging and sensitive-data protection must be enforced server-side. The demo's runtime guards and idempotency set are intentionally not presented as substitutes for backend security controls.

## Quality checks

GitHub Actions runs linting, strict TypeScript checking, automated tests and the production build on pushes and pull requests targeting `main`. Dependabot is configured to monitor npm dependencies and GitHub Actions updates weekly.

## Portfolio positioning

This project demonstrates the combination of visual product thinking and frontend engineering: polished fintech UI, reusable React components, realistic business workflows, derived state, runtime API validation, idempotency-aware transfer design, accessibility, responsive behavior, automated testing and a clean API boundary.

## Author

Najmeen Shaikh — React UI Frontend Developer
