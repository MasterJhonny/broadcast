const { Socket } = require('dgram');
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);

// connect socket io
const io = require('socket.io')(http);

// files static
app.use(express.static(path.join(__dirname,'views')));

io.on('connect', (socket) => {
    socket.on('stream', (image) => {
        // emit stream
        socket.broadcast.emit('stream', image);
    })
    socket.on('stop', (data) => {
        socket.broadcast.emit('stop', data);
    })
})

module.exports = http;