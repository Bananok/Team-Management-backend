let socket = null;
let connecting = false;
let connected = false;

var statusLine = document.getElementById('status-line');
var urlField = document.getElementById('url-field');
var tokenField = document.getElementById('token-field');
var connectBtn = document.getElementById('connect-btn');
var actionField = document.getElementById('action-field');
var messageField = document.getElementById('message-field');
var sendBtn = document.getElementById('send-btn');
var logsList = document.getElementById('logs');

function listenToFieldChange() {
  urlField.value = localStorage.wsClientUrl || 'ws://localhost:3010';
  urlField.addEventListener('keyup', (e) => {
    localStorage.wsClientUrl = e.target.value;
  });

  tokenField.value = localStorage.wsClientToken || '';
  tokenField.addEventListener('keyup', (e) => {
    localStorage.wsClientToken = e.target.value;
  });

  actionField.value = localStorage.wsClientAction || 'profile.get';
  actionField.addEventListener('keyup', (e) => {
    localStorage.wsClientAction = e.target.value;
  });

  messageField.value = localStorage.wsClientMessage || '{\n}';
  messageField.addEventListener('keyup', (e) => {
    localStorage.wsClientMessage = e.target.value;
    formatMessageJson();
  });

  formatMessageJson();

  sendBtn.disabled = true;
}

function addLog(action, data, isIncoming) {
  var li = document.createElement('li');
  li.classList.add('logs-item');
  li.classList.add(isIncoming ? 'logs-item--incoming' : 'logs-item--outgoing');
  var b = document.createElement('b');
  b.innerText = action;
  li.appendChild(b);
  var span = document.createElement('span');
  span.innerText = JSON.stringify(data);
  li.appendChild(span);

  logsList.appendChild(li);
  logsList.scrollTo(0, logsList.scrollHeight);
}

function changeConnectingStatus(cConnecting) {
  connecting = cConnecting;

  if (cConnecting) {
    connectBtn.innerText = 'Connecting';
  }

  connectBtn.disabled = true;
}

function changeConnectedStatus(cConnected) {
  connected = cConnected;

  connectBtn.innerText = cConnected ? 'Disconnect' : 'Connect';
  connectBtn.disabled = false;
  sendBtn.disabled = !cConnected;
  statusLine.classList[cConnected ? 'add' : 'remove']('status-line--online');
}

function connect() {
  changeConnectingStatus(true);

  socket = io(urlField.value, {
    autoConnect: true,
    reconnection: false,
    transports: ['websocket'],
    query: {
      token: tokenField.value,
    },
  });

  socket.on('connect', () => {
    changeConnectedStatus(true);
  });

  socket.onAny((action, data) => {
    addLog(action, data, false);
  });

  socket.on('disconnect', () => {
    changeConnectingStatus(false);
    changeConnectedStatus(false);
  });

  socket.on('connect_error', (e) => {
    alert('Error: ' + e.message);

    changeConnectingStatus(false);
    changeConnectedStatus(false);
  });
}

function disconnect() {
  changeConnectedStatus(false);

  socket.disconnect();

  socket = null;
}

function formatMessageJson() {
  try {
    var ugly = messageField.value;
    var obj = JSON.parse(ugly);
    var result = JSON.stringify(obj, undefined, 4);

    messageField.value = result;
    messageField.classList.remove('message-field--error');

    return obj;
  } catch (error) {
    messageField.classList.add('message-field--error');

    return false;
  }
}

function sendMessage() {
  var actionValue = actionField.value;
  var messageValue = formatMessageJson();

  socket.emit(actionValue, messageValue);
  addLog(actionValue, messageValue, true);
}

listenToFieldChange();

connectBtn.addEventListener('click', () => {
  if (!connected) {
    connect();
  } else {
    disconnect();
  }
});

sendBtn.addEventListener('click', () => {
  if (!socket || !socket.connected || !actionField.value.length || !formatMessageJson()) {
    return;
  }

  sendMessage();
});
