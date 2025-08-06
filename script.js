document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    document.getElementById("startscreen").classList.add("hidden");
    document.getElementById("login-screen").classList.remove("hidden");
  }, 3000);
});

let currentUser = null;

function login() {
  const uname = document.getElementById("username").value;
  const pwd = document.getElementById("password").value;

  fetch("users.json")
    .then(res => res.json())
    .then(users => {
      const user = users.find(u => u.username === uname && u.password === pwd);
      if (user) {
        currentUser = user;
        document.getElementById("login-screen").classList.add("hidden");
        document.getElementById("desktop").classList.remove("hidden");
        document.getElementById("welcome-name").textContent = user.username;
      } else {
        document.getElementById("login-error").textContent = "Falsche Zugangsdaten!";
      }
    });
}

function openApp(app) {
  const appContent = document.getElementById("app-content");
  const appWindow = document.getElementById("app-window");
  appWindow.classList.remove("hidden");

  if (app === "os") {
    appContent.innerHTML = "<h2>OS wird vorbereitet...</h2><p>Coming soon!</p>";
  } else if (app === "admin" && currentUser.role === "admin") {
    appContent.innerHTML = "<h2>Admin Panel</h2><p>Admin-Funktionen kommen bald!</p>";
  } else if (app === "owner" && currentUser.role === "owner") {
    appContent.innerHTML = "<h2>Owner Konsole</h2><textarea rows='10' cols='30' placeholder='Befehl eingeben...'></textarea><br/><button>Senden</button>";
  } else if (app === "ttt") {
    appContent.innerHTML = "<iframe src='games/tictactoe.html' width='100%' height='400px'></iframe>";
  } else if (app === "minecraft") {
    appContent.innerHTML = "<iframe src='games/fake-minecraft.html' width='100%' height='400px'></iframe>";
  } else if (app === "peckman") {
    appContent.innerHTML = "<iframe src='games/peckman.html' width='100%' height='400px'></iframe>";
  } else {
    appContent.innerHTML = "<h2>Kein Zugriff oder App nicht gefunden.</h2>";
  }
}

function closeApp() {
  document.getElementById("app-window").classList.add("hidden");
  document.getElementById("app-content").innerHTML = "";
}
