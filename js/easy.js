var search;
var ball;
$('.search').click(function (){
  search = $('.theme').val();

  var getter = $.ajax({
    url: "https://www.reddit.com/subreddits/search.json?q="+search,
    method: 'GET',
    dataType: 'json'
  })
  getter.done(function (returned){
    var images;
    if (returned['data']['children'][1]['data']['header_img'] === null || returned['data'] === undefined) {
      images = 'assets/paddle.png'
    } else {
      images = returned['data']['children'][1]['data']['header_img'];
    }
    var paddleFile = {
      type:'image',
      key:'paddle',
      url: images,
    };
    paddleFile.data = new Image();
    paddleFile.data.name = paddleFile.key;

    paddleFile.data.onload = function () {
      paddleFile.loaded = true;
      game.cache.addImage(paddleFile.key, paddleFile.url, paddleFile.data);
    };

    paddleFile.data.onerror = function () {
      paddleFile.error = true;
    }

    paddleFile.data.crossOrigin = '';
    paddleFile.data.src = paddleFile.url;
var value = $('#ballColor').val()

switch (value) {
  case '1':
    ball = 'assets/svg/ball_blue.svg';
    break;
  case '2':
    ball = 'assets/svg/ball_gray.svg';
    break;
  case '3':
    ball = 'assets/svg/ball_pink.svg';
    break;
  case '4':
    ball = 'assets/svg/ball_red.svg';
    break;
  case '5':
    ball = 'assets/svg/ball_yellow.svg';
    break;
  default :
    ball = 'assets/ball.png'
}
var gameProperties = {
    screenWidth: 1000,
    screenHeight: 600,

    dashSize: 5,

    paddleLeftXPlane: 100,
    paddleRightXPlane: 900,
    paddleVelocity: 600,
    paddleSegmentsMax: 4,
    paddleSegmentHeight: 20,
    paddleSegmentAngle: 15,

    ballVelocity: 500,
    ballRandomStartingAngleLeft: [-120, 120],
    ballRandomStartingAngleRight: [-60, 60],
    ballStartDelay: 2,

    scoreToWin: 2,
};

var graphicAssets = {
  ballURL: ball,
  ballName: 'ball',

  paddleURL: paddleFile.data.crossOrigin.src,
  paddleName: 'paddle'
};


var fontAssets = {
  scoreLeft_x: gameProperties.screenWidth * .25,
  scoreRight_x : gameProperties.screenWidth * .75,
  scoreTop_y: 10,

  scoreFontStyle: {font: '80px Arial', fill: '#FFFFFF', align: 'center'},
}
// The main state that contains our game. Think of states like pages or screens such as the splash screen, main menu, game screen, high scores, inventory, etc.
var mainState = function(game){
  this.backgroundGraphics;
  this.ballSprite;
  this.paddleLeftSprite;
  this.paddleRightSprite;
  this.paddleGroup;

  this.paddleLeft_up;
  this.paddleLeft_down;
  this.paddleRight_up;
  this.paddleRight_down;

  this.missedSide;

  this.scoreLeft;
  this.scoreRight;
};
mainState.prototype = {

    preload: function () {
      game.load.image(graphicAssets.ballName, graphicAssets.ballURL);
      game.load.image(graphicAssets.paddleName, graphicAssets.paddleURL);
    },

    create: function () {
      this.pGraphics();
      this.pPhysics();
      this.pKeyboard();
      this.startDemo();
      game.stage.backgroundColor= '#68b259';

    },

    update: function () {
      this.moveLeftPaddle();
      this.moveRightPaddle();
      game.physics.arcade.overlap(this.ballSprite, this.paddleGroup, this.collideWithPaddle, null, this)
    },

    pGraphics: function() {
      this.backgroundGraphics = game.add.graphics(0, 0);
      this.backgroundGraphics.lineStyle(2, 0xFFFFFF, 1);

      for(var y = 0; y < gameProperties.screenHeight; y+=gameProperties.dashSize * 2){
        this.backgroundGraphics.moveTo(game.world.centerX, y);
        this.backgroundGraphics.lineTo(game.world.centerX, y +gameProperties.dashSize)
      }
      this.ballSprite = game.add.sprite(game.world.centerX, game.world.centerY, graphicAssets.ballName);
      this.ballSprite.anchor.set(0.5, 0.5);
      this.ballSprite.scale.setTo(.5, .5)

      this.paddleLeftSprite = game.add.sprite(gameProperties.paddleLeftXPlane, game.world.centerY, graphicAssets.paddleName);
      this.paddleLeftSprite.anchor.set(0.5, 0.5);
      this.paddleLeftSprite.scale.setTo(1, 1);

      this.paddleRightSprite = game.add.sprite(gameProperties.paddleRightXPlane, game.world.centerY, graphicAssets.paddleName)
      this.paddleRightSprite.anchor.set(0.5, 0.5);
      this.paddleRightSprite.scale.setTo(1, 1);

      this.tf_scoreLeft = game.add.text(fontAssets.scoreLeft_x, fontAssets.scoreTop_y, '0', fontAssets.scoreFontStyle)
      this.tf_scoreLeft.anchor.set(0.5, 0);

      this.tf_scoreRight = game.add.text(fontAssets.scoreRight_x, fontAssets.scoreTop_y, '0', fontAssets.scoreFontStyle)
      this.tf_scoreRight.anchor.set(0.5, 0)

    },
    pPhysics: function() {
      game.physics.startSystem(Phaser.Physics.ARCADE);
      game.physics.enable(this.ballSprite);

      this.ballSprite.checkWorldBounds = true;
      this.ballSprite.body.collideWorldBounds = true;
      this.ballSprite.body.immovable = true;
      this.ballSprite.body.bounce.set(1);
      this.ballSprite.events.onOutOfBounds.add(this.ballOutOfBounds, this);

      this.paddleGroup = game.add.group();
      this.paddleGroup.enableBody = true;
      this.paddleGroup.physicsBodyType = Phaser.Physics.ARCADE;

      this.paddleGroup.add(this.paddleLeftSprite);
      this.paddleGroup.add(this.paddleRightSprite);

      this.paddleGroup.setAll('checkWorldBounds', true);
      this.paddleGroup.setAll('body.collideWorldBounds', true);
      this.paddleGroup.setAll('body.immovable', true);

    },
    pKeyboard: function () {
      this.paddleLeft_up = game.input.keyboard.addKey(Phaser.Keyboard.A);
      this.paddleLeft_down = game.input.keyboard.addKey(Phaser.Keyboard.S);

      this.paddleRight_up = game.input.keyboard.addKey(Phaser.Keyboard.UP);
      this.paddleRight_down = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    },
    startDemo: function() {
      this.resetBall();
      this.enablePaddles(false);
      this.enableBoundaries(true);
      game.input.onDown.add(this.startGame, this)

    },
    startGame: function () {
      game.input.onDown.remove(this.startGame, this);
      this.enablePaddles(true);
      this.enableBoundaries(false);
      this.resetBall();
      this.resetScores();

    },
    resetBall: function() {
      this.ballSprite.reset(game.world.centerX, game.rnd.between(0, gameProperties.screenHeight))
      this.ballSprite.visible = false;
      game.time.events.add(Phaser.Timer.SECOND * gameProperties.ballStartDelay, this.startBall, this)

    },
    startBall: function () {
      this.ballSprite.visible = true;
      var randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleRight.concat(gameProperties.ballRandomStartingAngleLeft));

      if (this.missedSide == 'right') {
        randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleLeft);
      } else if (this.missedSide == 'left') {
        randomAngle = game.rnd.pick(gameProperties.ballRandomStartingAngleRight)
      }

      game.physics.arcade.velocityFromAngle(randomAngle, gameProperties.ballVelocity, this.ballSprite.body.velocity);
    },
    enablePaddles: function(enabled) {
      this.paddleGroup.setAll('visible', enabled);
      this.paddleGroup.setAll('body.enable', enabled);

      this.paddleLeft_up.enabled = enabled;
      this.paddleLeft_down.enabled = enabled;
      this.paddleRight_up.enabled = enabled;
      this.paddleRight_down.enabled = enabled;
    },
    enableBoundaries: function (enabled) {
      game.physics.arcade.checkCollision.left = enabled;
      game.physics.arcade.checkCollision.right = enabled;
    },
    moveLeftPaddle: function() {
      if(this.paddleLeft_up.isDown) {
        this.paddleLeftSprite.body.velocity.y = -gameProperties.paddleVelocity;
      } else if (this.paddleLeft_down.isDown) {
        this.paddleLeftSprite.body.velocity.y = gameProperties.paddleVelocity
      } else {
        this.paddleLeftSprite.body.velocity.y = 0;
      }

    },
    moveRightPaddle: function () {
      if(this.paddleRight_up.isDown) {
        this.paddleRightSprite.body.velocity.y = -gameProperties.paddleVelocity;
      } else if (this.paddleRight_down.isDown) {
        this.paddleRightSprite.body.velocity.y = gameProperties.paddleVelocity
      } else {
        this.paddleRightSprite.body.velocity.y = 0;
      }
    },
    collideWithPaddle: function (ball, paddle) {
      var returnAngle;
      var segmentHit = Math.floor((ball.y-paddle.y)/gameProperties.paddleSegmentHeight);

      if(segmentHit >= gameProperties.paddleSegmentsMax) {
        segmentHit = gameProperties.paddleSegmentsMax - 1;
      } else if (segmentHit <= -gameProperties.paddleSegmentsMax - 1) {
        segmentHit = -(gameProperties.paddleSegmentsMax - 1)
      }
      if (paddle.x < gameProperties.screenWidth * 0.5) {
        returnAngle = segmentHit * gameProperties.paddleSegmentAngle;
        game.physics.arcade.velocityFromAngle(returnAngle, gameProperties.ballVelocity, this.ballSprite.body.velocity);
      } else {
        returnAngle = 180 - (segmentHit * gameProperties.paddleSegmentAngle)
        if (returnAngle > 180) {
          returnAngle -= 360;
        }
        game.physics.arcade.velocityFromAngle(returnAngle, gameProperties.ballVelocity, this.ballSprite.body.velocity)
      }
    },
    playerOneVictor: function () {
      $('#gameDiv').empty();
      $('#gameDiv').append('<img src=http://cdn.meme.am/instances/57638824.jpg />')
    },
    playerTwoVictor: function () {
      $('#gameDiv').empty();
      $('#gameDiv').append('<img src=http://cdn.meme.am/instances/29101253.jpg />');
    },
    onWin : function () {
      if (this.scoreLeft === gameProperties.scoreToWin) {
        this.playerOneVictor();
      } else if (this.scoreRight === gameProperties.scoreToWin){
        this.playerTwoVictor();
      }
    },
    ballOutOfBounds: function (){
      if (this.ballSprite.x < 0) {
        this.missedSide = 'left';
        this.scoreRight++;
      } else if (this.ballSprite.x > gameProperties.screenWidth) {
        this.missedSide = 'right'
        this.scoreLeft++;
      }
      this.updateScore();

      if(this.scoreLeft >= gameProperties.scoreToWin || this.scoreRight >= gameProperties.scoreToWin) {
        this.onWin();
      } else {
        this.resetBall();
      }
    },
    resetScores: function () {
      this.scoreLeft = 0;
      this.scoreRight = 0;
      this.updateScore();
    },
    updateScore: function() {
      this.tf_scoreLeft.text = this.scoreLeft;
      this.tf_scoreRight.text = this.scoreRight;
    }
};

var game = new Phaser.Game(gameProperties.screenWidth, gameProperties.screenHeight, Phaser.AUTO, 'gameDiv');


game.state.add('main', mainState);

game.state.start('main');
  })
})
