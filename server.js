const express = require('express');
const path = require('path');
const PORT = 3000;
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

let messages = [];

io.on('connection', async (socket) => {
    console.log(`Socket conectado: ${socket.id}`);

    //socket.emit('previousMessages', messages);
    const sockets = (await io.fetchSockets()).map((socket) => socket.id);
    console.log(sockets);

    socket.on('sendMessage', (data) => {
        messages.push(data);
        socket.broadcast.emit('receivedMessage', data);
    });
});

server.listen(PORT);
