import type { FeaturePageProps } from '../../../shared/types/featurePage';

export function VideoToGifPage({ onBack }: FeaturePageProps) {
  return (
    <section className="feature-workspace" aria-label="视频转 GIF 工作区">
      <button className="back-button" onClick={onBack} type="button">← 返回工具总览</button>
      <div className="feature-heading">
        <h1>视频转 GIF</h1>
        <p>从本地视频中生成适合分享的 GIF。</p>
      </div>
      <div className="feature-empty-state">
        <span className="feature-marker">+</span>
        <div>
          <h2>视频转 GIF 准备中</h2>
          <p>后续将在此页面实现视频选择、参数设置和结果展示。</p>
        </div>
      </div>
    </section>
  );
}
