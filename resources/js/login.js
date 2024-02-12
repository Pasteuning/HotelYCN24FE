function handleSubmit(event) {
    // Prevent the form from submitting normally
    event.preventDefault();
    
    // Get the email and password values
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('pw-input').value;
    var correctPassword = "secret";
    
    // Check if the password is correct
    if (password === correctPassword) {
        // Redirect to another page if the password is correct
        window.location.href = "manager.html";
    } else {
        // Alert the user if the password is incorrect
        alert("Incorrect password, please try again.");
    }
    // Display the input values
    console.log(email)
}