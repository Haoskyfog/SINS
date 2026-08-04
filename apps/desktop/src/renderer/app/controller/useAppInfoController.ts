import { useCallback, useEffect, useState } from 'react';
import { loadAppInfo } from '../model/appInfo.api';

type AppInfoState = {
  status: 'loading' | 'ready' | 'error';
  message: string;
};

const createRequestId = () => `app-info-${crypto.randomUUID()}`;

export function useAppInfoController() {
  const [state, setState] = useState<AppInfoState>({
    status: 'loading',
    message: '正在连接本地环境…',
  });

  const refresh = useCallback(async () => {
    setState({ status: 'loading', message: '正在连接本地环境…' });

    try {
      const appInfo = await loadAppInfo(createRequestId());
      setState({ status: 'ready', message: `SINS ${appInfo.version} · ${appInfo.platform}` });
    } catch (error) {
      setState({
        status: 'error',
        message: error instanceof Error ? error.message : '无法读取应用信息',
      });
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { state, refresh };
}
