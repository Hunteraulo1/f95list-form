interface EnvironmentDetails {
  domain: {
    type: 'Personal' | 'Workspace';
    name: string;
  };
}

const ENV: EnvironmentDetails = {
  domain: {
    type: 'Personal',
    name: '',
  },
};

export { ENV };
