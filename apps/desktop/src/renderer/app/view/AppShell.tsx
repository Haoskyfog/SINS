import type { ToolId } from '../model/toolCatalog';
import { toolGroups } from '../model/toolCatalog';
import type { ReactNode } from 'react';

type AppShellProps = {
  children: ReactNode;
  selectedToolId: ToolId | null;
  statusMessage: string;
  onSelectTool: (toolId: ToolId | null) => void;
  onRefreshStatus: () => void;
};

export function AppShell({
  children,
  selectedToolId,
  statusMessage,
  onSelectTool,
  onRefreshStatus,
}: AppShellProps) {
  return (
    <main className="shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => onSelectTool(null)} type="button">
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
