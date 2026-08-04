import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sathimate.app',
  appName: 'Sathimate',
  webDir: 'out',
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB' // Use App Bundle instead of APK
    }
  },
  server: {
    androidScheme: 'https',
    url: 'https://sathimate.com',
    cleartext: false
  }
};

export default config;

