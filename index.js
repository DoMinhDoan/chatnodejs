var app = require('express')();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var io = require('socket.io')(http);
var shortId = require('shortid');
var players = [];


app.get('/', function(req, res){
	// res.send('<h1>Hello World</h1>');
	res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
	var thisPlayerId = shortId.generate();
	console.log('a user connected: ' + thisPlayerId);
	
	players[thisPlayerId] = thisPlayerId;
	socket.emit('connection', thisPlayerId);
	
	io.emit('connected', 'a user connected: ' + thisPlayerId);
	
	var userStr = '';
	for(var playerId in players){
		userStr = userStr + playerId + ' ';
	};
	io.emit('online', 'Online users : ' + userStr);
	
	socket.on('disconnect', function(){
		console.log('a user disconnected');
		socket.broadcast.emit('disconnected', 'a user disconnected: ' + thisPlayerId);
		
		delete  players[thisPlayerId];		
	});
	socket.on('chat message', function(msg){
		console.log('message: ' + msg + '---' + thisPlayerId);
		socket.broadcast.emit('chat message', thisPlayerId + ': ' + msg);
	});
	
	socket.on('typing', function(){
		console.log('typing: ' + thisPlayerId);
		socket.broadcast.emit('typing', thisPlayerId + ' is typing');
	});
	
	socket.on('untyping', function(){
		console.log('untyping: ' + thisPlayerId);
		socket.broadcast.emit('untyping');
	});
})

http.listen(port, function(){
	console.log('Listening on *:' + port);
})

