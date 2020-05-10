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

var color = 0
var clients =[];
// var id = 0
// var sortedSockets = []

socketio.on('connection', socket => {
  // Log ID
  // console.log('new id: ', socket.id); // writes 1 on the console
  
  // var total = socketio.engine.clientsCount;
  // socketio.emit('getCount', total)

  // Set position
  // socket.emit('position', position)

  var socketPair = {
    // id: id,
    id: socket.id,
    uuid: socket.id
  }

  // When move is detected
  // socket.on('move', data => {
  //   // Mouse movement
  //   position.x = data.x
  //   position.y = data.y
  //   // console.log('x is: ', data)
  //   // console.log('clients: ', clients)
  //   socketio.emit('position', position)

  //   // var total = socketio.engine.clientsCount;
  //   // socketio.emit('getCount', total)
    
  // })

  socket.on('changeAllColors', data => {
    // Mouse movement
    var color = data.color
    console.log('id of it: ', data.id)
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

  // Store client info
  socket.on('storeClientInfo', function (data) {
    var clientInfo = new Object();
    clientInfo.customId = data.customId;
    clientInfo.clientId = socket.id;
    // console.log('client Info: ', clientInfo)
    // clientInfo.hooray = 'yay'
    clients.push(clientInfo);
    // Store client info
    socketio.emit('storeInfo', clientInfo)

    socket.emit('user_connected', socketPair)
    
    // Send all clients
    // socket.emit('all_clients', clients)

    // Broadcast to all
    var joining = {
      joinId: socket.id,
      joiners: clients,
    }
    socketio.sockets.emit('broadcast', joining)
    
    return
    // return clientInfo
  });

  socket.on('disconnect', function (data) {
    // console.log(`someone is leaving: ${socket.id}`)
    for (var i = 0, len = clients.length; i < len; ++i ) {
      var c = clients[i];
      if (c.clientId == socket.id) {
        clients.splice(i, 1);
        console.log('client id thats getting rid of: ', c.clientId)
        // Send message that someone left
        socket.emit('client_leaving', c.clientId)
        // console.log(`someone is leaving: ${socket.id}`)
        var package = {
          leavingId: c.clientId,
          remainers: clients
        }
        socketio.sockets.emit('broadcast', package)
        break;
      }
    }

    // Send all clients
    socket.emit('all_clients', clients)
    
  });

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