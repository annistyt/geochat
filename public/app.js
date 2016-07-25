var socket = io();
var messagesNode = $('.messages');
var onlineUsersNumber = $('.online-users-number');
var welcomeMessage = $('.welcome-message');
var resetUsernameEl = $('.reset-username');
var onlineUsersList = $('.online-users');
var messages = [];
var username;

function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

var typing;

var stopTyping = debounce(function() {
  socket.emit('typing', false);
  typing = false;
}, 3000);


var resetUsername = function() { 
  username = askAndSetUsername();
  updateUserNameInDom(username)
  socket.emit('username', username);
};

var updateUserNameInDom = function(username) {
  welcomeMessage.text('Welcome ' + username + '!');
}

var askAndSetUsername = function() {
  username = prompt("Please enter your new name", "");
  localStorage.setItem('username', username);
  return username;
}

$(function() {
  if('localStorage' in window) {
    var {localStorage} = window;
    username = localStorage.getItem('username');
    if(!username) {
      username = askAndSetUsername();
    }
  }
  else {
    username = prompt("Please enter your name", "");
  }
  socket.emit('username', username);
  updateUserNameInDom(username);

  var sendButton = $('.send-button');
  var inputField = $('#messageField');
  sendButton.click(function() {
    var text = inputField.val();
    if(text.trim() !== '') {
      socket.emit('send message', {text: text, username: username });
      inputField.val('');
    }
  });
  inputField.on('keyup', function(event) {
    if(!typing) {
      typing = true;
      socket.emit('typing', true);
    }
    stopTyping();
    if(event.keyCode == 13) {
      sendButton.click();
      typing = false;
      socket.emit('typing', false);
    }
  });
  resetUsernameEl.click(resetUsername);
});


var updateMessageList = function() {
  messagesNode.html('');
  messages.forEach(function(message) {
    var value = message.username + ': ' + message.text;
    $('<li>').addClass(message.mine ? 'mine' : '').html(value).appendTo(messagesNode);
  });
};

socket.on('message', function(data) {
  console.log(socket.id, data);
  data.mine = data.sender.indexOf(socket.id) !== -1;
  messages.push(data);
  updateMessageList();
});

socket.on('users', function(users) {
  onlineUsersNumber.text(users.length);
  onlineUsersList.html('');
  users.forEach(function(user) {
    var _username = user.username == username ? 'Myself' : user.username;
    $('<li>').addClass(user.typing ? 'typing' : '').text(_username).appendTo(onlineUsersList);
  });
});


