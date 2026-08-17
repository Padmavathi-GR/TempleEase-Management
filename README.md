# TempleEase - Crowd Booking Management System

TempleEase is a web application that helps visitors book visit slots to popular temples and helps organizers manage those bookings. It was built as part of the AI Enabled SDE Bootcamp Capstone Assessment (Problem Statement 5 - Temple / Event Crowd Booking System).

## Features

- Browse available temples with location, description, and available sessions
- Search/filter temples by name or location
- Select a temple, date, and session to book a visit
- Submit visitor details (name, contact number, number of visitors, notes)
- View all submitted bookings with search by booking ID or visitor name
- View booking details on each booking card
- Modify an existing booking's date/session
- Cancel a booking
- Track booking status (Confirmed / Cancelled)
- Frontend and backend form/data validation with clear success and error messages
- Responsive layout

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript (DOM manipulation, Fetch API)
- **Backend:** Node.js, Express.js
- **Data storage:** In-memory JavaScript arrays (no database, as permitted by the assessment)

## Project Structure

TempleEase/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css

## Setup Instructions

### Prerequisites
- Node.js installed on your machine

### Backend Setup

1. Open a terminal and navigate to the backend folder:
   cd TempleEase/backend
2. Install dependencies:
   npm install
3. Start the server:
   npm start
4. You should see:
   TempleEase server running on http://localhost:5000

### Frontend Setup

1. Open frontend/index.html directly in your browser (or use a live server extension in VS Code).
2. Make sure the backend server is running first, since the frontend fetches temple and booking data from it.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/temples | Get list of all temples |
| GET | /api/bookings | Get all bookings |
| GET | /api/bookings/:id | Get a single booking by ID |
| POST | /api/bookings | Create a new booking |
| PUT | /api/bookings/:id | Modify a booking's date/session |
| PUT | /api/bookings/:id/status | Update a