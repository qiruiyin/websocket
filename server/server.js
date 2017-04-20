// 服务器入口
console.log("服务器已开启");
var $sqlite3 = require('sqlite3');
var $db = new $sqlite3.Database('./databases/JhtShow1.sqlite');
var $parse = require('./common/parse.js');

var webSocket = require("ws"),
		webSocketServer = webSocket.Server,
		wss = new webSocketServer({
			port: "9000"
		});
// var scoket = io.connect('http://localhost:8888');
// 建立连接
wss.on("connection", function(ws) {
	var parse = $parse.parseToJson(ws.upgradeReq.url);
	$db.run("create table if not exists user('id' INTEGER NOT NULL, 'userId'  INTERGER, 'starttime' TEXT, 'endtime'  TEXT, 'starttimestamp'  INTEGER, 'endtimestamp'  INTEGER, PRIMARY KEY ('id'))",function(){
		$db.all("select count(*) as count from user", function(err, rows){
			var row = rows[0].count + 1;
			console.log(row);
			$db.run("insert into user ('id', 'userId') values (" + row + ", " + row + ")", function(){
				$db.all("select * from user", function(err, rows){
					console.log(rows)
				});
			});
		});
	});

	ws.on("message", function(data) {
		wss.clients.forEach(function each(client) {
			$db.all("select count(*) as count from user", function(err, rows){
				if (client.readyState === webSocket.OPEN) {
	        client.send("{data: " + data + ", row: " + rows[0].count + "}");
	      }
			});
    });
	});

	ws.on("message", function(data) {
		wss.clients.forEach(function each(client) {
			$db.all("select count(*) as count from user", function(err, rows){
				if (client.readyState === webSocket.OPEN) {
	        client.send("{data: " + data + ", row: " + rows[0].count + "}");
	      }
			});
    });
	})
})

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === webSocket.OPEN) {
      client.send(data);
    }
  });
};