import { HomePage } from '../modules/home';
import { useAppInfoController } from './controller/useAppInfoController';
import { useToolSelectionController } from './controller/useToolSelectionController';
import { AppShell } from './view/AppShell';
import { FeatureWorkspaceRouter } from './view/FeatureWorkspaceRouter';

export function App() {
  const { state, refresh } = useAppInfoController();
  const { recentToolIds, selectedToolId, selectTool, showHome } = useToolSelectionController();

  return (
    <AppShell
      onRefreshStatus={() => void refresh()}
      onSelectTool={selectTool}
      onShowHome={showHome}
      selectedToolId={selectedToolId}
      statusMessage={state.message}
    >
      {selectedToolId ? (
        <FeatureWorkspaceRouter onBack={showHome} toolId={selectedToolId} />
      ) : (
        <HomePage onSelectTool={selectTool} recentToolIds={recentToolIds} />
      )}
    </AppShell>
  );
}
