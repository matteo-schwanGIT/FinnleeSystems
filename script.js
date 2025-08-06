// Benutzerliste (fest definiert)
const users = [
  { username: "OwnerMatteo", password: "finnlee123", role: "owner" },
  { username: "AdminBea", password: "2025!Admin", role: "admin" },
  { username: "Player1", password: "playerpass", role: "player" }
];

let currentUser = null;

const loginScreen = document.getElementById("login-screen");
const desktop = document.getElementById("desktop");
const appWindow = document.getElementById("app-window");
const appContent = document.getElementById("app-content");
const userDisplay = document.getElementById("user-display");
const loginBtn = document.getElementById("login-btn");
const loginError = document.getElementById("login-error");
const closeAppBtn = document.getElementById("close-app");

// Login Event
loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    loginError.textContent = "Benutzername oder Passwort falsch!";
    return;
  }

  // Wartungsmodus (optional)
  const maintenanceMode = false;
  if (maintenanceMode && user.role === "player") {
    loginError.textContent = "Wartungsmodus aktiv – nur Admin/Owner können rein.";
    return;
  }

  currentUser = user;
  userDisplay.textContent = currentUser.username;

  loginScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  loginError.textContent = "";
});

// Desktop App öffnen
function openApp(appName) {
  if (!currentUser) return;

  if (appName === "admin" && !["admin", "owner"].includes(currentUser.role)) {
    alert("Nur Admins und Owner können die Admin App öffnen.");
    return;
  }

  if (appName === "owner" && currentUser.role !== "owner") {
    alert("Nur der Owner kann die Owner App öffnen.");
    return;
  }

  appWindow.classList.remove("hidden");
  switch (appName) {
    case "peckman":
      peckmanApp();
      break;
    case "freunde":
      appContent.innerHTML = "<p>Freundes-App kommt bald.</p>";
      break;
    case "settings":
      appContent.innerHTML = "<p>Einstellungen kommen bald.</p>";
      break;
    case "gamehub":
      appContent.innerHTML = "<p>Game Hub kommt bald.</p>";
      break;
    case "admin":
      adminApp();
      break;
    case "owner":
      ownerApp();
      break;
    default:
      appContent.innerHTML = `<p>App "${appName}" ist noch in Arbeit.</p>`;
  }
}

// App schließen
closeAppBtn.addEventListener("click", () => {
  appWindow.classList.add("hidden");
  appContent.innerHTML = "";
});

// Admin App (nur Owner/Admin)
function adminApp() {
  appContent.innerHTML = `
    <h3>Admin App</h3>
    <p>Verwalte Benutzer, Spiele und mehr.</p>
    <ul>
      <li>Feature 1: Benutzer sperren (kommt bald)</li>
      <li>Feature 2: Wartungsmodus (kommt bald)</li>
    </ul>
  `;
}

// Owner App (nur Owner)
function ownerApp() {
  appContent.innerHTML = `
    <h3>Owner App</h3>
    <p>Spezialfunktionen für den Owner.</p>
    <ul>
      <li>Admins verwalten (kommt bald)</li>
      <li>Broadcast Nachrichten senden (kommt bald)</li>
    </ul>
  `;
}

// --------- Peckman Spiel ---------
function peckmanApp() {
  appContent.innerHTML = `
    <canvas id="peckman-canvas" width="400" height="400"></canvas>
    <p style="text-align:center; font-weight:bold;">Punkte: <span id="peckman-score">0</span></p>
    <p style="text-align:center;">Steuerung: Pfeiltasten</p>
  `;

  const canvas = document.getElementById("peckman-canvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 20;
  const rows = 17;
  const cols = 20;

  // Level Matrix (1=Wand, 2=Punkt, 0=leer)
  let level = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,1,1,2,1,2,2,2,2,2,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,1,0,1,1,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,0,0,0,1,2,1,2,1,1,1,2,1],
    [1,2,2,1,2,1,2,1,0,1,0,1,2,1,2,2,2,2,2,1],
    [1,1,2,1,2,1,2,1,0,1,0,1,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,0,0,0,2,2,2,2,1,1,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,2,1],
    [1,2,2,1,2,2,2,1,0,0,0,1,2,1,2,2,2,2,2,1],
    [1,1,2,1,2,1,1,1,0,1,0,1,2,1,1,1,2,1,1,1],
    [1,2,2,2,2,1,2,2,0,1,0,2,2,2,2,1,2,2,2,1],
    [1,2,1,1,2,1,2,1,0,0,0,1,2,1,2,1,1
