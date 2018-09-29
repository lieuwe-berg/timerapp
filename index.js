const { app, BrowserWindow, Menu } = require('electron');
const { autoUpdater } = require("electron-updater")

const url = require('url');
const path = require('path');

let win;

let menuTemplate = [{
    label: 'Dev Tools',
    submenu: [
        {
            role: 'reload'
        }
    ]
}]

function sendStatusToWindow(text) {
    win.webContents.send('message', text);
}

function createDefaultWindow() {

    win = new BrowserWindow({
       // width: 800,
       // height: 600,
        title: 'Timer App'
    })
    win.setMenu(null);

    win.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }));
    
}

autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
});

app.on('ready', function() {
    autoUpdater.checkForUpdatesAndNotify();

    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  
    createDefaultWindow();
  });


app.on('window-all-closed', () => {
    app.quit();
})
