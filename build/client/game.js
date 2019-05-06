"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PLAYERS = exports.GAME_HEIGHT = exports.GAME_WIDTH = void 0;

var _phaser = _interopRequireDefault(require("phaser"));

var _Loading = _interopRequireDefault(require("./scenes/Loading"));

var _Login = _interopRequireDefault(require("./scenes/Login"));

var _Main = _interopRequireDefault(require("./scenes/Main"));

var _socket = _interopRequireDefault(require("socket.io-client"));

var _config = require("./config");

//import Boot from './scenes/Boot';
var GAME_WIDTH = 192;
exports.GAME_WIDTH = GAME_WIDTH;
var GAME_HEIGHT = 1916; // short to hide platform gaps on base row

exports.GAME_HEIGHT = GAME_HEIGHT;
var PLAYERS = ['todd', 'sam', 'adam', 'brandon', 'chris', 'kendall', 'brandy', 'shahn', 'jaymes', 'nick'];
exports.PLAYERS = PLAYERS;
var config = {
  type: _phaser["default"].AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  pixelArt: true,
  physics: {
    "default": 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },
  scene: [//Boot
  _Loading["default"], _Login["default"], _Main["default"]]
};
var game = new _phaser["default"].Game(config);
game.socket = _socket["default"].connect(_config.connectURL);
game.socket.on('loggedIn', function (player) {
  game.player = player;
});
game.socket.on('initialState', function (initialState) {
  game.initialState = initialState;
});