async function login(){

    const email =
    document.getElementById("email")
    .value
    .trim();

    const password =
    document.getElementById("password")
    .value
    .trim();

    if(!email || !password){

        alert("Please Enter Email & Password");
        return;
    }

    try{

        const response = await fetch(

            "http://localhost:8080/api/auth/login",

            {
                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    email:email,
                    password:password
                })
            }
        );

        const data = await response.json();

        console.log(data);

        if(response.ok){

            /* SAVE LOGIN DATA */

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "organizerEmail",
                email
            );

            localStorage.setItem(
                "role",
                data.role
            );

            console.log(
                "Saved Email = ",
                localStorage.getItem(
                    "organizerEmail"
                )
            );

            /* REDIRECT */

            if(data.role === "ADMIN"){

                window.location.href =
                "admin.html";
            }

            else if(data.role === "ORGANIZER"){

                window.location.href =
                "organizer.html";
            }

            else{

                window.location.href =
                "dashboard.html";
            }

        }else{

            alert(
                data.message ||
                "Invalid Credentials"
            );
        }

    }catch(error){

        console.log(error);

        alert("Login Failed");
    }
}