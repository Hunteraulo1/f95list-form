import { getAppConfiguration } from "./api/getAppConfiguration";
import { getTest } from "./api/getTest";
import { getUser } from "./api/getUser";
import { getViewConfiguration } from "./api/getViewConfiguration";
import { getViewData } from "./api/getViewData";
import { putAppConfiguration } from "./api/putAppConfiguration";
import { putUser } from "./api/putUser";

type MockEndpoints = {
  // App Configuration
  getAppConfiguration: typeof getAppConfiguration;
  putAppConfiguration: typeof putAppConfiguration;

  // User
  getUser: typeof getUser;
  putUser: typeof putUser;

  // Test
  getTest: typeof getTest;

  // Views
  getViewConfiguration: typeof getViewConfiguration;
  getViewData: typeof getViewData;
};

export default function getMockEndpoints(): MockEndpoints {
  return {
    // App Configuration
    getAppConfiguration,
    putAppConfiguration,

    // User
    getUser,
    putUser,

    // Test
    getTest,

    // Views
    getViewConfiguration,
    getViewData,
  };
}
