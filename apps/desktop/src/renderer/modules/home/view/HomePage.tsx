import { allTools } from '../../../app/model/toolCatalog';
import type { ToolId } from '../../../app/model/toolCatalog';

type HomePageProps = {
  onSelectTool: (toolId: ToolId) => void;
};

export function HomePage({ onSelectTool }: HomePageProps) {
  return (
    <>
      <div className="hero welcome-hero">
        <p className="eyebrow">SINS TOOLBOX</p>
        <h1>在 SINS 上完成你想做的任何事情吧！</h1>
        <p className="hero-copy">请选择一个工具。</p>
      </div>

      <section className="workspace-panel" aria-label="工作区">
        <div className="panel-heading">
          <div><span className="eyebrow">TOOLS</span><h2>从一个本地任务开始</h2></div>
          <span className="panel-count">{allTools.length} 个模块</span>
        </div>
        <div className="tool-grid">
          {allTools.map((tool) => (
            <button className="tool-card" key={tool.id} onClick={() => onSelectTool(tool.id)} type="button">
              <span className="card-icon">+</span>
              <span><strong>{tool.label}</strong><small>{tool.description}</small></span>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}
