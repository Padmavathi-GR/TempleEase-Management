// ===============================
// Temple Data
// ===============================

let temples = [];


// ===============================
// Fetch Temples From Backend API
// ===============================

async function fetchTemples() {

    try {

        const response =
            await fetch("http://localhost:5000/api/temples");

        if (!response.ok) {

            throw new Error("Failed to fetch temples");

        }

        temples = await response.json();

        console.log("Temples fetched from backend:", temples);

        displayTemples(temples);
        populateTempleSelect();

    } catch (error) {

        console.error("Error fetching temples:", error);

        templeList.innerHTML =
            "<p>Unable to load temples. Please try again.</p>";

    }
}


// ===============================
// Get HTML Elements
// ===============================

const templeList = document.getElementById("templeList");
const templeSearch = document.getElementById("templeSearch");
const exploreBtn = document.getElementById("exploreBtn");
const templeSelect = document.getElementById("templeSelect");
const visitDate = document.getElementById("visitDate");
const bookingForm = document.getElementById("bookingForm");
const message = document.getElementById("message");


// ===============================
// Display Temple Cards
// ===============================

function displayTemples(templeData) {

    templeList.innerHTML = "";

    if (templeData.length === 0) {

        templeList.innerHTML = `
            <p>No temples found.</p>
        `;

        return;
    }

    templeData.forEach(function(temple) {

        const card = document.createElement("div");

        card.className = "temple-card";

        card.innerHTML = `
            <h3>🛕 ${temple.name}</h3>

            <p>📍 ${temple.location}</p>

            <p>${temple.description}</p>

            <p class="availability">
                🕐 Sessions: ${temple.sessions}
            </p>

            <button onclick="selectTemple(${temple.id})">
                View Sessions
            </button>
        `;

        templeList.appendChild(card);
    });
}


// ===============================
// Populate Temple Dropdown
// ===============================

function populateTempleSelect() {

    temples.forEach(function(temple) {

        const option = document.createElement("option");

        option.value = temple.id;

        option.textContent = temple.name;

        templeSelect.appendChild(option);

    });
}


// ===============================
// Select Temple
// ===============================

function selectTemple(templeId) {

    const selectedTemple = temples.find(function(temple) {

        return temple.id === templeId;

    });

    if (!selectedTemple) {
        return;
    }

    templeSelect.value = templeId;

    document.getElementById("booking").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// Temple Search
// ===============================

templeSearch.addEventListener("input", function() {

    const searchText =
        templeSearch.value.toLowerCase();

    const filteredTemples = temples.filter(function(temple) {

        return (
            temple.name.toLowerCase().includes(searchText) ||
            temple.location.toLowerCase().includes(searchText)
        );

    });

    displayTemples(filteredTemples);

});


// ===============================
// Explore Button
// ===============================

exploreBtn.addEventListener("click", function() {

    document.getElementById("temples").scrollIntoView({
        behavior: "smooth"
    });

});


// ===============================
// Prevent Past Dates
// ===============================

const today = new Date();

const year = today.getFullYear();

const month = String(
    today.getMonth() + 1
).padStart(2, "0");

const day = String(
    today.getDate()
).padStart(2, "0");

const currentDate =
    `${year}-${month}-${day}`;

visitDate.min = currentDate;


// ===============================
// Initial Page Setup
// ===============================

fetchTemples();


// ===============================
// Booking Form Submission
// ===============================

bookingForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const visitorName =
        document.getElementById("visitorName").value.trim();

    const contact =
        document.getElementById("contact").value.trim();

    const visitorCount =
        document.getElementById("visitorCount").value;

    const selectedTempleId =
        Number(templeSelect.value);

    const selectedDate =
        visitDate.value;

    const selectedSession =
        document.getElementById("session").value;

    const notes =
        document.getElementById("notes").value.trim();


    // ===============================
    // Validation
    // ===============================

    if (!visitorName) {

        showMessage("Please enter your name.", "error");

        return;
    }


    if (!/^[A-Za-z ]{2,50}$/.test(visitorName)) {

        showMessage(
            "Name should contain only letters and spaces.",
            "error"
        );

        return;
    }


    if (!/^[6-9][0-9]{9}$/.test(contact)) {

        showMessage(
            "Please enter a valid 10-digit mobile number.",
            "error"
        );

        return;
    }


    if (!selectedTempleId) {

        showMessage(
            "Please select a temple.",
            "error"
        );

        return;
    }


    if (!selectedDate) {

        showMessage(
            "Please select a visit date.",
            "error"
        );

        return;
    }


    if (!selectedSession) {

        showMessage(
            "Please select a session.",
            "error"
        );

        return;
    }


    // ===============================
    // Find Selected Temple
    // ===============================

    const selectedTemple = temples.find(function(temple) {

        return temple.id === selectedTempleId;

    });


    // ===============================
    // Create Booking Object
    // ===============================

    const booking = {

        id: "TE" + Date.now(),

        visitorName: visitorName,

        contact: contact,

        visitorCount: Number(visitorCount),

        templeId: selectedTempleId,

        templeName: selectedTemple.name,

        date: selectedDate,

        session: selectedSession,

        notes: notes,

        status: "Confirmed"

    };


    // ===============================
    // Send Booking to Backend
    // ===============================

    try {

        const response = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(booking)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Backend rejected the booking.");
        }

        const savedBooking = await response.json();

        console.log("Saved to backend:", savedBooking);

        // ===============================
        // Success Message
        // ===============================

        showMessage(
            "Booking confirmed successfully! Booking ID: " + booking.id,
            "success"
        );

        displayBookings();

    } catch (error) {

        console.error("Backend save failed, using localStorage fallback:", error);

        // ===============================
        // Save Booking Temporarily (fallback)
        // ===============================

        const existingBookings =
            JSON.parse(localStorage.getItem("templeEaseBookings")) || [];

        existingBookings.push(booking);

        localStorage.setItem(
            "templeEaseBookings",
            JSON.stringify(existingBookings)
        );

        showMessage(
            "Booking saved locally (offline mode). Booking ID: " + booking.id,
            "success"
        );

        displayBookings();

    }

    // Clear form

    bookingForm.reset();

});


