import type { ComponentType } from 'react';
import { AudioVocalRemovalPage } from '../../modules/audio-vocal-removal';
import { LanTransferPage } from '../../modules/lan-transfer';
import { PdfToolsPage } from '../../modules/pdf-tools';
import { VideoToGifPage } from '../../modules/video-to-gif';
import type { FeaturePageProps } from '../../shared/types/featurePage';
import type { ToolId } from '../model/toolCatalog';

type FeatureWorkspaceRouterProps = FeaturePageProps & {
  toolId: ToolId;
};

const featurePageByToolId: Record<ToolId, ComponentType<FeaturePageProps>> = {
  'pdf-tools': PdfToolsPage,
  'video-to-gif': VideoToGifPage,
  'audio-vocal-removal': AudioVocalRemovalPage,
  'lan-transfer': LanTransferPage,
};

export function FeatureWorkspaceRouter({ onBack, toolId }: FeatureWorkspaceRouterProps) {
  const FeaturePage = featurePageByToolId[toolId];

  return <FeaturePage onBack={onBack} />;
}
