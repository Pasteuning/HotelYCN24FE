function handleSubmit(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the email and password values
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('pw-input').value;
    
    // Define the data you want to send
    const data = { email: email, password: password };
    
    // Make a POST request to your backend
    fetch("http://127.0.0.1:8080/login", { // Replace 'YOUR_BACKEND_ENDPOINT' with your actual backend URL
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    })
    .then(response => response.json()) // Parse the JSON response
    .then(data => {
        // Here you can handle the response from your backend
        // For example, redirect if login is successful
        if (data === 'SUCCESS') { // Assume your backend sends { success: true } for correct credentials
            window.location.href = "manager.html";
        } else {
            // Alert the user if the password is incorrect or login failed
            alert("Incorrect password, please try again.");
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
        alert("An error occurred while logging in.");
    });

    // Optionally, log the email to the console (though consider privacy/security implications)
}