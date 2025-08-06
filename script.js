    // --- Daten & Globals ---
let users = [
  { username: "OwnerMatteo", password: "finnlee123", role: "owner", banned: false },
  { username: "AdminBea", password: "2025!Admin", role: "admin", banned: false },
  { username: "PlayerMax", password: "maxpass", role: "player", banned: false },
];

let maintenanceMode = false;
let currentUser = null;
let friends = {};
let friendInvites = {};
let bannedUsers = new Set();

// --- Utils ---
function saveUsers() {
  localStorage.setItem("finnleeUsers", JSON.stringify(users));
}
function loadUsers() {
  const stored = localStorage.getItem("finnleeUsers");
  if (stored) users = JSON.parse(stored);
}
function saveBanned() {
  localStorage.setItem("finnleeBanned", JSON.stringify(Array.from(bannedUsers)));
}
function loadBanned() {
  const stored = localStorage.getItem("finnleeBanned");
  if (stored) bannedUsers = new Set(JSON.parse(stored));
}
function isBanned(username) {
  return bannedUsers.has(username);
}
function saveFriends() {
  localStorage.setItem("finnleeFriends", JSON.stringify(friends));
}
function loadFriends() {
  const stored = localStorage.getItem("finnleeFriends");
  if (stored) friends = JSON.parse(stored);
}
function saveFriendInvites() {
  localStorage.setItem("finnleeFriendInvites", JSON.stringify(friendInvites));
}
function loadFriendInvites() {
  const stored = localStorage.getItem("finnleeFriendInvites");
  if (stored) friendInvites = JSON.parse(stored);
}

// --- Init ---
loadUsers();
loadBanned();
loadFriends();
loadFriendInvites();

// --- Login ---
const loginScreen = document.getElementById("login-screen");
const desktop = document.getElementById("desktop");
const appContainer = document.getElementById("app-container");
const loginBtn = document.getElementById("login-btn");
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginError = document.getElementById("login-error");
const maintenanceMsg = document.getElementById("maintenance-msg");
const forgotPassword = document.getElementById("forgot-password");
const welcomeText = document.getElementById("welcome-text");
const appIcons = document.getElementById("app-icons");

loginBtn.addEventListener("click", () => {
  const uname = usernameInput.value.trim();
  const pwd = passwordInput.value.trim();
  if (!uname || !pwd) {
    loginError.style.display = "block";
    loginError.textContent = "Bitte Benutzername und Passwort eingeben.";
    return;
  }
  const user = users.find(u => u.username === uname);
  if (!user || user.password !== pwd) {
    loginError.style.display = "block";
    loginError.textContent = "Benutzername oder Passwort falsch.";
    return;
  }
  if (isBanned(uname)) {
    loginError.style.display = "block";
    loginError.textContent = "Du bist gebannt.";
    return;
  }
  if (maintenanceMode && !["admin","owner"].includes(user.role)) {
    maintenanceMsg.style.display = "block";
    return;
  }
  currentUser = user;
  loginScreen.style.display = "none";
  desktop.style.display = "flex";
  welcomeText.textContent = `Hallo, ${currentUser.username}!`;
  loginError.style.display = "none";
  maintenanceMsg.style.display = "none";

  // Zeige Admin oder Owner Apps wenn Rolle passt
  document.querySelector("[data-app='adminapp']").style.display = currentUser.role === "admin" || currentUser.role === "owner" ? "flex" : "none";
  document.querySelector("[data-app='ownerapp']").style.display = currentUser.role === "owner" ? "flex" : "none";

  // Init Friends List etc.
  refreshFriendsList();
  refreshFriendInvites();
  refreshBannedList();
});

// Passwort vergessen
forgotPassword.addEventListener("click", () => {
  alert("Eine Nachricht wurde an Admin und Owner gesendet, dass du dein Passwort vergessen hast.");
  // In echtem System würde hier Nachricht an Admin/Owner verschickt werden
});

