"use strict";

var panelEnum = {
	DEFAULT_PANEL:1,
	LOCK_PANEL:2,
	SETTINGS_PANEL:3
}

var currentPanel = panelEnum.DEFAULT_PANEL;
var oldPanel = null;

var WDStatus = {
	OPENING:0,
	DEACTIVED:1
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
	}	
}

function showSettingsPanel(){
	if(currentLock == 0){
		if(!settings_panel_opening){
			showPanelById(3);
			settings_panel_opening = true;
		}else{
			backtoDefaultPanel();
			settings_panel_opening = false;
		}
	}	
}

function controlPanelById(panelID,controlKey){
	$("#pn" + panelID).css("display",controlKey);
}

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