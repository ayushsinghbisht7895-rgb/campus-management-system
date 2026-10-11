// ==========================
// Show / Hide Password
// ==========================

function showPassword() {
    const pass = document.getElementById("password");
    const eye = document.getElementById("eye");

    if (pass.type === "password") {
        pass.type = "text";
        eye.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        pass.type = "password";
        eye.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// ==========================
// Login Form
// ==========================

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");
    const email = document.querySelector('input[name="email"]');
    const password = document.querySelector('input[name="password"]');

    if (form) {

        form.addEventListener("submit", function (e) {

            e.preventDefault();

            if (email.value.trim() === "") {
                alert("Please enter your college email.");
                email.focus();
                return;
            }

            if (password.value.length < 8) {
                alert("Password must be at least 8 characters.");
                password.focus();
                return;
            }

            alert("Login Successful!");

            window.location.href = "main.html";

        });

    }

    if (email) {
        email.focus();
    }

});