"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _levels = require("../shared/levels");

var _sprites = require("../shared/sprites");

var collectibleSprites = _sprites.sprites.slice(3);

var _default = {
  west: 0,
  south: 0,
  collectibles: {
    coffee: {
      pointUpdate: 1
    },
    breakroom_coffee: {
      pointUpdate: 0
    },
    monster: {
      pointUpdate: 3
    },
    carafe: {
      pointUpdate: 25
    }
  },
  create: function create() {
    this.parseLevel();
  },
  parseLevel: function parseLevel() {
    var _this = this;

    _levels.level1.forEach(function (row, i) {
      row.forEach(function (val, j) {
        var sprite = _sprites.sprites[val];

        if (sprite && collectibleSprites.includes(sprite)) {
          _this.collectibles[sprite]["".concat(sprite, "-").concat(i, "-").concat(j)] = {
            collected: false
          };
        }
      });
    });
  },
  getCurrent: function getCurrent() {
    return {
      west: this.west,
      south: this.south,
      collectibles: this.collectibles
    };
  },
  applyCollect: function applyCollect(collect) {
    var player = collect.player,
        sprite = collect.sprite,
        id = collect.id;
    var group = this.collectibles[sprite];
    var collectible = group[id];

    if (!collectible.collected) {
      collectible.collected = true;
      this[player.team] += group.pointUpdate;
      return (0, _objectSpread2["default"])({}, collect, {
        west: this.west,
        south: this.south
      });
    }
  }
};
exports["default"] = _default;