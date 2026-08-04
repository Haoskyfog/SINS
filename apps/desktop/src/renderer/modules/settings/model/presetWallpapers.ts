export type PresetWallpaper = {
  dataUrl: string;
  id: string;
  label: string;
};

const presetWallpaperModules = import.meta.glob(
  '../../../assets/wallpapers/*.{avif,gif,jpeg,jpg,png,webp}',
  { eager: true, import: 'default', query: '?url' },
) as Record<string, string>;

export const presetWallpapers: PresetWallpaper[] = Object.entries(presetWallpaperModules)
  .map(([filePath, dataUrl]) => {
    const fileName = filePath.split('/').at(-1) ?? filePath;
    const id = fileName.replace(/\.[^.]+$/, '');

    return {
      dataUrl,
      id,
      label: id.replace(/[-_]/g, ' '),
    };
  })
  .sort((first, second) => first.label.localeCompare(second.label));
