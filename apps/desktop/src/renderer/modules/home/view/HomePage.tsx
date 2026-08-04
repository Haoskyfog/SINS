import { allTools } from '../../../app/model/toolCatalog';
import type { ToolDefinition, ToolId } from '../../../app/model/toolCatalog';

type HomePageProps = {
  onSelectTool: (toolId: ToolId) => void;
  recentToolIds: ToolId[];
};

export function HomePage({ onSelectTool, recentToolIds }: HomePageProps) {
  const recentTools = recentToolIds
    .map((toolId) => allTools.find((tool) => tool.id === toolId))
    .filter((tool): tool is ToolDefinition => Boolean(tool));

  return (
    <>
      <div className="hero welcome-hero">
        <p className="eyebrow">SINS TOOLBOX</p>
        <h1>在 SINS 上完成你想做的任何事情吧！</h1>
        <p className="hero-copy">请选择一个工具。</p>
      </div>

      <section className="workspace-panel" aria-label="最近使用的功能">
        <div className="panel-heading">
          <div><span className="eyebrow">TOOLS</span><h2>这是你最近使用的功能</h2></div>
          {recentTools.length > 0 && <span className="panel-count">{recentTools.length} 个最近使用</span>}
        </div>
        {recentTools.length > 0 ? (
          <div className="tool-grid">
            {recentTools.map((tool) => (
              <button className="tool-card" key={tool.id} onClick={() => onSelectTool(tool.id)} type="button">
                <span className="card-icon">+</span>
                <span><strong>{tool.label}</strong><small>{tool.description}</small></span>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="empty-recent-tools">哇你还没有使用过功能QWQ，请快选一个试一试吧！</p>
        )}
      </section>
    </>
  );
}
