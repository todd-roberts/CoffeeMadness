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

var Login =
/*#__PURE__*/
function (_Phaser$Scene) {
  (0, _inherits2["default"])(Login, _Phaser$Scene);

  function Login() {
    (0, _classCallCheck2["default"])(this, Login);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(Login).call(this, {
      key: 'Login'
    }));
  }

  (0, _createClass2["default"])(Login, [{
    key: "create",
    value: function create() {
      this.music = this.sound.add('clouds', {
        mute: false,
        volume: 1,
        rate: 1,
        detune: 0,
        seek: 0,
        loop: true,
        delay: 0
      });
      var emailAddress = prompt("Enter your Midway email address. \nIf you fatfinger it, refresh and try again.");
      this.music.play();
      this.game.socket.emit('login', emailAddress);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.game.player) {
        this.scene.start('Main');
      }
    }
  }]);
  return Login;
}(_phaser["default"].Scene);

var _default = Login;
exports["default"] = _default;