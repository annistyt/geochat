const socket = io();
const messagesNode = $('.messages');
const onlineUsersNumber = $('.online-users-number');
const welcomeMessage = $('.welcome-message');
const resetUsernameEl = $('.reset-username');
const messages = [];
let username;

const resetUsername = () => updateUserNameInDom(askAndSetUsername());

const updateUserNameInDom = username => {
  welcomeMessage.text('Welcome ' + username + '!');
}

const askAndSetUsername = () => {
  username = prompt("Please enter your name", "");
  localStorage.setItem('username', username);
  return username;
}

$(() => {
  if('localStorage' in window) {
    const {localStorage} = window;
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
  sendButton.click(() => {
    var text = inputField.val();
    if(text.trim() !== '') {
      socket.emit('send message', {text: text, username: username });
      inputField.val('');
    }
  });
  inputField.on('keyup', event => {
    if(event.keyCode == 13) {
      sendButton.click();
    }
  });
  resetUsernameEl.click(resetUsername);
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


