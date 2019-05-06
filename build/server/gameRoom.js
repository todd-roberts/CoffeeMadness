"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _accounts = _interopRequireDefault(require("./accounts"));

var _default = {
  teams: {
    west: {},
    south: {}
  },
  loginAsPlayer: function loginAsPlayer(emailAddress) {
    var account = _accounts["default"][emailAddress];

    if (account && !this.accountInUse(account)) {
      this.teams[account.team][account.name] = account;
      return account;
    }
  },
  accountInUse: function accountInUse(account) {
    return this.teams[account.team][account.name];
  },
  logoutPlayer: function logoutPlayer(player) {
    delete this.teams[player.team][player.name];
  },
  mergeUpdate: function mergeUpdate(update) {
    var curr = this.teams[update.team][update.name];
    this.teams[update.team][update.name] = (0, _objectSpread2["default"])({}, curr, update);
  }
};
exports["default"] = _default;