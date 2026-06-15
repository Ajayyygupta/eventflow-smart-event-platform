function getSelectedRole() {
    const selected = document.querySelector('input[name="loginRole"]:checked');
    return selected ? selected.value : "USER";
}

function redirectByRole(role) {
    if (role === "ADMIN") {
        window.location.href = "admin.html";
    } else if (role === "ORGANIZER") {
        window.location.href = "organizer.html";
    } else {
        window.location.href = "userdashboard.html";
    }
}

async function login() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const selectedRole = getSelectedRole();

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    try {
        const response = await fetch("/api/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        let data;
        const contentType = response.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();
            if (!response.ok) {
                alert(text || "Invalid credentials");
                return;
            }
            data = { token: text, role: selectedRole, email };
        }

        if (!response.ok) {
            alert(data.message || "Invalid credentials");
            return;
        }

        if (!data.token) {
            alert("Login failed: server did not return a token");
            return;
        }

        const accountRole = (data.role || selectedRole).toUpperCase();

        if (accountRole !== selectedRole) {
            const roleNames = {
                ADMIN: "Admin",
                ORGANIZER: "Organizer",
                USER: "User"
            };
            alert(
                `This account is registered as ${roleNames[accountRole] || accountRole}. ` +
                `Please select "${roleNames[accountRole] || accountRole}" and try again.`
            );
            return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("userEmail", data.email || email);
        localStorage.setItem("role", accountRole);

        alert("Login successful");

        redirectByRole(accountRole);
    } catch (error) {
        console.error(error);
        alert("Login failed. Please try again.");
    }
}
