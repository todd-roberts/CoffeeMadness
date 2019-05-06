"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _express = _interopRequireDefault(require("express"));

var _chalk = _interopRequireDefault(require("chalk"));

var _config = _interopRequireDefault(require("./config"));

var _gameRoom = _interopRequireDefault(require("./gameRoom"));

var _gameState = _interopRequireDefault(require("./gameState"));

var _http = _interopRequireDefault(require("http"));

var _socket = _interopRequireDefault(require("socket.io"));

var app = (0, _express["default"])();
app.use(_express["default"]["static"]('public'));
app.set('view engine', 'ejs');

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);

_gameState["default"].create();

io.on('connection', function (client) {
  console.log(_chalk["default"].magenta('someone connected'));
  var player;
  client.emit('initialState', _gameState["default"].getCurrent());
  client.on('login', function (emailAddress) {
    if (emailAddress) {
      player = _gameRoom["default"].loginAsPlayer(emailAddress);

      if (player) {
        client.emit('loggedIn', player);
        client.broadcast.emit('playerJoined', player.name);
      }
    }
  });
  client.on('disconnect', function () {
    console.log(_chalk["default"].cyan('someone disconnected'));

    if (player) {
      _gameRoom["default"].logoutPlayer(player);

      client.emit('playerLeft', player.name);
    }
  });
  client.on('update', function (update) {
    client.broadcast.emit('update', update);
  });
  client.on('collect', function (collect) {
    var applied = _gameState["default"].applyCollect(collect);

    applied && client.broadcast('collect', applied);
  });
});
app.get('/', function (req, res) {
  res.render('index', {});
});
server.listen(_config["default"].port, function () {
  console.log(_chalk["default"].blue("app started on port ".concat(_config["default"].port)));
});