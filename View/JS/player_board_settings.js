var UpdateBoardSignal = {
	NAME_BACK_CLR:0,
	SCORE_BACK_CLR:1,
	NAME_FONT_SIZE:2,
	SCORE_FONT_SIZE:3,
	FONT_COLOR:4,
	SCORE_UPDATE:5,
	LOCK_UPDATE:6,
	UNLOCK_UPDATE:7,
	NAME_UPDATE:8,
	ALARM:9
}

var currentStatus = WDStatus.DEACTIVED; // default
var currentWin = null;
var displaySelected = null;
var displays = electron.screen.getAllDisplays();
var settings_panel_opening = false;

function ChangeColorOfNameArea(){
	document.getElementById("clr-name-input").click();
}

function ChangeColorOfScoreArea(){
	document.getElementById("clr-score-input").click();
}

function SelectDisplayById(){
	var display_id = this.getAttribute("display-id");
	var display_name = this.getAttribute("display-name");

	//find display
	for(var i in displays){
		if(displays[i].id == display_id){
			displaySelected = displays[i];
			break;
		}
	}

	let message = "You selected " + display_name + "(" + displaySelected.bounds.width + "x" + displaySelected.bounds.height + ")";
	document.getElementById("display-selection-message").innerHTML = message;
}

function OpenPlayerBoard(){
	if(currentStatus == WDStatus.DEACTIVED){
		//open player board window
		const path = require('path');
		const windowPath = path.join('file://',__dirname,'../HTML/player-board.html');
		var win = null;

		if(displaySelected == null){
			win = new BrowserWindow({frame:false,fullscreen:true});
		}else{
			win = new BrowserWindow({frame:false,fullscreen:true,x:displaySelected.bounds.x,y:displaySelected.bounds.y});
		}
			
			
		win.on('close',() => {
			currentWin = null;
			f_WD_Closing();
		});

		win.loadURL(windowPath);
		win.show();
		currentWin = win;

		f_WD_Opening();
		let Data = {
			WD_ID:currentWin.id,
			dAta: UpdateBoardSignal.NAME_UPDATE + "*" + clientName
		}

		TransferDataToBoard("update-player-board",Data);
	}
}

function ClosePlayerBoard(){
	const win = BrowserWindow.fromId(currentWin.id);
	win.close();
}

/*Events*/
document.getElementById("clr-name-input").addEventListener('change',function(e){
	if(currentWin != null){
		document.getElementById("clr-name-area").style.backgroundColor = e.target.value;

		let Data = {
			WD_ID: currentWin.id,
			dAta: UpdateBoardSignal.NAME_BACK_CLR + "*" + e.target.value
		}
		TransferDataToBoard("update-player-board",Data);
	}	
},false);

document.getElementById("clr-score-input").addEventListener('change',function(e){
	if(currentWin != null){
		document.getElementById("clr-score-area").style.backgroundColor = e.target.value;

		let Data = {
			WD_ID: currentWin.id,
			dAta: UpdateBoardSignal.SCORE_BACK_CLR + "*" + e.target.value
		}
		TransferDataToBoard("update-player-board",Data);
	}	
},false);

document.getElementById("name-size-input").addEventListener('change',function(e){
	if(currentWin != null){
		let Data = {
		WD_ID: currentWin.id,
		dAta: UpdateBoardSignal.NAME_FONT_SIZE + "*" + e.target.value
		}
		TransferDataToBoard("update-player-board",Data);
	}
},false);

document.getElementById("score-size-input").addEventListener('change',function(e){
	if(currentWin != null){
		let Data = {
		WD_ID: currentWin.id,
		dAta: UpdateBoardSignal.SCORE_FONT_SIZE + "*" + e.target.value
		}
		TransferDataToBoard("update-player-board",Data);
	}	
},false);


document.getElementById("font-color-input").addEventListener('change',function(e){
	if(currentWin != null){
		let Data = {
		WD_ID: currentWin.id,
		dAta: UpdateBoardSignal.FONT_COLOR + "*" + e.target.value
		}
		TransferDataToBoard("update-player-board",Data);
	}
},false);

/*Methods*/
function ToggleDisplayStatus(){
	var deactivedElements =  document.getElementsByClassName("deactived");
	if(deactivedElements.length > 0){
		for(i = 0; i < deactivedElements.length;i++){
			deactivedElements[i].disabled = true;
		}
	}
	
	var activedElements = document.getElementsByClassName("actived");
	if(activedElements.length > 0){
		for(i = 0; i < activedElements.length;i++){
			activedElements[i].disabled = false;
		}
	}
}

function f_WD_Opening(){
	document.getElementById("status-txt").innerHTML = "Opening...";
	document.getElementById("player-board-open-btt").classList.add("deactived");
	document.getElementById("player-board-open-btt").classList.remove("actived");

	document.getElementById("player-board-close-btt").classList.add("actived");
	document.getElementById("player-board-close-btt").classList.remove("deactived");
	currentStatus = WDStatus.OPENING;
	ToggleDisplayStatus();
}

function f_WD_Closing(){
	document.getElementById("status-txt").innerHTML = "Deactived";
	document.getElementById("player-board-open-btt").classList.remove("deactived");
	document.getElementById("player-board-open-btt").classList.add("actived");

	document.getElementById("player-board-close-btt").classList.remove("actived");
	document.getElementById("player-board-close-btt").classList.add("deactived");
	currentStatus = WDStatus.DEACTIVED;
	ToggleDisplayStatus();
}


function UpdateDisplaysInformation(displays_list){
	var count = displays_list.length;

	for(i = 0; i < count;i++){
		var displayComponents = displays_list[i].split('#');
		/*[0] is display name
			[1] is size of the display
		*/

		var bound = displayComponents[1].split("x");
		/*
			bound[0] : width
			bound[1] : height
		*/

		var displayDiv = document.createElement('div');
		displayDiv.classList.add('display');

		var nameOfDisplay = document.createElement('p');
		nameOfDisplay.classList.add('name-of-display');
		nameOfDisplay.innerHTML = displayComponents[0];

		displayDiv.appendChild(nameOfDisplay);

		var selectDiv = document.createElement('div');
		selectDiv.classList.add('select-display-button');

		var selectButton = document.createElement('button');
		selectButton.setAttribute('id','display-config-button-1')
		selectButton.setAttribute("display-id",displays[i].id);
		selectButton.setAttribute("display-name",displayComponents[0]);
		selectButton.addEventListener("dblclick",SelectDisplayById);
		selectButton.innerHTML = displayComponents[1];

		selectDiv.appendChild(selectButton);

		displayDiv.appendChild(selectDiv);

		var displays_area = document.getElementById('displays-list');
		displays_area.appendChild(displayDiv);
	}
}

function DetectDisplays(){
	var displays_area = document.getElementById("displays-list");
	while(displays_area.hasChildNodes()){
		displays_area.removeChild(displays_area.firstChild);
	}

	const {app} = require('electron').remote;

	const displayPr_execute =  app.getAppPath() + "\\graphics_information.exe";

	const {spawn} = require('child_process');
	const bat = spawn(displayPr_execute);

	var result = "";
	bat.stdout.on('data',(data)=>{
		var stringHelper = require("../JS/Module/stringHelper.js");
		result = stringHelper.convertAsciiArrayToText(data);
		result = result.substring(0,result.length - 1);
		UpdateDisplaysInformation(result.split("-"));
	});
}

/*RUN WHEN INIT*/
DetectDisplays();