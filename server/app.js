const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);

// socketio.of('/chat').clients((error, clients) => {
//   if (error) throw error;
//   console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
// });

// var clients = socketio.sockets.clients();
// var clients = socketio.sockets.clients('room'); // all users from room `room`

var position = {
  x: 100,
  y: 100
}

// var clients = [];

// socketio.sockets.on('connect', function(client) {
//     clients.push(client); 

//     client.on('disconnect', function() {
//         clients.splice(clients.indexOf(client), 1);
//     });
// });

socketio.on('connection', socket => {
  socket.emit('position', position)
  socket.on('move', data => {
    // Mouse movement
    position.x = data.x
    position.y = data.y
    // console.log('x is: ', data)
    // console.log('clients: ', clients)
    socketio.emit('position', position)

    var total = socketio.engine.clientsCount;
    socketio.emit('getCount', total)
    
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
