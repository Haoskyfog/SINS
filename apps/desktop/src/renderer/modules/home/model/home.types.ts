import type { AppInfo } from '@sins/contracts';

export type HomeState = {
  status: 'loading' | 'ready' | 'error';
  appInfo?: AppInfo;
  errorMessage?: string;
};
