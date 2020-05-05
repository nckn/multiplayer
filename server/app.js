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
    // Mouse movement
    position.x = data.x
    position.y = data.y
    console.log('x is: ', data)
    socketio.emit('position', position)
    
    // Button movement
    // switch (data) {
    //   case 'left':
    //     position.x -= 5
    //     socketio.emit('position', position)
    //     break
    //   case 'right':
    //     position.x += 5
    //     socketio.emit('position', position)
    //     break
    //   case 'up':
    //     position.y -= 5
    //     socketio.emit('position', position)
    //     break
    //   case 'down':
    //     position.y += 5
    //     socketio.emit('position', position)
    //     break
    // }
  })
})

http.listen(3000, () => {
  console.log('listening at :3000...');
});
