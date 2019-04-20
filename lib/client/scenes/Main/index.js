import Phaser from 'phaser';

const BACKGROUND = 'background';
const PLAYER = 'player';

class Main extends Phaser.Scene {
    constructor(){
        super({ key: 'Main'});
    }

    init() {
        const { width, height } = this.sys.game.config;
        this.gameWidth = width;
        this.gameHeight = height;
    }

    preload() {
        this.loadImages();
    }

    loadImages() {
        this.load.image(BACKGROUND, 'assets/background.png');
        this.load.image(PLAYER, 'assets/player.png');
    }

    create() {
        this.createBackground();
        this.createPlayer();
    }

    createBackground() {
        this.background = this.add.sprite(0, 0, BACKGROUND);
        this.background.setOrigin(0, 0);
    }

    createPlayer() {
        this.player = this.add.sprite(0, 0, PLAYER);
        this.player.setPosition(this.gameWidth/2, this.gameHeight/2);
    }

    update() {

    }

}

export default Main;