// --- Desktop & Apps ---
appIcons.addEventListener("click", e => {
  const appIcon = e.target.closest(".app-icon");
  if (!appIcon) return;
  const app = appIcon.getAttribute("data-app");
  openApp(app);
});

const closeAppBtn = document.getElementById("close-app");
closeAppBtn.addEventListener("click", () => {
  appContainer.style.display = "none";
  hideAllApps();
  desktop.style.display = "flex";
});

function openApp(appName) {
  desktop.style.display = "none";
  appContainer.style.display = "block";
  hideAllApps();
  if (appName === "friends") {
    document.getElementById("friends-app").style.display = "block";
  } else if (appName === "settings") {
    document.getElementById("settings-app").style.display = "block";
    document.getElementById("settings-username").value = currentUser.username;
    document.getElementById("settings-password").value = currentUser.password;
    document.getElementById("settings-bgcolor").value = "#000000"; // default black, kann man erweitern
  } else if (appName === "gamehub") {
    document.getElementById("gamehub-app").style.display = "block";
  } else if (appName === "adminapp") {
    document.getElementById("adminapp").style.display = "block";
  } else if (appName === "ownerapp") {
    document.getElementById("ownerapp").style.display = "block";
  }
}

function hideAllApps() {
  document.querySelectorAll(".app").forEach(app => (app.style.display = "none"));
  hideAllGames();
}

// --- Freunde App ---
const addFriendBtn = document.getElementById("add-friend-btn");
const friendUsernameInput = document.getElementById("friend-username");
const friendListEl = document.getElementById("friend-list");
const friendInvitesEl = document.getElementById("friend-invites");

addFriendBtn.addEventListener("click", () => {
  const friendName = friendUsernameInput.value.trim();
  if (!friendName) return alert("Bitte gib einen Benutzernamen ein.");
  if (friendName === currentUser.username) return alert("Du kannst dich nicht selbst als Freund hinzufügen.");
  const friendUser = users.find(u => u.username === friendName);
  if (!friendUser) return alert("Benutzer nicht gefunden.");
  if (!friends[currentUser.username]) friends[currentUser.username] = [];
  if (friends[currentUser.username].includes(friendName)) return alert("Benutzer ist bereits dein Freund.");
  // Sende Einladung
  if (!friendInvites[friendName]) friendInvites[friendName] = [];
  friendInvites[friendName].push(currentUser.username);
  saveFriendInvites();
  alert("Freundschaftsanfrage gesendet.");
  refreshFriendInvites();
  friendUsernameInput.value = "";
});

function refreshFriendsList() {
  friendListEl.innerHTML = "";
  const userFriends = friends[currentUser.username] || [];
  userFriends.forEach(f => {
    const li = document.createElement("li");
    li.textContent = f;
    friendListEl.appendChild(li);
  });
}

function refreshFriendInvites() {
  friendInvitesEl.innerHTML = "";
  const invites = friendInvites[currentUser.username] || [];
  invites.forEach(inviter => {
    const li = document.createElement("li");
    li.textContent = `${inviter} möchte dein Freund sein.`;
    const acceptBtn = document.createElement("button");
    acceptBtn.textContent = "Annehmen";
    acceptBtn.onclick = () => {
      // Freundschaft hinzufügen
      if (!friends[currentUser.username]) friends[currentUser.username] = [];
      if (!friends[currentUser.username].includes(inviter)) friends[currentUser.username].push(inviter);
      if (!friends[inviter]) friends[inviter] = [];
      if (!friends[inviter].includes(currentUser.username)) friends[inviter].push(currentUser.username);
      // Einladung löschen
      friendInvites[currentUser.username] = friendInvites[currentUser.username].filter(name => name !== inviter);
      saveFriends();
      saveFriendInvites();
      refreshFriendsList();
      refreshFriendInvites();
    };
    li.appendChild(acceptBtn);
    friendInvitesEl.appendChild(li);
  });
}

