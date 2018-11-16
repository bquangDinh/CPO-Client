const {app, BrowserWindow} = require('electron');
const {ipcMain} = require('electron');

let mainWindow;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 500, height: 400, frame: false,resizable:false});

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/View/HTMl/set-up-client-page.html');

  ipcMain.on('config-server',(event,arg) => {
  const win = BrowserWindow.fromId(2);
  console.log("Win 2 " + win.getSize());

  win.webContents.on('did-finish-load',function(){
    win.webContents.send('init-client',arg);
    console.log("Main : " + arg.ip + " " + arg.port + " " + arg.username + " " + arg.id);
  });
  
  });

  ipcMain.on('update-player-board',(event,arg) => {
    const win = BrowserWindow.fromId(arg.WD_ID);

   if(arg.dAta.split("*")[0] == "8"){
      win.webContents.on('did-finish-load',function(){
        win.webContents.send("update-player-board",arg);
      });
   }else{
      win.webContents.send('update-player-board',arg);
   }
    console.log(arg);
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
});

