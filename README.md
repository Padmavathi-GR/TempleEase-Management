TempleEase - Crowd Booking Management System

TempleEase is a web application that helps visitors book visit slots to popular temples and helps organizers manage those bookings. It was built as part of the AI Enabled SDE Bootcamp Capstone Assessment (Problem Statement 5 - Temple / Event Crowd Booking System).

Features
Browse available temples with location, description, and available sessions
Search/filter temples by name or location
Select a temple, date, and session to book a visit
Submit visitor details (name, contact number, number of visitors, notes)
View all submitted bookings with search by booking ID or visitor name
View booking details on each booking card
Modify an existing booking's date/session
Cancel a booking
Track booking status (Confirmed / Cancelled)
Frontend and backend form/data validation with clear success and error messages
Responsive layout
Tech Stack
Frontend: HTML, CSS, JavaScript (DOM manipulation, Fetch API)
Backend: Node.js, Express.js
Data storage: In-memory JavaScript arrays (no database, as permitted by the assessment)
Project Structure
TempleEase/
├── backend/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
└── frontend/
    ├── index.html
    ├── script.js
    └── style.css
Setup Instructions
Prerequisites
Node.js installed on your machine
Backend Setup
Open a terminal and navigate to the backend folder:
   cd TempleEase/backend
Install dependencies:
   npm install
Start the server:
   npm start
You should see:
   TempleEase server running on http://localhost:5000
Frontend Setup
Open frontend/index.html directly in your browser (or use a live server extension in VS Code).
Make sure the backend server is running first, since the frontend fetches temple and booking data from it.
API Endpoints
Method	Endpoint	Description
GET	/api/temples	Get list of all temples
GET	/api/bookings	Get all bookings
GET	/api/bookings/:id	Get a single booking by ID
POST	/api/bookings	Create a new booking
PUT	/api/bookings/:id	Modify a booking's date/session
PUT	/api/bookings/:id/status	Update a booking's status (Confirmed/Cancelled)
DELETE	/api/bookings/:id	Delete a booking
Sample Request/Response

POST /api/bookings

Request body:

json
{
  "visitorName": "Padma",
  "contact": "9876543210",
  "visitorCount": 2,
  "templeId": 1,
  "templeName": "Kukke Subramanya Temple",
  "date": "2026-08-20",
  "session": "Morning",
  "notes": ""
}

Response (201 Created):

json
{
  "message": "Booking created successfully",
  "booking": {
    "id": "TE1786896143193",
    "visitorName": "Padma",
    "contact": "9876543210",
    "visitorCount": 2,
    "templeId": 1,
    "templeName": "Kukke Subramanya Temple",
    "date": "2026-08-20",
    "session": "Morning",
    "notes": "",
    "status": "Confirmed"
  }
}

If required fields are missing or invalid, the API responds with a 400 status and a list of specific validation error messages.

Validation

Frontend:

Visitor name must contain only letters and spaces (2-50 characters)
Contact number must be a valid 10-digit Indian mobile number
Temple, date, and session must be selected before submitting

Backend:

Re-validates visitor name, contact number, visitor count, temple selection, date, and session on every booking creation
Returns HTTP 400 with descriptive error messages for invalid input
Returns HTTP 404 when a requested booking ID does not exist
Prevents modification of already-cancelled bookings
HTTP Status Codes Used
Code	Meaning	Used When
200	OK	Successful GET, PUT, or DELETE
201	Created	Successful POST (new booking)
400	Bad Request	Validation failure or invalid status value
404	Not Found	Booking ID does not exist
Implementation Notes

The frontend initially stored bookings in the browser's localStorage as a working prototype, then was progressively connected to the Express backend so that all booking data (create, view, modify, cancel) flows through the REST API and is stored server-side in memory. A localStorage fallback remains in place so the booking form still works if the backend is temporarily unreachable.

Author

Padmavathi