# 仓库指南

## 项目与目录

SINS 是跨平台、本地优先的 AI 桌面效率工具箱。桌面端已配置 Electron Forge、Vite、React 与 TypeScript；Python、FastAPI、FFmpeg、模型和测试框架仍未配置。不得虚构命令、依赖、接口或检查结果；新增后同步更新 `README.md`。

- `apps/desktop`：Electron 桌面端及前端测试。
- `apps/service`：本地 Python/FastAPI 服务。
- `packages/contracts`：前后端共享模型与接口契约。
- `packages/ui`：无业务状态的可复用 UI 组件。
- `docs`：工程、架构与功能文档；`docx/` PRD 是 MVP 依据。
- `scripts`：有文档说明的开发、构建和检查脚本。
- `timeline`：按日期记录每次开发的时间、范围、改动和验证结果。

## Electron 与 MVC

`main` 负责窗口、系统能力、文件选择和本地服务生命周期。`preload` 只通过安全 IPC 桥接暴露最小、受控且带 TypeScript 类型的 API。`renderer` 是 React 界面，禁止直接使用 Node.js、`fs`、`child_process`、文件系统、shell 或完整 Electron API。

前端按 `renderer/modules/<feature>/` 组织：`view/` 只展示界面；`controller/` 处理交互、状态流转和业务编排；`model/` 管理类型、状态、请求和转换。UI 必须经 Controller 与 Model 调用 IPC 或 FastAPI，不得直接调用。

## 后端、安全与协作

后端模块为 `app/modules/<feature>/`：`router.py` 定义接口，`schemas.py` 定义请求响应，`service.py` 编排业务，`*_adapter.py` 封装 FFmpeg、Demucs 等工具。后端不得信任前端路径、命令参数或 MIME 类型；校验规范化路径、存在性、类型、大小和访问范围，防止路径穿越。子进程使用参数数组，必须支持超时、取消和退出清理。

用户数据默认不上传。涉及文件系统、子进程、网络、模型下载或用户数据时，先说明安全影响与授权方式。临时文件写入受控目录并在完成、失败或取消后清理；日志不得记录文件内容或敏感路径。

TypeScript 用 2 空格、`PascalCase` 组件与 `camelCase` 变量；Python 用 4 空格、PEP 8、`snake_case` 和公共接口类型标注。每项功能同步评估前端、后端、契约、测试和文档；测试覆盖成功、无效输入、取消、超时和清理。提交使用简短祈使式，如 `media: validate output path`；PR 说明行为、需求、验证、安全影响，UI 改动附截图。

## AI 执行规范

AI 必须先读本文件、相关 `docs/` 和现有代码。不得重构、移动或删除无关文件，不得臆造包、命令、测试结果或接口。每次开发或功能修改后，必须按 `timeline/README.md` 向当天的 Timeline 文件追加记录。修改后运行现有可用检查；缺少工具须说明原因，并保持代码、测试、契约、文档和 Timeline 一致。
