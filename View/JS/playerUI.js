"use strict";

module.exports = class PlayerUI{
	constructor(scoreBox,timeProgressBox,timeLb){
		this.scoreBox = scoreBox;
		this.timeProgressBox = timeProgressBox;
		this.timeLb = timeLb;
		this.stopCounter = 0;
	}

	TimeProgress(value){
		this.timeProgressBox.style.width = value + "%";
	}

	set ScoreBox(value){
		this.scoreBox = value;
	}

	TimeLb(value){
		this.timeLb.innerHTML = value + "s";
	}

	set StopCounter(value){
		if(value == 0 || value == 1){
			this.stopCounter = value;
		}
	}

	//Method
	GetTime(data){
		if(this.stopCounter == 0){
			var data_package = data.split("#");
			this.TimeProgress(data_package[1]);
			this.TimeLb(data_package[0]);
		}
	}
}