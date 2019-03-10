let player = document.querySelector("#player");
let gameArea = document.getElementsByClassName("gameArea")[0];
let gameInProgress = false;
let holes;
let positionX;
let positionY;
let speedX;
let speedY;
let gameTime;

function Start() {
    document.getElementById("start").hidden = true;
    PrepareGameArea();
}

function Restart() {
    document.getElementById("restart").hidden = true;
    CleanGameArea();
    PrepareGameArea();
}

function Move() {
    SetPlayerPosition();
    CheckCollisions();

    if (gameInProgress == true) {
        window.requestAnimationFrame(Move)
    }
}

function SetPlayerPosition() {
    if (PlayerInsideHorizontalGameArea()) {
        positionX += speedX;
        player.style.left = positionX + 'px';
    }
    if (PlayerInsideVerticalGameArea()) {
        positionY += speedY;
        player.style.top = positionY + 'px';
    }
}

function PlayerInsideHorizontalGameArea() {
    return positionX + speedX < window.innerWidth - 50 && positionX + speedX > 0
}

function PlayerInsideVerticalGameArea() {
    return positionY + speedY < window.innerHeight - 50 && positionY + speedY > 0
}


function CheckCollisions() {
    for (i = 0; i < holes.length; i++) {
        if (IsInCollision(i)) {
            if (IsWinHole(i)) {
                ProcessWin();
            }
            else {
                ProcessDefeat();
            }
        }
    };
}

function IsInCollision(i) {
    return (true
        && positionY < Math.floor(holes[i].style.top.slice(0, -2)) + 25 && positionY > holes[i].style.top.slice(0, -2) - 25
        && positionX > holes[i].style.left.slice(0, -2) - 25 && positionX < Math.floor(holes[i].style.left.slice(0, -2)) + 25
        );
}

function IsWinHole(i) {
    return holes[i].classList.contains("winHole");
}

function ProcessWin() {
    let yourTime = Date.now() - gameTime;
    window.alert("You Won! Your time: " + yourTime);
    document.getElementById("restart").hidden = false;
}

function ProcessDefeat() {
    gameInProgress = false;
    window.alert("You Lost!");
    document.getElementById("restart").hidden = false;
}

function SpawnHoles() {
    for (i = 2; i < (window.innerWidth / 30); i++) {
        let hole = document.createElement('div');
        hole.classList.add("hole");
        hole.style.left = Math.random() * (window.innerWidth - 50) + 'px';
        hole.style.top = Math.random() * (window.innerHeight - 50) + 'px';
        holes.push(hole);
        gameArea.appendChild(hole);
    }
    PostProcessHoles();
    SetWinHole(1);
}

function PostProcessHoles() {
    for (i = 0; i < holes.length - 1; i++) {
        for (j = i + 1; j < holes.length; j++) {
            if (IsInHorizontalCollision(j)) {
                holes[j].style.left = holes[j].style.left.slice(0, -2) + 70 + 'px';
            }
            if (IsInVerticalCollision(j)) {
                holes[j].style.top = holes[j].style.top.slice(0, -2) + 70 + 'px';
            }
        }
    }
}

function IsInHorizontalCollision(j) {
    return (true
        && holes[j].style.left.slice(0, -2) > holes[i].style.left.slice(0, -2) - 10
        && holes[j].style.left.slice(0, -2) < holes[i].style.left.slice(0, -2) + 60)
        ;
}

function IsInVerticalCollision(j) {
    return (true
        && holes[j].style.top.slice(0, -2) > holes[i].style.top.slice(0, -2) - 10
        && holes[j].style.top.slice(0, -2) < holes[i].style.top.slice(0, -2) + 50)
        ;
}

function SetWinHole() {
    let winHole = Math.floor(Math.random() * holes.length);
    holes[winHole].classList.remove("hole");
    holes[winHole].classList.add("winHole")
}

function PrepareGameArea() {
    gameInProgress = true;
    gameTime = Date.now();
    holes = [];
    positionX = 20;
    positionY = 20;
    speedX = 0;
    speedY = 0;
    SpawnHoles();
    Move();
}

function CleanGameArea() {
    for (i = gameArea.childElementCount; i > 0; i--) {
        if (gameArea.childNodes[i].nodeName == "DIV") {
            if (gameArea.childNodes[i].id !== "player") {
                gameArea.removeChild(gameArea.childNodes[i])
            }
        }
    }
}

function GetInput(e) {
    console.log(e);
    speedX = e.gamma / 10
    speedY = e.beta / 10
}