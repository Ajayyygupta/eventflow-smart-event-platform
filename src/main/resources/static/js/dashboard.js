const token = localStorage.getItem("token");
const userEmail = localStorage.getItem("userEmail");

// Token nahi hai toh login par bhejo
if (!token) {
    alert("Please Login First");
    window.location.href = "login.html";
}

let allEvents = [];
let bookedEventIds = [];

// ── Unsplash images — ?w=800&auto=format se guaranteed load hoti hain ──
const eventImages = [
    "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format",
    "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format",
    "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&auto=format",
    "https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=800&auto=format",
    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format",
    "https://images.unsplash.com/photo-1486591978090-58e619d37fe7?w=800&auto=format"
];

// =========================
// LOAD EVENTS
// =========================
async function loadEvents() {
    try {
        const response = await fetch("/api/events", {
            headers: { Authorization: "Bearer " + token }
        });

        const events = await response.json();
        allEvents = events;
        renderEvents(events);

        const totalEl = document.getElementById("totalEvents");
        const upcomingEl = document.getElementById("upcomingEvents");
        if (totalEl) totalEl.innerText = events.length;
        if (upcomingEl) upcomingEl.innerText = events.length;

    } catch (error) {
        console.error("loadEvents error:", error);
    }
}

// =========================
// RENDER EVENTS
// =========================
function renderEvents(events) {
    let output = "";

    events.forEach((event, index) => {
        const alreadyBooked = bookedEventIds.includes(event.id);
        const soldOut = (event.capacity ?? event.availableSeats ?? 1) <= 0;

        // Har event ko ek fixed Unsplash image milegi index se
        const imgSrc = eventImages[index % eventImages.length];

        output += `
        <div class="col-lg-4">
            <div class="event-card">

                <div class="event-image-wrapper">
                    <img
                        src="${imgSrc}"
                        alt="${event.title}"
                        class="event-image"
                        onerror="this.src='https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format'"
                    >
                </div>

                <div class="event-content">
                    <h3 class="event-title">${event.title}</h3>
                    <p>${event.description ?? ""}</p>
                    <p>📍 ${event.location ?? "TBD"}</p>
                    <p>📅 ${event.date ?? "TBD"}</p>
                    <p>🎟 Seats Left: ${event.capacity ?? event.availableSeats ?? 0}</p>

                    ${
                        alreadyBooked
                        ? `<button class="book-btn booked-btn" disabled>✅ Already Booked</button>`
                        : soldOut
                        ? `<button class="book-btn soldout-btn" disabled>❌ Sold Out</button>`
                        : `<button class="book-btn" onclick="bookEvent(${event.id})">🎟 Book Event</button>`
                    }
                </div>

            </div>
        </div>`;
    });

    document.getElementById("eventsContainer").innerHTML = output;
}

// =========================
// SEARCH EVENT
// =========================
function searchEvent(query) {
    query = query.toLowerCase();
    const filtered = allEvents.filter(event =>
        event.title.toLowerCase().includes(query) ||
        event.location.toLowerCase().includes(query)
    );
    renderEvents(filtered);
}

// =========================
// BOOK EVENT
// =========================
async function bookEvent(eventId) {
    try {
        const response = await fetch(
            `/api/bookings/${eventId}?userEmail=${userEmail}`,
            {
                method: "POST",
                headers: { Authorization: "Bearer " + token }
            }
        );

        const result = await response.text();

        if (response.ok) {
            alert("Event Booked 🔥");
            initializeDashboard();
        } else {
            alert(result);
        }

    } catch (error) {
        console.error("bookEvent error:", error);
    }
}

// =========================
// LOAD BOOKINGS
// =========================
async function loadBookings() {
    try {
        const response = await fetch(
            `/api/bookings?userEmail=${userEmail}`,
            {
                headers: { Authorization: "Bearer " + token }
            }
        );

        const bookings = await response.json();
        let output = "";
        bookedEventIds = [];

        bookings.forEach(booking => {
            bookedEventIds.push(booking.eventId);

            output += `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.eventTitle}</td>
                <td>${booking.bookingTime}</td>
                <td>
                    <button class="btn btn-danger btn-sm"
                        onclick="cancelBooking(${booking.id})">
                        Cancel
                    </button>
                </td>
            </tr>`;
        });

        const tableBody = document.getElementById("bookingTableBody");
        if (tableBody) tableBody.innerHTML = output;

        const myBookingsEl = document.getElementById("myBookings");
        if (myBookingsEl) myBookingsEl.innerText = bookings.length;

    } catch (error) {
        console.error("loadBookings error:", error);
    }
}

// =========================
// CANCEL BOOKING
// =========================
async function cancelBooking(id) {
    try {
        const response = await fetch(`/api/bookings/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            alert("Booking Cancelled");
            initializeDashboard();
        }

    } catch (error) {
        console.error("cancelBooking error:", error);
    }
}

// =========================
// LOGOUT
// =========================
function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}

// =========================
// INIT
// =========================
async function initializeDashboard() {
    await loadBookings();
    await loadEvents();
}

initializeDashboard();