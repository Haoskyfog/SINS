export type IpcResult<T> =
  | { ok: true; data: T; requestId: string }
  | {
      ok: false;
      error: { code: string; message: string; retryable: boolean };
      requestId: string;
    };

export type AppInfo = {
  name: string;
  version: string;
  platform: NodeJS.Platform;
};

export type AppApi = {
  getInfo: (requestId: string) => Promise<IpcResult<AppInfo>>;
};
