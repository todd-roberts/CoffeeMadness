import Phaser from 'phaser';
import { PLAYERS } from 'client/game';

const spriteInfo = {
    frameWidth: 16,
    frameHeight: 16,
    margin: 0,
    spacing: 0
};

class Loading extends Phaser.Scene {
    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        this.loadPlayerSheets();
        this.loadStaticImages();
        this.loadFonts();
        this.loadSounds();
    }

    loadPlayerSheets(){
        PLAYERS.forEach(player => {
            this.load.spritesheet(
                player,
                `assets/sprites/sheets/${player}.png`,
                spriteInfo
            );
        });
    }

    loadStaticImages(){
        this.load.image('coffee', 'assets/sprites/static/coffee.png');
        this.load.image('breakroom_coffee', 'assets/sprites/static/breakroom_coffee.png');
        this.load.image('monster', 'assets/sprites/static/monster.png');
        this.load.image('carafe', 'assets/sprites/static/carafe.png');
        this.load.image('platform', 'assets/sprites/static/platform.png');
        this.load.image('cloud', 'assets/sprites/static/cloud.png');
        this.load.image('ufo_todd', 'assets/sprites/static/ufo_todd.png');
    }

    loadFonts() {
        this.load.bitmapFont('carrier_command', 'assets/fonts/bitmapFonts/carrier_command.png',
         'assets/fonts/bitmapFonts/carrier_command.xml');
    }

    loadSounds() {
        this.load.audio('clouds', ['assets/sounds/nimbus-land.mp3']);  // urls: an array of file url
    }

    create() {
        PLAYERS.forEach(p => {
            this.anims.create({
                key: `${p}-walking`,
                frames: this.anims.generateFrameNames(p, { 
                    frames: [0, 1, 2, 3, 4, 5, 6, 7]
                }),
                frameRate: 12,
                repeat: -1
            });
        });

        
        this.scene.start('Login');
    }

}

export default Loading;