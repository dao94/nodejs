/**
 * Cash info class
 *
 * @author daotrancong@vccorp.vn
 */

var express = require('express'),
    http    = require('http');
var app     = express();
var server  = app.listen(3000);
var io      = require('socket.io').listen(server);

io.sockets.on('connection',function(socket){

  socket.on('create', function(res){
    io.emit('newsticket
    	',res)
    console.log('Received expression from client ',res);
  });

  socket.on('disconnect', function(){
    console.log('Disconnected');
  });

});

console.log("Express server listening on port 3000");