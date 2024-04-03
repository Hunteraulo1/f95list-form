import getMockEndpoints from "./mocks/_API";
let polyfilled = false;

export default async function polyfillScriptRun() {
  if (polyfilled) return;
  polyfilled = true;

  const _window: any =
    typeof window !== "undefined"
      ? window
      : typeof globalThis !== "undefined"
      ? globalThis
      : {};

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
}
