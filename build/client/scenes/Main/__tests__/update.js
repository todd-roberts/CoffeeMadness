"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _ = _interopRequireDefault(require(".."));

var main;
describe('updating the scene', function () {
  beforeEach(function () {
    main = new _["default"]();
    main.init();
    main.preload();
    main.create();
  });
  it('moves the player\'s x toward the cursor\'s x', function () {
    main.player.x = 1;
    main.input.activePointer.x = 2;
    main.update();
    expect(main.player.x).toBe(2);
  });
});