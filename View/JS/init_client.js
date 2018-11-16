var clientNet = require('../JS/Module/network.js');
var client = new clientNet();
var clientName =  "";
var currentLock = 0;
var lockAlarmStatus = false;

var receiveSignal = {
	LOCK:"1",
	UNLOCK:"2",
	SCORE:"3",
	TIME:"4",
	DISALR:"5",
	UNDISALR:"6"
}

const {ipcRenderer} = require('electron');

ipcRenderer.on('init-client',(events,arg) => {
	client.connectToServer(arg.port,arg.ip,arg.username,arg.id);
	clientName = arg.username;
	document.getElementById("clr-name-area").innerHTML = arg.username;
});

client.eventEmitter.on('send-abroad',function(data){
	var toggleControlElement = function(isTurnOn){
		document.getElementById('send-answer-btt').disabled = isTurnOn;
		document.getElementById('send-alarm-btt').disabled = isTurnOn;
		document.getElementById('answer-input').disabled = isTurnOn;
	}

	var elements = data.split("*");
	var signal = elements[0];
	var value = elements[1];

	switch(signal){
		case receiveSignal.LOCK:
			if(currentLock == 0){
				toggleControlElement(true);
		
				var lock_sign = document.getElementById("lock-sign");
				lock_sign.classList.remove("unlock");
				lock_sign.classList.add("lock");
				showPanelById(2);
				currentLock = 1;
			}
			break;

		case receiveSignal.UNLOCK:
			if(currentLock == 1){
				toggleControlElement(false);
			
				var lock_sign = document.getElementById("lock-sign");
				lock_sign.classList.remove("lock");
				lock_sign.classList.add("unlock");
				backtoDefaultPanel();
				currentLock = 0;
			}
			break;

		case receiveSignal.SCORE:
			document.getElementById("current-score").innerHTML = value;

			if(currentWin != null){
				let Data = {
					WD_ID:currentWin.id,
					dAta:UpdateBoardSignal.SCORE_UPDATE + "*" + value
				}
				TransferDataToBoard("update-player-board",Data);
			}	
			break;

		case receiveSignal.TIME:
			var data_package = value.split("#");
			playerUI.TimeProgress(data_package[1]);
			playerUI.TimeLb(data_package[0]);
			break;

		case receiveSignal.DISALR:
			var alarm_btt = document.getElementById("send-alarm-btt");
			lockAlarmStatus = true;

			//clear class
			alarm_btt.classList.remove("actived");
			alarm_btt.classList.remove("deactived");

			alarm_btt.classList.add("deactived");
			break;

		case receiveSignal.UNDISALR:
			var alarm_btt = document.getElementById("send-alarm-btt");
			lockAlarmStatus = false;
			
			//clear class
			alarm_btt.classList.remove("actived");
			alarm_btt.classList.remove("deactived");

			alarm_btt.classList.add("actived");
			break;
	}
});

const playerUI_MD = require("../JS/playerUI");
var playerUI = new playerUI_MD(document.getElementById("current-score"),document.getElementById("progressBar"),document.getElementById("current-time"));
