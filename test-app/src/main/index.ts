import { app, BrowserWindow } from 'electron';
import { winURL } from './util';
import path from 'path';

// Menu.setApplicationMenu(null);

// var a: number = '1';

let mainWindow: BrowserWindow | null;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 1080,
    width: 1920,
    useContentSize: true,
    // frame: process.platform !== 'darwin' ? false : true,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#fff',
    // show: false,
    webPreferences: {
      // 此设置运行渲染进程 使用node Api
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL(winURL);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
    app.exit();
  });

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });

  mainWindow.flashFrame(true);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// app.on('activate', () => {
//   if (mainWindow === null) {
//     createWindow();
//   }
// });
