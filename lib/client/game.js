import Phaser from 'phaser';
import Main from './scenes/Main';

const config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: [
        Main
    ]
};

new Phaser.Game(config);