import { useHomeController } from '../controller/useHomeController';

const toolGroups = [
  { label: '文件工具', items: ['PDF 工具'] },
  { label: '媒体工具', items: ['视频转 GIF', '音频去人声'] },
  { label: '网络工具', items: ['局域网传输'] },
];

export function HomePage() {
  const { state, refresh } = useHomeController();

  return (
    <main className="shell">
      <aside className="sidebar">
        <div className="brand"><span className="brand-mark">S</span><span>SINS</span></div>
        <div className="sidebar-label">工具箱</div>
        <nav aria-label="工具导航">
          {toolGroups.map((group) => (
            <section className="tool-group" key={group.label}>
              <h2>{group.label}</h2>
              {group.items.map((item, index) => (
                <button className={`tool-item ${index === 0 && group.label === '媒体工具' ? 'active' : ''}`} key={item} type="button">
                  <span className="tool-dot" />{item}
                </button>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-footer">本地优先 · 模块化</div>
      </aside>

      <section className="content">
        <header className="topbar"><span className="eyebrow">WORKSPACE</span><span className="status-dot" /> 本地环境</header>
        <div className="hero">
          <p className="eyebrow">SINS TOOLBOX</p>
          <h1>把繁琐任务，留在本机完成。</h1>
          <p className="hero-copy">选择一个工具开始。文件默认只在本机处理。</p>
        </div>
        <section className="workspace-panel" aria-label="工作区">
          <div className="panel-heading"><div><span className="eyebrow">READY</span><h2>选择一个工具</h2></div><span className="panel-count">{toolGroups.reduce((count, group) => count + group.items.length, 0)} 个模块</span></div>
          <div className="tool-grid">
            {toolGroups.flatMap((group) => group.items).map((item) => (
              <button className="tool-card" type="button" key={item}><span className="card-icon">+</span><span>{item}</span><span className="arrow">→</span></button>
            ))}
          </div>
        </section>
        <footer className="app-footer">
          <span>{state.status === 'ready' ? `SINS ${state.appInfo?.version} · ${state.appInfo?.platform}` : state.status === 'error' ? state.errorMessage : '正在连接本地环境…'}</span>
          <button className="text-button" onClick={() => void refresh()} type="button">刷新状态</button>
        </footer>
      </section>
    </main>
  );
}
