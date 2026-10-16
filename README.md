# StorePulse

Storepulse is a full-stack web application designed for discovering, rating, and managing local stores. It provides role-based access for System Administrators, Store Owners, and Normal Users.

---

## Tech Stack

* **Backend:** Node.js, Express.js, MySQL (`mysql2/promise`), JWT, `express-validator`, `bcryptjs`, `helmet`, `express-rate-limit`
* **Frontend:** React.js (Vite), Bootstrap 5, Custom CSS, `react-toastify`, `canvas-confetti`, `axios`, `react-router-dom`

---

## Features

### System Administrator
* Dashboard with total counts for users, stores, and ratings.
* Create new user accounts (Admin, Store Owner, User) and add stores assigned to owners.
* Search and filter tables by Name, Email, Address, and Role with column sorting.

### Store Owner
* View store average rating (rounded to 2 decimal places).
* Customer feedback table with individual user ratings and timestamps.
* Star rating breakdown (1-5 star distribution).

### Normal User
* Search stores by Name or Address with debounced input.
* Interactive 5-star rating control with automatic update on re-rating (`ON DUPLICATE KEY UPDATE`).
* Filter store list by minimum ratings (All, 3★+, 4★+).

---

## Security & Implementation Details

* JWT Authentication with protected routes (`ProtectedRoute` component on frontend, role-checking middleware on backend).
* Input validation on user and store forms (Name length, password rules, email format).
* Debounced search (`useDebounce`) to avoid excessive API requests while typing.
* Centralized Express error handler returning consistent JSON responses.
* Indexes added on foreign key columns (`role`, `owner_id`, `store_id`, `user_id`).
* Seeding logic reads initial mock data directly from `sampleData.json`.

---

## Demo Accounts

| Role | Email | Password | Linked Account / Store |
| :--- | :--- | :--- | :--- |
| **System Admin** | `admin@system.com` | `Admin@123` | System Administrator |
| **Store Owner** | `aniket.hadakar@gmail.com` | `Password@123` | Apex Electronics & Gadgets |
| **Store Owner** | `victoria@gmail.com` | `Password@123` | Urban Harvest Grocery Mart |
| **Normal User** | `aniket123456@gmail.com` | `Password@123` | Normal User |
| **Normal User** | `samantha@gmail.com` | `Password@123` | Normal User |
| **Normal User** | `benjamin@gmail.com` | `Password@123` | Normal User |

---

## Local Setup

### 1. Database
Make sure MySQL is running on your machine, then create the database:
```sql
CREATE DATABASE IF NOT EXISTS roxiler_db;