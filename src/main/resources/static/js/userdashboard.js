const token =
    localStorage.getItem("token");

const userEmail =
    localStorage.getItem("userEmail");

if(!token){

    alert("Please Login First");

    window.location.href =
        "login.html";
}

let allEvents = [];

let bookedEventIds = [];

const eventImages = [

"https://images.unsplash.com/photo-1492684223066-81342ee5ff30",

"https://images.unsplash.com/photo-1511578314322-379afb476865",

"https://images.unsplash.com/photo-1505373877841-8d25f7d46678",

"https://images.unsplash.com/photo-1523580494863-6f3031224c94"
];

// =========================
// LOAD EVENTS
// =========================

async function loadEvents(){

    try{

        const response = await fetch(

            "/api/events",

            {
                headers:{
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        const events =
            await response.json();

        allEvents = events;

        renderEvents(events);

        document.getElementById(
            "totalEvents"
        ).innerText =
            events.length;

        document.getElementById(
            "upcomingEvents"
        ).innerText =
            events.length;

    }catch(error){

        console.log(error);
    }
}

// =========================
// RENDER EVENTS
// =========================

function renderEvents(events){

    let output = "";

    events.forEach((event,index)=>{

        const alreadyBooked =
            bookedEventIds.includes(event.id);

        const soldOut =
            event.capacity <= 0;

        output += `

        <div class="col-lg-4">

        <div class="event-card">

        <img src="${
            eventImages[
                index % eventImages.length
            ]
        }"

        class="event-image">

        <div class="event-content">

        <h3 class="event-title">

        ${event.title}

        </h3>

        <p>

        ${event.description}

        </p>

        <p>

        📍 ${event.location}

        </p>

        <p>

        📅 ${event.date}

        </p>

        <p>

        🎟 Seats Left:
        ${event.capacity}

        </p>

        ${
            alreadyBooked

            ?

            `
            <button
                class="book-btn booked-btn"
                disabled>

                Already Booked

            </button>
            `

            :

            soldOut

            ?

            `
            <button
                class="book-btn soldout-btn"
                disabled>

                Sold Out

            </button>
            `

            :

            `
            <button
                class="book-btn"

                onclick="bookEvent(${event.id})">

                Book Event

            </button>
            `
        }

        </div>

        </div>

        </div>
        `;
    });

    document.getElementById(
        "eventContainer"
    ).innerHTML = output;
}

// =========================
// SEARCH EVENT
// =========================

function searchEvent(query){

    query = query.toLowerCase();

    const filtered =
        allEvents.filter(event =>

            event.title
                .toLowerCase()
                .includes(query)

            ||

            event.location
                .toLowerCase()
                .includes(query)
        );

    renderEvents(filtered);
}

// =========================
// BOOK EVENT
// =========================

async function bookEvent(eventId){

    try{

        const response = await fetch(

            `/api/bookings/${eventId}?userEmail=${userEmail}`,

            {
                method:"POST",

                headers:{
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        const result =
            await response.text();

        if(response.ok){

            alert("Event Booked 🔥");

            initializeDashboard();

        }else{

            alert(result);
        }

    }catch(error){

        console.log(error);
    }
}

// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings(){

    try{

        const response = await fetch(

            `/api/bookings?userEmail=${userEmail}`,

            {
                headers:{
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        const bookings =
            await response.json();

        let output = "";

        bookedEventIds = [];

        bookings.forEach(booking=>{

            bookedEventIds.push(
                booking.eventId
            );

            output += `

            <tr>

            <td>${booking.id}</td>

            <td>${booking.eventTitle}</td>

            <td>${booking.bookingTime}</td>

            <td>

            <button
                class="btn btn-danger btn-sm"

                onclick="cancelBooking(${booking.id})">

                Cancel

            </button>

            </td>

            </tr>
            `;
        });

        document.getElementById(
            "bookingTableBody"
        ).innerHTML = output;

        document.getElementById(
            "myBookings"
        ).innerText =
            bookings.length;

    }catch(error){

        console.log(error);
    }
}

// =========================
// CANCEL BOOKING
// =========================

async function cancelBooking(id){

    try{

        const response = await fetch(

            `/api/bookings/${id}`,

            {
                method:"DELETE",

                headers:{
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        if(response.ok){

            alert("Booking Cancelled");

            initializeDashboard();
        }

    }catch(error){

        console.log(error);
    }
}

// =========================
// LOGOUT
// =========================

function logout(){

    localStorage.clear();

    window.location.href =
        "login.html";
}

// =========================
// INIT
// =========================

async function initializeDashboard(){

    await loadBookings();

    await loadEvents();
}

initializeDashboard();