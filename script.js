// Benutzer (für Demo hart kodiert)
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

  if(!user){
    loginError.textContent = "Benutzername oder Passwort falsch!";
    return;
  }
  // Wartungsmodus Beispiel (hier aus, du kannst erweitern)
  const maintenanceMode = false;
  if(maintenanceMode && user.role === "player"){
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
function openApp(appName){
  if(!currentUser) return;
  // Owner und Admin können Admin App öffnen, nur Owner Owner App
  if(appName === "admin" && !["admin","owner"].includes(currentUser.role)) {
    alert("Nur Admins und Owner können die Admin App öffnen.");
    return;
  }
  if(appName === "owner" && currentUser.role !== "owner"){
    alert("Nur der Owner kann die Owner App öffnen.");
    return;
  }

  appWindow.classList.remove("hidden");
  switch(appName){
    case "peckman": peckmanApp(); break;
    case "freunde": freundeApp(); break;
    case "settings": settingsApp(); break;
    case "gamehub": gameHubApp(); break;
    case "admin": adminApp(); break;
    case "owner": ownerApp(); break;
    default:
      appContent.innerHTML = `<p>App ${appName} ist noch in Arbeit.</p>`;
  }
}

// App schließen
closeAppBtn.addEventListener("click", () => {
  appWindow.classList.add("hidden");
  appContent.innerHTML = "";
});

// ---- Peckman Spiel ----
function peckmanApp() {
  appContent.innerHTML = `
    <canvas id="peckman-canvas" width="400" height="400" style="background:black; display:block; margin: auto; border: 3px solid limegreen; border-radius: 10px;"></canvas>
    <p style="text-align:center; color:lime; font-weight:bold; font-size:1.2em;">Punkte: <span id="peckman-score">0</span></p>
    <p style="text-align:center; color:lime;">Steuerung: Pfeiltasten</p>
  `;

  const canvas = document.getElementById("peckman-canvas");
  const ctx = canvas.getContext("2d");

  const tileSize = 20;
  const rows = 17;
  const cols = 20;

  const level = [
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
    [1,2,1,1,2,1,2,1,0,0,0,1,2,1,2,1,1,1,2,1],
    [1,2,2,1,2,2,2,1,1,1,1,1,2,1,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,2,2,2,2,2,2,1,2,1,1,1,2,1],
    [1,2,2,2,2,1,2,1,1,1,1,1,2,2,2,2,2,2,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  let pacman = { x: 1, y: 1, dir: "right" };
  let score = 0;

  let ghosts = [
    { x: 18, y: 1, dir: "left" },
    { x: 18, y: 15, dir: "up" }
  ];

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for(let y=0; y<rows; y++) {
      for(let x=0; x<cols; x++) {
        const tile = level[y] && level[y][x];
        if(tile === 1) {
          ctx.fillStyle = "blue";
          ctx.fillRect(x*tileSize, y*tileSize, tileSize, tileSize);
        } else if(tile === 2) {
          ctx.fillStyle = "white";
          ctx.beginPath();
          ctx.arc(x*tileSize + tileSize/2, y*tileSize + tileSize/2, 4, 0, Math.PI*2);
          ctx.fill();
        }
      }
    }

    ctx.fillStyle = "yellow";
    ctx.beginPath();
    const px = pacman.x * tileSize + tileSize/2;
    const py = pacman.y * tileSize + tileSize/2;
    ctx.arc(px, py, tileSize/2 - 2, 0, Math.PI*2);
    ctx.fill();

    ghosts.forEach(g => {
      ctx.fillStyle = "red";
      ctx.beginPath();
      ctx.arc(g.x * tileSize + tileSize/2, g.y * tileSize + tileSize/2, tileSize/2 - 2, 0, Math.PI*2);
      ctx.fill();
    });

    document.getElementById("peckman-score").textContent = score;
  }

  function canMove(x,y) {
    return level[y] && level[y][x] !== 1;
  }

  function movePacman() {
    let nx = pacman.x;
    let ny = pacman.y;

    switch(pacman.dir) {
      case "up": ny--; break;
      case "down": ny++; break;
      case "left": nx--; break;
      case "right": nx++; break;
    }

    if(canMove(nx, ny)) {
      pacman.x = nx;
      pacman.y = ny;

      if(level[ny][nx] === 2) {
        level[ny][nx] = 0;
        score++;
      }
    }
  }

  function moveGhosts() {
    ghosts.forEach(g => {
      const dirs = ["up", "down", "left", "right"];
      let tries = 0;
      let moved = false;
      while(!moved && tries < 10) {
        const dir = dirs[Math.floor(Math.random()*dirs.length)];
        let nx = g.x;
        let ny = g.y;
        switch(dir) {
          case "up": ny--; break;
          case "down": ny++; break;
          case "left": nx--; break;
          case "right": nx++; break;
        }
        if(canMove(nx, ny)) {
          g.x = nx; g.y = ny; g.dir = dir;
          moved = true;
        }
        tries++;
      }
    });
  }

  function checkCollision() {
    for(let g of ghosts) {
      if(g.x === pacman.x && g.y === pacman.y) {
        alert("Game Over! Du wurdest vom Geist erwischt!");
        resetGame();
      }
    }
  }

  function resetGame() {
    pacman = { x: 1, y: 1, dir: "right" };
    score = 0;
    const originalLevel = [
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
      [1,1,2,1,2,1,1,1,0,1,0,1,2,1,1,1,2
