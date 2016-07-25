const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public', {maxAge: 0}));

const http = require('http').Server(app);
const io = require('socket.io')(http);

const users = new Map();

io.on('connection', socket => {

  const emitUsers = () => {
    const userArray = [];
    users.forEach(({username}) => userArray.push(username));
    io.emit('users', userArray);
  }

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

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.info(`Server now live on http://localhost:${port}`)
});
