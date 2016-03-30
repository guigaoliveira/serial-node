var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var serial= require('./serial-node');
app.use(express.static(__dirname + '/docs'));
server.listen(80, function() {console.log("Server Online");});
io.on('connection', function (socket) 
{  
	serial.list();
	serial.use('com3');
	socket.on('led-status', function (data) 
	{  
		serial.open();
    	if(data===1) 
    	{ 
			serial.write("1");
    	}
		if(data===0) 
		{ 
			serial.write("0"); 
		}
		console.log(serial.read());
		serial.close();
  	});
});