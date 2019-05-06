"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _levels = require("../../../shared/levels");

var _sprites = require("../../../shared/sprites");

var TILE_SIZE = 16;

var LevelCreator =
/*#__PURE__*/
function () {
  function LevelCreator(physics, initialState) {
    (0, _classCallCheck2["default"])(this, LevelCreator);
    this.physics = physics;
    this.initialState = initialState;
    this.initialize();
  }

  (0, _createClass2["default"])(LevelCreator, [{
    key: "initialize",
    value: function initialize() {
      this.loadLevelMap();
      this.initGroups();
    }
  }, {
    key: "loadLevelMap",
    value: function loadLevelMap() {
      this.level = _levels.level1;
    }
  }, {
    key: "initGroups",
    value: function initGroups() {
      this.groups = {
        platform: this.physics.add.staticGroup(),
        cloud: this.physics.add.group({
          allowGravity: false,
          mass: 0
        }),
        coffee: this.physics.add.group({
          allowGravity: false,
          immovable: false
        }),
        breakroom_coffee: this.physics.add.group({
          allowGravity: false,
          immovable: false
        }),
        monster: this.physics.add.group({
          allowGravity: false,
          immovable: false
        }),
        carafe: this.physics.add.group({
          allowGravity: false,
          immovable: true
        })
      };
    }
  }, {
    key: "create",
    value: function create() {
      for (var i = 0; i < this.level.length; i++) {
        for (var j = 0; j < this.level[i].length; j++) {
          var spriteToAdd = _sprites.sprites[this.level[i][j]];
          var id = "".concat(spriteToAdd, "-").concat(i, "-").concat(j);

          if (spriteToAdd && !this.initialState[spriteToAdd][id].collected) {
            var s = this.createSprite(i, j, spriteToAdd, spriteToAdd == 'platform');
            s.collectibleID = id;
            this.groups[spriteToAdd].add(s);
          }
        }
      }

      return this.groups;
    }
  }, {
    key: "createSprite",
    value: function createSprite(i, j, sprite, isStatic) {
      var x = j * TILE_SIZE;
      var y = i * TILE_SIZE;
      var s = this.physics.add[isStatic ? 'staticSprite' : 'sprite'](x + TILE_SIZE / 2, y + TILE_SIZE / 2, sprite);
      return s;
    }
  }]);
  return LevelCreator;
}();

exports["default"] = LevelCreator;