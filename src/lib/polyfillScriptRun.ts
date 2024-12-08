import getMockEndpoints from './mocks/Api';
let polyfilled = false;

const polyfillScriptRun = async (): Promise<void> => {
  if (polyfilled) return;
  polyfilled = true;

  const _window = typeof window === 'undefined' ? globalThis : window;

  const google = _window.google || {};
  _window.google = google;

  if (google.script?.run) return;

  const mocks = getMockEndpoints();
  google.script = google.script || {};
  Object.defineProperty(google.script, 'run', {
    value: {
      withSuccessHandler: (resolve: (result: unknown) => void): unknown => ({
        withFailureHandler: (reject: (error: unknown) => void): unknown => {
          const wrappedMocks: Record<string, (...args: unknown[]) => Promise<void>> = {};
          for (const [key, value] of Object.entries(mocks) as [string, (...args: unknown[]) => Promise<unknown>][]) {
            wrappedMocks[key] = async (...args: unknown[]): Promise<void> => {
              try {
                const result = await value(...args);
                resolve(result);
              } catch (error) {
                reject(error);
              }
            };
          }
          return wrappedMocks;
        },
      }),
    },
  });
};

polyfillScriptRun();
