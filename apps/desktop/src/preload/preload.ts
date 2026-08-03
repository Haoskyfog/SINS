import { contextBridge, ipcRenderer } from 'electron';
import type { AppApi } from '@sins/contracts';

const api: AppApi = {
  getInfo: (requestId) => ipcRenderer.invoke('app:get-info', requestId),
};

contextBridge.exposeInMainWorld('sins', api);
