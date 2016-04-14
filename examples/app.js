var express = require('express');
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var SerialPort= require('../serial-node'), serial = new SerialPort();
app.use(express.static(__dirname + '/web'));
server.listen(80, function() {console.log("Server Online");});
io.on('connection', function (socket) 
{  
	serial.use('com3'); // configure your serial port or list(); 
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
