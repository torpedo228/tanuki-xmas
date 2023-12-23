var canvasWidth = vw(100);
var canvasHeight = vh(100);
var myBackground;
var myGamePiece;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;
var MousePlaying;
var keyBoardPlaying;
var ControllerPlaying;
var gameStart;
var counting;
var isCrashed;
var isPaused;
var timeLeft;

// function enterHover(){
//   mySound = new sound("./audios/chuchu.mp3");
//   mySound.play();
// }

function choosePlayMode() {
  document.getElementById("entry").style.display = "none";
  document.getElementById("ranking").style.display = "none";
  document.getElementById("chooseGameMode").style.display = "flex";
  document.getElementById("home").style.display = "flex";

}

function backToHome() {
  document.getElementById("entry").style.display = "block";
  document.getElementById("chooseGameMode").style.display = "none";
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("pause_control").style.display = "none";
  document.getElementById("controller").style.display = "none";
}

function goToRanking() {
  document.getElementById("entry").style.display = "none";
  document.getElementById("ranking").style.display = "flex";
  document.getElementById("home").style.display = "flex";
}

function record() {
  document.getElementById("recordPopUp").style.display = "flex";
}

function submit() {
  alert('登錄成功!')
  document.getElementById("recordPopUp").style.display = "none";
}

function playWithMouse() {
  MousePlaying = true;
  keyBoardPlaying = false;
  ControllerPlaying = false;
  countDown();
  document.body.style.cursor = "none";
}

function playWithKeyBoard() {
  keyBoardPlaying = true;
  MousePlaying = false;
  ControllerPlaying = false;
  countDown();
}

function playWithController() {
  ControllerPlaying = true;
  MousePlaying = false;
  keyBoardPlaying = false;
  document.getElementById("controller").style.display = "flex";
  countDown();
}

function backToChooseMode() {
  reset();
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("controller").style.display = "none";
  document.getElementById("pause_control").style.display = "none";
  document.getElementById("chooseGameMode").style.display = "flex";
  document.getElementById("home").style.display = "flex";
}


function countDown() {
  counting = true;
  gameStart = false;
  timeLeft = 3;
  startGame();
  document.getElementById("home").style.display = "none";
  document.getElementById("chooseGameMode").style.display = "none";
  document.getElementById("pause_control").style.display = "none";
  document.getElementById("countdown").style.display = "flex";
  document.getElementById("countdown").innerHTML = timeLeft;

  if (isCrashed == true) {
    clearInterval(downloadTimer);
  }

  var downloadTimer = setInterval(function () {
    timeLeft -= 1;
    document.getElementById("countdown").innerHTML = timeLeft;
    if (timeLeft === 0) {
      document.getElementById("countdown").innerHTML = 'Start!'
    } else if (timeLeft < 0) {
      clearInterval(downloadTimer);
      document.getElementById("countdown").style.display = "none";
      counting = false;
      gameStart = true;
    }
  }, 1000);
}

function startGame() {
  document.getElementById("controller").style.zIndex = 20;
  myBackground = new component(canvasWidth, canvasHeight, "./images/game/background.png", 0, 0, "background");
  myGamePiece = new component(120, 150, "./images/game/tanudeer.png", 10, 120, "image");
  myScore = new component("30px", "Kiwi Maru", "black", canvasWidth - 250, 60, "text");
  // mySound = new sound("./audios/chuchu.mp3");
  myMusic = new sound("./audios/JingleBells.mp3");

  // document.body.addEventListener("click", function () {
  //   myMusic.loop = true;
  //   myMusic.play()
  // })
  myGameArea.start();
}


setInterval(function () {
  window.addEventListener('keydown', pause);
}, 10);

function pause(e) {
  if (gameStart == true && counting == false) {
    let key = e.key;
    if (key === "Escape") {
      myGameArea.stop();
      document.getElementById("pause_control").style.display = "flex";
      document.getElementById("controller").style.zIndex = 0;
      document.body.style.cursor = "default";
      counting = false;
      gameStart = false;
      isPaused = true;
    }
  }

}


