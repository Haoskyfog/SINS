import { useState } from 'react';
import { presetWallpapers } from '../model/presetWallpapers';
import { selectWallpaper } from '../model/wallpaper.api';

export function useSettingsController() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSelectingWallpaper, setIsSelectingWallpaper] = useState(false);
  const [wallpaperBlur, setWallpaperBlur] = useState(10);
  const [wallpaperDataUrl, setWallpaperDataUrl] = useState<string | null>(null);
  const [wallpaperError, setWallpaperError] = useState<string | null>(null);

  async function chooseWallpaper() {
    setIsSelectingWallpaper(true);
    setWallpaperError(null);

    try {
      const wallpaper = await selectWallpaper();

      if (wallpaper) setWallpaperDataUrl(wallpaper.dataUrl);
    } catch (error) {
      setWallpaperError(error instanceof Error ? error.message : '无法设置壁纸');
    } finally {
      setIsSelectingWallpaper(false);
    }
  }

  function chooseDefaultWallpaper() {
    setWallpaperDataUrl(null);
    setWallpaperError(null);
  }

  function choosePresetWallpaper(wallpaperDataUrl: string) {
    setWallpaperDataUrl(wallpaperDataUrl);
    setWallpaperError(null);
  }

  return {
    chooseDefaultWallpaper,
    choosePresetWallpaper,
    chooseWallpaper,
    closeSettings: () => setIsOpen(false),
    isOpen,
    isSelectingWallpaper,
    openSettings: () => setIsOpen(true),
    presetWallpapers,
    setWallpaperBlur: (blur: number) => setWallpaperBlur(blur),
    wallpaperBlur,
    wallpaperDataUrl,
    wallpaperError,
  };
}
