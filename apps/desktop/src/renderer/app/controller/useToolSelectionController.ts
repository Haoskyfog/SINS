import { useState } from 'react';
import { loadRecentToolIds, recordRecentToolId } from '../model/recentTools.store';
import type { ToolId } from '../model/toolCatalog';

export function useToolSelectionController() {
  const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(null);
  const [recentToolIds, setRecentToolIds] = useState<ToolId[]>(loadRecentToolIds);

  function selectTool(toolId: ToolId) {
    setSelectedToolId(toolId);
    setRecentToolIds((currentToolIds) => recordRecentToolId(currentToolIds, toolId));
  }

  function showHome() {
    setSelectedToolId(null);
  }

  return { recentToolIds, selectedToolId, selectTool, showHome };
}
