var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    // connection.on('message', function(message) {
    //     if (message.type === 'utf8') {
    //         console.log("Received: '" + message.utf8Data + "'");
    //     }
    // });
    
    function sendData() {
        if (connection.connected) {
            // var msgData = 6;
            // var msgData = "alo";
            var msgData = Math.floor(Math.random() * 101);
            connection.sendUTF(msgData);                        // toString

            setTimeout(sendData, 1000);
        }
    }
    sendData();
});

client.connect('ws://localhost:8080/', 'echo-protocol');

// ws://<ip>:<port>/