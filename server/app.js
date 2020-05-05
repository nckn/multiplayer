const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);

var position = {
  x: 100,
  y: 100
}

socketio.on('connection', socket => {
  socket.emit('position', position)
  socket.on('move', data => {
    position.x = data.x
    position.y = data.y
    console.log('x is: ', data)
    socket.emit('position', position)
  })
})

http.listen(3000, () => {
  console.log('listening at :3000...');
});
