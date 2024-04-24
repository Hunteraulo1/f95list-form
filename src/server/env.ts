interface EnvironmentDetails {
  executeAs: "USER_DEPLOYING" | "USER_ACCESSING"
  domain: {
    type: "Personal" | "Workspace"
    name: string
  }
}

const ENV: EnvironmentDetails = {
  executeAs: "USER_ACCESSING", // "USER_DEPLOYING" | "USER_ACCESSING"
  domain: {
    type: "Personal",
    name: "",
  },
}

export { ENV }
