document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");
    const statusDiv = document.getElementById("formStatus");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        // Run Google reCAPTCHA v3
        grecaptcha.ready(function () {
            grecaptcha.execute("6Ld-5NorAAAAAKkeDgIceW6uSkeogbJ5ZzTohT48", { action: "submit" }).then(function (token) {
                document.getElementById("g-recaptcha-response").value = token;

                // Collect form data
                const formData = new FormData(form);

                // Send to backend
                fetch("/api/contact.php", {
                    method: "POST",
                    body: formData,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        if (data.success) {
                            statusDiv.textContent = "✅ Message sent successfully!";
                            statusDiv.className = "mt-6 text-green-400";
                            form.reset();
                        } else {
                            statusDiv.textContent = "❌ Failed to send message. Please try again.";
                            statusDiv.className = "mt-6 text-red-400";
                        }
                    })
                    .catch((err) => {
                        console.error(err);
                        statusDiv.textContent = "⚠️ Error sending message.";
                        statusDiv.className = "mt-6 text-red-400";
                    });
            });
        });
    });
});
