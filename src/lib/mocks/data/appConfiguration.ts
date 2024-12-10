import { user } from './user';

export const appConfiguration = {
  appName: 'Mock App',
  deployingUserEmail: user.email,
  webhooks: {
    update: '',
    logs: '',
    traductor: '',
  },
};
