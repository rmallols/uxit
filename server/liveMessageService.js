'use strict';

module.exports = {

    init: function (io) {
        io.sockets.on('connection', function (socket) {
            //socket.broadcast.emit('user connected');
            socket.on('publicMessage', function (data, fn) {
                //Broadcast the message to all the clients but the sender
                socket.broadcast.emit('publicMessageReceived', data);
                //Send a callback to the client that invoked this method so he'll now it has been sent to the others
                fn(data);
            });
        });
    }
};