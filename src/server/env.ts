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

const F95host = 'https://f95zone.to';

export { ENV, F95host };
