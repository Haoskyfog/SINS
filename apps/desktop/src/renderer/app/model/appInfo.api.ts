import type { AppInfo } from '@sins/contracts';

export async function loadAppInfo(requestId: string): Promise<AppInfo> {
  if (!window.sins) throw new Error('本地桥接仅在 Electron 中可用');

  const result = await window.sins.getInfo(requestId);

  if (!result.ok) throw new Error(result.error.message);

  return result.data;
}
