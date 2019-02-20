const electron = require('electron');
const url = require('url');
const path = require('path');
const{app, BrowserWindow, Menu} = electron; //  decomposition

let mainWindow;
let addWindow;

app.on('ready', () => {
    mainWindow = new BrowserWindow({});
    
    //  Pass file://dirname/mainWindow.html into loadURL
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    //  Quit any other windows when you close main window
    mainWindow.on('closed', () => {
        app.quit();
    });
    setMainMenu();
});

function setMainMenu() {
    const template = [{
        label: 'File',
        submenu: [
            {
                label: 'Add Item',
                accelerator: process.platform == 'darwin' ? 'Command+A' : 'Ctrl+A',
                click() {
                    createAddWindow();
                }
            },
            {
                label: 'Clear Items'
            },
            {
                label: 'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }];
    addDeveloperToolsMenuItem(template);
    //  Fix File menu for Mac, without getting blank space on Windows
    if (process.platform == 'darwin') {
        template.unshift({label:''});   //  push to the front of the array (opposite of array.push())
    }
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

function createAddWindow() {
    addWindow = new BrowserWindow({width:300, height:200, title:'Add Shopping List Item'});
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));
    //  Garbage collection
    addWindow.on('close', () => {
        addWindow = null;
    });
}

function addDeveloperToolsMenuItem(template) {
    if (process.env.NODE_ENV !== 'production') {
        template.push({
            label: 'Developer Tools',
            submenu: [
                {
                    label: 'Toggle DevTools',
                    accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                    click(item, focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
                {
                    role: 'reload'
                }
            ]
        });
    }
}

