// =========================
// TOKEN + EMAIL
// =========================

const token = localStorage.getItem("token");

const email = localStorage.getItem("userEmail");

// =========================
// CHECK LOGIN
// =========================

if (!token || !email) {

    alert("Please Login First");

    window.location.href = "login.html";
}

// =========================
// GLOBAL EVENTS ARRAY
// =========================

let allEvents = [];

// =========================
// COMMON FETCH FUNCTION
// =========================

async function apiFetch(url, options = {}) {

    const response = await fetch(url, {

        ...options,

        headers: {

            "Content-Type": "application/json",

            Authorization: "Bearer " + token,

            ...(options.headers || {})
        }
    });

    // HANDLE 401 / 403

    if (response.status === 401 || response.status === 403) {

        alert("Unauthorized! Please login again.");

        localStorage.clear();

        window.location.href = "login.html";

        return null;
    }

    return response;
}

// =========================
// LOAD STATS
// =========================

async function loadStats() {

    try {

        // TOTAL EVENTS

        const eventRes = await apiFetch(

            `http://localhost:8080/api/organizer/event-count/${email}`
        );

        if (!eventRes) return;

        const eventCount = await eventRes.json();

        document.getElementById(
            "totalEvents"
        ).innerText = eventCount;

        // ORGANIZER BOOKINGS

     const bookingRes = await apiFetch(

    `http://localhost:8080/api/organizer/bookings/${email}`
);
        if (!bookingRes) return;

        const bookings = await bookingRes.json();

        document.getElementById(
            "totalBookings"
        ).innerText = bookings.length;

        document.getElementById(
            "totalRegistrations"
        ).innerText = bookings.length;

    } catch (error) {

        console.log("Load Stats Error:", error);
    }
}

// =========================
// CREATE EVENT
// =========================

async function createNewEvent() {

    try {

        const event = {

            title:
                document.getElementById("title").value,

            location:
                document.getElementById("location").value,

            date:
                document.getElementById("date").value,

            capacity:
                document.getElementById("capacity").value,

            description:
                document.getElementById("description").value,

            organizerEmail: email
        };

        const response = await apiFetch(

            "http://localhost:8080/api/organizer/events",

            {
                method: "POST",

                body: JSON.stringify(event)
            }
        );

        if (!response) return;

        if (response.ok) {

            alert("Event Created 🔥");

            document.activeElement.blur();

            // CLOSE MODAL

            const modal = bootstrap.Modal.getInstance(

                document.getElementById("eventModal")
            );

            if (modal) {

                modal.hide();
            }

            // CLEAR FORM

            document.getElementById("title").value = "";

            document.getElementById("location").value = "";

            document.getElementById("date").value = "";

            document.getElementById("capacity").value = "";

            document.getElementById("description").value = "";

            // RELOAD

            await loadEvents();

            await loadStats();

        } else {

            const errorText = await response.text();

            console.log(errorText);

            alert("Failed To Create Event");
        }

    } catch (error) {

        console.log("Create Event Error:", error);
    }
}

// =========================
// LOAD EVENTS
// =========================

async function loadEvents() {

    try {

        const response = await apiFetch(

            `http://localhost:8080/api/organizer/events/${email}`
        );

        if (!response) return;

        if (!response.ok) {

            console.log("Load Events Failed");

            return;
        }

        const events = await response.json();

        allEvents = events;

        renderEvents(events);

    } catch (error) {

        console.log("Load Events Error:", error);
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

            <td colspan="6" class="text-center">

                No Events Found

            </td>

        </tr>
        `;
    }

    events.forEach(event => {

        output += `

        <tr>

            <td>${event.id}</td>

            <td>${event.title}</td>

            <td>${event.location}</td>

            <td>${event.date}</td>

            <td>${event.capacity}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"

                    onclick="openUpdateModal(

                        ${event.id},

                        '${event.title}',

                        '${event.location}',

                        '${event.date}',

                        '${event.capacity}',

                        \`${event.description}\`
                    )">

                    Edit

                </button>

                <button
                    class="btn btn-danger btn-sm"

                    onclick="deleteEvent(${event.id})">

                    Delete

                </button>

            </td>

        </tr>
        `;
    });

    document.getElementById(
        "eventTableBody"
    ).innerHTML = output;
}

// =========================
// SEARCH EVENT
// =========================

