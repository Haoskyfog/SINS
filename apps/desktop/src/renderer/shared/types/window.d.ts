import type { AppApi } from '@sins/contracts';

declare global {
  interface Window {
    sins?: AppApi;
  }
}

export {};
