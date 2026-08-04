import type { ToolDefinition } from '../model/toolCatalog';

type ToolWorkspaceProps = {
  tool: ToolDefinition;
  onBack: () => void;
};

export function ToolWorkspace({ tool, onBack }: ToolWorkspaceProps) {
  return (
    <section className="feature-workspace" aria-label={`${tool.label} 工作区`}>
      <button className="back-button" onClick={onBack} type="button">← 返回工具总览</button>
      <div className="feature-heading">
        <h1>{tool.label}</h1>
        <p>{tool.description}</p>
      </div>
      <div className="feature-empty-state">
        <span className="feature-marker">+</span>
        <div>
          <h2>功能面板准备中</h2>
          <p>该工具的本地处理流程将在后续开发阶段接入。</p>
        </div>
      </div>
    </section>
  );
}
