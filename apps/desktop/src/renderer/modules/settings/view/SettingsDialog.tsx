import type { PresetWallpaper } from '../model/presetWallpapers';

type SettingsDialogProps = {
  isOpen: boolean;
  isSelectingWallpaper: boolean;
  wallpaperBlur: number;
  wallpaperDataUrl: string | null;
  wallpaperError: string | null;
  presetWallpapers: PresetWallpaper[];
  onClose: () => void;
  onSelectDefaultWallpaper: () => void;
  onSelectPresetWallpaper: (wallpaperDataUrl: string) => void;
  onSelectWallpaper: () => void;
  onWallpaperBlurChange: (blur: number) => void;
};

export function SettingsDialog({
  isOpen,
  isSelectingWallpaper,
  wallpaperBlur,
  wallpaperDataUrl,
  wallpaperError,
  presetWallpapers,
  onClose,
  onSelectDefaultWallpaper,
  onSelectPresetWallpaper,
  onSelectWallpaper,
  onWallpaperBlurChange,
}: SettingsDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="settings-overlay" role="presentation" onMouseDown={onClose}>
      <section
        aria-labelledby="settings-title"
        aria-modal="true"
        className="settings-dialog"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
      >
        <aside className="settings-sidebar" aria-label="设置分类">
          <div className="settings-sidebar-title">设置</div>
          <button className="settings-nav-item active" type="button">自定义壁纸</button>
        </aside>
        <div className="settings-content">
          <div className="settings-header">
            <div>
              <p className="eyebrow">APPEARANCE</p>
              <h2 id="settings-title">自定义壁纸</h2>
            </div>
            <button aria-label="关闭设置" className="dialog-close-button" onClick={onClose} type="button">关闭</button>
          </div>
          <div className="wallpaper-preview" style={wallpaperDataUrl ? { backgroundImage: `url("${wallpaperDataUrl}")` } : undefined}>
            {!wallpaperDataUrl && <span>尚未选择图片</span>}
          </div>
          <div className="wallpaper-actions">
            <button className="wallpaper-select-button" disabled={isSelectingWallpaper} onClick={onSelectWallpaper} type="button">
              {isSelectingWallpaper ? '正在打开选择器...' : '选择本机图片'}
            </button>
            <label className="wallpaper-blur-control">
              <span>背景模糊度 <output>{wallpaperBlur}px</output></span>
              <input
                aria-label="背景模糊度"
                max="24"
                min="0"
                onChange={(event) => onWallpaperBlurChange(Number(event.target.value))}
                step="1"
                type="range"
                value={wallpaperBlur}
              />
            </label>
            {wallpaperError && <p className="wallpaper-error" role="alert">{wallpaperError}</p>}
          </div>
          <section className="default-wallpapers" aria-labelledby="default-wallpapers-title">
            <h3 id="default-wallpapers-title">默认背景</h3>
            <div className="preset-wallpaper-grid">
              <button
                aria-pressed={!wallpaperDataUrl}
                className={`preset-wallpaper-card ${!wallpaperDataUrl ? 'active' : ''}`}
                onClick={onSelectDefaultWallpaper}
                type="button"
              >
                <span className="preset-wallpaper-thumbnail default-wallpaper-thumbnail" />
                <span>默认浅色</span>
              </button>
              {presetWallpapers.map((wallpaper) => (
                <button
                  aria-pressed={wallpaperDataUrl === wallpaper.dataUrl}
                  className={`preset-wallpaper-card ${wallpaperDataUrl === wallpaper.dataUrl ? 'active' : ''}`}
                  key={wallpaper.id}
                  onClick={() => onSelectPresetWallpaper(wallpaper.dataUrl)}
                  type="button"
                >
                  <span className="preset-wallpaper-thumbnail" style={{ backgroundImage: `url("${wallpaper.dataUrl}")` }} />
                  <span>{wallpaper.label}</span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}
