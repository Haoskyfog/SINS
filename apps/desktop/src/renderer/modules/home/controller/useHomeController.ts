import { useCallback, useEffect, useState } from 'react';
import { loadAppInfo } from '../model/home.api';
import type { HomeState } from '../model/home.types';

const createRequestId = () => `app-info-${crypto.randomUUID()}`;

export function useHomeController() {
  const [state, setState] = useState<HomeState>({ status: 'loading' });

  const refresh = useCallback(async () => {
    setState({ status: 'loading' });

    try {
      const appInfo = await loadAppInfo(createRequestId());
      setState({ status: 'ready', appInfo });
    } catch (error) {
      setState({
        status: 'error',
        errorMessage: error instanceof Error ? error.message : '无法读取应用信息',
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { state, refresh };
}
