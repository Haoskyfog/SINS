# 新增工具与类目指南

本指南说明如何在 SINS 左侧导航增加类目或工具，并将工具入口与右侧功能面板绑定。开发前先阅读根目录 `AGENTS.md`、`docs/SPEC.md` 和现有代码。当前仅建立前端导航框架，尚未接入 FastAPI、文件选择、FFmpeg 或真实任务处理。

## 当前绑定关系

```text
toolCatalog.ts
  ├─ toolGroups：类目与工具定义
  └─ ToolId：工具唯一标识
       ↓
AppShell.tsx：自动生成左侧导航按钮
       ↓ 点击工具 ID
App.tsx：selectedToolId 保存当前选择
       ↓
HomePage 或对应工具的右侧 View
```

关键文件：

- `apps/desktop/src/renderer/app/model/toolCatalog.ts`：工具清单的唯一来源。
- `apps/desktop/src/renderer/app/view/AppShell.tsx`：左侧导航和公共右侧框架。
- `apps/desktop/src/renderer/app/App.tsx`：页面选择状态与右侧面板路由。
- `apps/desktop/src/renderer/modules/<feature>/`：每个具体功能自己的 MVC 文件。

不要在 `AppShell.tsx` 手写某一个工具按钮；不要让左侧导航直接导入或调用某个功能模块。

## 新增一个类目

在 `toolCatalog.ts` 的 `toolGroups` 数组中增加一项。类目没有独立 ID，只是工具的分组标题：

```ts
{
  label: '图像工具',
  tools: [
    {
      id: 'image-upscale',
      label: '图片增强',
      description: '改善本地图片的清晰度与尺寸。',
    },
  ],
}
```

`AppShell` 会自动在左侧生成“图像工具”标题和“图片增强”按钮；`HomePage` 也会自动生成对应卡片。类目只用于视觉组织，不应承载业务逻辑。

## 新增一个工具入口

以新增“图片增强”为例，按顺序完成以下改动：

1. 扩展 `ToolId` 联合类型：

```ts
export type ToolId =
  | 'pdf-tools'
  | 'video-to-gif'
  | 'audio-vocal-removal'
  | 'lan-transfer'
  | 'image-upscale';
```

2. 在目标类目的 `tools` 数组中定义 `id`、`label`、`description`。`id` 使用小写 kebab-case，必须唯一且稳定；它是导航、状态和功能面板绑定的键。仅改这一步时，右侧会显示通用的“功能面板准备中”占位页。

3. 运行：

```bash
cd apps/desktop
npm run typecheck
npm run lint
```

## 绑定独立右侧功能面板

当功能开始实现时，不修改 `AppShell`。在 `apps/desktop/src/renderer/modules/image-upscale/` 创建 MVC 目录：

```text
modules/image-upscale/
  view/ImageUpscalePage.tsx
  controller/useImageUpscaleController.ts
  model/imageUpscale.types.ts
  model/imageUpscale.api.ts
  index.ts
```

`view/` 只接收 props、展示表单和触发回调。`controller/` 负责交互、状态流转和业务编排。`model/` 放类型、请求及数据转换；UI 不得直接调用 IPC 或 FastAPI。

创建入口导出：

```ts
// modules/image-upscale/index.ts
export { ImageUpscalePage } from './view/ImageUpscalePage';
```

然后在 `App.tsx` 导入页面，并按 `selectedToolId` 选择右侧内容：

```tsx
import { ImageUpscalePage } from '../modules/image-upscale';

function renderWorkspace() {
  if (selectedToolId === 'image-upscale') {
    return <ImageUpscalePage />;
  }

  return selectedTool ? (
    <ToolWorkspace onBack={() => setSelectedToolId(null)} tool={selectedTool} />
  ) : (
    <HomePage onSelectTool={setSelectedToolId} />
  );
}
```

在 `AppShell` 的 `children` 位置渲染 `{renderWorkspace()}`。这样左侧仅发送工具 ID，`App` 是唯一决定右侧内容的地方；导航与具体功能保持解耦。

## 新功能完成前的边界

工具入口不等于功能已实现。在文件选择、IPC、FastAPI 或子进程尚未开发时，保留 `ToolWorkspace` 的占位状态。开始真实功能前，必须同时评估：前端模块、`packages/contracts` 共享契约、后端 `apps/service/app/modules/<feature>/`、测试、文档以及文件和网络安全影响。

功能完成后，测试左侧按钮、欢迎页卡片、品牌返回、右侧面板切换与刷新后默认状态；再运行仓库内实际可用的检查命令，并更新 `README.md` 与相关文档。
