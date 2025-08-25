---
description: Rules for the CEE Admin project
globs: ['**/*']
alwaysApply: true
---

## 1. Core Principles

This project follows specific architectural and structural guidelines to ensure code quality, maintainability, and consistency. All generated code must adhere to these rules.

For a detailed overview of the project's architecture, refer to the main documentation file:

- **Primary Documentation**: `docs/CODE_STRUCTURE.md`

---

## 2. Backend (Laravel)

The backend follows a clean architecture pattern, separating concerns into distinct layers.

### Business Logic

- **Controllers must be lean.** They should only be responsible for handling HTTP requests and returning responses.
- **Business logic must be delegated to `Service` classes.** Complex database queries can be abstracted into `Repository` classes.
- **AVOID placing business logic in controllers or models.** See `docs/CODE_STRUCTURE.md` for correct examples.

### Validation

- **Always use `FormRequest` classes** for validation. This keeps validation logic separate from the controller.
- Reference: `docs/CODE_STRUCTURE.md`.

### Database

- The database schema is defined and documented. Before creating or modifying migrations, refer to `docs/database.md`.
- Use **migrations, seeders, and factories** for database management.

---

## 3. Frontend (React + TypeScript)

The frontend is built with React, TypeScript, and Inertia.js, emphasizing a clear separation of concerns.

### Component & Page Structure

- **Pages**: `resources/js/pages` - Represent application screens.
- **Reusable Components**: `resources/js/components` - UI-only components with no business logic.
- **Forms**: `resources/js/forms` - Contains form schemas and logic.
- **Global State**: `resources/js/stores` - For global state management using Zustand.
- For more details, see `docs/CODE_STRUCTURE.md`.

### State Management & Forms

- Use **Zustand** for global state management.
- Use **react-hook-form** with **Zod** for all forms to ensure robust validation and state handling.

### Styling

- **shadcn/ui** is the primary component library. Use its components whenever possible for UI consistency.
- Styling is done via **TailwindCSS**.

---

## 4. User Flows & Features

When implementing new features or modifying existing ones, it's crucial to understand the defined user flows. This ensures the implementation aligns with the application's intended behavior.

- **Refer to `docs/user-flows.md`** to understand the main application flows, such as sales registration and user management.

---

## 5. Testing

The project has a clear testing strategy for both backend and frontend.

- **Backend (Pest)**:
    - **Feature Tests**: For routes, validation, and controller logic.
    - **Unit Tests**: For `Service` classes in isolation.
    - **E2E Tests**: Use **Pest + Playwright** to simulate user flows.
- **Frontend (React)**:
    - **Component Tests**: Use **React Testing Library** for UI component testing.

Refer to the "Tests" section in `docs/CODE_STRUCTURE.md` for more details.

---

## 6. General Coding Standards

- **Code Style**:
    - **PHP**: Follow **PSR-12**.
    - **TypeScript/JavaScript**: Follow **ESLint + Prettier** rules.
- **Naming**: Use clear, descriptive, and English names for all variables, methods, and classes. Avoid generic names like `data` or `item`.
- **AI-Friendliness**: Write clear comments explaining the _intent_ behind complex code blocks to guide AI-assisted development.
