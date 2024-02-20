document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("contact-form").addEventListener("submit", function(event) {
        event.preventDefault();
        // Show message
        alert("Your message is sent!");
        // Optionally, you can reset the form after showing the message
        this.reset();
    });
});