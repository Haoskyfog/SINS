import type { FeaturePageProps } from '../../../shared/types/featurePage';

export function AudioVocalRemovalPage({ onBack }: FeaturePageProps) {
  return (
    <section className="feature-workspace" aria-label="音频去人声工作区">
      <button className="back-button" onClick={onBack} type="button">← 返回工具总览</button>
      <div className="feature-heading">
        <h1>音频去人声</h1>
        <p>从本地音频中分离人声与伴奏。</p>
      </div>
      <div className="feature-empty-state">
        <span className="feature-marker">+</span>
        <div>
          <h2>音频去人声准备中</h2>
          <p>后续将在此页面实现本地音频分离的任务流程。</p>
        </div>
      </div>
    </section>
  );
}
