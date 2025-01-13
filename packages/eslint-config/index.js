import baseConfig from './base.js';
import nextConfig from './next.js';
import reactInternalConfig from './react-internal.js';

export { baseConfig, nextConfig, reactInternalConfig };

// Default export for backwards compatibility
export default {
  extends: ['./base.js'],
};
