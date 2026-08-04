# 前端第一阶段计划

## 目标

建立可启动、可检查的 Electron + React + TypeScript 外壳，验证 `main`、`preload`、`renderer` 三层边界与 MVC 调用链；不实现文件处理、网络请求、模型下载或本地服务。

## 当前交付

1. Electron Forge 与 Vite 提供开发、打包和分发命令。
2. `main` 以 `contextIsolation: true`、`nodeIntegration: false` 和受限窗口策略创建应用窗口。
3. `preload` 仅暴露只读的 `app:get-info` 示例接口。
4. Renderer 提供应用壳和 `modules/home` MVC 示例；View 经 Controller/Model 调用桥接。
5. `packages/contracts` 定义应用信息和统一 IPC 结果类型。
6. `App` 持有当前工具选择状态；`AppShell` 负责导航，`FeatureWorkspaceRouter` 使用完整的 `ToolId` 映射到对应功能模块的独立右侧页面。
7. 左侧导航栏与右侧内容区各自滚动；选择工具只切换右侧工作区，不耦合具体处理能力。
8. Renderer 仅在浏览器本地存储最近使用的工具 ID，最多保留 6 项；不记录文件、路径、任务内容或网络数据。

## 后续阶段

1. 定义首个业务功能的视频转 GIF 契约、输入输出、安全路径策略和任务状态。
2. 建立 FastAPI 服务骨架及 `video_to_gif` 模块，不在 Renderer 中调用 FFmpeg。
3. 实现 `video-to-gif` 的 MVC 页面、受控文件选择、任务进度、取消与结果展示。
4. 为 IPC、Controller、路径校验、任务取消和临时文件清理补充实际测试框架与测试。
