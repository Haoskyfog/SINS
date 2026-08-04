import type { WallpaperImage } from '@sins/contracts';

export async function selectWallpaper(): Promise<WallpaperImage | null> {
  if (!window.sins) throw new Error('本地设置服务不可用');

  const result = await window.sins.selectWallpaper(crypto.randomUUID());

  if (!result.ok) throw new Error(result.error.message);

  return result.data;
}
