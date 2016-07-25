var socket = io();
var messagesNode = $('.messages');
var onlineUsersNumber = $('.online-users-number');
var messages = [];

$(() => {
  var person = prompt("Please enter your name", "");
  var sendButton = $('.send-button');
  var inputField = $('#messageField');
  sendButton.click(() => {
    var text = inputField.val();
    if(text.trim() !== '') {
      socket.emit('send message', {text: text, username: person});
      inputField.val('');
    }
  });
  inputField.on('keyup', event => {
    if(event.keyCode == 13) {
      sendButton.click();
    }
  })
});


var updateMessageList = () => {
  messagesNode.html('');
  messages.forEach(message => {
    var value = message.username + ': ' + message.text;
    $('<li>').text(value).appendTo(messagesNode);
  });
};

socket.on('message', data => {
  messages.push(data);
  updateMessageList();
  // alert(`fikk melding fra bruker: ${data.text}`);

});

socket.on('numberofusers', numberofusers => {
  onlineUsersNumber.text(numberofusers);
});