function keepGoing() {
  counting = false;
  gameStart = true;
  isCrashed = false;
  isPaused = false;
  myGameArea.start();
  document.getElementById("pause_control").style.display = "none";
  document.getElementById("controller").style.zIndex = 20;
  if (playWithMouse == true) {
    document.body.style.cursor = "none";
  }
}

function restartGame() {
  if (isPaused == true) {
    isCrashed = false;
  }
  reset();
  countDown();
  document.getElementById("myfilter").style.display = "none";
  document.getElementById("pause_control").style.display = "none";
  document.getElementById("controller").style.zIndex = 20;
  if (MousePlaying == true) {
    document.body.style.cursor = "none";
  }
}

function reset() {
  myGameArea.stop();
  myGameArea.clear();
  myGamePiece = {};
  myObstacles = [];
  myScore = {};
  document.getElementsByTagName("canvas").innerHTML = "";
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
    if (MousePlaying == true) {
      window.addEventListener('mousemove', function (e) {
        myGameArea.x = e.pageX;
        myGameArea.y = e.pageY;
      })
    }

    // keyboard playing
    if (keyBoardPlaying == true) {
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
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function () {
    ctx = myGameArea.context;
    if (type == "image") {
      this.width = this.image.naturalWidth;
      this.height = this.image.naturalHeight;
    }

    if (type == "image" || type == "background") {
      ctx.drawImage(
        this.image, this.x, this.y, this.width, this.height
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

  // crash 
  for (i = 0; i < myObstacles.length; i++) {
    if (myGamePiece.crashWith(myObstacles[i])) {
      // mySound.play();
      myGameArea.stop();
      counting = false;
      gameStart = false;
      isCrashed = true;
      document.getElementById("myfilter").style.display = "flex";
      document.getElementById("countdown").style.display = "none";
      document.getElementById("pause_control").style.display = "none";
      document.getElementById("score").innerHTML = "得分:" + Math.floor(myGameArea.frameNo) + "顆狸猫粉";
      document.body.style.cursor = "default";
      return;
    }
  }

  myGameArea.clear();

  // background

  if (myGameArea.frameNo < 500) {
    myBackground.speedX = -1;
  } else if (myGameArea.frameNo >= 500 && myGameArea.frameNo < 1000) {
    myBackground.speedX = -1.5;
  } else if (myGameArea.frameNo >= 1000) {
    myBackground.speedX = -2;
  }
  myBackground.newPos();
  myBackground.update();

  // frame
  setTimeout(function () {
    myGameArea.frameNo += 0.5;
    if (myGameArea.frameNo == 1 || everyInterval(250)) {
      x = myGameArea.canvas.width;
      y = myGameArea.canvas.height;
      let obstacle1 = `./images/obstacles/obstacle_${getRandom(1, 12)}.png`
      let obstacle2 = `./images/obstacles/obstacle_${getRandom(1, 12)}.png`
      myObstacles.push(new component(this.width, this.height, obstacle1, x, getRandom(0, y / 2 - 100), "image"));
      myObstacles.push(new component(this.width, this.height, obstacle2, x, getRandom(y / 2, y - 100), "image"));
    }
  }, 4000);

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
  };

  for (i = 0; i < myObstacles.length; i++) {
    if (myGameArea.frameNo < 500) {
      myObstacles[i].x += -1;
    } else if (myGameArea.frameNo >= 500 && myGameArea.frameNo < 1000) {
      myObstacles[i].x += -1.5;
    } else if (myGameArea.frameNo >= 1000) {
      myObstacles[i].x += -2;
    }
    myObstacles[i].update();
  }

  myGamePiece.newPos();
  myGamePiece.update();

  myScore.text = "狸猫粉: " + Math.floor(myGameArea.frameNo) + "顆";
  myScore.update();

  // mouse playing
  if (MousePlaying == true) {
    if (myGameArea.x && myGameArea.y) {
      myGamePiece.x = myGameArea.x;
      myGamePiece.y = myGameArea.y;
    }
  }

  // keyboard playing
  if (keyBoardPlaying == true) {
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