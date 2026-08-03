# SINS
SINS-Schweizer Messer is not Schweizer Messer 赛博瑞士军刀

## 桌面端开发

桌面端位于 `apps/desktop`，采用 Electron Forge、Vite、React 和 TypeScript。首次使用需在该目录安装依赖：

```bash
cd apps/desktop
npm install
```

可用命令：

```bash
npm start       # 启动 Electron 开发环境
npm run lint    # 检查 TypeScript 与 React 源码
npm run typecheck # 执行 TypeScript 类型检查
npm run package # 打包当前应用
npm run make    # 生成当前平台的分发产物
```

业务功能尚未实现。开发前请阅读 `AGENTS.md` 和 `docs/SPEC.md`，遵守本地优先、最小 IPC 权限和前端 MVC 规则。
