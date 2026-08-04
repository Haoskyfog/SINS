# SINS 工程规范

## 架构目标与本地优先

SINS 以 Electron + React + TypeScript 作为桌面端、Python + FastAPI 作为本地服务，规划集成 FFmpeg、Demucs、PyTorch 与 SQLite。桌面端已配置 Electron Forge、Vite、React 和 TypeScript；本地服务、媒体工具、模型与测试框架尚未配置。本文不代表未实现的依赖、命令或接口。用户文件、任务信息、模型推理和结果默认保留本机；网络、模型下载、遥测和同步必须由用户明确触发，说明用途、范围、保留时间和离线失败行为，且不得默认上传用户文件、内容或目录。

## 目录与归属

```text
apps/desktop/                 Electron、React、TypeScript 桌面端
  src/main/                   窗口、系统能力、服务生命周期
  src/preload/                最小权限 IPC 桥接
  src/renderer/               app、modules、shared、assets
  tests/                      桌面端测试
apps/service/                 FastAPI 本地服务
  app/api/                    应用装配与全局路由
  app/core/                   配置、日志、异常、依赖
  app/infrastructure/         SQLite、文件系统等基础设施
  app/modules/                业务功能域
  tests/                      服务端测试
packages/contracts/           跨端数据模型、状态、错误码
packages/ui/                  无业务状态的复用 UI
docs/                         工程与功能设计
scripts/                      已说明用途的辅助脚本
timeline/                     按日期保存开发变更记录
docx/                         原始 PRD
```

按功能域维护，不跨端复制模型。前端使用 kebab-case，如 `video-to-gif`；后端使用 snake_case，如 `video_to_gif`。只有跨域通用能力才能进入 `shared`、`core` 或 `infrastructure`。新增包、配置、脚本、命令或工具时，必须在 `README.md` 记录真实安装、开发、构建、检查和测试方式；尚未配置的服务端与业务工具不得编造。

## Electron 与 IPC 边界

`main` 处理窗口、文件选择、系统权限、本地服务启动停止及受控原生操作，不放置页面逻辑，也不把任意页面请求转换为文件或命令操作。`preload` 通过 `contextBridge` 提供带 TypeScript 类型的最小 API，不得暴露 `ipcRenderer`、`require`、`process` 或完整 Electron/Node API。`renderer` 只处理 React 展示与状态，禁止使用 `fs`、`path`、`child_process`、shell、Node.js 或完整 Electron API。

IPC 通道为 `<domain>:<action>` 的小写 kebab-case，例如 `files:select-video`、`settings:select-wallpaper`、`tasks:cancel`。禁止 `execute`、`invoke-any` 或任意命令字符串通道。请求和响应都必须可序列化，采用统一语义：`{ ok: true, data, requestId }` 或 `{ ok: false, error: { code, message, retryable }, requestId }`。主进程验证参数、来源与权限；错误不得泄漏堆栈、命令行或敏感路径。图片选择等文件能力只返回完成显示所需的数据，不向 Renderer 返回原始路径。订阅型通道须提供取消订阅。

## React MVC 模板

页面功能置于 `apps/desktop/src/renderer/modules/<feature>/`：

```text
modules/video-to-gif/
  view/VideoToGifPage.tsx
  controller/useVideoToGifController.ts
  model/videoToGif.types.ts
  model/videoToGif.store.ts
  model/videoToGif.api.ts
  routes.tsx
```

`view/` 只接收 props、渲染与回调，不请求 IPC/FastAPI、读写存储或拼装命令。`controller/` 负责输入校验、交互、任务创建、状态流转、轮询/订阅和错误呈现。`model/` 负责类型、状态、契约适配、请求与转换；UI 必须经 Controller 和 Model 调用外部能力。TypeScript 使用 2 空格，组件为 `PascalCase`，函数和变量为 `camelCase`。

## FastAPI、契约与长任务

后端按 `apps/service/app/modules/<feature>/` 建立模块：

```text
modules/video_to_gif/
  router.py        # 接口与依赖
  schemas.py       # 请求、响应与校验
  service.py       # 业务编排
  ffmpeg_adapter.py# 外部工具封装
```

`*_adapter.py` 以参数数组启动 FFmpeg、Demucs 等子进程，禁止将用户输入拼接入 shell。Python 使用 4 空格、PEP 8、`snake_case`，公共边界提供类型标注。请求、响应、任务状态和错误码优先在 `packages/contracts` 定义；契约变更必须同步桌面端、服务端、测试与文档。

流程为创建任务并返回 `taskId`，查询或订阅读取进度，按 ID 取消，完成后读取结果摘要与受控输出位置。状态至少有 `queued`、`running`、`succeeded`、`failed`、`cancelled`；进度为 0 至 100，未知必须明确标记。任务记录开始时间、取消信号、失败摘要和输出；超时或取消时停止并回收子进程。任务完成、失败或取消后清理独立临时目录，清理失败写入安全日志。

## 文件、安全、配置与质量

后端不信任 Renderer、IPC 的路径、MIME、扩展名、大小或命令参数。必须校验规范化路径、存在性、可读性、真实格式及访问范围，拒绝相对路径穿越。输出只写入用户选择或应用管理的目录，不覆盖未确认文件。日志只记录任务 ID、模块、耗时、错误码和脱敏摘要；禁止文件内容、令牌、完整命令行和敏感绝对路径。

配置统一在 `app/core` 读取并校验环境变量或本地配置；不得提交密钥、用户路径、模型或环境专属配置。错误码按域命名，例如 `FILES_INVALID_PATH`、`TASK_CANCELLED`。测试覆盖成功、无效输入、路径穿越、取消、超时、子进程失败和临时文件清理；名称描述行为。发布前确认契约一致、IPC 最小权限、Renderer 无 Node 特权、长任务可回收、离线默认可用、网络操作有确认、日志脱敏、UI 有截图，且文档更新。

## 新功能与 AI 执行规范

先读 `AGENTS.md`、相关 `docs/`、PRD 与现有代码，明确用户流程、输入输出、数据位置、安全影响和失败情形；再评估 `packages/contracts`，创建服务端模块与前端 MVC 模块，注册受控 IPC/路由，补测试并更新 README/功能文档。修改后执行现有可用检查；未配置工具须如实说明。

所有 AI 不得在未读上下文前变更，不得重构、移动或删除无关文件，也不得臆造包、命令、测试结果或接口。任何文件系统、子进程、网络、模型下载或用户数据改动先说明安全影响。每次修改保持代码、测试、契约和文档一致。

## Timeline 记录

每次开发完成后，必须更新根目录 `timeline/` 下当天的 `YYYY-MM-DD.md` 文件。每个条目记录精确时间、范围、改动内容、新增内容、验证结果和未完成项；功能改动还应写明安全影响或明确“无新增安全影响”。记录描述事实，不得声称未执行的检查。具体格式见 `timeline/README.md`。
