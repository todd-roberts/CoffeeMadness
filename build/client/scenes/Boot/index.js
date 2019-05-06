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

var Boot =
/*#__PURE__*/
function (_Phaser$Scene) {
  (0, _inherits2["default"])(Boot, _Phaser$Scene);

  function Boot() {
    (0, _classCallCheck2["default"])(this, Boot);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Boot).apply(this, arguments));
  }

  (0, _createClass2["default"])(Boot, [{
    key: "init",
    value: function init() {}
  }, {
    key: "preload",
    value: function preload() {}
  }, {
    key: "create",
    value: function create() {
      this.add;
    }
  }, {
    key: "update",
    value: function update() {
      if (this.input.activePointer.isDown) {}
    }
  }]);
  return Boot;
}(_phaser["default"].Scene);

var _default = Boot;
exports["default"] = _default;