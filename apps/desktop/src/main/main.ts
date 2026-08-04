import { app, BrowserWindow, dialog, ipcMain, nativeImage } from 'electron';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import started from 'electron-squirrel-startup';
import type { AppInfo, IpcResult, WallpaperImage } from '@sins/contracts';

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

const wallpaperMimeTypes: Record<string, string> = {
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};
const maximumWallpaperBytes = 12 * 1024 * 1024;

function isValidRequestId(requestId: unknown): requestId is string {
  return typeof requestId === 'string' && requestId.length > 0 && requestId.length <= 128;
}

function invalidRequestResult(): IpcResult<never> {
  return {
    ok: false,
    requestId: 'invalid-request',
    error: { code: 'IPC_INVALID_REQUEST', message: '请求格式无效', retryable: false },
  };
}

ipcMain.handle('app:get-info', (_event, requestId: unknown) => {
  if (!isValidRequestId(requestId)) return invalidRequestResult();

  return getAppInfo(requestId);
});

ipcMain.handle('settings:select-wallpaper', async (event, requestId: unknown): Promise<IpcResult<WallpaperImage | null>> => {
  if (!isValidRequestId(requestId)) return invalidRequestResult();

  const window = BrowserWindow.fromWebContents(event.sender);

  if (!window) {
    return {
      ok: false,
      requestId,
      error: { code: 'SETTINGS_WINDOW_NOT_FOUND', message: '无法打开图片选择器', retryable: true },
    };
  }

  const selection = await dialog.showOpenDialog(window, {
    title: '选择壁纸图片',
    properties: ['openFile'],
    filters: [{ name: '图片', extensions: ['avif', 'gif', 'jpg', 'jpeg', 'png', 'webp'] }],
  });

  if (selection.canceled || selection.filePaths.length === 0) {
    return { ok: true, requestId, data: null };
  }

  const filePath = selection.filePaths[0];
  const extension = path.extname(filePath).toLowerCase();
  const mimeType = wallpaperMimeTypes[extension];

  if (!mimeType) {
    return {
      ok: false,
      requestId,
      error: { code: 'SETTINGS_INVALID_IMAGE_TYPE', message: '请选择支持的图片格式', retryable: true },
    };
  }

  try {
    const fileStats = await stat(filePath);

    if (!fileStats.isFile() || fileStats.size > maximumWallpaperBytes) {
      return {
        ok: false,
        requestId,
        error: { code: 'SETTINGS_INVALID_IMAGE_SIZE', message: '图片文件无效或超过 12 MB', retryable: true },
      };
    }

    const fileData = await readFile(filePath);

    if (nativeImage.createFromBuffer(fileData).isEmpty()) {
      return {
        ok: false,
        requestId,
        error: { code: 'SETTINGS_INVALID_IMAGE_CONTENT', message: '所选文件不是有效图片', retryable: true },
      };
    }

    return {
      ok: true,
      requestId,
      data: { dataUrl: `data:${mimeType};base64,${fileData.toString('base64')}` },
    };
  } catch {
    return {
      ok: false,
      requestId,
      error: { code: 'SETTINGS_IMAGE_READ_FAILED', message: '无法读取所选图片', retryable: true },
    };
  }
});

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 960,
    minHeight: 640,
    title: 'SINS',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
