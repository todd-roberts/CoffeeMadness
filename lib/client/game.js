import Phaser from 'phaser';
import Loading from './scenes/Loading';
import Login from './scenes/Login';
import Main from './scenes/Main';
import io from 'socket.io-client';
import { connectURL } from './config';

const config = {
    type: Phaser.AUTO,
    width: 192,
    height: 1916, // short to hide platform gaps on base row
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: true
        }
    },
    scene: [
        Loading,
        Login,
        Main
    ]
};

function main() {
    const game = new Phaser.Game(config);

    game.socket = io.connect(connectURL);

    game.socket.on('loggedIn', player => {
        game.player = player;
    });

    game.socket.on('initialObjectives', initialObjectives => {
        game.initialObjectives = initialObjectives;
    });
}

main();