"use strict";
/*INITS*/
const {remote} = require('electron');
const {BrowserWindow} = remote;
const electron = require('electron');
const app = require('electron').remote.app;


//set hotkeys
document.getElementById("answer-input").addEventListener('keyup',function(e){
	if(e.keyCode === 13){
		sendAnswer();	
	}
},false);

/*EVENTS*/
function sendAnswer(){
	var answerContent = document.getElementById("answer-input").value;
	client.sendAnswer(answerContent);
	alert("Gửi thành công");
}

function sendAlarm(){
	console.log(_lockAlarm);
	if(lockAlarmStatus == false){
		console.log("Send Alarm");
		client.sendAlarm();
	}
	console.log("Unsend Alarm");
	
	//lock alarm interval seconds
	LockAlarm();
}

function closeWindow(){
	//Exit App
	const {remote} = require('electron');
	remote.BrowserWindow.getFocusedWindow().close();
}

function minimizeWindow(){
	const {remote} = require('electron');
	remote.BrowserWindow.getFocusedWindow().minimize();
}


/*METHODS*/
function TransferDataToBoard(channel,data){
	const {ipcRenderer} = require('electron');
	ipcRenderer.send(channel,data);
}

function ToggleAlarmActive(value){
	var alarm_btt = document.getElementById("send-alarm-btt");

	if(value == 1){
		alarm_btt.disabled = true;

		//clear class
		alarm_btt.classList.remove("actived");
		alarm_btt.classList.remove("deactived");

		alarm_btt.classList.add("deactived");
	}else{
		alarm_btt.disabled = false;

		//clear class
		alarm_btt.classList.remove("actived");
		alarm_btt.classList.remove("deactived");

		alarm_btt.classList.add("actived");
	}
}


class lockAlarm{
	SendData(data){
		document.getElementById("alarm-progress-bar").style.width = data.percentage + "%";

		if(data.percentage == 0){
			var alarm_btt = document.getElementById("send-alarm-btt");
			alarm_btt.disabled = false;

			//clear class
			alarm_btt.classList.remove("actived");
			alarm_btt.classList.remove("deactived");

			alarm_btt.classList.add("actived");
		}
	}
}

var _lockAlarm = new lockAlarm();

var timeCountdown_MD = require("../JS/Module/TimeCountDown.js");
var timeCountdown = new timeCountdown_MD(_lockAlarm);
timeCountdown.SetTime(1.5); // one second

function LockAlarm(){
	ToggleAlarmActive(1);
	timeCountdown.Start();
}
