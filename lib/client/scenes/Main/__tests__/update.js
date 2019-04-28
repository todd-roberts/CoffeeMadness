import Main from '..';

let main;

describe('updating the scene', () => {
    beforeEach(() => {
        main = new Main();
        main.init();
        main.preload();
        main.create();
    });

    it('moves the player\'s x toward the cursor\'s x', () => {
        main.player.x = 1;
        main.input.activePointer.x = 2;
        main.update();
        expect(main.player.x).toBe(2);
    });
});