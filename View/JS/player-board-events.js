"use strict";

var UpdateBoardSignal = {
	NAME_BACK_CLR:"0",
	SCORE_BACK_CLR:"1",
	NAME_FONT_SIZE:"2",
	SCORE_FONT_SIZE:"3",
	FONT_COLOR:"4",
	SCORE_UPDATE:"5",
	LOCK_UPDATE:"6",
	UNLOCK_UPDATE:"7",
	NAME_UPDATE:"8",
	ALARM:"9"
}

const {ipcRenderer} = require('electron');

var background_color = "white";

ipcRenderer.on('update-player-board',(event,arg) => {
	var elements = arg.dAta.split("*");
	var signal = elements[0];
	var value = elements[1];

	switch(signal){
		case UpdateBoardSignal.NAME_BACK_CLR:
		document.getElementById("name-area").style.backgroundColor = value;
		break;

		case UpdateBoardSignal.SCORE_BACK_CLR:
		document.getElementById("score-area").style.backgroundColor = value;
		background_color = value;
		break;

		case UpdateBoardSignal.NAME_FONT_SIZE:
		document.getElementById("name-text").style.fontSize = value + "em";
		break;
		
		case UpdateBoardSignal.SCORE_FONT_SIZE:
		document.getElementById("score-text").style.fontSize = value + "em";
		break;

		case UpdateBoardSignal.FONT_COLOR:
		document.getElementById("score-text").style.color = value;
		document.getElementById("name-text").style.color = value;
		break;

		case UpdateBoardSignal.SCORE_UPDATE:
		document.getElementById("score-text").innerHTML = value;
		break;

		case UpdateBoardSignal.NAME_UPDATE:
		document.getElementById("name-text").innerHTML = value;
		break;

		case UpdateBoardSignal.ALARM:
		document.getElementById("score-area").style.background = "#e74c3c";
		setTimeout(function(){
			document.getElementById("score-area").style.background = background_color;
		},1500);
		break;
	}
});