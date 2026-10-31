# Vehicle Service Management Platform

## Setup
1. In MySQL Workbench, run `database/schema.sql`.
2. In `backend`, copy `.env.example` to `.env` and enter your MySQL password.
3. Open a terminal in `backend`: run `npm install`, then `npm run dev`.
4. Open a second terminal in `frontend`: run `npm install`, then `npm run dev`.
5. Open the Vite URL shown in the terminal (usually http://localhost:5173).

Backend: http://localhost:5000
Database test: http://localhost:5000/api/db-test

Register an account, log in, add a vehicle, then create a service booking.

Never share your real `.env` file or database password. The Python prediction folder is a starter placeholder; its sample rule is not a trained ML model.
