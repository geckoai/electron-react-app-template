export function sendMessage(data: { type: string; msg: string }) {
  if (process.env.APP_RUNTIME_ENV === 'electron') {
    const electron = require('electron');
    electron.ipcRenderer.send('message', data);
  }
}
