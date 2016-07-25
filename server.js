const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('public', {maxAge: 0}));

const http = require('http').Server(app);
const io = require('socket.io')(http);


io.on('connection', socket => {
  
  socket.on('send message', data => {
     console.log(data);
    io.emit('message', data);

  });

});

const port = process.env.PORT || 3000;
http.listen(port, () => {
  console.info(`Server now live on http://localhost:${port}`)
});
