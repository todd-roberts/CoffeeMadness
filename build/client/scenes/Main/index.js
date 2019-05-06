"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _phaser = _interopRequireDefault(require("phaser"));

var _levelCreator = _interopRequireDefault(require("./level-creator"));

var _game = require("client/game");

var SKY_BLUE = '#2be8cf';
var PLAYER_HEIGHT = 16;
var PLAYER_WIDTH = 8;
var PLAYER_SPEED = 60;
var PLAYER_JUMP_SPEED = -360;
var JUMPING_FRAME = 6;
var PLAYER_NAME_START = -100;
var FONT = 'carrier_command';
var FONT_SIZE = 6;
var PLAYER_NAME_X_OFFSET = 3;
var PLAYER_NAME_Y_OFFSET = 16;
var CLOUD_SPEED = 10;
var POISONED = 0x7cfc00;

var Main =
/*#__PURE__*/
function (_Phaser$Scene) {
  (0, _inherits2["default"])(Main, _Phaser$Scene);

  function Main() {
    (0, _classCallCheck2["default"])(this, Main);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Main).call(this, {
      key: 'Main'
    }));
  }

  (0, _createClass2["default"])(Main, [{
    key: "init",
    value: function init() {
      this.levelCreator = new _levelCreator["default"](this.physics, this.game.initialObjectives);
      this.initializeCamera();
      this.initializeInput();
    }
  }, {
    key: "initializeCamera",
    value: function initializeCamera() {
      var _this = this;

      var width = this.game.config.width;
      this.cameras.main.setBackgroundColor(SKY_BLUE);
      this.cameras.main.setViewport(0, 0, width, width / this.getAspectRatio());
      window.addEventListener('resize', function () {
        _this.cameras.main.setSize(width, width / _this.getAspectRatio());
      });
    }
  }, {
    key: "getAspectRatio",
    value: function getAspectRatio() {
      return window.innerWidth / window.innerHeight;
    }
  }, {
    key: "initializeInput",
    value: function initializeInput() {
      this.cursors = this.input.keyboard.createCursorKeys();
    }
  }, {
    key: "create",
    value: function create() {
      this.levelGroups = this.levelCreator.create();
      this.createClouds();
      this.createCarafe();
      this.createPlayer();
      this.createOtherPlayers();
      this.createPlayerNames();
      this.addColliders();
      this.addTimers();
      this.focusCamera();
    }
  }, {
    key: "createClouds",
    value: function createClouds() {
      this.levelGroups.cloud.getChildren().forEach(function (c) {
        c.setDepth(-5);
        c.setVelocityX(CLOUD_SPEED);
      });
    }
  }, {
    key: "createCarafe",
    value: function createCarafe() {
      this.levelGroups.carafe.getChildren().forEach(function (c) {
        c.anims.play('sloosh');
      });
    }
  }, {
    key: "createPlayer",
    value: function createPlayer() {
      var _this$game$config = this.game.config,
          height = _this$game$config.height,
          width = _this$game$config.width;
      var startX = Math.round(width * Math.random());
      this.player = this.physics.add.sprite(startX, height - PLAYER_HEIGHT, this.game.player.name);
      this.player.body.setSize(PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_WIDTH / 2, 0);
      this.player.body.setCollideWorldBounds(true);
    }
  }, {
    key: "createOtherPlayers",
    value: function createOtherPlayers() {
      var _this2 = this;

      this.otherPlayers = {};
      this.game.socket.on('playerJoined', function (playerName) {
        if (playerName != _this2.game.player.name) {
          _this2.otherPlayers[playerName] = _this2.physics.add.staticSprite(-PLAYER_WIDTH, 0, playerName);
        }
      });
      this.game.socket.on('playerLeft', function (playerName) {
        _this2.otherPlayers[playerName].destroy();

        delete _this2.otherPlayers[playerName];
      });
      this.game.socket.on('update', function (update) {
        if (update.name != _this2.game.player.name) {
          if (!_this2.otherPlayers[update.name]) {
            _this2.otherPlayers[update.name] = _this2.physics.add.staticSprite(-PLAYER_WIDTH, 0, update.name);
          }

          Object.entries(update).forEach(function (_ref) {
            var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                k = _ref2[0],
                v = _ref2[1];

            _this2.otherPlayers[update.name][k] = v;
          });
        }
      });
    }
  }, {
    key: "createPlayerNames",
    value: function createPlayerNames() {
      var _this3 = this;

      this.playerNames = {};

      _game.PLAYERS.forEach(function (p) {
        _this3.playerNames[p] = _this3.add.bitmapText(PLAYER_NAME_START, PLAYER_NAME_START, FONT, p, FONT_SIZE);
      });
    }
  }, {
    key: "addColliders",
    value: function addColliders() {
      var _this4 = this;

      Object.entries(this.levelGroups).filter(function (_ref3) {
        var _ref4 = (0, _slicedToArray2["default"])(_ref3, 2),
            k = _ref4[0],
            _ = _ref4[1];

        return k != 'cloud';
      }).forEach(function (_ref5) {
        var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
            _ = _ref6[0],
            v = _ref6[1];

        return _this4.physics.add.collider(_this4.player, v);
      });
    }
  }, {
    key: "addTimers",
    value: function addTimers() {
      var _this5 = this;

      this.lastState = {
        walking: this.player.walking,
        jumping: this.player.jumping,
        x: this.player.x,
        y: this.player.y,
        flipX: this.player.flipX
      };
      this.time.addEvent({
        delay: 5,
        callback: function callback() {
          var currentUpdate = _this5.getPlayerUpdate();

          if (Object.keys(currentUpdate).length) {
            _this5.game.socket.emit('update', (0, _objectSpread2["default"])({}, _this5.game.player, currentUpdate));
          }
        },
        loop: true
      });
    }
  }, {
    key: "getPlayerUpdate",
    value: function getPlayerUpdate() {
      var _this6 = this;

      return Object.entries(this.lastState).reduce(function (acc, _ref7) {
        var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
            k = _ref8[0],
            v = _ref8[1];

        if (_this6.player[k] != v) {
          _this6.lastState[k] = _this6.player[k];
          acc[k] = _this6.player[k];
        }

        return acc;
      }, {});
    }
  }, {
    key: "focusCamera",
    value: function focusCamera() {
      this.cameras.main.startFollow(this.player, true, 1, 1);
    }
  }, {
    key: "update",
    value: function update() {
      this.wrapClouds();
      this.updatePlayer();
      this.updateOtherPlayers();
      this.writePlayerNames();
      this.updateCamera();
    }
  }, {
    key: "wrapClouds",
    value: function wrapClouds() {
      var _this7 = this;

      this.levelGroups.cloud.getChildren().forEach(function (c) {
        if (c.x > _this7.game.config.width + c.width / 2) {
          c.x = -(c.width / 2);
        }
      });
    }
  }, {
    key: "updatePlayer",
    value: function updatePlayer() {
      this.playerJumping();
      this.playerWalking();
      this.playerAnimation();
    }
  }, {
    key: "playerJumping",
    value: function playerJumping() {
      this.setPlayerOnGround();
      this.freezeJumpingFrame();
      var _this$player = this.player,
          onGround = _this$player.onGround,
          jumping = _this$player.jumping;

      if (onGround && !jumping && this.cursors.space.isDown) {
        this.jump();
      }

      this.player.jumping = this.cursors.space.isDown;
    }
  }, {
    key: "setPlayerOnGround",
    value: function setPlayerOnGround() {
      this.player.onGround = this.player.body.blocked.down;
    }
  }, {
    key: "freezeJumpingFrame",
    value: function freezeJumpingFrame() {
      !this.player.onGround && this.player.setFrame(JUMPING_FRAME);
    }
  }, {
    key: "jump",
    value: function jump() {
      this.player.body.setVelocityY(PLAYER_JUMP_SPEED);
    }
  }, {
    key: "playerWalking",
    value: function playerWalking() {
      var _ref9 = [this.cursors.left.isDown, this.cursors.right.isDown],
          l = _ref9[0],
          r = _ref9[1];
      this.player.walking = l ? !r : r;
      l && !r && this.player.setVelocityX(PLAYER_SPEED * -1);
      r && !l && this.player.setVelocityX(PLAYER_SPEED);
      l == r && this.player.setVelocityX(0);
    }
  }, {
    key: "playerAnimation",
    value: function playerAnimation() {
      this.player.body.velocity.x ? this.cyclePlayerWalk() : this.haltPlayer();
    }
  }, {
    key: "cyclePlayerWalk",
    value: function cyclePlayerWalk() {
      this.setPlayerFacing();
      this.player.onGround && this.player.anims.play("".concat(this.game.player.name, "-walking"), true);
    }
  }, {
    key: "setPlayerFacing",
    value: function setPlayerFacing() {
      this.player.flipX = this.player.body.velocity.x < 0;
    }
  }, {
    key: "haltPlayer",
    value: function haltPlayer() {
      this.player.anims.stop("".concat(this.game.player.name, "-walking"));
      this.player.onGround && this.player.setFrame(0);
    }
  }, {
    key: "updateOtherPlayers",
    value: function updateOtherPlayers() {
      Object.entries(this.otherPlayers).forEach(function (_ref10) {
        var _ref11 = (0, _slicedToArray2["default"])(_ref10, 2),
            k = _ref11[0],
            v = _ref11[1];

        v.walking ? v.anims.play("".concat(k, "-walking"), true) : v.anims.stop("".concat(k, "-walking")) || v.setFrame(0);
        v.jumping && v.setFrame(JUMPING_FRAME);
      });
    }
  }, {
    key: "writePlayerNames",
    value: function writePlayerNames() {
      var _this8 = this;

      Object.entries(this.otherPlayers).concat([[this.game.player.name, this.player]]).forEach(function (_ref12) {
        var _ref13 = (0, _slicedToArray2["default"])(_ref12, 2),
            name = _ref13[0],
            sprite = _ref13[1];

        _this8.playerNames[name].setPosition(sprite.x - PLAYER_NAME_X_OFFSET * name.length, sprite.y - PLAYER_NAME_Y_OFFSET);
      });
    }
  }, {
    key: "updateCamera",
    value: function updateCamera() {
      this.updateFollowOffset();
    }
  }, {
    key: "updateFollowOffset",
    value: function updateFollowOffset() {
      var _this$game$config2 = this.game.config,
          width = _this$game$config2.width,
          height = _this$game$config2.height;
      var xOffset = -(width / 2 - this.player.x);
      var inBottom = this.player.y > height / 2;
      var cameraHeight = width / this.getAspectRatio();
      var yOffset = inBottom ? Math.max(this.player.y - (height - .5 * cameraHeight), 0) : Math.min(this.player.y - .5 * cameraHeight, 0);
      this.cameras.main.setFollowOffset(xOffset, yOffset);
    }
  }]);
  return Main;
}(_phaser["default"].Scene);

var _default = Main;
exports["default"] = _default;