import type { FeaturePageProps } from '../../../shared/types/featurePage';

export function PdfToolsPage({ onBack }: FeaturePageProps) {
  return (
    <section className="feature-workspace" aria-label="PDF 工具工作区">
      <button className="back-button" onClick={onBack} type="button">← 返回工具总览</button>
      <div className="feature-heading">
        <h1>PDF 工具</h1>
        <p>处理常见 PDF 转换与识别任务。</p>
      </div>
      <div className="feature-empty-state">
        <span className="feature-marker">+</span>
        <div>
          <h2>PDF 工具准备中</h2>
          <p>后续将在此页面实现 PDF 相关的本地处理流程。</p>
        </div>
      </div>
    </section>
  );
}
