
var sys = require("sys"),
	WebSocketServer = require('websocket').server,
	http = require('http'),

	webSocketsServerPort = 8888,
	isAllReady = 0,
	clients = [], // list of currently connected clients (users)

	server,
	wsServer;


// http server
server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
	console.log((new Date()) + " Server is created");
});

server.listen(webSocketsServerPort, function() {
	console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});



// web socket server
wsServer = new WebSocketServer({
    httpServer: server
});

if (wsServer == null) {
	console.log((new Date()) + " wsServer + " + wsServer);
}

wsServer.on('request', function (request) {
	console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
	var connection = request.accept(null, request.origin); 

	// var connection = request.accept('echo-protocol', request.origin);
    // we need to know client index to remove them on 'close' event
	var index = clients.push(connection) - 1;

    console.log((new Date()) + " Connection accepted. Index of connection: " + index);

    clients.forEach(function(client, i) {
		client.send("userCount " + clients.length); 
		console.log("Client " + i + " receives the userCount number: " + clients.length);
    });

	
	// we assume the clients[0] is the controller and is created in the first time
    connection.on("message", function(message) {
		// broadcast message to all the connected clients
		var matches = message.utf8Data.split(/\s/g),
			action = matches[0];

		if (action == "control") {
			isAllReady = 0;
			clients.forEach(function(client, i) {
				client.send(message.utf8Data); 
				console.log("Client "+ i + " control video: " + message.utf8Data);
			});
		}
		else if (action == "canplay") {
			++isAllReady;
			console.log("Number of ready clients: " + isAllReady);
			// If controller and client are ready --> start playing
			if (isAllReady > 1 && isAllReady === clients.length) {
				clients.forEach(function(client, i) {
					client.send("isAllReady " + isAllReady);
					console.log("All " + i + " are ready: " + isAllReady);
				});	
			}
		} else {
			// action is timestamp or summary or pause
			clients.forEach(function(client, i) {
				client.send(message.utf8Data); 
				console.log("Client "+ i + ": " + message.utf8Data);	
			});
		}
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
		--isAllReady;
	});

});