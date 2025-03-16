import emailjs from '@emailjs/browser';  // Importing the EmailJS SDK

document.addEventListener("DOMContentLoaded", function() {
    emailjs.init("WxggkAx_avkYXx1Ev");  // Your correct public key from EmailJS

    document.getElementById("bug-report-form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent default form submission
        const bugDescription = document.getElementById("bug-description").value;
        const submitButton = document.getElementById("submit-button");

        // Check if the description is empty
        if (!bugDescription.trim()) {
            alert("Por favor, ingresa una descripción del bug.");
            return;
        }

        // Disable the submit button to prevent multiple clicks
        submitButton.disabled = true;
        submitButton.textContent = "Enviando..."; // Update button text while sending

        // Debug log for description
        console.log("Description:", bugDescription);

        // Sending the email with the bug description
        emailjs.send("aras_erdag", "template_jx6b5vo", {
            description: bugDescription,
            from_name: "Bug Reporter",  // Optional: You can add the name of the user reporting
            reply_to: "aras.erdag@gmail.com"  // Optional: Add a reply-to email for responses
        }).then(function(response) {
            console.log("SUCCESS!", response.status, response.text);
            // Display thank you message after successful submission
            document.querySelector(".menu").innerHTML = `
                <h2>¡Gracias por reportar!</h2>
                <p>¡Tu reporte será revisado lo antes posible!</p>
                <a href="index.html" class="button">Volver al Inicio</a>
            `;
        }, function(error) {
            console.error("FAILED...", error);
            alert("Error al reportar el bug. Por favor, inténtalo de nuevo.");
            
            // Re-enable the submit button and reset the button text
            submitButton.disabled = false;
            submitButton.textContent = "Enviar";
        });
    });
});
