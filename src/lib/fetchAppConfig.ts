import { GAS_API } from "./GAS_API"
import { appConfiguration, isLoading } from "./stores"

/**
 * Fetches the app configuration from the server.
 */
export const fetchAppConfiguration = async () => {
  isLoading.set(true)

  console.info("fetching app configuration...")

  try {
    const result = await GAS_API.getAppConfiguration()

    appConfiguration.set(result)
  } catch (error) {
    console.error("Could not get app configuration:", error)
  } finally {
    console.info("App configuration loaded.")
    isLoading.set(false)
  }
}
