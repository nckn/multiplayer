const express = require('express')();
const http = require('http').Server(express);
const socketio = require('socket.io')(http);

var position = {
  x: 100,
  y: 100
}

var color = 0
var clients =[];

socketio.on('connection', socket => {
  // Log ID
  // console.log('new id: ', socket.id); // writes 1 on the console

  var socketPair = {
    // id: id,
    id: socket.id,
    uuid: socket.id
  }

  console.log('new socket: ', socket.id)

  var clientObj = new Object();
  // clientObj.customId = data.customId;
  clientObj.clientId = socket.id;
  // console.log('client Info: ', clientObj)
  clients.push(clientObj);
  // Store client info
  // socketio.emit('storeInfo', clientInfo)

  socket.emit('user_connected', socketPair)
  
  // Broadcast to all
  // var joining = {
  //   joinId: socket.id,
  //   joiners: clients,
  // }

  // Broadcast joining
  // socketio.sockets.emit('broadcast', joining)
  
  socket.on('fetch_others', () => {
    socket.emit('all_clients', clients)
  })

  socket.on('changeAllColors', data => {
    // Mouse movement
    var color = data.color
    // console.log('id of it: ', data.id)
    var obj = {color: color, id: data.id}
    clients.forEach((element, index) => {
      if (element.clientId === data.id) {
        // console.log('its a match')
        element.color = color
        obj = {color: color, id: element.clientId}
      }
    });
    socketio.emit('color', obj)
  })

  socket.on('disconnect', function (data) {
    // console.log(`someone is leaving: ${socket.id}`)
    for (var i = 0, len = clients.length; i < len; ++i ) {
      var c = clients[i];
      if (c.clientId == socket.id) {
        clients.splice(i, 1);
        console.log('client id thats getting rid of: ', c.clientId)
        var package = {
          leavingId: c.clientId,
          remainers: clients
        }
        socketio.sockets.emit('broadcast', package)
        break;
      }
    }

    // Send all clients
    // socket.emit('all_clients', clients)
    
  });

  // socket.on('disconnect', data => {
  //   console.log(`someone leaving: ${socket.id}`)
  // })

})

http.listen(3000, () => {
  console.log(`Server listening on 3000`);
  // console.log(`Server listening on http://${host}:${port}`);
});

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