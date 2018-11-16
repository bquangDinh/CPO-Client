module.exports = class Client{
	constructor(){
		/*Init Events*/
        var event = require('events');
        this.eventEmitter = new event.EventEmitter();
	}

	connectToServer(port,ip,username,id){
		const net = require('net');
		var client = new net.Socket();

		client.connect(port,ip,function(){

			//send config of client to server
			 client.write("PLM#ASSI^" + (id-1) + "^" + username);
		});
		
		var that = this;
		client.on('data',function(data){
			var stringHelper = require('../Module/stringHelper.js');
			data = stringHelper.convertAsciiArrayToText(data);
			that.eventEmitter.emit("send-abroad",data);
		});

		this.client = client;
		this.username = username;
		this.id = id;
	}

	sendAnswer(answerContent){

		var data = "PLM#" + (this.id - 1) + "^GCTL^" + answerContent; 
		this.client.write(data);
	}

	sendAlarm(){
		var data = "PLM#" + (this.id - 1) + "^GC^";
		this.client.write(data);
	}

}