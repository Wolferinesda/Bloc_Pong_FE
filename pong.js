var canvas = document.getElementById('pongCanvas');
var c = canvas.getContext('2d');

// canvas background
c.fillStyle = 'black';
c.fillRect(0, 0, canvas.width, canvas.height);

// paddles
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.score = 0;
  this.height = height;
  this.width = width;
  this.speed = 12;
};

Paddle.prototype.move = function(dy) {
  if(this.y + dy > 0 && this.y + this.height + dy < canvas.height) {
    this.y += dy ;
  }
};

Paddle.prototype.render = function() {
  c.fillStyle = 'white';
  c.fillRect(this.x, this.y, this.width, this.height);
};

// the ball
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.radius = 10;
  this.x_speed = -2;
  this.y_speed = -2;

  this.resetPostion = function() {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
  };

  this.resetSpeed = function() {
    this.x_speed = 2;
    this.y_speed = -2;
  }

  this.reset = function() {
    this.resetPostion();
    this.resetSpeed();
  };

  this.stop = function() {
    this.resetPostion();
    this.x_speed = 0;
    this.y_speed = 0;

    if (playerScore >= 11) {
      winner.textContent = "Congrats Player 1 you win! Sorry Player 2 better luck next time! Press restart to play again.";
    } else if (playerScore <= 11) {
      winner.textContent = "Sorry Player 1 you lose! Player 2 you win! Press restart to play again.";
    };

    winner.hidden = false;
    restartButton.hidden = false;

    restartButton.addEventListener("click", function(){
      restartButton.hidden = true;
      winner.hidden = true;
      ball.reset();
    });
  };
}

Ball.prototype.move = function() {
  this.x += this.x_speed;
  this.y += this.y_speed;

  if (this.y - 5 < 0) { //hitting top wall
    this.y_speed = -this.y_speed;

  } else if (this.y + 5 > canvas.height) { //hitting bottom wall
    this.y_speed = -this.y_speed;
  }

  function checkCollision(paddle, axis) {
    var widthheight = axis ==  "x" ? "width" : "height";
    var rectPos = paddle[axis] + paddle[widthheight] / 2;
    return Math.abs(ball[axis] - rectPos);
  };

  var playerX = checkCollision(player, "x");
  var playerY = checkCollision(player, "y");

  var computerX = checkCollision(computer, "x");
  var computerY = checkCollision(computer, "y");

  if (playerX < (player.width/2 + ball.radius) && playerY < (player.height/2 + ball.radius)) {
    this.x_speed = -this.x_speed;
  } else if (computerX < (computer.width / 2 + ball.radius) && computerY < (computer.height / 2 + ball.radius)) {
    this.x_speed = -this.x_speed;
  }
};

Ball.prototype.render = function() {
  c.beginPath();
  c.fillStyle = 'white';
  c.arc(this.x, this.y, this.radius, 0 , Math.PI * 2, false)
  c.fill();
  c.font='25px Times New Roman';
  c.fillText(playerScore, 20, 40);
  c.fillText(computerScore, 565, 40);
};

var player = new Paddle(50, 150, 10, 100);
var computer = new Paddle(550, 150, 10, 100);

var playerScore = player.score;
var computerScore = computer.score;

Ball.prototype.update = function(player, computer) {
  // resets the ball
  if (this.x < 0) {
    computerScore++;
    this.reset();
  }
  else if (this.x > canvas.width) {
    playerScore++;
    this.reset();
  }

  if (playerScore >= 11 || computerScore >= 11) {
    this.stop();
    playerScore = 0;
    computerScore = 0;
  }
};

var restartButton = document.getElementById('restart');
var winner = document.getElementById('winner');
var player = new Paddle(50, 150, 10, 100);
var computer = new Paddle(550, 150, 10, 100);
var ball = new Ball(canvas.width / 2, canvas.height / 2);

computer.update = function(ball) {
  var ball_y_position = ball.y;
  var diff = -((computer.y + (computer.height / 2)) - ball_y_position);

  if (diff < 0) {
      diff = -2;
  }
  else if (diff > 0) {
      diff = 2;
  }
  // sets the difficulty, eventually want to randomize
  computer.move(diff * 0.55);
};
// var computer = new Computer();

function addKeyEvent() {
  window.addEventListener('keydown', keyPress, true);
}

function keyPress(direction) {
  switch (direction.keyCode) {
    case 80:
      player.move(-player.speed);  // up
      break;
    case 79:
      player.move(player.speed); // down
      break;
  }
}

var animate = window.requestAnimationFrame || function(callback) { window.setTimeout(callback, 1000/60) };

var step = function() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  update();
  render();
  animate(step);
};

var render = function(){
  player.render();
  computer.render();
  ball.render();
  ball.move();
};

var update = function() {
  computer.update(ball);
  ball.update(player, computer);
};

window.onload = function(){
  addKeyEvent();
  step();
};
