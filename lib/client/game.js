import Phaser from 'phaser';
//import Boot from './scenes/Boot';
import Loading from './scenes/Loading';
import Login from './scenes/Login';
import Main from './scenes/Main';

import io from 'socket.io-client';
import { connectURL } from './config';

export const GAME_WIDTH = 192;
export const GAME_HEIGHT = 1916; // short to hide platform gaps on base row

export const PLAYERS = ['todd','sam',
'adam','brandon','chris',
'kendall','brandy','shahn',
'jaymes','nick'];

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    scene: [
        //Boot
        Loading,
        Login,
        Main
    ]
};

const game = new Phaser.Game(config);

game.socket = io.connect(connectURL);

game.socket.on('loggedIn', player => {
    game.player = player;
});

game.socket.on('gameState', currentState => {
    console.log(currentState);
    game.currentState = currentState;
});