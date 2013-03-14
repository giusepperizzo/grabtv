var sys = require("sys");


var WebSocketServer = require('websocket').server;
var http = require('http');
var webSocketsServerPort = 8888;



var server = http.createServer(function(request, response) {
    // process HTTP request. Since we're writing just WebSockets server
    // we don't have to implement anything.
	console.log((new Date()) + " Server is created");
 
});

server.listen(webSocketsServerPort, function() {
console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
 });

// create the server
var wsServer = new WebSocketServer({
    httpServer: server
});

//var userCount = [];

// list of currently connected clients (users)
var clients = [ ];
var isAllReady=0;
if (wsServer == null)
	console.log((new Date()) + " wsServer + " + wsServer);

wsServer.on('request', function (request) {
		 console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    // accept connection - you should check 'request.origin' to make sure that
    // client is connecting from your website
    // (http://en.wikipedia.org/wiki/Same_origin_policy)
   var connection = request.accept(null, request.origin); 
   
   
   //var connection = request.accept('echo-protocol', request.origin);
    // we need to know client index to remove them on 'close' event
   var index = clients.push(connection) - 1;
    console.log((new Date()) + ' Connection accepted. Index of connection: '+ index);
	for (var i=0; i < clients.length; i++) {  
		clients[i].send("userCount "+clients.length); 
		console.log("Client "+ i + " receives the userCount number: "+ clients.length);
	}
	var controlVideo="";
	//var userCount=[];
	
	// we assume the client [0] is the controller and is created in the first time
    connection.on('message', function(message) {
		// broadcast message to all connected clients
		var matches;
		matches = message.utf8Data.split(/\s/g);
		if(matches[0]=="control"){
			isAllReady=0;
			controlVideo=matches[1];
			for (var i=0; i < clients.length; i++){  
				//message ="timestamp " + 5;
				clients[i].send(message.utf8Data); 
				//connection.send(message.utf8Data); 
				console.log("Client "+ i + " control video: "+ message.utf8Data);
			
			}
		}
		if(matches[0]=="canplay"){
			++isAllReady;
			console.log("Number of ready clients: "+ isAllReady);
			// If controller and client are ready --> start playing
			if(isAllReady>1 && isAllReady==clients.length){						
				for (var i=0; i < clients.length; i++) {  
					clients[i].send("isAllReady "+isAllReady);
					console.log("All "+i+" are ready: "+ isAllReady);
				}	
			}
		}
		// update userCount --> maybe can delete this one
		/*if(userCount!=clients.length)
		{
			// we assume the first clients in this server is the contrroller
			++userCount;
			
		}*/
		if(matches[0]=="timestamp"){
			for (var i=0; i < clients.length; i++) {  
				clients[i].send(message.utf8Data); 
				console.log("Client "+ i + ": "+ message.utf8Data);
				
				}
		}
		
		if(matches[0]=="summary"){
			for (var i=0; i < clients.length; i++) {  
				clients[i].send(message.utf8Data); 
				console.log("Client "+ i + ": "+ message.utf8Data);
				
				}
		}
		if(matches[0]=="pause"){
			for (var i=0; i < clients.length; i++) {  
				clients[i].send(message.utf8Data); 
				console.log("Client "+ i + ": "+ message.utf8Data);
				
				}
		}
    });

    // user disconnected
    connection.on('close', function(connection) {
            console.log((new Date()) + " Peer "
                + connection.remoteAddress + " disconnected.");
            // remove user from the list of connected clients
            clients.splice(index, 1);
			--isAllReady;
			
});
});

function log(msg) {
  sys.puts(+new Date + ' - ' + msg.toString());
}


 