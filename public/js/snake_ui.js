(function(root){
  var SnakeGame = root.SnakeGame = root.SnakeGame || {};

  var View = SnakeGame.View = function(element){
    this.$el = $(element);
    $("#pause_button").on('click', this.start.bind(this));
    this.board = new SnakeGame.Board();
  }

  View.prototype.start = function(){

    $("html").keydown(this.handleKeyEvent.bind(this));

    $("#pause_button").text("Pause game")
    $("#pause_button").off('click')
    $("#pause_button").on('click', this.pauseGame.bind(this));

    this.step();
    this.timer = setInterval(this.step.bind(this), 3000/this.board.height);
    $(".wrapper").css("height",this.board.height*30);
    $(".container").css("height",this.board.height*30+200);
  }

  View.prototype.restart = function() {
    $("h1").text("NOKIA FUN TIMES");
    this.board = new SnakeGame.Board();
    this.start();
  }

  View.prototype.pauseGame = function () {
    clearInterval(this.timer);
    $("#pause_button").text("Unpause game")
    $("#pause_button").off('click')
    $("#pause_button").on('click', this.unpauseGame.bind(this));
  };

  View.prototype.unpauseGame = function () {
    this.step();
    this.timer = setInterval(this.step.bind(this), 3000/this.board.height);
    $("#pause_button").text("Pause game")
    $("#pause_button").off('click')
    $("#pause_button").on('click', this.pauseGame.bind(this));
  };


  View.prototype.handleKeyEvent = function(event){
    switch (event.keyCode) {
    case 37: // left
      this.board.snake.turn("W")
      break
    case 38: // up
      this.board.snake.turn("N")
      break
    case 39: //right
      this.board.snake.turn("E")
      break
    case 40: //down
      this.board.snake.turn("S")
      break
    }
  }

  View.prototype.step = function() {
    this.board.snake.move();
    if (this.board.manageApple()) {
      this.increaseScore();
    };
    this.render();
    if(this.board.checkLost()){
      this.lose();
    }
  }

  View.prototype.increaseScore = function() {
    var score = $('#score').text();
    score = parseInt(score) + 10;
    this.board.height++;
    this.board.width++;
    $('#score').text(score);
    clearInterval(this.timer)
    this.timer = setInterval(this.step.bind(this), 3000/this.board.height);
  }

  View.prototype.lose = function() {
    clearInterval(this.timer);
    $("h1").text("YOU LOSE BRO");
    $("#pause_button").text("Restart game")
    $("#pause_button").off('click')
    $("#pause_button").on('click', this.restart.bind(this));
    $('#score').text(0);
  }

  View.prototype.render = function () {
    this.$el.empty()

    for(var y = 0; y < this.board.height; y++){
      for(var x = 0; x < this.board.width; x++){
        if (this.board.snake.containsPoint([x, y])){
          this.$el.append('<div class="snake tile"></div>');
        } else if (this.board.apple.isAt([x,y])){
          this.$el.append('<div class="apple tile"></div>');
        } else {
          this.$el.append('<div class="empty tile"></div>');
        }
      }
    }
    $(".tile").css("height",450/this.board.height+"px");
    $(".tile").css("width",450/this.board.width+"px");
  };

})(this);

var v = new SnakeGame.View($(".wrapper")[0])
v.render();