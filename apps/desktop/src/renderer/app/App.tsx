import { HomePage } from '../modules/home';
import { SettingsDialog, useSettingsController } from '../modules/settings';
import { useAppInfoController } from './controller/useAppInfoController';
import { useToolSelectionController } from './controller/useToolSelectionController';
import { AppShell } from './view/AppShell';
import { FeatureWorkspaceRouter } from './view/FeatureWorkspaceRouter';

export function App() {
  const { state, refresh } = useAppInfoController();
  const { recentToolIds, selectedToolId, selectTool, showHome } = useToolSelectionController();
  const settings = useSettingsController();

  return (
    <>
      <AppShell
        onOpenSettings={settings.openSettings}
        onRefreshStatus={() => void refresh()}
        onSelectTool={selectTool}
        onShowHome={showHome}
        selectedToolId={selectedToolId}
        statusMessage={state.message}
        wallpaperBlur={settings.wallpaperBlur}
        wallpaperDataUrl={settings.wallpaperDataUrl}
      >
        {selectedToolId ? (
          <FeatureWorkspaceRouter onBack={showHome} toolId={selectedToolId} />
        ) : (
          <HomePage onSelectTool={selectTool} recentToolIds={recentToolIds} />
        )}
      </AppShell>
      <SettingsDialog
        isOpen={settings.isOpen}
        isSelectingWallpaper={settings.isSelectingWallpaper}
        onClose={settings.closeSettings}
        onSelectDefaultWallpaper={settings.chooseDefaultWallpaper}
        onSelectPresetWallpaper={settings.choosePresetWallpaper}
        onSelectWallpaper={() => void settings.chooseWallpaper()}
        onWallpaperBlurChange={settings.setWallpaperBlur}
        wallpaperBlur={settings.wallpaperBlur}
        wallpaperDataUrl={settings.wallpaperDataUrl}
        wallpaperError={settings.wallpaperError}
        presetWallpapers={settings.presetWallpapers}
      />
    </>
  );
}
