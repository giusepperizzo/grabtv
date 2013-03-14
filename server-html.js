var sys = require("sys");
var express = require('express');

var app = require('express').createServer();
// in this circumstance , we don't need io here
//var io = require('socket.io').listen(app);

app.listen(8000);
// routing
app.use(express.logger('dev'));
app.use(express.static(__dirname ));
// in this circumstance , we don't need io here
app.use(express.static('socket.io/lib' ));

app.get('/video-controller.html', function (req, res) {
  res.sendfile((__dirname + '/video-controller.html'));
});

app.get('/video-client.html', function (req, res) {
  res.sendfile((__dirname + '/video-client.html'));
});

var userCount = [];

function log(msg) {
  sys.puts(+new Date + ' - ' + msg.toString());
}


 