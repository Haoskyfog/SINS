import type { ToolId } from '../model/toolCatalog';
import { toolGroups } from '../model/toolCatalog';
import type { CSSProperties, ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
  selectedToolId: ToolId | null;
  statusMessage: string;
  onSelectTool: (toolId: ToolId) => void;
  onShowHome: () => void;
  onOpenSettings: () => void;
  onRefreshStatus: () => void;
  wallpaperBlur: number;
  wallpaperDataUrl: string | null;
};

export function AppShell({
  children,
  selectedToolId,
  statusMessage,
  onSelectTool,
  onShowHome,
  onOpenSettings,
  onRefreshStatus,
  wallpaperBlur,
  wallpaperDataUrl,
}: AppShellProps) {
  const shellStyle = wallpaperDataUrl
    ? {
        '--wallpaper-blur': `${wallpaperBlur}px`,
        backgroundImage: `url("${wallpaperDataUrl}")`,
      } as CSSProperties
    : undefined;

  return (
    <main className={`shell ${wallpaperDataUrl ? 'has-wallpaper' : ''}`} style={shellStyle}>
      <aside className="sidebar">
        <button className="brand" onClick={onShowHome} type="button">
          <span className="brand-mark">S</span><span>SINS</span>
        </button>
        <div className="sidebar-label">工具箱</div>
        <nav aria-label="工具导航">
          {toolGroups.map((group) => (
            <section className="tool-group" key={group.label}>
              <h2>{group.label}</h2>
              {group.tools.map((tool) => (
                <button
                  className={`tool-item ${selectedToolId === tool.id ? 'active' : ''}`}
                  key={tool.id}
                  onClick={() => onSelectTool(tool.id)}
                  type="button"
                >
                  <span className="tool-dot" />{tool.label}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <button className="settings-button" onClick={onOpenSettings} type="button">设置</button>
      </aside>

      <section className="content">
        {children}
        <footer className="app-footer">
          <span>{statusMessage}</span>
          <button className="text-button" onClick={onRefreshStatus} type="button">刷新状态</button>
        </footer>
      </section>
    </main>
  );
}
