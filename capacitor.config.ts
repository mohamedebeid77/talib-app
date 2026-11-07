import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.talib.app',
  appName: 'طالب',
  webDir: 'dist',
  android: {
    backgroundColor: '#0A0B0E',
    allowMixedContent: false,
    captureInput: true,
  },
  plugins: {
    Filesystem: {},
    Preferences: {},
  },
};

export default config;
