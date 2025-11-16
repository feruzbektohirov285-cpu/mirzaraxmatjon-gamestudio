let canvas, ctx;

// Mushuk
let cat = { x: 30, y: 30, size: 25, speed: 2 };

// Kuchuk
let dog = { x: 440, y: 440, size: 28, speed: 0.5 };

// Sichqon
let mouse = { x: 200, y: 200, size: 18 };

let score = Number(localStorage.getItem("score")) || 0;

let gameRunning = false;

// Rasmlar yuklash
const catImg = new Image(); catImg.src = "images/cat.png";
const dogImg = new Image(); dogImg.src = "images/dog.png";
const mouseImg = new Image(); mouseImg.src = "images/mouse.png";

// Labirint devorlari
const walls = [
    { x: 0, y: 0, w: 500, h: 10 },
    { x: 0, y: 0, w: 10, h: 500 },
    { x: 490, y: 0, w: 10, h: 500 },
    { x: 0, y: 490, w: 500, h: 10 },

    { x: 100, y: 0, w: 10, h: 300 },
    { x: 200, y: 200, w: 250, h: 10 },

    { x: 300, y: 100, w: 10, h: 300 },
    { x: 50, y: 350, w: 200, h: 10 },

    { x: 150, y: 120, w: 180, h: 10 }
];

const playBtn = document.getElementById("playBtn");
const scoreBtn = document.getElementById("scoreBtn");
const restartBtn = document.getElementById("restartBtn");
const mobileControls = document.getElementById("mobileControls");

let moveDir = { x: 0, y: 0 };

// Mobil tugmalar
document.querySelectorAll("#mobileControls button").forEach(btn => {
    btn.onclick = () => {
        let d = btn.dataset.dir;
        if (d === "up") moveDir = { x: 0, y: -cat.speed };
        if (d === "down") moveDir = { x: 0, y: cat.speed };
        if (d === "left") moveDir = { x: -cat.speed, y: 0 };
        if (d === "right") moveDir = { x: cat.speed, y: 0 };
    };
});

// WASD
window.onkeydown = e => {
    if (e.key === "w") moveDir = { x: 0, y: -cat.speed };
    if (e.key === "s") moveDir = { x: 0, y: cat.speed };
    if (e.key === "a") moveDir = { x: -cat.speed, y: 0 };
    if (e.key === "d") moveDir = { x: cat.speed, y: 0 };
};

playBtn.onclick = startGame;
scoreBtn.onclick = showScores;
restartBtn.onclick = startGame;


// 🟦 URILISH TEKSHIRUV
function hitsWall(obj, nx, ny) {
    return walls.some(w =>
        nx < w.x + w.w &&
        nx + obj.size > w.x &&
        ny < w.y + w.h &&
        ny + obj.size > w.y
    );
}


function startGame() {
    document.getElementById("gameContainer").classList.remove("hidden");
    document.getElementById("scorePage").classList.add("hidden");

    if (window.innerWidth < 700) mobileControls.classList.remove("hidden");

    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    cat.x = 30; cat.y = 30;
    dog.x = 440; dog.y = 440;

    spawnMouse();
    gameRunning = true;
    restartBtn.classList.add("hidden");

    loop();
}


function loop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, 500, 500);

    drawWalls();

    // Mushuk urilmaydigan bo‘lsa harakat qiladi
    let nx = cat.x + moveDir.x;
    let ny = cat.y + moveDir.y;

    if (!hitsWall(cat, nx, cat.y)) cat.x = nx;
    if (!hitsWall(cat, cat.x, ny)) cat.y = ny;

    // Kuchuk mushukka qarab keladi
    if (dog.x < cat.x) dog.x += dog.speed;
    if (dog.x > cat.x) dog.x -= dog.speed;
    if (dog.y < cat.y) dog.y += dog.speed;
    if (dog.y > cat.y) dog.y -= dog.speed;

    ctx.drawImage(catImg, cat.x, cat.y, cat.size, cat.size);
    ctx.drawImage(dogImg, dog.x, dog.y, dog.size, dog.size);
    ctx.drawImage(mouseImg, mouse.x, mouse.y, mouse.size, mouse.size);

    // Sichqon yeyish
    if (checkCollision(cat, mouse)) {
        score += 3;
        localStorage.setItem("score", score);
        spawnMouse();
    }

    // Kuchuk ushlasa
    if (checkCollision(cat, dog)) {
        gameOver();
        return;
    }

    requestAnimationFrame(loop);
}


function drawWalls() {
    ctx.fillStyle = "#444";
    walls.forEach(w => {
        ctx.fillRect(w.x, w.y, w.w, w.h);
    });
}


function checkCollision(a, b) {
    return (
        a.x < b.x + b.size &&
        a.x + a.size > b.x &&
        a.y < b.y + b.size &&
        a.y + a.size > b.y
    );
}

function spawnMouse() {
    mouse.x = Math.random() * 450;
    mouse.y = Math.random() * 450;
}

function gameOver() {
    gameRunning = false;
    restartBtn.classList.remove("hidden");
}

function showScores() {
    document.getElementById("gameContainer").classList.add("hidden");
    document.getElementById("scorePage").classList.remove("hidden");

    let rank = "";
    if (score >= 1000) rank = "Boshliq";
    else if (score >= 500) rank = "Menejer";
    else if (score >= 200) rank = "Boshqaruvchi";
    else if (score >= 100) rank = "Boshlovchi";
    else rank = "Hali daraja yo'q";

    document.getElementById("scoreText").innerText = `Ballingiz: ${score}`;
    document.getElementById("rankText").innerText = `Darajangiz: ${rank}`;
}
