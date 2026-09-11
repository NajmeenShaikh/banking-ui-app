# SecureBank UI — React + TypeScript

A production-style banking dashboard UI built to demonstrate React frontend engineering for BFSI/FinTech use cases.

## What this project demonstrates

- React + TypeScript component architecture
- Strict domain models for accounts and transactions
- Service-layer separation for API integration
- Functional transfer workflow: beneficiary → amount → validation → review → confirmation → success/failure
- Transfer validation and demo transaction receipt handling
- Loading, error and retry states
- Transaction filtering with stable IDs
- Responsive design for desktop and mobile
- Semantic HTML and keyboard-visible focus states
- Accessible status, alert, dialog and table patterns
- Automated UI and service tests with Vitest + React Testing Library
- ESLint and GitHub Actions quality checks

## Architecture

```text
UI Components
      ↓
useDashboard()       TransferMoney()
      ↓                    ↓
      └──── Service Layer ──┘
               ↓
       REST API / Banking Backend
```

The current repository uses small mock services to keep the portfolio application self-contained. A production integration can replace the service implementations with authenticated REST calls without coupling API logic to the UI.

## Transfer workflow

The transfer feature demonstrates a realistic frontend business flow:

1. Open **Transfer money** from the dashboard.
2. Select a saved beneficiary.
3. Enter an INR amount.
4. Validate beneficiary, amount, transfer limit and available balance.
5. Review the beneficiary and amount before submission.
6. Confirm the transfer and show a processing state.
7. Display a success receipt with a transaction reference, or a recoverable failure state.
8. Update the demo dashboard balance and transaction list locally after success.

The transfer service also generates an idempotency key in the demo client request shape. In a real banking system, the backend must enforce idempotency and authorization; the frontend cannot be the security boundary.

## Testing strategy

The test suite covers both user-facing behavior and the service boundary:

- Dashboard loading and successful content rendering
- Banking summary metrics
- Accessible transaction filter states
- Debit and credit transaction filtering
- Transfer validation rules
- Transfer review and confirmation flow
- Successful transfer receipt
- Banking service response contract

Run tests locally with:

```bash
npm test
npm run test:watch
```

## Suggested production API contract

- `GET /api/accounts`
- `GET /api/transactions?page=1&pageSize=25&type=DEBIT`
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

This is a portfolio/demo UI and does not process real money or store credentials. In a production banking system, authorization, transaction limits, validation, idempotency, audit logging and sensitive-data protection must be enforced server-side.

## Quality checks

GitHub Actions is configured to run linting, automated tests and the production build on pushes and pull requests targeting `main`.

## Run locally

```bash
npm install
npm run dev
npm run lint
npm test
npm run build
```

## Portfolio positioning

This project is designed to complement the author's fund-transfer workflow, EMI calculator, TypeScript banking domain work, and React/TypeScript banking dashboard. It focuses specifically on polished banking UI, reusable components, realistic frontend business workflows, accessibility, responsive behavior, automated testing, and a clean API boundary.

## Author

Najmeen Shaikh — React UI Frontend Developer