// ===============================
// Display Bookings
// ===============================

async function displayBookings() {

    const bookingList =
        document.getElementById("bookingList");

    const searchInput =
        document.getElementById("bookingSearch");

    if (!bookingList) return;

    let bookings = [];

    try {

        const response = await fetch("http://localhost:5000/api/bookings");

        if (!response.ok) {
            throw new Error("Failed to fetch bookings");
        }

        bookings = await response.json();

    } catch (error) {

        console.error("Error fetching bookings from backend, using localStorage fallback:", error);

        bookings =
            JSON.parse(
                localStorage.getItem("templeEaseBookings")
            ) || [];
    }

    const searchTerm =
        searchInput
            ? searchInput.value.toLowerCase().trim()
            : "";

    const filteredBookings =
        bookings.filter(function(booking) {

            const bookingId =
                String(booking.id || "").toLowerCase();

            const visitorName =
                String(
                    booking.visitorName || ""
                ).toLowerCase();

            return (
                bookingId.includes(searchTerm) ||
                visitorName.includes(searchTerm)
            );

        });


    if (filteredBookings.length === 0) {

        bookingList.innerHTML =
            "<p>No bookings found.</p>";

        return;
    }


    bookingList.innerHTML =
        filteredBookings.map(function(booking) {

            return `

                <div class="booking-card">

                    <h3>
                        Booking ID: ${booking.id}
                    </h3>

                    <p>
                        <strong>Visitor:</strong>
                        ${booking.visitorName}
                    </p>

                    <p>
                        <strong>Temple:</strong>
                        ${booking.templeName || "N/A"}
                    </p>

                    <p>
                        <strong>Date:</strong>
                        ${booking.date || "N/A"}
                    </p>

                    <p>
                        <strong>Session:</strong>
                        ${booking.session || "N/A"}
                    </p>

                    <p>
                        <strong>Status:</strong>
                        ${booking.status || "Confirmed"}
                    </p>

                    ${
                        booking.status !== "Cancelled"
                        ?
                        `
                        <button onclick="modifyBooking('${booking.id}')">
                        ✏️ Modify Booking
                        </button>
                        <button
                            onclick="cancelBooking('${booking.id}')"
                        >
                            Cancel Booking
                        </button>
                        `
                        :
                        `
                        <p>
                            ❌ This booking has been cancelled.
                        </p>
                        `
                    }

                </div>

            `;

        }).join("");
}


// ===============================
// Cancel Booking
// ===============================

async function cancelBooking(bookingId) {

    const confirmCancel = confirm("Are you sure you want to cancel this booking?");

    if (!confirmCancel) return;

    try {

        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Cancelled" })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to cancel booking.");
        }

        showMessage("Booking cancelled successfully.", "success");
        displayBookings();

    } catch (error) {
        console.error("Error cancelling booking:", error);
        showMessage(error.message, "error");
    }
}


// ===============================
// Modify Booking
// ===============================

async function modifyBooking(bookingId) {

    try {

        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`);

        if (!response.ok) {
            throw new Error("Booking not found.");
        }

        const booking = await response.json();

        if (booking.status === "Cancelled") {
            showMessage("Cancelled bookings cannot be modified.", "error");
            return;
        }

        document.getElementById("modifyBookingId").value = bookingId;
        document.getElementById("modifyDate").value = booking.date;
        document.getElementById("modifySession").value = booking.session;

        document.getElementById("modifyModal").style.display = "block";

    } catch (error) {
        console.error("Error loading booking:", error);
        showMessage(error.message, "error");
    }
}


// ===============================
// Save Modified Booking
// ===============================

async function saveModifiedBooking() {

    const bookingId = document.getElementById("modifyBookingId").value;
    const newDate = document.getElementById("modifyDate").value;
    const newSession = document.getElementById("modifySession").value;

    if (!newDate) {
        showMessage("Please select a visit date.", "error");
        return;
    }

    if (!newSession) {
        showMessage("Please select a session.", "error");
        return;
    }

    try {

        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ date: newDate, session: newSession })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update booking.");
        }

        document.getElementById("modifyModal").style.display = "none";

        showMessage("Booking updated successfully!", "success");
        displayBookings();

    } catch (error) {
        console.error("Error updating booking:", error);
        showMessage(error.message, "error");
    }
}


// ===============================
// Close Modify Modal
// ===============================

function closeModifyModal() {

    document.getElementById("modifyModal").style.display =
        "none";
}


// ===============================
// Display Message
// ===============================

function showMessage(text, type) {

    const message =
        document.getElementById("message");

    if (!message) {
        alert(text);
        return;
    }

    message.textContent = text;

    if (type === "success") {

        message.style.backgroundColor = "#d4edda";
        message.style.color = "#155724";

    } else {

        message.style.backgroundColor = "#f8d7da";
        message.style.color = "#721c24";
    }

    message.style.padding = "12px";
    message.style.marginTop = "15px";
    message.style.borderRadius = "8px";
}


// ===============================
// Booking Search & Initial Display
// ===============================

const bookingSearch =
    document.getElementById("bookingSearch");

if (bookingSearch) {

    bookingSearch.addEventListener(
        "input",
        displayBookings
    );

}

displayBookings();
