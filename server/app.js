const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);

var position = {
  x: 200,
  y: 200
}

socketio.on('connection', socket => {
  socket.emit('position', position)
})

http.listen(3000, () => {
  console.log('listening at :3000...');
});
