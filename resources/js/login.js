function login() {
    // Get the email and password values
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('pw-input').value;
    
    // Define the data you want to send
    const data = { email: email, password: password };
    
    // Make a POST request to your backend
    fetch("http://127.0.0.1:8080/login", {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json', // Specify the content type
        },
        body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    })
    .then(response => response.json())
    .then(account => {
        if (!account) {
            // Niet gevonden
        } else {
            localStorage.setItem('TOKEN', account.token);

            if (account.role == 'STAFF') {
                // Redirect to the URL returned by the server
                window.location.href = "manager.html";
            } else if (account.role == 'GUEST') {
                window.location.href = "user_account.html";
            } else if (account.role == 'OWNER') {
                window.location.href = "manager.html";
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
        alert("An error occurred while logging in.");
    });

    // Optionally, log the email to the console (though consider privacy/security implications)
}