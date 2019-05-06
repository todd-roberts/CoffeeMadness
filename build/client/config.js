"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connectURL = void 0;
var connectURL = process.env.NODE_ENV == 'production' ? 'https://coffee-madness.herokuapp.com/' : 'http://localhost:8080';
exports.connectURL = connectURL;