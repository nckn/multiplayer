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

// var id = 0

// Assigning IDs
// socketio.engine.generateId = function (req) {
//   // generate a new custom id here
//   id++
//   return id
// }

// var util = require("util"),
//   io = require('/socket.io').listen(8080),
//   fs = require('fs'),
//   os = require('os'),
//   url = require('url');

var clients =[];

// io.sockets.on('connection', function (socket) {

//     socket.on('storeClientInfo', function (data) {

//         var clientInfo = new Object();
//         clientInfo.customId         = data.customId;
//         clientInfo.clientId     = socket.id;
//         clients.push(clientInfo);
//     });

//     socket.on('disconnect', function (data) {

//         for( var i=0, len=clients.length; i<len; ++i ){
//             var c = clients[i];

//             if(c.clientId == socket.id){
//                 clients.splice(i,1);
//                 break;
//             }
//         }

//     });
// });

// var clients = [];

// socketio.sockets.on('connect', function(client) {
//     clients.push(client); 

//     client.on('disconnect', function() {
//         clients.splice(clients.indexOf(client), 1);
//     });
// });

socketio.on('connection', socket => {
  // Log ID
  // console.log('new id: ', socket.id); // writes 1 on the console
  // Set position
  socket.emit('position', position)
  // When move is detected
  socket.on('move', data => {
    // Mouse movement
    position.x = data.x
    position.y = data.y
    // console.log('x is: ', data)
    // console.log('clients: ', clients)
    socketio.emit('position', position)

    var total = socketio.engine.clientsCount;
    socketio.emit('getCount', total)
    
  })

  socket.on('changeAllColors', data => {
    // Mouse movement
    color = data
    socketio.emit('color', color)
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
    return clientInfo
  });

  socket.on('disconnect', function (data) {
    for (var i = 0, len = clients.length; i < len; ++i ){
      var c = clients[i];
      if (c.clientId == socket.id) {
        clients.splice(i, 1);
        break;
      }
    }
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