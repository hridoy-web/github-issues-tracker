// 01. get the button element and store variable
const loginButton = document.getElementById("login-btn");

// 02. sign-in button clicked function
loginButton.addEventListener("click", () => {

    // 02-1 get the html element & user input value check
const userName = document.getElementById("input-username").value.trim();
const password = document.getElementById("input-password").value.trim();

// 02-2 condition check
if (userName === 'admin' && password === 'admin123'){
alert('Welcome Login Succesful')
window.location.href = 'dashboard.html'
} else {
    alert('Username And Password Wrong')
}
})