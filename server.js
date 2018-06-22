var WebSocketServer = require('websocket').server;
var http = require('http');
var dateFormat = require('dateformat')
var date = dateFormat((new Date()), "dddd HH:MM:ss, dd/mm/yyyy, ")

var server = http.createServer(function(request, response) {
    console.log(date + ' Received request for ' + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(81, function() {
    var msgContent = (date + ' Server is listening on port 81');
    console.log(msgContent);    // 80 / 82
});

wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

// bloquear origens
function originIsAllowed(request) {
    if(request) return false;
    else return true;
}
wsServer.on('request', function(request) {
    if (!originIsAllowed(request.url)) {
      request.reject();
      var msgContent = (date + ' Connection from origin ' + request.origin + ' rejected.');
      console.log(msgContent);
      logFiles(msgContent, "connLog");
      return;
    }
    
    var connection = request.accept();  // 'echo-protocol'
    var ip = connection.remoteAddress.toString();
    ip = ip.substring(ip.lastIndexOf(':')+1);
    var msgContent = (date + ' Connection accepted from: ' + ip);
    console.log(msgContent);
    logFiles(msgContent, "connLog");

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
        	var msgContent = 'Received Message: ' + message.utf8Data + ' From: ' + ip + ' at ' + date;
            console.log(msgContent);
            // connection.sendUTF(message.utf8Data);
            logFiles(msgContent, "msgLog");
        }
    });
    connection.on('close', function(reasonCode, description) {
        var msgContent = (date + ' Peer ' + ip + ' disconnected.');
        console.log(msgContent);
        logFiles(msgContent, "connLog");
    });
});

var fs = require('fs')
function logFiles(content, type) {
    var logger = fs.createWriteStream(type + '.txt', {
      flags: 'a'
    });

    logger.write(content + "\n");
}