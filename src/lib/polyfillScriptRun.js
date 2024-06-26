import getMockEndpoints from './mocks/API'
let polyfilled = false

const polyfillScriptRun = async () => {
  if (polyfilled) return
  polyfilled = true

  // eslint-disable-next-line no-undef
  const _window = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : {}

  const google = _window.google || {}
  _window.google = google

  if (!google.script || !google.script.run) {
    const mocks = getMockEndpoints()
    google.script = google.script || {}
    google.script.run = {
      withSuccessHandler: (resolve) => {
        return {
          withFailureHandler: (reject) => {
            const wrappedMocks = {}
            for (const [key, value] of Object.entries(mocks)) {
              wrappedMocks[key] = async (...args) => {
                try {
                  const result = await value(...args)
                  resolve(result)
                } catch (error) {
                  reject(error)
                }
              }
            }
            return wrappedMocks
          },
        }
      },
    }
  }
}

polyfillScriptRun()
