# Church Sales Counter System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is a web-based application designed to manage the sales counter at a church, handling product sales and tracking members' monthly fee payments. It's built with a modern tech stack and is intended to be a practical tool for the church and a portfolio piece.

## 🌟 Key Features

- **User Roles**: Two main user roles—**Manager** and **Attendant**—with distinct permissions.
    - **Managers** can oversee the system, manage users, and view comprehensive reports.
    - **Attendants** can process sales and monthly fee payments.
- **Sales Counter**: A straightforward interface for registering sales, including customer details, items sold, and payment methods.
- **Monthly Fee Tracking**: Efficiently manage and track members' monthly contributions, with a clear view of who is up-to-date and who has pending payments.
- **Reporting**: Generate daily and monthly sales reports to help with accounting and financial tracking.
- **User Management**: Managers have the ability to add and manage attendant accounts.

## 🛠️ Tech Stack

This project is built using the TALL stack, leveraging the power of Laravel for the backend and modern frontend technologies for a reactive user experience.

- **Backend**:
    - [Laravel 12](https://laravel.com/): A PHP web application framework with expressive, elegant syntax.
    - [Inertia.js](https://inertiajs.com/): To build single-page apps using classic server-side routing.
    - [MySQL](https://www.mysql.com/): As the primary database.
- **Frontend**:
    - [React](https://reactjs.org/): A JavaScript library for building user interfaces.
    - [TypeScript](https://www.typescriptlang.org/): For static typing and improved developer experience.
    - [Tailwind CSS](https://tailwindcss.com/): A utility-first CSS framework for rapid UI development.
    - [Vite](https://vitejs.dev/): A next-generation frontend tooling for a faster and leaner development experience.
- **Testing**:
    - [Pest](https://pestphp.com/): For backend testing.

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and npm
- A local database (MySQL is recommended)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/GuilhermeBenites/cee-admin
    cd cee-admin
    ```
2.  **Install backend dependencies:**
    ```sh
    composer install
    ```
3.  **Install frontend dependencies:**
    ```sh
    npm install
    ```
4.  **Set up your environment:**
    - Copy the `.env.example` file to `.env`.
    - Update the database credentials in your `.env` file.
    ```sh
    cp .env.example .env
    php artisan key:generate
    ```
5.  **Run database migrations and seeders:**
    ```sh
    php artisan migrate --seed
    ```
6.  **Start the development servers:**
    ```sh
    npm run dev
    ```
    This will start the Vite development server and the PHP development server concurrently. You can now access the application at `http://localhost:8000`.

## 📄 License

This project is open-source and licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.\

## 📬 Contact

Guilherme - guilherme.rebello91@gmail.com - https://www.linkedin.com/in/guilherme-benites-39639233/

Project Link: [https://github.com/GuilhermeBenites/cee-admin](https://github.com/GuilhermeBenites/cee-admin)
