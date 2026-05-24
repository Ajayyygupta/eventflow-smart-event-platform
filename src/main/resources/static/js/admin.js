

const token = localStorage.getItem("token");

// GLOBAL EVENTS ARRAY
let allEvents = [];

const role = localStorage.getItem("role");

if(!token){

    alert("Please Login First");

    window.location.href = "login.html";
}

//  =========================
// SEarch Event
// =========================
// GLOBAL EVENTS ARRAY
// =========================
// GLOBAL EVENTS ARRAY
// =========================


// =========================
// LOAD EVENTS
// =========================

async function loadEvents(){

    try{

        const response = await fetch(

            "/api/admin/events",

            {
                headers:{
                    Authorization:
                        "Bearer " + token
                }
            }
        );

        const events =
            await response.json();

        // SAVE GLOBALLY
        allEvents = events;

        renderEvents(allEvents);

    }catch(error){

        console.log(error);
    }
}
//         alert("Failed To Load Events");
//     }
// }
// =========================
// RENDER EVENTS
// =========================

function renderEvents(events){

    let output = "";

    if(events.length === 0){

        output = `

        <tr>

            <td colspan="5"
                class="text-center">

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

            <td>${event.capacity}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm me-2"

                    onclick="editEvent(${event.id})">

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

function searchEvent(query){

    query = query.toLowerCase();

    const filtered =
        allEvents.filter(event =>

            String(event.id)
                .toLowerCase()
                .includes(query)

            ||

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
// LOAD STATS
// =========================

async function loadStats(){

    try{

        const response = await fetch(

            "/api/admin/stats",

            {
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                }
            }
        );

        const stats = await response.json();

        document.getElementById("totalUsers").innerText =
            stats.totalUsers || 0;

        document.getElementById("totalEvents").innerText =
            stats.totalEvents || 0;

        document.getElementById("totalBookings").innerText =
            stats.totalBookings || 0;

    }catch(error){

        console.log(error);
    }
}



// =========================
// CREATE EVENT
// =========================

async function createEvent(){

    try{

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
                
        };

        const response = await fetch(

            "/api/admin/events",

            {
                method:"POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:
                        "Bearer " + token
                },

                body: JSON.stringify(event)
            }
        );

        if(response.ok){

            alert("Event Created Successfully 🔥");

            // CLOSE MODAL
            const modal =
                bootstrap.Modal.getInstance(
                    document.getElementById("eventModal")
                );

            modal.hide();

            // CLEAR FORM
            document.getElementById("title").value = "";

            document.getElementById("location").value = "";

            document.getElementById("date").value = "";

            document.getElementById("capacity").value = "";

            document.getElementById("description").value = "";

            document.getElementById("createdBy").value = "";

            // RELOAD EVENTS
            loadEvents();

            loadStats();

        }else{

            alert("Failed To Create Event");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}
// =========================
// LOAD EVENTS
// =========================

// async function loadEvents(){

//     try{

//         const response = await fetch(

//             "/api/admin/events",

//             {
//                 headers:{
//                     Authorization: "Bearer " + token
//                 }
//             }
//         );

//         const events = await response.json();

//         let output = "";

//         events.forEach(event => {

//             output += `

//             <tr>

//                 <td>${event.id}</td>

//                 <td>${event.title}</td>

//                 <td>${event.location}</td>

//                 <td>${event.capacity}</td>

//               <td>

//                   <button class="btn btn-warning btn-sm"
//                       onclick="editEvent(${event.id})">

//                         Edit

//                  </button>

//                  <button class="btn btn-danger btn-sm"
//                       onclick="deleteEvent(${event.id})">

//                         Delete

//                 </button>

//              </td>

//             </tr>
//             `;
//         });

//         document.getElementById(
//             "eventTableBody"
//         ).innerHTML = output;

//     }catch(error){

//         console.log(error);
//     }
// }

// =========================
// Edit Event Fucntion
// =========================

async function editEvent(id){

    const title = prompt("Enter new title");

    const location = prompt("Enter new location");

    const date = prompt("Enter new date");

    const capacity = prompt("Enter capacity");

    const description = prompt("Enter description");

    // const createdBy = prompt("ADMIN / ORGANIZER")

    await fetch(`/api/admin/events/${id}`,{

        method:"PUT",

        headers:{

            "Content-Type":"application/json",

            Authorization:"Bearer " + token
        },

        body:JSON.stringify({

            title,
            location,
            date,
            capacity,
            description
        })
    });

    alert("Event Updated 🔥");

    loadEvents();
}

// =========================
// DELETE EVENT
// =========================

async function deleteEvent(id){

    if(!confirm("Delete this event?")) return;

    try{

        const response = await fetch(

            `/api/admin/events/${id}`,

            {
                method:"DELETE",

                headers:{
                    Authorization:"Bearer " + token
                }
            }
        );

        const data = await response.json();

        if(response.ok){

            alert("Event Deleted Successfully");

            loadEvents();
            loadStats();

        }else{

            alert(data.message || "Delete Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}

// =========================
// LOAD USERS
// =========================

async function loadUsers(){

    try{

        const response = await fetch(

            "/api/admin/users",

            {
                headers:{
                    Authorization: "Bearer " + token
                }
            }
        );

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

                    <button
                        class="btn btn-danger btn-sm"
                        onclick="deleteUser(${user.id})">

                        Delete

                    </button>

                </td>

            </tr>
            `;
        });

        document.getElementById(
            "userTableBody"
        ).innerHTML = output;

    }catch(error){

        console.log(error);
    }
}

// =========================
// DELETE USER
// =========================

async function deleteUser(id){

    if(!confirm("Delete this user?")) return;

    try{

        const response = await fetch(

            `/api/admin/users/${id}`,

            {
                method:"DELETE",

                headers:{
                    Authorization:"Bearer " + token
                }
            }
        );

        const data = await response.json();

        if(response.ok){

            alert("User Deleted Successfully");

            loadUsers();
            loadStats();

        }else{

            alert(data.message || "Delete Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}

// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings(){

    try{

        const response = await fetch(

            "/api/admin/bookings",

            {
                headers:{
                    Authorization: "Bearer " + token
                }
            }
        );

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

    }catch(error){

        console.log(error);
    }
}

// =========================
// DELETE BOOKING
// =========================

async function deleteBooking(id){

    if(!confirm("Delete this booking?")) return;

    try{

        const response = await fetch(

            `/api/admin/bookings/${id}`,

            {
                method:"DELETE",

                headers:{
                    Authorization:"Bearer " + token
                }
            }
        );

        const data = await response.json();

        if(response.ok){

            alert("Booking Deleted Successfully");

            loadBookings();
            loadStats();

        }else{

            alert(data.message || "Delete Failed");
        }

    }catch(error){

        console.log(error);

        alert("Server Error");
    }
}


// =========================
// LOGOUT
// =========================

function logout(){

    localStorage.clear();

    window.location.href = "login.html";
}


// =========================
// CREATE EVENT
// =========================
async function addEvent(){

    const event = {

        title: document.getElementById("title").value,

        location: document.getElementById("location").value,

        date: document.getElementById("date").value,

        capacity: document.getElementById("capacity").value,

        description: document.getElementById("description").value,

        createdBy: localStorage.getItem("userEmail")
    };

    await fetch("/api/admin/events",{

        method:"POST",

        headers:{

            "Content-Type":"application/json",

            Authorization:"Bearer " + token
        },

        body:JSON.stringify(event)
    });

    alert("Event Created 🔥");

    loadEvents(); // better than reload
}



// =========================
// ANALYTICS CHART
// =========================

const ctx =
    document.getElementById(
        "bookingChart"
    );

if(ctx){

    new Chart(ctx, {

        type:"bar",

        data:{

            labels:[
                "Users",
                "Events",
                "Bookings"
            ],

            datasets:[{

                label:"Analytics",

                data:[12,19,7],

                borderWidth:1
            }]
        }
    });
}


function scrollToSection(id) {
    const section = document.getElementById(id);

    if (section) {
        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
}
/////MEDIAAA QU

function toggleSidebar(){

    document.querySelector(".sidebar")
        .classList.toggle("active");

    document.getElementById("overlay")
        .classList.toggle("active");
}


/* SECTION NAVIGATION */

function scrollToSection(id) {

    const section =
        document.getElementById(id);

    if(section){

        section.scrollIntoView({
            behavior: "smooth"
        });

        /* MOBILE MENU CLOSE */

        document.querySelector(".sidebar")
            .classList.remove("active");

        document.getElementById("overlay")
            .classList.remove("active");
    }
}


// =========================
// INITIAL LOAD
// =========================

loadStats();

loadEvents();

loadUsers();

loadBookings();