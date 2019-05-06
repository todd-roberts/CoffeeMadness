import Phaser from 'phaser';
import { playerNames } from '../../../shared/accounts';
import { spriteInfo, getAnimationInfo } from '../../../shared/sprites';
import { soundInfo } from './sounds';

class Loading extends Phaser.Scene {
    constructor() {
        super({ key: 'Loading' });
    }

    preload() {
        this.loadPlayerSheets();
        this.loadCarafe();
        this.loadStaticImages();
        this.loadFonts();
        this.loadSounds();
    }

    loadPlayerSheets() {
        playerNames.forEach(player => {
            this.load.spritesheet(
                player,
                this.getSheetPath(player),
                spriteInfo
            );
        });
    }

    getSheetPath = obj => `assets/sprites/sheets/${obj}.png`;

    loadCarafe() {
        const carafeInfo = {
            ...spriteInfo,
            frameHeight: spriteInfo.frameHeight * 2
        };

        this.load.spritesheet(
            'carafe',
            this.getSheetPath('carafe'),
            carafeInfo
        );
    }

    loadStaticImages() {
        this.load.image('coffee', 'assets/sprites/static/coffee.png');
        this.load.image('breakroom_coffee', 'assets/sprites/static/breakroom_coffee.png');
        this.load.image('monster', 'assets/sprites/static/monster.png');
        this.load.image('platform', 'assets/sprites/static/platform.png');
        this.load.image('cloud', 'assets/sprites/static/cloud.png');
        this.load.image('ufo_todd', 'assets/sprites/static/ufo_todd.png');
    }

    loadFonts() {
        this.load.bitmapFont('carrier_command', 'assets/fonts/bitmapFonts/carrier_command.png',
            'assets/fonts/bitmapFonts/carrier_command.xml');
    }

    loadSounds() {
        this.load.audio('clouds', ['assets/sounds/nimbus-land.mp3']);
        this.load.audio('jump', ['assets/sounds/jump.wav']);
        this.load.audio('carafe_collect', ['assets/sounds/carafe_collect.wav']);
        this.load.audio('hyper', ['assets/sounds/hyper.wav']);
        this.load.audio('poisoned', ['assets/sounds/poisoned.wav']);
        this.load.audio('unpoisoned', ['assets/sounds/unpoisoned.wav']);
    }

    create() {
        this.createAnimations();
        this.createSounds();
        this.scene.start('Login');
    }

    createAnimations() {
        playerNames.forEach(p => {
            this.anims.create({
                key: `${p}-walking`,
                ...getAnimationInfo(this.anims, p)
            });
        });

        this.anims.create({
            key: 'sloosh',
            ...getAnimationInfo(this.anims, 'carafe')
        });
    }

    createSounds() {
        this.game.music = this.sound.add('clouds', {
            soundInfo,
            loop: true
        });

        this.game.jump = this.sound.add('jump', soundInfo);
        this.game.poisoned = this.sound.add('poisoned', soundInfo);
        this.game.hyper = this.sound.add('hyper', soundInfo);
        this.game.carafe_collect = this.sound.add('carafe_collect', soundInfo);
        this.game.unpoisoned = this.sound.add('unpoisoned', soundInfo);
    }
}

export default Loading;