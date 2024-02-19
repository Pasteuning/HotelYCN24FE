// On load
document.addEventListener('DOMContentLoaded', function () {
    setupEnterListener();
    setupCheckboxFunction();
});




// Login
function login() {
    // Get the email and password values
    let email = document.getElementById('email-input').value;
    let password = document.getElementById('pw-input').value;

    // Define the data you want to send
    const data = { email: email, password: password };

    // Make a POST request to your backend
    fetch(url + "/login", {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('TOKEN')
        },
        body: JSON.stringify(data), // Convert the JavaScript object to a JSON string
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return response.text(); // Get the response body as text
    })
    .then(body => {
        // Parse the JSON only if the response body is not empty
        const account = body ? JSON.parse(body) : null;

        if (account) {
            // Successful login
            // Token in localStorage zetten
            localStorage.setItem('TOKEN', account.token);
            console.log(account)

            // Naar html pagina sturen die correspondeert met de role 
            if (account.role == 'GUEST') {
                window.location.href = "user_account.html";
            } else if (account.role == 'STAFF') {
                window.location.href = "manager.html";
            } else if (account.role == 'OWNER') {
                window.location.href = "manager.html";
            }

        } else {
            // Incorrect username or password
            invalidLogin();
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Handle any errors that occurred during the fetch
        alert("An error occurred while logging in.");
    });
}




// Create account
function register() {
    let account =  {
        "password": document.getElementById("password").value,
        "user": {
            "firstName": document.getElementById("firstName").value,
            "lastName": document.getElementById("lastName").value,
            "dateOfBirth": document.getElementById("dateOfBirth").value,
            "street": document.getElementById("street").value,
            "houseNumber": document.getElementById("houseNumber").value,
            "zipCode": document.getElementById("zipCode").value,
            "city": document.getElementById("city").value,
            "country": document.getElementById("country").value,      
            "email": document.getElementById("email").value,     
            "phoneNumber": document.getElementById("phoneNumber").value
        }   
    }


    // check of alle velden ingevuld zijn
    if (!account.password) {
        const message = "Please enter a password.";
        invalidForm(message);
        return;
    }

    for (const key in account.user) {
        if (!account.user[key]) {
            const message = "Please fill in all fields.";
            invalidForm(message);
            return;
        }
    }
    

    // Checkt of er al een account is op het ingegeven email adres
    isEmailAvailable(account.user.email)
    .then(available => {
        if (!available) {
            alert("An account already exists on this email");
            return;
        } else {
            
            // account creëren en meteen inloggen als het is gelukt
            createAccount(account)
            .then(status => {
                if (status !== null) {
                    document.getElementById('email-input').value = account.user.email;
                    document.getElementById('pw-input').value = account.password;
                    login()
                } else {
                    alert("An error occured while creating account");
                }
            })  
        }
    }) 
}


async function isEmailAvailable(email) {
    const res = await fetch(url + "/is-email-available", {
        method: 'POST',
        body: email,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const response = await res.json();
    return response;
}


async function createAccount(account) {
    const res = await fetch(url + "/create-account", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(account),
    });
    const response = await res.json();
    return response;
}




// Visuals
function invalidLogin() {
    let errorMessage = document.getElementById('invalid-login');

    errorMessage.textContent = 'Incorrect username or password';

    // Set up the fade-out transition
    errorMessage.style.transition = 'opacity 1s';

    // Hide the error message after 1.5 seconds
    setTimeout(() => {
        errorMessage.style.opacity = '0'; // Set opacity to 0 for fade-out
        
        // Clear the text and reset the opacity when hiding
        setTimeout(() => {
            errorMessage.textContent = ' ';
            errorMessage.style.opacity = '1'; // Reset opacity for future use
        }, 500); // fade-out transition
    }, 1500); // delay before starting the fade-out transition
    document.getElementById("pw-input").value = "";
}


function invalidForm(message) {
    let errorMessage = document.getElementById('invalid-create');

    errorMessage.textContent = message;

    // Set up the fade-out transition
    errorMessage.style.transition = 'opacity 1s';

    // Hide the error message after 1.5 seconds
    setTimeout(() => {
        errorMessage.style.opacity = '0'; // Set opacity to 0 for fade-out
        
        // Clear the text and reset the opacity when hiding
        setTimeout(() => {
            errorMessage.textContent = ' ';
            errorMessage.style.opacity = '1'; // Reset opacity for future use
        }, 500); // fade-out transition
    }, 1500); // delay before starting the fade-out transition
}


function showCreateAccount() {
    // Hide the login container
    document.getElementById('login-box').style.display = 'none';
    // Show the personal info container
    document.getElementById('register-box').style.display = 'block';
}


function showLogin() {
    // Show the personal info container
    document.getElementById('login-box').style.display = 'flex';
    // Hide the login container     
    document.getElementById('register-box').style.display = 'none';
}




// Extra functies
function setupEnterListener() {
    // Get the login button element
    const loginBtn = document.querySelector('.login-btn');

    // Add an event listener to the email and password input fields
    document.getElementById('email-input').addEventListener('keyup', handleEnterKey);
    document.getElementById('pw-input').addEventListener('keyup', handleEnterKey);
}

function setupCheckboxFunction() {
    const termsCheckbox = document.getElementById('terms-checkbox');
    const registerBtn = document.getElementById('register-btn');

    termsCheckbox.addEventListener('change', function () {
        registerBtn.disabled = !termsCheckbox.checked;
    });
}

function handleEnterKey(event) {
    // Function to handle the Enter key press
    if (event.key === 'Enter') {
        // Call the login function when Enter is pressed
        login();
    }
}