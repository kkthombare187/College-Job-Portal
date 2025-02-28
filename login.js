function validateForm() {
    var email = document.getElementById("email-input").value;
    var password = document.getElementById("password-input").value;

    if (email === "" || password === "") {
        alert("All fields are mandatory!");
        return false;
    }

    alert("Login successful!");
    window.location.href = "Home.html";
    return false;
}

document.getElementById("loginForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    document.getElementById("message").textContent = data.message;

    if (response.status === 200) {
        alert("Login successful!");
        window.location.href = "dashboard.html"; // Redirect after login
    }
});
localStorage.setItem("token", data.token);

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();
    
    // Authentication logic (backend se response check karna hoga)
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem("isLoggedIn", "true");
            alert("Login Successful!");
            window.location.href = "jobCategories.html"; // Redirect to job page
        } else {
            alert("Invalid credentials!");
        }
    })
    .catch(error => console.error("Error:", error));
});

