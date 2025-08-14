---
description: Rules
globs:
alwaysApply: true
---

## 1. General Project Organization (Laravel + React + Inertia)

- Follow the standard Laravel architecture, keeping controllers lean and delegating business logic to Services or Actions.
- Use **Eloquent Resources** to format data sent to the frontend.
- Avoid business logic in Controllers or Inertia Views.
- Standardize controller names in singular form + `Controller` (e.g., `UserController`).
- Use `Route::resource` or `Route::controller` whenever possible for consistency.

---

## 2. React with Inertia.js Standards

- Use **functional components** with React Hooks.
- Organize components into:
    - `resources/js/Pages` for pages
    - `resources/js/Components` for reusable components
- Avoid overly large components — split into reusable subcomponents.
- Prefer **TailwindCSS** or **CSS Modules** for styling.
- Use **shadcn/ui** for ready-to-use accessible UI components with consistent design.
- Use `@inertiajs/react` for navigation and forms, avoiding `window.location` or `<a>` outside of Inertia's Link.

---

## 3. JavaScript/TypeScript Best Practices on Frontend

- Use **TypeScript** whenever possible for type safety.
- Avoid using `any` — prefer explicit types or typed generics.
- Use **destructuring** for props and variables.
- Create **reusable hooks** for state logic to avoid code duplication.
- Keep imports organized: libraries first, then internal files.
- Use **react-hook-form** for form state management.
- Validate forms using **zod** schemas integrated with react-hook-form.
- Use **zustand** for global state management when shared state is required across components.

---

## 4. Laravel ↔ React Integration via Inertia

- Always return data to Inertia via `Inertia::render` with compact data (using **Resources** when needed).
- Avoid sending unpaginated queries for large tables.
- For forms:
    - Use Inertia's `useForm` on the frontend when not using react-hook-form
    - Use `react-hook-form` with zod validation for advanced forms
    - Use `FormRequest` on the backend
- Keep backend validations consistent and centralized.

---

## 5. Laravel Code Best Practices

- Use **migrations**, **seeders**, and **factories** for data management.
- Use **mass assignment** protection (`$fillable`) or DTOs when creating records.
- Avoid queries in Blade or React Views — always retrieve data from the controller.
- Use **caching** for static or heavy data.
- Create **automated tests** for main routes and features.

---

## 6. Code Standardization

- Follow **PSR-12** for PHP.
- Follow **ESLint + Prettier** for JavaScript/TypeScript.
- Use English names for classes, methods, variables, and files.
- Avoid generic names like `data`, `info` — prefer descriptive names.
- Document complex functions with clear comments.
