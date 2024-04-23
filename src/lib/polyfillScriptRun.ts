// @ts-nocheck
import getMockEndpoints from "./mocks/API";
let polyfilled = false;

const polyfillScriptRun = async () => {
  if (polyfilled) return;
  polyfilled = true;

  const _window = window ?? globalThis ?? {};

  const google = _window.google || {};
  _window.google = google;

  if (!google.script || !google.script.run) {
    const mocks = getMockEndpoints();
    google.script = google.script || {};
    google.script.run = {
      withSuccessHandler: (resolve: any) => {
        return {
          withFailureHandler: (reject: any) => {
            const wrappedMocks: any = {};
            for (const [key, value] of (Object as any).entries(mocks)) {
              wrappedMocks[key] = async (...args: any) => {
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
        };
      },
    };
  }
};

export default polyfillScriptRun;
