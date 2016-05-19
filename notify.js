/**
 * Created by dongvan on 08/01/2015.
 */

var app = require('http').createServer(handler),
    // io = require('/home/thinhdv/node_modules/socket.io').listen(app),
    io  = require('socket.io').listen(app),
    url = require('url')
app.listen(8080);

function handler (req, res, next) {

  /*var origin;
    origin = req.header('Origin', '*');
    if (origin === 'null') {
        origin = '*';
    }
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Requested-With, X-Session-Id');
    res.header('Access-Control-Expose-Headers', 'Location, X-Session-Id');*/
    
// parse URL
    var requestURL = url.parse(req.url, true);
    // console.log('requestURL', requestURL.query);
// if there is a message, send it
    if(requestURL.query.message && requestURL.query.user_id)
        sendMessage(decodeURI(requestURL.query.message),decodeURI(requestURL.query.user_id));

// end the response
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("");
}

function sendMessage(message, user_id) {
    io.sockets.emit('notification_'+user_id, {'message': message});

}

// emit when event create ticket from user
io.sockets.on('connection',function(socket){

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
    io.sockets.emit('changeStatus', data);
  });

  socket.on("changeComment", function (data) {
    console.log('data-changeComment', data);
    io.sockets.emit('changeComment', data);
  });

  socket.on("changeStatusVersion", function (data) {
      io.sockets.emit('changeStatusVersion', data);
  });

  socket.on("changeAttachment", function (data) {
      io.sockets.emit('changeAttachment', data);
  });

  socket.on("dataStep", function (data) {
      io.sockets.emit('dataStep', data);
  });

  socket.on("dataTask", function (data) {
      io.sockets.emit('dataTask', data);
  });

});

console.log('Server listening at port ', 8080);