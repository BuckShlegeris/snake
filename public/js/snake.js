(function(root) {
  var SnakeGame = root.SnakeGame = root.SnakeGame || {};

  var Snake = SnakeGame.Snake = function () {
    this.dir = "N";
    this.segments = [new Coord([5,5])];
    this.growing = 0;
  };

  Snake.prototype.move = function () {
    var newHead = this.segments[0].plus(directionVector(this.dir));
    this.segments.unshift(newHead);
    if (this.growing > 0){
      this.growing --;
    } else {
      this.segments.pop();
    }
  };



  Snake.prototype.turn = function(newDir) {
    if (Math.abs(directionVector(this.dir)[0])
            !== Math.abs(directionVector(newDir)[0]) ||
              this.segments.length === 1) {
      this.dir = newDir;
    }
  };

  Snake.prototype.containsPoint = function(point){
    return _.any(this.segments, function(segment){
      return segment.x === point[0] && segment.y === point[1];
    })
  }

  var directionVector = function(direction) {
    switch (direction) {
      case "N":
        return [0,-1];
      case "E":
        return [1,0];
      case "S":
        return [0,1];
      case "W":
        return [-1,0];
    }
  }

  var Coord = SnakeGame.Coord = function(arr) {
    this.x = arr[0]
    this.y = arr[1]
  }

  Coord.prototype.plus = function(other) {
    return new Coord([this.x+other[0], this.y+other[1]])
  }

  var Board = SnakeGame.Board = function() {
    this.snake = new Snake();
    this.width = 15;
    this.height = 15;
    this.apple = new Apple(this.randomApplePosition());
  }

  Board.prototype.render = function(){
    var outString = "";
    for(var y = 0; y < this.height; y++){
      for(var x = 0; x < this.width; x++){
        if (this.snake.containsPoint([x, y])){
          outString += "S";
        } else {
          outString += ".";
        }
      }
      outString += "\n"
    }
    return outString;
  }

  Board.prototype.manageApple = function() {
    if (this.snakeHasApple()) {
      this.snake.growing += 45/this.height;
      this.apple = new Apple(this.randomApplePosition());
      return true;
    }
    return false;
  }

  Board.prototype.snakeHasApple = function () {
    var head = this.snake.segments[0];
    return head.x === this.apple.x && head.y === this.apple.y;
  }

  Board.prototype.randomApplePosition = function () {
    var x = Math.floor(Math.random()*this.width)
    var y = Math.floor(Math.random()*this.height)

    if (this.snake.containsPoint([x,y])) {
      return this.randomApplePosition();
    }
    return [x,y]
  };

  Board.prototype.checkLost = function () {
    var head = this.snake.segments[0];
    if (head.x < 0 || head.x >= this.width ){
      return true;
    }
    if (head.y < 0 || head.y >= this.height){
      return true;
    }
    for(var i = 1; i < this.snake.segments.length; i++){
      var segment = this.snake.segments[i];
      if (head.x === segment.x && head.y === segment.y){
        return true;
      }
    }
    return false;
  }

  var Apple = SnakeGame.Apple = function (pos) {
    this.x = pos[0];
    this.y = pos[1];
  };

  Apple.prototype.isAt = function(pos){
    return this.x === pos[0] && this.y === pos[1];
  }

})(this);
