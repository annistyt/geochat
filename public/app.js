var socket = io();
var messagesNode = $('.messages');
var messages = [];

$(() => {
  var sendButton = $('.send-button');
  var inputField = $('#messageField');
  sendButton.click(() => {
    var text = inputField.val();
    if(text.trim() !== '') {
      socket.emit('send message', {text});
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
    $('<li>').text(message.text).appendTo(messagesNode);
  });
};

socket.on('message', data => {
  messages.push(data);
  updateMessageList();
  // alert(`fikk melding fra bruker: ${data.text}`);

});


