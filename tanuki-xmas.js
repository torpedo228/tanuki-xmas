var canvasWidth = vw(100);
var canvasHeight = vh(100);
var myBackground;
var myGamePiece;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;
var playWithMouse;
var playWithKeyBoard;
var playWithController;
var timeLeft = 3;
var gameStart;

// function enterHover(){
//   mySound = new sound("./audios/chuchu.mp3");
//   mySound.play();
// }

function choosePlayMode() {
  document.getElementById("entry").style.display = "none";
}

function backToHome() {
  document.getElementById("entry").style.display = "block";
  document.getElementById("chooseGameMode").style.display = "flex";
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("controller").style.display = "none";
}

function playWithMouse() {
  playWithMouse = true;
  // playWithKeyBoard = false;
  // playWithController = false;
  countDown();
  document.body.style.cursor = "none";
  console.log("playWithMouse:", playWithMouse, 'playWithKeyBoard:', playWithKeyBoard, 'playWithController', playWithController);

}

function playWithKeyBoard() {
  playWithKeyBoard = true;
  // playWithMouse = false;
  // playWithController = false;
  countDown();
  console.log("playWithMouse:", playWithMouse, 'playWithKeyBoard:', playWithKeyBoard, 'playWithController', playWithController);
}

function playWithController() {
  playWithController = true;
  // playWithMouse = false;
  // playWithKeyBoard = false;
  document.getElementById("controller").style.display = "block";
  countDown();
  console.log("playWithMouse:", playWithMouse, 'playWithKeyBoard:', playWithKeyBoard, 'playWithController', playWithController);

}

function backToChooseMode() {
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("controller").style.display = "none";
  document.getElementById("chooseGameMode").style.display = "flex";
}


function countDown() {
  startGame();
  document.getElementById("chooseGameMode").style.display = "none";
  document.getElementById("countdown").style.display = "flex";
  document.getElementById("countdown").innerHTML = timeLeft;
  var downloadTimer = setInterval(function () {
    timeLeft--;
    document.getElementById("countdown").innerHTML = timeLeft;
    if (timeLeft == 0) {
      document.getElementById("countdown").innerHTML = 'Start!'
    } else if (timeLeft < 0) {
      clearInterval(downloadTimer);
      document.getElementById("countdown").style.display = "none";
      timeLeft = 3;
      gameStart = true;
      console.log(gameStart);
    }
  }, 1000);


}

function startGame() {
  myBackground = new component(canvasWidth, canvasHeight, "./images/game/background.png", 0, 0, "background");
  myGamePiece = new component(120, 150, "./images/game/tanudeer.svg", 10, 120, "image");
  myScore = new component("30px", "Consolas", "black", canvasWidth - 250, 40, "text");
  // mySound = new sound("./audios/chuchu.mp3");
  myMusic = new sound("./audios/JingleBells.mp3");

  // document.body.addEventListener("click", function () {
  //   myMusic.loop = true;
  //   myMusic.play()
  // })
  myGameArea.start();
}


setInterval(function () {
  if (gameStart == true) {
    window.addEventListener('keydown', pause);
  }
}, 1000);


function pause(e) {
  gameStart = false;
  let key = e.key;
  console.log(key);
  if (key === "Escape") {
    myGameArea.stop();
    document.getElementById("pause_control").style.display = "flex";
    document.body.style.cursor = "default";
  }
}


function keepGoing() {
  gameStart = true
  myGameArea.start();
  document.getElementById("pause_control").style.display = "none";
  if (playWithMouse == true) {
    document.body.style.cursor = "none";
  }
}

