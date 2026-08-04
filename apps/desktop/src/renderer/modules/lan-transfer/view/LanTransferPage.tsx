import type { FeaturePageProps } from '../../../shared/types/featurePage';

export function LanTransferPage({ onBack }: FeaturePageProps) {
  return (
    <section className="feature-workspace" aria-label="局域网传输工作区">
      <button className="back-button" onClick={onBack} type="button">← 返回工具总览</button>
      <div className="feature-heading">
        <h1>局域网传输</h1>
        <p>在同一局域网内发送文件与文件夹。</p>
      </div>
      <div className="feature-empty-state">
        <span className="feature-marker">+</span>
        <div>
          <h2>局域网传输准备中</h2>
          <p>后续将在此页面实现设备发现、连接和传输进度。</p>
        </div>
      </div>
    </section>
  );
}
