const token = localStorage.getItem("token");
const role  = localStorage.getItem("role");

// ✅ Auth Guard
if (!token) {
    alert("Please Login First");
    window.location.href = "login.html";
}

// Global events array for search
let allEvents = [];


// =========================
// LOAD STATS
// =========================

async function loadStats() {
    try {
        const response = await fetch("/api/admin/stats", {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            }
        });

        const stats = await response.json();

        document.getElementById("totalUsers").innerText    = stats.totalUsers    || 0;
        document.getElementById("totalEvents").innerText   = stats.totalEvents   || 0;
        document.getElementById("totalBookings").innerText = stats.totalBookings || 0;

    } catch (error) {
        console.error("Stats error:", error);
    }
}


// =========================
// LOAD EVENTS
// =========================

async function loadEvents() {
    try {
        const response = await fetch("/api/admin/events", {
            headers: { Authorization: "Bearer " + token }
        });

        const events = await response.json();

        allEvents = events;
        renderEvents(allEvents);

    } catch (error) {
        console.error("Load events error:", error);
    }
}


// =========================
// RENDER EVENTS
// =========================

function renderEvents(events) {
    let output = "";

    if (events.length === 0) {
        output = `
        <tr>
            <td colspan="5" class="text-center">No Events Found</td>
        </tr>`;
    }

    events.forEach(event => {
        output += `
        <tr>
            <td>${event.id}</td>
            <td>${event.title}</td>
            <td>${event.location}</td>
            <td>${event.capacity}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2" onclick="editEvent(${event.id})">Edit</button>
                <button class="btn btn-danger btn-sm"       onclick="deleteEvent(${event.id})">Delete</button>
            </td>
        </tr>`;
    });

    document.getElementById("eventTableBody").innerHTML = output;
}


// =========================
// SEARCH EVENT
// =========================

function searchEvent(query) {
    query = query.toLowerCase();

    const filtered = allEvents.filter(event =>
        String(event.id).toLowerCase().includes(query)    ||
        String(event.title).toLowerCase().includes(query) ||
        String(event.location).toLowerCase().includes(query)
    );

    renderEvents(filtered);
}


// =========================
// ✅ CREATE EVENT — FIXED
// Both admin and organizer use this single clean function
// =========================

async function submitCreateEvent() {
    try {
        const title       = document.getElementById("title").value.trim();
        const location    = document.getElementById("location").value.trim();
        const date        = document.getElementById("date").value.trim();
        const capacity    = document.getElementById("capacity").value.trim();
        const description = document.getElementById("description").value.trim();

        // Basic validation
        if (!title || !location || !date || !capacity) {
            alert("Please fill in all required fields.");
            return;
        }

        const event = {
            title,
            location,
            date,
            capacity,
            description,
            createdBy: localStorage.getItem("userEmail")  // ✅ FIXED: was missing
        };

        const response = await fetch("/api/admin/events", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify(event)
        });

        if (response.ok) {
            alert("Event Created Successfully 🔥");

            // Close modal
            const modalEl = document.getElementById("eventModal");
            if (modalEl) {
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
            }

            // Clear form fields
            document.getElementById("title").value       = "";
            document.getElementById("location").value    = "";
            document.getElementById("date").value        = "";
            document.getElementById("capacity").value    = "";
            document.getElementById("description").value = "";

            // Reload
            loadEvents();
            loadStats();

        } else {
            let errMsg = "Failed To Create Event";
            try {
                const errData = await response.json();
                if (errData.message) errMsg = errData.message;
            } catch (e) {}
            alert(errMsg);
        }

    } catch (error) {
        console.error("Create event error:", error);
        alert("Server Error. Please try again.");
    }
}


// =========================
// EDIT EVENT
// =========================

