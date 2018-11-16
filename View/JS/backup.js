"use strict";

/*INIT*/

//set hotkeys
document.getElementById("answer-input").addEventListener('keyup',function(e){
	e.preventDefault();

	if(e.keyCode === 13){
		sendAnswer();
	}
},false);

var panelEnum = {
	DEFAULT_PANEL:1,
	LOCK_PANEL:2,
	SETTINGS_PANEL:3
}

var currentPanel = panelEnum.DEFAULT_PANEL;
var oldPanel = null;

document.getElementById("clr-name-input").addEventListener('change',function(e){
	document.getElementById("clr-name-area").style.backgroundColor = e.target.value;
},false);

document.getElementById("clr-score-input").addEventListener('change',function(e){
	document.getElementById("clr-score-area").style.backgroundColor = e.target.value;
},false);


var displays = 
/*EVENTS*/
function ChangeColorOfNameArea(){
	document.getElementById("clr-name-input").click();
}

function ChangeColorOfScoreArea(){
	document.getElementById("clr-score-input").click();
}

function showPanelById(panel_id){
	if(currentPanel != oldPanel){
		if(currentPanel != panelEnum.DEFAULT_PANEL){
		$("#pn" + currentPanel).css("z-index","0");
		$("#pn" + currentPanel).css("display","none");
		$("#pn" + panel_id).css("z-index","1");
		$("#pn" + panel_id).css("display","block");		
		}else{
			$("#pn" + panel_id).css("z-index","1");
			$("#pn" + panel_id).css("display","block");
		}

		currentPanel = panel_id;
		oldPanel = currentPanel;
		console.log("Lock Panel");
	}	
}

function controlPanelById(panelID,controlKey){
	$("#pn" + panelID).css("display",controlKey);
}

var settings_panel_opening = false;

function showSettingsPanel(){
	if(!settings_panel_opening){
		showPanelById(3);
		settings_panel_opening = true;
	}else{
		backtoDefaultPanel();
		settings_panel_opening = false;
	}
}

function sendAnswer(){
	var answerContent = document.getElementById("answer-input").value;
	client.sendAnswer(answerContent);
}


function sendAlarm(){
	client.sendAlarm();
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
function backtoDefaultPanel(){
	if(currentPanel != panelEnum.DEFAULT_PANEL){
		controlPanelById(currentPanel,"none");
		oldPanel = currentPanel;
		currentPanel = panelEnum.DEFAULT_PANEL;
	}else{
		if(oldPanel != null){
			showPanelById(oldPanel);
			currentPanel = oldPanel;
		}
	}
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

DetectDisplays();