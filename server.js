const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 5000;

// ===============================
// Middleware
// ===============================

app.use(cors());
app.use(express.json());


// ===============================
// Temple Data
// ===============================

const temples = [
    {
        id: 1,
        name: "Kukke Subramanya Temple",
        location: "Subramanya, Karnataka",
        description: "A famous temple dedicated to Lord Subramanya.",
        sessions: ["Morning", "Afternoon", "Evening"]
    },
    {
        id: 2,
        name: "Udupi Sri Krishna Temple",
        location: "Udupi, Karnataka",
        description: "A historic temple dedicated to Lord Krishna.",
        sessions: ["Morning", "Afternoon", "Evening"]
    },
    {
        id: 3,
        name: "Dharmasthala Manjunatha Temple",
        location: "Dharmasthala, Karnataka",
        description: "A renowned temple dedicated to Lord Manjunatha.",
        sessions: ["Morning", "Afternoon", "Evening"]
    },
    {
        id: 4,
        name: "Murudeshwar Temple",
        location: "Murudeshwar, Karnataka",
        description: "A famous Shiva temple located near the Arabian Sea.",
        sessions: ["Morning", "Afternoon", "Evening"]
    }
];

// ===============================
// GET All Temples
// ===============================

app.get("/api/temples", (req, res) => {
    res.status(200).json(temples);
});


// ===============================
// Booking Data
// ===============================

let bookings = [];


// ===============================
// Validation Helper
// ===============================

function validateBookingInput(body) {

    const errors = [];

    if (!body.visitorName || typeof body.visitorName !== "string" || body.visitorName.trim().length < 2) {
        errors.push("Visitor name is required (min 2 characters).");
    }

    if (!body.contact || !/^[6-9][0-9]{9}$/.test(body.contact)) {
        errors.push("A valid 10-digit contact number is required.");
    }

    if (!body.visitorCount || Number(body.visitorCount) < 1) {
        errors.push("Visitor count must be at least 1.");
    }

    if (!body.templeId) {
        errors.push("Temple selection is required.");
    }

    if (!body.date) {
        errors.push("Visit date is required.");
    }

    if (!body.session) {
        errors.push("Session is required.");
    }

    return errors;
}


// ===============================
// Create Booking
// ===============================

app.post("/api/bookings", (req, res) => {

    const errors = validateBookingInput(req.body);

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", errors });
    }

    const booking = {
        id: "TE" + Date.now(),
        ...req.body,
        status: "Confirmed"
    };

    bookings.push(booking);

    res.status(201).json({
        message: "Booking created successfully",
        booking: booking
    });
});


// ===============================
// Get All Bookings
// ===============================

app.get("/api/bookings", (req, res) => {
    res.status(200).json(bookings);
});


// ===============================
// Get Single Booking
// ===============================

app.get("/api/bookings/:id", (req, res) => {

    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
    }

    res.status(200).json(booking);
});


// ===============================
// Modify Booking (date/session)
// ===============================

app.put("/api/bookings/:id", (req, res) => {

    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
    }

    if (booking.status === "Cancelled") {
        return res.status(400).json({ message: "Cancelled bookings cannot be modified." });
    }

    const { date, session } = req.body;

    if (!date) {
        return res.status(400).json({ message: "Visit date is required." });
    }

    if (!session) {
        return res.status(400).json({ message: "Session is required." });
    }

    booking.date = date;
    booking.session = session;

    res.status(200).json({
        message: "Booking updated successfully",
        booking: booking
    });
});


// ===============================
// Update Booking Status
// ===============================

app.put("/api/bookings/:id/status", (req, res) => {

    const booking = bookings.find(b => b.id === req.params.id);

    if (!booking) {
        return res.status(404).json({ message: "Booking not found." });
    }

    const { status } = req.body;
    const allowedStatuses = ["Confirmed", "Cancelled"];

    if (!status || !allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Status must be 'Confirmed' or 'Cancelled'." });
    }

    booking.status = status;

    res.status(200).json({
        message: "Booking status updated successfully",
        booking: booking
    });
});


// ===============================
// Delete (Cancel) Booking
// ===============================

app.delete("/api/bookings/:id", (req, res) => {

    const index = bookings.findIndex(b => b.id === req.params.id);

    if (index === -1) {
        return res.status(404).json({ message: "Booking not found." });
    }

    const deleted = bookings.splice(index, 1);

    res.status(200).json({
        message: "Booking deleted successfully",
        booking: deleted[0]
    });
});


// ===============================
// Start Server
// ===============================

app.listen(PORT, () => {
    console.log(`TempleEase server running on http://localhost:${PORT}`);
});