const http = require('./http');
const { app, BrowserWindow, Menu, desktopCapturer, ipcMain } = require("electron");
const path = require("path");

const { appConfig } = require('./config');
const port = appConfig.port || 8080;


http.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        minWidth: 1280,
        minHeight: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })
    win.webContents.openDevTools();
    win.loadFile(path.join(__dirname, 'views/index.html'));
    // win.loadURL(`http://localhost:${port}/index.html`);

}

app.whenReady().then(() => { 
    // The Main Window
    createWindow()

    ipcMain.on('message', (e, data) => {
        console.log(data)
    });
    
    ipcMain.handle("ip:address", async () => {
        console.log(appConfig.host);
        const ip = appConfig.host;
        return ip;
    })

    ipcMain.handle("set:sourse", async () => {
        const decives = (await desktopCapturer.getSources({ types: ['window', 'screen'] })).map(item => {
          return {
            id: item.id,
            name: item.name,
          }
        });
        return decives;
    })
    app.on('window-all-closed', () => {
        console.log("closed!");
        if (process.platform !== 'darwin') app.quit();
    })
})


// Menu Template
const templateMenu = []
templateMenu.push({
    label: 'DevTools',
    submenu: [
        {
            label: 'Show/Hide Dev Tools',
            accelerator: process.platform == 'darwin' ? 'Comand+D' : 'Ctrl+D',
            click(item, focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
        {
            role: 'reload'
        }
    ]
})

const mainMenu = Menu.buildFromTemplate(templateMenu);
// Set The Menu to the Main Window
Menu.setApplicationMenu(mainMenu);