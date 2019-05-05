import express from 'express';
import chalk from 'chalk';
import config from './config';
import gameRoom from './gameRoom';
import gameState from './gameState';

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

import http from 'http';
const server = http.createServer(app);
import socketIO from 'socket.io';
const io = socketIO(server);

gameState.create();

io.on('connection', client => {
    console.log(chalk.magenta('someone connected'))
    let player;

    client.emit('gameState', gameState.getCurrent());

    client.on('login', emailAddress => {
        if (emailAddress) {
            player = gameRoom.loginAsPlayer(emailAddress);

            if (player) {
                client.emit('loggedIn', player);
                client.broadcast.emit('playerJoined', player.name);
            }
        }
    });

    client.on('disconnect', () => {
        console.log(chalk.cyan('someone disconnected'));
        if (player) {
            gameRoom.logoutPlayer(player);
            client.emit('playerLeft', player.name);
        }
    });

    client.on('update', update => {
        client.broadcast.emit('update', update);
    });

    client.on('collect', collect => {
        const applied = gameState.applyCollect(collect);
        applied && client.broadcast('collect', applied);
    })

});

app.get('/', (req, res) => {
    res.render('index', {});
});

server.listen(config.port, () => {
     console.log(chalk.blue(`app started on port ${config.port}`))
});