export type ToolId = 'pdf-tools' | 'video-to-gif' | 'audio-vocal-removal' | 'lan-transfer';

export type ToolDefinition = {
  id: ToolId;
  label: string;
  description: string;
};

export type ToolGroup = {
  label: string;
  tools: ToolDefinition[];
};

export const toolGroups: ToolGroup[] = [
  {
    label: '文件工具',
    tools: [{ id: 'pdf-tools', label: 'PDF 工具', description: '处理常见 PDF 转换与识别任务。' }],
  },
  {
    label: '媒体工具',
    tools: [
      { id: 'video-to-gif', label: '视频转 GIF', description: '从本地视频中生成适合分享的 GIF。' },
      { id: 'audio-vocal-removal', label: '音频去人声', description: '从本地音频中分离人声与伴奏。' },
    ],
  },
  {
    label: '网络工具',
    tools: [{ id: 'lan-transfer', label: '局域网传输', description: '在同一局域网内发送文件与文件夹。' }],
  },
];

export const allTools = toolGroups.flatMap((group) => group.tools);

export function getToolById(toolId: ToolId): ToolDefinition {
  const tool = allTools.find((item) => item.id === toolId);

  if (!tool) throw new Error(`Unknown tool: ${toolId}`);

  return tool;
}
