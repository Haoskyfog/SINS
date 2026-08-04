import { useState } from 'react';
import { HomePage } from '../modules/home';
import { useAppInfoController } from './controller/useAppInfoController';
import type { ToolId } from './model/toolCatalog';
import { AppShell } from './view/AppShell';
import { FeatureWorkspaceRouter } from './view/FeatureWorkspaceRouter';

export function App() {
  const [selectedToolId, setSelectedToolId] = useState<ToolId | null>(null);
  const { state, refresh } = useAppInfoController();

  return (
    <AppShell
      onRefreshStatus={() => void refresh()}
      onSelectTool={setSelectedToolId}
      selectedToolId={selectedToolId}
      statusMessage={state.message}
    >
      {selectedToolId ? (
        <FeatureWorkspaceRouter onBack={() => setSelectedToolId(null)} toolId={selectedToolId} />
      ) : (
        <HomePage onSelectTool={setSelectedToolId} />
      )}
    </AppShell>
  );
}
