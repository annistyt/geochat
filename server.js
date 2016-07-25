const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public', {maxAge: 0}));

const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = new Map();
const emitUsers = () => {
  const userArray = [];
  users.forEach(user => userArray.push(user));
  io.emit('users', userArray);
}

io.on('connection', socket => {

  socket.on('send message', data => {
    io.emit('message', data);
  });

  socket.on('disconnect', () => {
    users.delete(socket.id);
    emitUsers();
  });

  socket.on('username', username => {
    users.set(socket.id, {username});
    emitUsers();
  });

  socket.on('typing', typing => {
    const user = users.get(socket.id);
    user.typing = typing;
    users.set(socket.id, user);
    emitUsers();
  });

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.info(`Server now live on http://localhost:${port}`)
});
