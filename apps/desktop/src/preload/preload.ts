import { contextBridge, ipcRenderer } from 'electron';
import type { AppApi } from '@sins/contracts';

const api: AppApi = {
  getInfo: (requestId) => ipcRenderer.invoke('app:get-info', requestId),
  selectWallpaper: (requestId) => ipcRenderer.invoke('settings:select-wallpaper', requestId),
};

contextBridge.exposeInMainWorld('sins', api);