function restartGame() {
  gameStart = true
  document.getElementById("myfilter").style.display = "none";
  if (playWithMouse == true) {
    document.body.style.cursor = "none";
  }
  myGameArea.stop();
  myGameArea.clear();
  myGamePiece = {};
  myObstacles = [];
  myScore = {};
  document.getElementsByTagName("canvas").innerHTML = "";
  countDown();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function () {
    this.canvas.width = canvasWidth;
    this.canvas.height = canvasHeight;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);

    // mouse playing
    if (playWithMouse == true) {
      window.addEventListener('mousemove', function (e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      })
    }

    // keyboard playing
    if (playWithKeyBoard == true) {
      window.addEventListener('keydown', function (e) {
        myGameArea.keys = (myGameArea.keys || []);
        myGameArea.keys[e.keyCode] = true;
        // let pressedKey = e.key;
        // myGameArea.keys.push(pressedKey)
      })
      window.addEventListener('keyup', function (e) {
        myGameArea.keys[e.keyCode] = false;
      })
    }
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop: function () {
    clearInterval(this.interval);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;

    if (type == "image" || type == "background") {
      this.image = new Image();
      this.image.src = color;
    }

    if (type == "image" || type == "background") {
      ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width, this.height
      );
      if (type == "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
      }
    } else if (type == "text") {
      ctx.font = this.width + " " + this.height;
      ctx.fillStyle = color;
      ctx.fillText(this.text, this.x, this.y);
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  this.newPos = function () {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.type == "background") {
      if (this.x == -(this.width)) {
        this.x = 0;
      }
    }
  }

  this.crashWith = function (otherObj) {
    var myLeft = this.x;
    var myRight = this.x + (this.width);
    var myTop = this.y;
    var myBottom = this.y + (this.height);
    var otherLeft = otherObj.x;
    var otherRight = otherObj.x + (otherObj.width);
    var otherTop = otherObj.y;
    var otherBottom = otherObj.y + (otherObj.height);
    var crash = true;
    if ((myBottom < otherTop) ||
      (myTop > otherBottom) ||
      (myRight < otherLeft) ||
      (myLeft > otherRight)) {
      crash = false;
    }
    return crash;
  }
}

function updateGameArea() {
  var x, y;

  for (i = 0; i < myObstacles.length; i++) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      // mySound.play();
      myGameArea.stop();
      gameStart = false;
      document.getElementById("myfilter").style.display = "flex";
      document.getElementById("countdown").style.display = "none";
      timeLeft = 3;
      document.getElementById("score").innerHTML = "得分:" + Math.floor(myGameArea.frameNo) + "顆狸猫粉";
      document.body.style.cursor = "default";
      return;
    }
  }

  myGameArea.clear();

  // background
  myBackground.speedX = -1;
  myBackground.newPos();
  myBackground.update();

  // frame
  setTimeout(function () {
    myGameArea.frameNo += 0.2;
    if (myGameArea.frameNo == 1 || everyInterval(200)) {
      x = myGameArea.canvas.width;
      minHeight = 20;
      maxHeight = 300;
      height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      minGap = 50;
      maxGap = 300;
      gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new component(50, height, "green", x, 0));
      myObstacles.push(new component(50, x - height - gap, "green", x, height + gap));
    }
  }, 4000);

  for (i = 0; i < myObstacles.length; i++) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }

  myScore.text = "狸貓粉: " + Math.floor(myGameArea.frameNo) + "顆";
  myScore.update();

  // mouse playing
  if (playWithMouse == true) {
    if (myGameArea.x && myGameArea.y) {
      myGamePiece.x = myGameArea.x;
      myGamePiece.y = myGameArea.y;
    }
  }

  // keyboard playing
  if (playWithKeyBoard == true) {
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
      myGamePiece.speedX = -10;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
      myGamePiece.speedX = 10
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
      myGamePiece.speedY = -10;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
      myGamePiece.speedY = 10;
    }
  }
  myGamePiece.newPos();
  myGamePiece.update();
}

function everyInterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}


function moveup() {
  myGamePiece.speedY -= 5;
}

function movedown() {
  myGamePiece.speedY += 5
}

function moveleft() {
  myGamePiece.speedX -= 5
}

function moveright() {
  myGamePiece.speedX += 5;
}

function clearmove() {
  myGamePiece.speedX = 0;
  myGamePiece.speedY = 0;
}

function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function () {
    this.sound.play();
  }
  this.stop = function () {
    this.sound.pause();
  }
}

function vh(percent) {
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return (percent * h) / 100;
}

function vw(percent) {
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  return (percent * w) / 100;
}