"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _game = require("client/game");

var COLORS = ['#49e7ff', '#6945ff'];
var BEAM_VERT_OFFSET = 10;
var BEAM_HORIZ_OFFSET_RIGHT = 30;
var BEAM_HORIZ_OFFSET_LEFT = 3;
var BEAM_WIDTH = 3;

var SpaceShip =
/*#__PURE__*/
function () {
  function SpaceShip(pos, facingRight) {
    (0, _classCallCheck2["default"])(this, SpaceShip);
    this.pos = pos;
    this.facingRight = facingRight;
    this.tip = {};
  }

  (0, _createClass2["default"])(SpaceShip, [{
    key: "move",
    value: function move(pos) {
      this.facingRight = pos.x > this.pos.x;
      this.pos = pos;
    }
  }, {
    key: "fire",
    value: function fire() {
      this.updateTipPosition();
      var beam = new BreakerBeam(this.tip, this.facingRight);
      this.renderBeam(beam.fire());
    }
  }, {
    key: "updateTipPosition",
    value: function updateTipPosition() {
      this.tip.x = this.facingRight ? this.pos.x + BEAM_HORIZ_OFFSET_RIGHT : this.pos.x - BEAM_HORIZ_OFFSET_LEFT;
      this.tip.y = this.pos.y + BEAM_VERT_OFFSET;
    }
  }]);
  return SpaceShip;
}();

exports["default"] = SpaceShip;

var BreakerBeam =
/*#__PURE__*/
function () {
  function BreakerBeam(_ref, facingRight) {
    var x = _ref.x,
        y = _ref.y;
    (0, _classCallCheck2["default"])(this, BreakerBeam);
    this.facingRight = facingRight;
    this.origin = {
      x: x,
      y: y
    };
  }

  (0, _createClass2["default"])(BreakerBeam, [{
    key: "fire",
    value: function fire() {
      var length = this.facingRight ? _game.GAME_WIDTH - this.origin.x : this.origin.x;
      return Array.from(new Array(length * BEAM_WIDTH), this.getPixelColor);
    }
  }, {
    key: "getPixelColor",
    value: function getPixelColor() {
      var tf = Math.random() > .5;
      return COLORS[+tf];
    }
  }]);
  return BreakerBeam;
}();