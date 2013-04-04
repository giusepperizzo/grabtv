
var sys = require("sys"),
	express = require("express"),
	app = express.createServer();

app.listen(8000);
app.use(express.logger("dev"));
app.use(express.static(__dirname ));
app.use(express.static("socket.io/lib"));

app.get("/video-controller.html", function (req, res) {
  res.sendfile((__dirname + "/video-controller.html"));
});

app.get("/video-client.html", function (req, res) {
  res.sendfile((__dirname + "/video-client.html"));
});