import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import type { AppInfo, IpcResult } from '@sins/contracts';

if (started) {
  app.quit();
}

const getAppInfo = (requestId: string): IpcResult<AppInfo> => ({
  ok: true,
  requestId,
  data: {
    name: 'SINS',
    version: app.getVersion(),
    platform: process.platform,
  },
});

ipcMain.handle('app:get-info', (_event, requestId: unknown) => {
  if (typeof requestId !== 'string' || requestId.length === 0 || requestId.length > 128) {
    return {
      ok: false,
      requestId: 'invalid-request',
      error: { code: 'IPC_INVALID_REQUEST', message: '请求格式无效', retryable: false },
    } satisfies IpcResult<never>;
  }

  return getAppInfo(requestId);
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'SINS',
    webPreferences: {
      preload: path.join(__dirname, '../preload/preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));

  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    void mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    void mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }
};

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
