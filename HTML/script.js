const userList = ["admin", "vineetks", "srijan", "trial"];
const userPassword = ["admin", "vineetks", "123", "111"];
const loginForm = document.getElementById("loginForm");
 
function redirectToProfile() {
  window.location.href = "profile.html";
}
 
function redirectToLogin() {
  window.location.href = "index.html";
}
 
function checkLoginStatus() {
  const currentUser = localStorage.getItem("currentUser");
  if (currentUser) {
    redirectToProfile();
  }
}
 
loginForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const username = loginForm.username.value;
  const password = loginForm.password.value;
  const userIndex = userList.indexOf(username);
 
  if (userIndex > -1 && userPassword[userIndex] === password) {
    localStorage.setItem("currentUser", username); // Save the logged-in user
    redirectToProfile();
  } else {
    alert("Invalid username or password");
  }
});

checkLoginStatus();
