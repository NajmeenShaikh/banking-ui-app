# SecureBank UI — React + TypeScript

A production-style banking dashboard UI built to demonstrate React frontend engineering for BFSI/FinTech use cases.

## What this project demonstrates

- React + TypeScript component architecture
- Strict domain models for accounts and transactions
- Service-layer separation for API integration
- Loading, error and retry states
- Transaction filtering with stable IDs
- Responsive design for desktop and mobile
- Semantic HTML and keyboard-visible focus states
- Accessible status, alert and table patterns
- Automated UI and service tests with Vitest + React Testing Library
- ESLint and GitHub Actions quality checks

## Architecture

```text
UI Components
      ↓
useDashboard()
      ↓
Service Layer
      ↓
REST API / Banking Backend
```

The current repository uses a small mock service to keep the portfolio application self-contained. A production integration can replace `src/services/bankingApi.ts` with authenticated REST calls without coupling API logic to the UI.

## Testing strategy

The test suite covers both user-facing behavior and the service/API boundary:

- Dashboard loading state and successful content rendering
- Banking summary metrics
- Accessible transaction filter states
- Debit and credit transaction filtering
- Empty transaction state
- Banking service response contract
- Stable transaction data availability

Run tests locally with:

```bash
npm test
npm run test:watch
```

## Suggested production API contract

- `GET /api/accounts`
- `GET /api/transactions?page=1&pageSize=25&type=DEBIT`
- `GET /api/notifications`
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

This is a portfolio/demo UI and does not process real money or store credentials. In a production banking system, authorization, transaction limits, validation, idempotency, audit logging and sensitive-data protection must be enforced server-side.

## Quality checks

GitHub Actions runs linting, automated tests and the production build on pushes and pull requests targeting `main`.

## Run locally

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Portfolio positioning

This project is designed to complement the author's fund-transfer workflow, EMI calculator, TypeScript banking domain work, and React/TypeScript banking dashboard. It focuses specifically on polished banking UI, reusable components, accessibility, responsive behavior, automated testing, and a clean API boundary.

## Author

Najmeen Shaikh — React UI Frontend Developer
