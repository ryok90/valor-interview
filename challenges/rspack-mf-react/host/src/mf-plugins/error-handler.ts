import { FederationRuntimePlugin } from '@module-federation/enhanced/runtime';

const errorHandler = (): FederationRuntimePlugin => ({
  name: 'my-custom-error-handler-plugin',
  errorLoadRemote: async ({ from, error }) => {
    const component = () => 'Error while loading remote component: ' + error;

    // Workaround to deal with build modules.
    let mod;
    if (from === 'build') {
      mod = () => ({
        __esModule: true,
        default: component,
      });
    } else {
      mod = {
        default: component,
      };
    }

    return mod;
  },
});

export default errorHandler;
