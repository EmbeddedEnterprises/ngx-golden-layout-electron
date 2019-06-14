import { app, BrowserWindow, screen, ipcMain } from 'electron';
import * as path from 'path';
import * as url from 'url';
import { triggerAsyncId } from 'async_hooks';

let win, serve;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

function createWindow() {

  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    frame: false,
    width: size.width,
    height: size.height,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
    },
  });

  win.webContents.on('new-window', (event, url: string, frameName, disposition, options, additionalFeatures) => {
    console.log(event, url, frameName, options, additionalFeatures);
    if (url.indexOf("gl-window") >= 0) {
    // open window as modal
      event.preventDefault();
      Object.assign(options, {
        frame: true,
        width: 100,
        height: 100,
        left: 0,
        top: 0,
      });
      event.newGuest = new BrowserWindow(options)
    }
  })

  ipcMain.on('test', (event, arg) => {
    console.log(arg);
    event.returnValue = arg;
  });
  ipcMain.on('test2', (event, arg) => {
    console.log('test2', arg);
    event.returnValue = arg;
  });

  if (serve) {
    require('electron-reload')(__dirname, {
      electron: require(`${__dirname}/node_modules/electron`)
    });
    win.loadURL('http://localhost:4200');
  } else {
    win.loadURL(url.format({
      pathname: path.join(__dirname, 'dist/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  if (serve) {
    win.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });

} catch (e) {
  // Catch Error
  // throw e;
}
