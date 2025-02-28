function validateForm() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm_password").value;

    if (name === "" || email === "" || password === "" || confirmPassword === "") {
        alert("All fields are mandatory!");
        return false;
    }

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return false;
    }

    if (password.length < 8) {
        alert("Password should be at least 8 characters.");
        return false;
    }

    // alert("Your registration was successful!");
    window.location.href = "Home.html";
    return false; // Prevent form submission for demo purposes
}


document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
    });


    const result = await response.json();
    alert(result.message);
});
document.getElementById("registerForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Prevent default form submission

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();
        alert(result.message);

        if (response.ok) {
            window.location.href = "Home.html"; // Redirect on success
        }
    } catch (error) {
        console.error("Error:", error);
        alert("Failed to register. Try again.");
    }
});



document.getElementById("registerForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;

    if (response.status === 201) {
        alert("Registration successful! You can now log in.");
        window.location.href = "login.html"; // Redirect to login page
    }
});
