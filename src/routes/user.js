/*
 * GET users listing.
 */

var redis = require("redis"),
	client1 = redis.createClient(),
	client2 = redis.createClient(),
	msg_count = 0;



var EventEmitter = require('events').EventEmitter;

var evt = new EventEmitter();
evt.setMaxListeners(0);

client1.on("subscribe", function(channel, count) {
	console.log('read msg', channel, count);
});
client1.on("message", function(channel, message) {
	console.log("client1 channel " + channel + ": " + message);
	evt.emit(channel, message);
});

exports.sub = function(req, res) {
	var id = (req.param('id'));
	var callback = (req.param('callback'));
	var t = client1.subscribe(id);
	var fun=function(msg) {
		clearTimeout(time_fp);
		console.log('read ok', msg);
		if(callback){
			msg=callback+"("+JSON.stringify(msg)+")";
		}
		res.send(msg);

	}

	var time_fp = setTimeout(function() {
		evt.removeListener(id, fun)
		clearTimeout(time_fp);
		var msg='timeout';
		if(callback){
			msg=callback+"("+JSON.stringify(msg)+")";
		}
		return res.send(msg);

	},30000)


	evt.once(id,fun)

};

exports.pub = function(req, res) {
	var id = req.param("id");
	var msg = req.param("msg");
	var callback = (req.param('callback'));

	if (!id || !msg) {
		if(callback){
			msg='error param';
			msg=callback+"("+JSON.stringify(msg)+")";
		}
		return res.send(msg);
	}
	client2.publish(id, msg);
	msg='ok';
	if(callback){
			msg=callback+"("+JSON.stringify(msg)+")";
	}


	res.send(msg);
};