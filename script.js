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

loginBtn.addEventListener("click", () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    loginError.textContent = "Benutzername oder Passwort falsch!";
    return;
  }

  currentUser = user;
  userDisplay.textContent = currentUser.username;

  loginScreen.classList.add("hidden");
  desktop.classList.remove("hidden");
  loginError.textContent = "";
});

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

closeAppBtn.addEventListener("click", () => {
  appWindow.classList.add("hidden");
  appContent.innerHTML = "";
});

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

// ------------------ Peckman -------------------
function peckmanApp() {
  appContent.innerHTML = `
    <canvas id="peckman-canvas" width="400" height="400"></canvas>
    <p style="text-align:center; font-weight:bold;">Punkte: <span id="peckman-score">0</span></p>
    <p style="text-align:center;">Steuerung: Pfeiltasten</p>
  `;

  const canvas = document.getElementById("peckman-canvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 20;
  const rows = 20;
  const cols = 20;

  let level = [
    // 1=Wand, 2=Punkt, 0=leer
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1],
    [1,2,1,0,0,1,2,1,0,0,0,0,0,1,2,1,0,1,2,1],
    [1,2,1,0,0,1,2,1,0,1,1,1,0,1,2,1,0,1,2,1],
    [1,2,1,0,0,0,2,1,0,1,0,1,0,1,2,1,0,1,2,1],
    [1,2,1,1,1,1,2,1,0,1,0,1,0,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,0,1,0,1,0,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,2,1,0,1,0,1,0,1,1,1,1,1,2,1],
    [1,2,2,2,2,1,2,1,0,0,0,0,0,1,2,2,2,2,2,1],
    [1,1,1,1,2,1,2,1,1,1,1,1,0,1,2,1,1,1,1,1],
    [1,2,2,1,2,1,2,2,2,2,2,1,0,1,2,1,2,2,2,1],
    [1,2,1,1,2,1,1,1,1,1,2,1,0,1,2,1,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,1,2,2,0,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,1,1,0,1,1,1,1,1,2,1],
    [1,2,2,2,2,2,2,1,2,2,2,2,0,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,2,1,1,1,1,1,0,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let pacman = {x:1, y:1, dir: 'right'};
  let score = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let y=0; y<rows; y++) {
      for(let x=0; x<cols; x++) {
        let tile = level[y][x];
        if(tile === 1) {
          ctx.fillStyle = 'blue';
          ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
        } else if(tile === 2) {
          ctx.fillStyle = 'white';
          ctx.beginPath();
          ctx.arc(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 4, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    // Pacman zeichnen
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(pacman.x*tileSize + tileSize/2, pacman.y*tileSize + tileSize/2, tileSize/2 - 2, 0, Math.PI*2);
    ctx.fill();
  }

  function canMove(x,y) {
    return level[y] && level[y][x] !== 1;
  }

  function movePacman() {
    let nx = pacman.x;
    let ny = pacman.y;

    switch(pacman.dir) {
      case 'up': ny--; break;
      case 'down': ny++; break;
      case 'left': nx--; break;
      case 'right': nx++; break;
    }

    if(canMove(nx, ny)) {
      pacman.x = nx;
      pacman.y = ny;

      if(level[ny][nx] === 2) {
        level[ny][nx] = 0;
        score++;
        document.getElementById('peckman-score').textContent = score;
      }
    }
  }

  window.onkeydown = e => {
    switch(e.key) {
      case 'ArrowUp': pacman.dir = 'up'; break;
      case 'ArrowDown': pacman.dir = 'down'; break;
      case 'ArrowLeft': pacman.dir = 'left'; break;
      case 'ArrowRight': pacman.dir = 'right'; break;
    }
  };

  function gameLoop() {
    movePacman();
    draw();
  }

  score = 0;
  document.getElementById('peckman-score').textContent = score;
  draw();

  clearInterval(window.peckmanInterval);
  window.peckmanInterval = setInterval(gameLoop, 200);
}
