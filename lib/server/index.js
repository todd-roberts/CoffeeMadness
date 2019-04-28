const express = require('express');
const chalk = require('chalk');
const config = require('./config');
const gameRoom = require('./gameRoom').gameRoom;

const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');

const server = require('http').createServer(app);
const io = require('socket.io')(server);

io.on('connection', client => {
    console.log(chalk.magenta('someone connected'))
    let player;

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

});

app.get('/', (req, res) => {
    res.render('index', {});
});

server.listen(config.port, () => {
     console.log(chalk.blue(`app started on port ${config.port}`))
});