function searchEvent(query) {

    query = query.toLowerCase();

    const filtered = allEvents.filter(event =>

        String(event.title)
            .toLowerCase()
            .includes(query)

        ||

        String(event.location)
            .toLowerCase()
            .includes(query)
    );

    renderEvents(filtered);
}

// =========================
// DELETE EVENT
// =========================

async function deleteEvent(id) {

    if (!confirm("Delete Event?"))
        return;

    try {

        const response = await apiFetch(

            `http://localhost:8080/api/organizer/events/${id}`,

            {
                method: "DELETE"
            }
        );

        if (!response) return;

        if (response.ok) {

            alert("Event Deleted");

            loadEvents();

            loadStats();
        }

    } catch (error) {

        console.log("Delete Event Error:", error);
    }
}

// =========================
// OPEN UPDATE MODAL
// =========================

function openUpdateModal(

    id,
    title,
    location,
    date,
    capacity,
    description
) {

    document.getElementById(
        "updateId"
    ).value = id;

    document.getElementById(
        "updateTitle"
    ).value = title;

    document.getElementById(
        "updateLocation"
    ).value = location;

    document.getElementById(
        "updateDate"
    ).value = date;

    document.getElementById(
        "updateCapacity"
    ).value = capacity;

    document.getElementById(
        "updateDescription"
    ).value = description;

    new bootstrap.Modal(

        document.getElementById(
            "updateModal"
        )

    ).show();
}

// =========================
// UPDATE EVENT
// =========================
async function updateEvent() {

    const id = document.getElementById(
        "updateId"
    ).value;

    const event = {

        title:
            document.getElementById(
                "updateTitle"
            ).value,

        location:
            document.getElementById(
                "updateLocation"
            ).value,

        date:
            document.getElementById(
                "updateDate"
            ).value,

        capacity:
            document.getElementById(
                "updateCapacity"
            ).value,

        description:
            document.getElementById(
                "updateDescription"
            ).value,

        organizerEmail: email
    };

    try {

        const response = await apiFetch(

            `http://localhost:8080/api/organizer/events/${id}`,

            {
                method: "PUT",

                body: JSON.stringify(event)
            }
        );

        if (!response) return;

        if (response.ok) {

            alert("Event Updated 🔥");

            // CLOSE MODAL

            const modal = bootstrap.Modal.getInstance(

                document.getElementById("updateModal")
            );

            if (modal) {

                modal.hide();
            }

            loadEvents();

            loadStats();

        } else {

            const errorText = await response.text();

            console.log(errorText);

            alert("Update Failed");
        }

    } catch (error) {

        console.log("Update Event Error:", error);
    }
}

// async function editEvent(id){

//     const title = prompt("Enter new title");

//     const location = prompt("Enter new location");

//     const date = prompt("Enter new date");

//     const capacity = prompt("Enter capacity");

//     const description = prompt("Enter description");

//     // const createdBy = prompt("ADMIN / ORGANIZER")

//     await fetch(`/api/organizer/events/${id}`,{

//         method:"PUT",

//         headers:{

//             "Content-Type":"application/json",

//             Authorization:"Bearer " + token
//         },

//         body:JSON.stringify({

//             title,
//             location,
//             date,
//             capacity,
//             description
//         })
//     });

//     alert("Event Updated 🔥");

//     loadEvents();
// }


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

    try {

        const response = await apiFetch(

            `/api/organizer/bookings/${email}`
        );

        if (!response) return;

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

                    <button
                        class="btn btn-danger btn-sm"

                        onclick="deleteBooking(${booking.id})">

                        Delete

                    </button>

                </td>

            </tr>
            `;
        });

        document.getElementById(
            "bookingTableBody"
        ).innerHTML = output;

        document.getElementById(
            "registrationTableBody"
        ).innerHTML = output;

    } catch (error) {

        console.log("Load Bookings Error:", error);
    }
}

// =========================
// DELETE BOOKING
// =========================

async function deleteBooking(id) {

    if (!confirm("Delete Booking?"))
        return;

    try {

        const response = await apiFetch(

            `http://localhost:8080/api/organizer/bookings/${id}`,

            {
                method: "DELETE"
            }
        );

        if (!response) return;

        if (response.ok) {

            alert("Booking Deleted");

            loadBookings();

            loadStats();
        }

    } catch (error) {

        console.log("Delete Booking Error:", error);
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
// INITIAL LOAD
// =========================

loadStats();

loadEvents();

loadBookings();