var WebSocketServer = require('websocket').server;
var http = require('http');

var server = http.createServer(function(request, response) {
    console.log((new Date()) + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(8080, function() {
    console.log((new Date()) + ' Server is listening on port 8080');    //3000
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// bloquear origens indefinidas. ou range de ip.
function originIsAllowed(request) {
    if(request) return false;
    else return true;
}
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.url)) {
      request.reject();
      console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
      return;
    }
    
    var connection = request.accept('echo-protocol', request.origin);
    console.log((new Date()) + request.origin + ' Connection accepted.');
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	var content = 'Received Message: ' + message.utf8Data + ' From: ' + connection.remoteAddress + ' at ' + (new Date());
            console.log(content);
            // connection.sendUTF(message.utf8Data);
            logFile(content);
        }
    });
    connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
    });
});

var fs = require('fs');
function logFile(content){
	var logger = fs.createWriteStream('log.txt', {
	  flags: 'a'
	});

	logger.write(content + "\n");
}