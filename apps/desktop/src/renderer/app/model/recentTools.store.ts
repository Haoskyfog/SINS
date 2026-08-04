import { allTools } from './toolCatalog';
import type { ToolId } from './toolCatalog';

const recentToolsStorageKey = 'sins:recent-tool-ids';
const maximumRecentTools = 6;

function isToolId(value: unknown): value is ToolId {
  return typeof value === 'string' && allTools.some((tool) => tool.id === value);
}

export function loadRecentToolIds(): ToolId[] {
  try {
    const value = window.localStorage.getItem(recentToolsStorageKey);

    if (!value) return [];

    const parsedValue: unknown = JSON.parse(value);

    if (!Array.isArray(parsedValue)) return [];

    return parsedValue.filter(isToolId).slice(0, maximumRecentTools);
  } catch {
    return [];
  }
}

export function recordRecentToolId(recentToolIds: ToolId[], toolId: ToolId): ToolId[] {
  const nextRecentToolIds = [toolId, ...recentToolIds.filter((id) => id !== toolId)]
    .slice(0, maximumRecentTools);

  try {
    window.localStorage.setItem(recentToolsStorageKey, JSON.stringify(nextRecentToolIds));
  } catch {
    // 本地存储不可用时，仍保留当前运行期间的最近使用状态。
  }

  return nextRecentToolIds;
}
