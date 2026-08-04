import { useState } from 'react';
import { HomePage } from '../modules/home';
import { useAppInfoController } from './controller/useAppInfoController';
import { getToolById } from './model/toolCatalog';
import type { ToolId } from './model/toolCatalog';
import { AppShell } from './view/AppShell';
import { ToolWorkspace } from './view/ToolWorkspace';

export function App() {
  const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(null);
  const { state, refresh } = useAppInfoController();
  const selectedTool = selectedToolId ? getToolById(selectedToolId) : null;

  return (
    <AppShell
      onRefreshStatus={() => void refresh()}
      onSelectTool={setSelectedToolId}
      selectedToolId={selectedToolId}
      statusMessage={state.message}
    >
      {selectedTool ? (
        <ToolWorkspace onBack={() => setSelectedToolId(null)} tool={selectedTool} />
      ) : (
        <HomePage onSelectTool={setSelectedToolId} />
      )}
    </AppShell>
  );
}
