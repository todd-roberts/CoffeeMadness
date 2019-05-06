"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _phaser = _interopRequireDefault(require("phaser"));

var _game = require("client/game");

var spriteInfo = {
  frameWidth: 16,
  frameHeight: 16,
  margin: 0,
  spacing: 0
};

var Loading =
/*#__PURE__*/
function (_Phaser$Scene) {
  (0, _inherits2["default"])(Loading, _Phaser$Scene);

  function Loading() {
    (0, _classCallCheck2["default"])(this, Loading);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Loading).call(this, {
      key: 'Loading'
    }));
  }

  (0, _createClass2["default"])(Loading, [{
    key: "preload",
    value: function preload() {
      this.loadPlayerSheets();
      this.loadCarafe();
      this.loadStaticImages();
      this.loadFonts();
      this.loadSounds();
    }
  }, {
    key: "loadPlayerSheets",
    value: function loadPlayerSheets() {
      var _this = this;

      _game.PLAYERS.forEach(function (player) {
        _this.load.spritesheet(player, "assets/sprites/sheets/".concat(player, ".png"), spriteInfo);
      });
    }
  }, {
    key: "loadCarafe",
    value: function loadCarafe() {
      this.load.spritesheet('carafe', 'assets/sprites/sheets/carafe.png', {
        frameWidth: 16,
        frameHeight: 32,
        margin: 0,
        spacing: 0
      });
    }
  }, {
    key: "loadStaticImages",
    value: function loadStaticImages() {
      this.load.image('coffee', 'assets/sprites/static/coffee.png');
      this.load.image('breakroom_coffee', 'assets/sprites/static/breakroom_coffee.png');
      this.load.image('monster', 'assets/sprites/static/monster.png');
      this.load.image('platform', 'assets/sprites/static/platform.png');
      this.load.image('cloud', 'assets/sprites/static/cloud.png');
      this.load.image('ufo_todd', 'assets/sprites/static/ufo_todd.png');
    }
  }, {
    key: "loadFonts",
    value: function loadFonts() {
      this.load.bitmapFont('carrier_command', 'assets/fonts/bitmapFonts/carrier_command.png', 'assets/fonts/bitmapFonts/carrier_command.xml');
    }
  }, {
    key: "loadSounds",
    value: function loadSounds() {
      this.load.audio('clouds', ['assets/sounds/nimbus-land.mp3']);
    }
  }, {
    key: "create",
    value: function create() {
      var _this2 = this;

      _game.PLAYERS.forEach(function (p) {
        _this2.anims.create({
          key: "".concat(p, "-walking"),
          frames: _this2.anims.generateFrameNames(p, {
            frames: [0, 1, 2, 3, 4, 5, 6, 7]
          }),
          frameRate: 12,
          repeat: -1
        });
      });

      this.anims.create({
        key: 'sloosh',
        frames: this.anims.generateFrameNames('carafe', {
          frames: [0, 1, 2, 3, 4, 5, 6, 7]
        }),
        frameRate: 12,
        repeat: -1
      });
      this.scene.start('Login');
    }
  }]);
  return Loading;
}(_phaser["default"].Scene);

var _default = Loading;
exports["default"] = _default;