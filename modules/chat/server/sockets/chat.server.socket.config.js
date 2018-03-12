'use strict';

//  Documentación 1.0
//  Los archivos de sockets se registran en config/lib/socket.io línea 111, donde captura los assets de sockets
const translate = require('google-translate-api');

let res  = '';
// Create the chat configuration
module.exports = async (io, socket) => {

/*  io.emit('chatChannel', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: socket.request.user.profileImageURL,
    username: socket.request.user.username
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatChannel', async (message) => {
    res =  await translate(message.text, { to: 'es'});
    message.text = res.text;
    message.type = 'message';
    message.created = Date.now();
    message.profileImageURL = socket.request.user.profileImageURL;
    message.username = socket.request.user.username;

    // Emit the 'chatChannel' event
    io.emit('chatChannel', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', async () => {
    io.emit('chatChannel', {
      type: 'status',
      text: 'disconnected',
      created: Date.now(),
      profileImageURL: socket.request.user.profileImageURL,
      username: socket.request.user.username
    });
  });*/
  io.emit('chatChannel', {
    type: 'status',
    text: 'Is now connected',
    created: Date.now(),
    profileImageURL: 'a',
    username: 'a'
  });

  // Send a chat messages to all connected sockets when a message is received
  socket.on('chatChannel', async (message) => {
    // Emit the 'chatChannel' event
    io.emit('chatChannel', message);
  });

  // Emit the status event when a socket client is disconnected
  socket.on('disconnect', async () => {
    io.emit('chatChannel', {
      type: 'status',
      text: 'disconnected'
    });
  });
};
