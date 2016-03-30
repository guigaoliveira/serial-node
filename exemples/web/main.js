$(function()
{
	var socket = io.connect('http://localhost');
	$("#on").click(function(e)
	{ 
		console.log("on");
		socket.emit('led-status',1);
	});
	$("#off").click(function(e)
	{
		console.log("off");
		socket.emit('led-status',0);
	});
	/*socket.on('disconnect', function() {
        socket.disconnect();
    });*/
});