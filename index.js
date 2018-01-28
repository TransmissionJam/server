const io = require('socket.io')();

let rooms = [

];
const maxPlayers = 3;

io.on('connection', function (socket) {

    socket.emit('update rooms', rooms.filter(room => room.players.length < maxPlayers));

    socket.on('new room', function (room) {
        rooms.push(room);
        io.sockets.emit('update rooms', rooms.filter(room => room.players.length < maxPlayers));
        socket.join(room.name);
    });

    socket.on('join room', function (req) {
        rooms.find(room => room.name === req.roomName).players.unshift(req.player);
        io.sockets.emit('update rooms', rooms.filter(room => room.players.length < maxPlayers));
        socket.join(req.roomName);
        io.in(req.roomName).emit('start game', `${req.roomName}`);

        startGame(req.roomName);
    });
});

const startGame = function (namespace) {
    const nsp = io.of('/' + namespace);

    nsp.on('connection', function (socket) {
        console.log('someone connected');
    });

    nsp.emit('hi', 'everyone!');
};

var http = require('http');
var server = http.createServer();
server.listen(50001, '0.0.0.0');
var socket = io.listen(server);

io.listen(50007);