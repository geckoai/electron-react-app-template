import { app, BrowserWindow } from 'electron';
import { winURL } from './util';

// Menu.setApplicationMenu(null);、

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
      devTools: true,
    },
  });

  mainWindow.loadURL(winURL);

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

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
