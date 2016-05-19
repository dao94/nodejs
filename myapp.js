// app.js

var express = require('express');  
var app     = express();  
var server  = require('http').createServer(app);  
var io      = require('socket.io')(server);
var url     = require('url');
var logger  = require('morgan');

io.set('origins', '*:*');

app.use(logger('dev'));

/*app.use(function(req, res, next) {
   var origin;
    origin = req.header('Origin', '*');
    if (origin === 'null') {
        origin = '*';
    }
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, X-Session-Id');
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Max-Age', 86400);
        return res.send(200);
    } else {
        return next();
    }
});*/

app.get('/', function(req, res, next) {  
	// parse URL
    var requestURL = url.parse(req.url, true);
    // console.log('requestURL', requestURL.query);
// if there is a message, send it
    if(requestURL.query.message && requestURL.query.user_id)
        sendMessage(decodeURI(requestURL.query.message),decodeURI(requestURL.query.user_id));

// end the response
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("");
});

function sendMessage(message, user_id) {
    io.sockets.emit('notification_'+user_id, {'message': message});

}

// emit when event create ticket from user
io.sockets.on('connection',function(socket){

  console.log('have a connected with socket server !');

  socket.on('create', function(res){
    io.emit('newsticket',res)
    // console.log('Received expression from client ',res);
  });

  socket.on('disconnect', function(){
    // console.log('Disconnected');
  });

  socket.on("message",function(data){
      io.sockets.emit('message',data);
  });

  socket.on("changeStatus", function (data) {
    console.log('data-changeStatus', data);
      socket.broadcast.emit('changeStatus', data);
  });

  socket.on("changeComment", function (data) {
    console.log('data-changeComment', data);
      socket.broadcast.emit('changeComment', data);
  });

  socket.on("changeStatusVersion", function (data) {
      socket.broadcast.emit('changeStatusVersion', data);
  });

  socket.on("changeAttachment", function (data) {
      socket.broadcast.emit('changeAttachment', data);
  });

  socket.on("dataStep", function (data) {
      socket.broadcast.emit('dataStep', data);
  });

  socket.on("dataTask", function (data) {
      socket.broadcast.emit('dataTask', data);
  });

});

server.listen(1111); 

console.log('Server listening at port ', 1111); 
