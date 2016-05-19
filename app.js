/**
 * Cash info class
 *
 * @author daotrancong@vccorp.vn
 */
 
// Creating an express server
var express 	 = require('express'),
	app          = express(),
	redis        = require('redis'),
	exec         = require('child_process').exec,
	client       = redis.createClient('6685', '172.16.11.24'),
	ticket       = redis.createClient('6688', '172.16.11.24'),
	notification = redis.createClient('6687', '172.16.11.28');

client.subscribe('push_facebook_chanel');

client.on('message', function (channel, message){
	switch(message) {

	    case 'ok':
	    	var cmd  = 'php ../schedulers/system.php Ads FacebookCampaignPusher';
			exec(cmd, function(error, stdout, stderr) {
			  // console.log(error,stdout,stderr);
			});    
	        break;

	    case 'audiences':
	        var cmd  = 'php ../schedulers/system.php Ads PushAudiences';
			exec(cmd, function(error, stdout, stderr) {
			  // console.log(error,stdout,stderr);
			});
	        break;
	        
	    default:
	        // default code block
	}
});

ticket.subscribe('add_tiket_cc');

ticket.on('message', function (channel, message){
	if(message == 'ok') {
		var cmd  = 'php ../schedulers/system.php Report Addticket';
		exec(cmd, function(error, stdout, stderr) {
		  // console.log(error,stdout,stderr);
		});
	}
});

notification.subscribe('push_notify');

notification.on('message', function (channel, message){
	if(message == 'send') {
		var cmd  = 'php /data/webroot/dev_developer_shg_vn_85/schedulers/system.php Execution NotifyUser';
		exec(cmd, function(error, stdout, stderr) {
		  console.log('notification : ', error, stdout, stderr);
		});
	}
});

/*

ticket.on('message', function (channel, message){
	if(message == 'login') {
		var cmd  = 'php ../schedulers/system.php Loglogin Insert';
		exec(cmd, function(error, stdout, stderr) {
			//if(error)
				console.log(error,stdout,stderr);
		});
	}
});

*/



// This is needed if the app is run on heroku and other cloud providers:

var port = process.env.PORT || 1111;

// App Configuration

// Make the files in the public folder available to the world
app.use(express.static(__dirname + '/public'));

console.log('Your application is running on http://localhost:' + port);
