import socketIO from 'socket.io';
import gameRoom from './gameRoom';
import objectives from './objectives';
import chalk from 'chalk';

objectives.init();

const connections = {};

class ClientConnection {
    constructor(client) {
        this.client = client;
        this.provideObjectives();
        this.setEvents();
    }

    provideObjectives() {
        this.client.emit('initialObjectives', objectives.getCurrent());
    }

    setEvents() {
        this.client.on('login', this.attemptLogin);
        this.client.on('update', this.broadcastUpdate);
        this.client.on('collect', this.processCollect);
    }

    attemptLogin = emailAddress => {
        emailAddress && this.joinGameRoom(emailAddress);
    };

    joinGameRoom = emailAddress => {
        this.player = gameRoom.loginAsPlayer(emailAddress);
        this.player && this.broadcastJoin();
    };

    broadcastJoin() {
        this.client.emit('loggedIn', this.player);
        this.client.broadcast.emit('playerJoined', this.player.name);
    }

    broadcastUpdate = update => {
        this.client.broadcast.emit('update', update);
    }

    processCollect = collect => {
        const applied = objectives.applyCollect(collect);

        if (applied) {
            this.broadcastCollect(applied);
            applied.gameOver && this.handleGameOver(applied.gameOver);
        }
    }

    broadcastCollect = applied => {
        this.client.emit('collect', applied);
        this.client.broadcast.emit('collect', applied);
    }

    handleGameOver(nextGameIn) {
        this.broadcastGameOver(nextGameIn);
        this.scheduleNextGame(nextGameIn);
    }

    broadcastGameOver(nextGameIn) {
        const nextGameAt = nextGameIn + Date.now();
        this.client.emit('gameOver', nextGameAt);
        this.client.broadcast.emit('gameOver', nextGameAt);
    }

    scheduleNextGame(nextGameIn) {
        setTimeout(() => {
            this.triggerNextGame();
            this.provideObjectives();
        }, nextGameIn);
    }

    triggerNextGame = () => {
        this.broadcastGameStart();
    }

    broadcastGameStart() {
        this.client.emit('gameStart', objectives.getCurrent());
        this.client.broadcast.emit('gameStart', objectives.getCurrent());
    }
}

export default function (server) {
    const io = socketIO(server);
    io.on('connection', handleConnection);
};

function handleConnection(client) {
    logConnection();

    connections[client.id] = new ClientConnection(client);

    client.on('disconnect', () => {
        const player = connections[client.id].player;

        player && removePlayer(client, player);

        logDisconnect();

        delete connections[client.id];
    });
}

function logConnection() {
    console.log(chalk.cyan('someone connected'));
}

function removePlayer(client, player) {
    gameRoom.logoutPlayer(player);

    client.emit('playerLeft', player.name);

    client.broadcast.emit('playerLeft', player.name);
}

function logDisconnect() {
    console.log(chalk.magenta('someone disconnected'));
}