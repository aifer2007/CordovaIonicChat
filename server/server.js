
var port = process.env.PORT || 3000;

var io = require('socket.io')(port);
var sql = require('mssql');
var connectedUsers = {};

var dbConfig = {
	server: "redacted"
};

sql.connect(dbConfig).then(function(){
	console.log('connected to db');
/*
	new sql.Request().query('SELECT * FROM BaStatus').then(function(recordset){
		console.dir(recordset);
	}).catch(function(err){
		console.log(err);
	});
*/

}).catch(function(err){
	console.log(err);
});

function reloadConnectedUsers(){
	io.sockets.emit('users changed', Object.keys(connectedUsers));
}

//Called on socket creation
io.use(function(socket, next){
	var handshakeData = socket.request;
	var userID = handshakeData._query['userID'];
	socket.userID = userID;
	connectedUsers[userID] = socket;
	next();
});

io.on('connection', function(socket, data){
	console.log('client connected: ' + socket.userID);

	reloadConnectedUsers();

	//query the database for past (25) messages (or just new messages)
	//socket.emit a 'load old messages' signal


	socket.on('retrieve messages', function(data, callback){
		var selectQuery = "SELECT * FROM Chat WHERE ((sender='" + socket.userID +
						"' AND receiver='" + data + "') OR (sender='" + data +
						"' AND receiver='" + socket.userID + "'))";

		new sql.Request().query(selectQuery).then(function(recordset){
			callback(recordset);
		}).catch(function(err){
			console.log(err);
		});
	});

	socket.on('send message', function(data, callback){
		var receiverID = data.userID;
		console.log(receiverID);
		var msg = data.msg;

		// User is online, emit msg and save to database
		if(receiverID in connectedUsers){
			connectedUsers[receiverID].emit('receive message', {userID: socket.userID, msg: msg});
		}
		// User is not online, don't need this else. will save to database either way
		else{
			console.log('user offline');
		}

		// either way, save message to database

		var insertQuery = "INSERT INTO [Chat] ([receiver],[sender],[message]) VALUES('" + receiverID + "','" + socket.userID + "','" + msg + "')";

		new sql.Request().query(insertQuery).then(function(){
			//console.dir(recordset);
		}).catch(function(err){
			console.log(err);
		});

	});

	socket.on('disconnect', function(data){
		if(!socket.userID) return;
		delete connectedUsers[socket.userID];
		console.log('disconnected');

		reloadConnectedUsers();
	});
});

console.log('listening on port ' + port);
