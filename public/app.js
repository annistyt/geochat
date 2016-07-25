var socket = io();
var messagesNode = $('.messages');
var onlineUsersNumber = $('.online-users-number');
var welcomeMessage = $('.welcome-message');
var resetUsernameEl = $('.reset-username');
var messages = [];
var username;

var resetUsername = function() { updateUserNameInDom(askAndSetUsername()) };

var updateUserNameInDom = function(username) {
  welcomeMessage.text('Welcome ' + username + '!');
}

var askAndSetUsername = function() {
  username = prompt("Please enter your name", "");
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
    if(event.keyCode == 13) {
      sendButton.click();
    }
  });
  resetUsernameEl.click(resetUsername);
});


var updateMessageList = function() {
  messagesNode.html('');
  messages.forEach(function(message) {
    var value = message.username + ': ' + message.text;
    $('<li>').text(value).appendTo(messagesNode);
  });
};

socket.on('message', function(data) {
  messages.push(data);
  updateMessageList();
  // alert(`fikk melding fra bruker: ${data.text}`);

});

socket.on('numberofusers', function(numberofusers) {
  onlineUsersNumber.text(numberofusers);
});