// --- Einstellungen App ---
const saveSettingsBtn = document.getElementById("save-settings-btn");
saveSettingsBtn.addEventListener("click", () => {
  const newUsername = document.getElementById("settings-username").value.trim();
  const newPassword = document.getElementById("settings-password").value.trim();
  // Hintergrundfarbe ist optional, hier nur Beispiel
  if (!newUsername || !newPassword) {
    alert("Benutzername und Passwort dürfen nicht leer sein.");
    return;
  }
  // Prüfen, ob Benutzername schon existiert (außer aktuell)
  if (users.some(u => u.username === newUsername && u !== currentUser)) {
    alert("Benutzername existiert bereits.");
    return;
  }
  // Update user
  currentUser.username = newUsername;
  currentUser.password = newPassword;
  saveUsers();
  alert("Einstellungen gespeichert. Bitte neu einloggen.");
  location.reload();
});

// --- Game Hub ---
const gameHub = document.getElementById("gamehub-app");
gameHub.addEventListener("click", e => {
  const gameIcon = e.target.closest(".game-icon");
  if (!gameIcon) return;
  const game = gameIcon.getAttribute("data-game");
  openGame(game);
});

const gamesContainer = document.getElementById("games-container");

function openGame(gameName) {
  hideAllApps();
  gamesContainer.style.display = "block";
  desktop.style.display = "none";
  hideAllGames();
  if (gameName === "tictactoe") {
    document.getElementById("tictactoe-game").style.display = "block";
    initTicTacToe();
  } else if (gameName === "peckman") {
    document.getElementById("peckman-game").style.display = "block";
    initPeckman();
  } else if (gameName === "fakeminecraft") {
    document.getElementById("fakeminecraft-game").style.display = "block";
    initFakeMinecraft();
  } else if (gameName === "fakeclashroyale") {
    alert("Fake Clash Royale kommt bald!");
  } else if (gameName === "fakefortnite") {
    alert("Fake Fortnite kommt bald!");
  }
}

function hideAllGames() {
  document.querySelectorAll(".game").forEach(g => (g.style.display = "none"));
}

// --- Tic Tac Toe Spiel ---
const tictactoeBoard = document.getElementById("tictactoe-board");
const tictactoeStatus = document.getElementById("tictactoe-status");
const tictactoeReset = document.getElementById("tictactoe-reset");

let tttBoardState = ["", "", "", "", "", "", "", "", ""];
let tttCurrentPlayer = "X";
let tttGameActive = true;

function initTicTacToe() {
  tttBoardState = ["", "", "", "", "", "", "", "", ""];
  tttCurrentPlayer = "X";
  tttGameActive = true;
  tictactoeStatus.textContent = `Spieler ${tttCurrentPlayer} ist dran`;
  tictactoeBoard.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.addEventListener("click", () => ticTacToeCellClicked(i));
    tictactoeBoard.appendChild(cell);
  }
}

function ticTacToeCellClicked(index) {
  if (!tttGameActive || tttBoardState[index] !== "") return;
  tttBoardState[index] = tttCurrentPlayer;
  updateTicTacToeBoard();
  if (checkTicTacToeWin()) {
    tictactoeStatus.textContent = `Spieler ${tttCurrentPlayer} gewinnt!`;
    tttGameActive = false;
    return;
  }
  if (tttBoardState.every(cell => cell !== "")) {
    tictactoeStatus.textContent = "Unentschieden!";
    tttGameActive = false;
    return;
  }
  tttCurrentPlayer = tttCurrentPlayer === "X" ? "O" : "X";
  tictactoeStatus.textContent = `Spieler ${tttCurrentPlayer} ist dran`;
}

function updateTicTacToeBoard() {
  tictactoeBoard.childNodes.forEach((cell, idx) => {
    cell.textContent = tttBoardState[idx];
