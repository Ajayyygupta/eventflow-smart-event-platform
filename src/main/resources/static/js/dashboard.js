
    // =========================
    // JWT TOKEN
    // =========================

    const token = localStorage.getItem("token");

    // comment:
    // token nahi toh login

    if(!token){

        alert("Please Login First");

        window.location.href = "login.html";
    }

    // =========================
    // USER EMAIL
    // =========================

    // const userEmail = prompt(
    //     "Enter your email"
    // );

    // save email
    // localStorage.setItem("userEmail",loginData.email);
    // get email from localStorage
     const userEmail =localStorage.getItem("userEmail");


    // =========================
    // BOOKED EVENT IDS
    // =========================

    // comment:
    // booked ids save hongi

    let bookedEventIds = [];

    // =========================
    // RANDOM EVENT IMAGES
    // =========================

    // comment:
    // random premium event images

    const eventImages = [

        "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1200&auto=format&fit=crop",

        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200&auto=format&fit=crop"
    ];

    // =========================
    // LOAD EVENTS
    // =========================

    async function loadEvents(){

        const response = await fetch(

            "http://localhost:8080/api/events",

            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const events = await response.json();

        let output = "";

        // comment:
        // index use for random images

        events.forEach((event, index) => {
             console.log(bookedEventIds);
              console.log(event.id);

            // comment:
            // already booked check

           const alreadyBooked =
    bookedEventIds.includes(Number(event.id));

            // comment:
            // seats finish

            const isSoldOut =
                event.capacity <= 0;

            output += `

            <div class="col-lg-4 col-md-6">

                <div class="event-card">

                    <!-- Event Image -->
                    <img src="${eventImages[index % eventImages.length]}"
                         class="event-image">

                    <div class="event-content">

                        <h3 class="event-title">
                            ${event.title}
                        </h3>

                        <p class="event-desc">
                            ${event.description}
                        </p>

                        <div class="event-info">
                            📍 ${event.location}
                        </div>

                        <div class="event-info">
                            📅 ${event.date}
                        </div>

                        <div class="event-info capacity">
                            🎟 Seats Left:
                            ${event.capacity}
                        </div>

                        ${
                            alreadyBooked

                            ?

                            `
                            <button
                                class="book-btn booked-btn"
                                disabled>

                                ✅ Already Booked

                            </button>
                            `

                            :

                            isSoldOut

                            ?

                            `
                            <button
                                class="book-btn soldout-btn"
                                disabled>

                                ❌ Sold Out

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
            "eventsContainer"
        ).innerHTML = output;
    }

    // =========================
    // BOOK EVENT
    // =========================

   async function bookEvent(eventId){

    const response = await fetch(

        `http://localhost:8080/api/bookings/${eventId}?userEmail=${userEmail}`,

        {
            method:"POST",

            headers:{
                "Authorization":
                    "Bearer " + token
            }
        }
    );

    const result = await response.text();

    if(response.ok){

        alert("Event Booked 🔥");

        bookedEventIds.push(Number(bookings.eventId));

        loadBookings();

    }else{

        alert(result);
    }
}

    // =========================
    // LOAD BOOKINGS
    // =========================

    async function loadBookings(){

        const response = await fetch(

            `http://localhost:8080/api/bookings?userEmail=${userEmail}`,

            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const bookings = await response.json();

        let output = "";

        // comment:
        // clear old ids

        bookedEventIds = [];

        //Agar koy nws booking nahi ki toh uske liyed

        if(bookings.length === 0){

        document.getElementById("bookingContainer").innerHTML = `

         <div class="booking-card text-center">

            <h4 style="color:#6c757d;">
                😔 No Bookings Yet
            </h4>

            <p style="margin-top:10px;">
                You haven’t booked any events yet.
            </p>

          </div>
           `;
 
            loadEvents();

             return;
        }
        // -------------------

        bookings.forEach(booking => {

            // comment:
            // store booked ids
          bookedEventIds.push(
          Number(booking.eventId) 
        );

            output += `

            <div class="booking-card">

                <h5>
                    ${booking.eventTitle}
                </h5>

                <p>
                    ⏰ Booking Time:
                    ${booking.bookingTime}
                </p>

            </div>
            `;
        });

        document.getElementById(
            "bookingContainer"
        ).innerHTML = output;

        // comment:
        // refresh events

        loadEvents();
    }

    // =========================
    // LOGOUT
    // =========================

    function logout(){

        localStorage.removeItem("token");

        window.location.href = "login.html";
    }

    // INITIAL LOAD

    loadBookings();

