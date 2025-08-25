# Code Structure Guidelines

This document defines how to organize the code for the **Church Sales Counter** system.
The goal is to keep the project clean, sustainable, and easy for humans and AI to understand.

---

## General Project Structure

/project-root
│── /app
│ │── /Models # Laravel Eloquent Models
│ │── /Http
│ │ ├── /Controllers # Controllers
│ │ ├── /Requests # Form Requests (validation)
│ │ └── /Middleware # Middlewares
│ │── /Services # More complex business rules
│ │── /Repositories # Abstraction for queries
│── /database
│ │── /migrations # Migration files
│ │── /seeders # Test data
│── /resources
│ │── /js # React + Inertia code
│ │ ├── /components # Reusable components
│ │ ├── /pages # Application pages
│ │ ├── /stores # Global state (Zustand)
│ │ └── /forms # Forms (react-hook-form + zod)
│ │── /views # In case Blade is needed
│── /tests
│ │── /Feature # Application tests (Pest + Playwright)
│ │── /Unit # Unit tests
│ │── /Components # React component tests
│── /public # Public files
│── CODE_STRUCTURE.md
│── README.md
│── user-flows.md

---

## Organization Guidelines

### ✅ Best Practices

- **Lean Models** → use Services or Repositories for business logic.
- **Backend Validation** → always use `FormRequest` in Laravel.
- **Frontend with clear responsibility**:
    - `/components`: UI only, no business logic.
    - `/pages`: screens that combine components.
    - `/stores`: global state (Zustand).
    - `/forms`: forms with validation (react-hook-form + zod).
- **AI friendly** → clear comments explaining the code's intent.

### ❌ What NOT to do

- Place business logic inside the **Controller**.
- Mix database logic inside the **Model**.
- Place complex logic inside **React components**.
- Create files with non-descriptive names (e.g., `Utils2.js`).

---

## Tests

### Laravel (Backend)

- Use **Pest 4** as the testing framework.
- **Unit** Tests → test Services in isolation.
- **Feature** Tests → routes, middlewares, validation.
- **End-to-End (E2E)** Tests → use **Pest + Playwright** to simulate a real flow.

### React (Frontend)

- **Component Tests** → use [Testing Library](https://testing-library.com/docs/react-testing-library/intro/) to check the UI.
- **Application (E2E) Tests** → run with Pest 4 + Playwright.

---

## File Structure Examples

### Backend

/app
│── /Models/Member.php
│── /Services/MonthlyPaymentService.php
│── /Repositories/SaleRepository.php
│── /Http/Controllers/SaleController.php
│── /Http/Requests/SaleRequest.php

### Frontend

/resources/js
│── /components/SaleForm.jsx
│── /components/MonthlyPaymentForm.jsx
│── /pages/SalesPage.jsx
│── /stores/useSalesStore.js
│── /forms/saleSchema.js

---

## Common Error Example ❌

```php
// Controller full of business logic - DO NOT DO THIS
public function store(Request $request) {
    $member = Member::find($request->member_id);
    $member->balance += $request->amount;
    $member->save();
}

Correct Example ✅

// Clean Controller
public function store(SaleRequest $request, SaleService $service) {
    $service->registerSale($request->validated());
}

// Logic isolated in the Service
class SaleService {
    public function registerSale(array $data) {
        $sale = Sale::create($data);
        // extra logic here
        return $sale;
    }
}
```
