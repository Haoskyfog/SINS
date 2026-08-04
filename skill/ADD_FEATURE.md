# 新增工具与类目指南

本指南定义 SINS 的前端功能注册方式。开始前先阅读根目录 `AGENTS.md`、相关 `docs/` 与现有代码。当前只提供独立的前端占位页面，尚未接入文件选择、IPC、FastAPI、FFmpeg 或真实任务处理。

## 当前结构

```text
app/model/toolCatalog.ts              工具 ID、类目、显示名称的唯一来源
app/view/AppShell.tsx                 左侧导航与右侧公共外壳
app/view/FeatureWorkspaceRouter.tsx  ToolId 到页面组件的完整映射
modules/<feature>/view/               各工具独立的右侧页面
modules/<feature>/controller/         实现交互时新增
modules/<feature>/model/              实现请求、状态和转换时新增
```

左侧导航与主页卡片都只发送 `ToolId`；`App.tsx` 保存当前 ID；`FeatureWorkspaceRouter` 根据该 ID 渲染唯一的模块页面。左侧导航不得导入任何功能页面，也不得包含业务逻辑。

## 新增类目

在 `apps/desktop/src/renderer/app/model/toolCatalog.ts` 的 `toolGroups` 加入类目。类目只负责展示分组，不得承载功能逻辑：

```ts
{
  label: '图像工具',
  tools: [{
    id: 'image-upscale',
    label: '图片增强',
    description: '改善本地图片的清晰度与尺寸。',
  }],
}
```

同时把 `'image-upscale'` 加入 `ToolId`。`AppShell` 和 `HomePage` 会自动生成入口。

## 新增独立工具页面

每个工具必须有自己的目录与页面。以 `image-upscale` 为例：

```text
modules/image-upscale/
  index.ts
  view/ImageUpscalePage.tsx
  controller/             # 需要交互和业务编排时创建
  model/                  # 需要状态、请求或转换时创建
```

页面 View 只接收 props、展示界面并触发回调；不能直接调用 IPC、FastAPI、Node.js 或文件系统。入口文件只导出页面：

```ts
export { ImageUpscalePage } from './view/ImageUpscalePage';
```

在 `FeatureWorkspaceRouter.tsx` 导入页面，并加入映射：

```tsx
const featurePageByToolId: Record<ToolId, ComponentType<FeaturePageProps>> = {
  // 现有映射保持不变
  'image-upscale': ImageUpscalePage,
};
```

`Record<ToolId, ...>` 是完整性约束：每个 `ToolId` 必须有一个页面，漏掉时 `npm run typecheck` 失败；多余或拼错的 ID 也会被发现。不得恢复通用兜底页面，否则新增工具可能只有入口却没有独立右侧面板。

## 功能实现与检查

开始真实功能后，在同一模块中新增 `controller/` 与 `model/`，并同步评估共享契约、后端模块、测试、文档和本地数据安全。涉及文件、子进程、网络、模型或用户数据时，先说明安全影响与授权；默认不上传用户数据。

完成后，从左侧、主页卡片和品牌返回分别验证页面切换，再执行实际可用的：

```bash
cd apps/desktop
npm run typecheck
npm run lint
```

同步更新 `README.md`、相关文档与当天 `timeline/YYYY-MM-DD.md`。未配置的工具或检查不得声称已执行。