async function editEvent(id) {
    const title       = prompt("Enter new title");
    const location    = prompt("Enter new location");
    const date        = prompt("Enter new date (YYYY-MM-DD)");
    const capacity    = prompt("Enter capacity");
    const description = prompt("Enter description");

    if (!title || !location || !date || !capacity) {
        alert("All fields are required to update.");
        return;
    }

    try {
        const response = await fetch(`/api/admin/events/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ title, location, date, capacity, description })
        });

        if (response.ok) {
            alert("Event Updated 🔥");
            loadEvents();
        } else {
            alert("Failed to update event.");
        }

    } catch (error) {
        console.error("Edit event error:", error);
        alert("Server Error");
    }
}


// =========================
// DELETE EVENT
// =========================

async function deleteEvent(id) {
    if (!confirm("Delete this event?")) return;

    try {
        const response = await fetch(`/api/admin/events/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            alert("Event Deleted Successfully");
            loadEvents();
            loadStats();
        } else {
            const data = await response.json().catch(() => ({}));
            alert(data.message || "Delete Failed");
        }

    } catch (error) {
        console.error("Delete event error:", error);
        alert("Server Error");
    }
}


// =========================
// LOAD USERS
// =========================

async function loadUsers() {
    try {
        const response = await fetch("/api/admin/users", {
            headers: { Authorization: "Bearer " + token }
        });

        const users = await response.json();
        let output = "";

        users.forEach(user => {
            output += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Delete</button>
                </td>
            </tr>`;
        });

        document.getElementById("userTableBody").innerHTML = output;

    } catch (error) {
        console.error("Load users error:", error);
    }
}


// =========================
// DELETE USER
// =========================

async function deleteUser(id) {
    if (!confirm("Delete this user?")) return;

    try {
        const response = await fetch(`/api/admin/users/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            alert("User Deleted Successfully");
            loadUsers();
            loadStats();
        } else {
            const data = await response.json().catch(() => ({}));
            alert(data.message || "Delete Failed");
        }

    } catch (error) {
        console.error("Delete user error:", error);
        alert("Server Error");
    }
}


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {
    try {
        const response = await fetch("/api/admin/bookings", {
            headers: { Authorization: "Bearer " + token }
        });

        const bookings = await response.json();
        let output = "";

        bookings.forEach(booking => {
            output += `
            <tr>
                <td>${booking.id}</td>
                <td>${booking.userEmail}</td>
                <td>${booking.eventTitle}</td>
                <td>${booking.bookingTime}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="deleteBooking(${booking.id})">Delete</button>
                </td>
            </tr>`;
        });

        document.getElementById("bookingTableBody").innerHTML = output;

    } catch (error) {
        console.error("Load bookings error:", error);
    }
}


// =========================
// DELETE BOOKING
// =========================

async function deleteBooking(id) {
    if (!confirm("Delete this booking?")) return;

    try {
        const response = await fetch(`/api/admin/bookings/${id}`, {
            method: "DELETE",
            headers: { Authorization: "Bearer " + token }
        });

        if (response.ok) {
            alert("Booking Deleted Successfully");
            loadBookings();
            loadStats();
        } else {
            const data = await response.json().catch(() => ({}));
            alert(data.message || "Delete Failed");
        }

    } catch (error) {
        console.error("Delete booking error:", error);
        alert("Server Error");
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
// SIDEBAR TOGGLE (Mobile)
// =========================

function toggleSidebar() {
    document.querySelector(".sidebar").classList.toggle("active");
    document.getElementById("overlay").classList.toggle("active");
}


// =========================
// SECTION SCROLL
// =========================

function scrollToSection(id) {
    const section = document.getElementById(id);
    if (section) {
        section.scrollIntoView({ behavior: "smooth" });
        // Close sidebar on mobile
        const sidebar = document.querySelector(".sidebar");
        const overlay = document.getElementById("overlay");
        if (sidebar) sidebar.classList.remove("active");
        if (overlay) overlay.classList.remove("active");
    }
}


// =========================
// ANALYTICS CHART
// =========================

const ctx = document.getElementById("bookingChart");

if (ctx) {
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Users", "Events", "Bookings"],
            datasets: [{
                label: "Analytics",
                data: [12, 19, 7],
                borderWidth: 1
            }]
        }
    });
}


// =========================
// INITIAL LOAD
// =========================

loadStats();
loadEvents();
loadUsers();
loadBookings();