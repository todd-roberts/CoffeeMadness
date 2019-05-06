import express from 'express';
import http from 'http';
import connect from './socket';
import { PORT } from './config';
import chalk from 'chalk';

const app = express();

app.use(express.static('public'));

app.set('view engine', 'ejs');

const server = http.createServer(app);

connect(server);

app.get('/', (req, res) => {
    res.render('index', {});
});

server.listen(PORT, () => {
     console.log(chalk.blue(`app started on port ${PORT}`))
});