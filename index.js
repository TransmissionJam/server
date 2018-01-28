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
        io.in(req.roomName).emit('start game', `http://jam.xaq.space:50000?nps=${req.roomName}`);
    });

});


io.listen(3000);