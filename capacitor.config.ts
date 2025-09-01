import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.25b7087171bc480c9cf0371c400e77ba',
  appName: 'code-splinter-mentor',
  webDir: 'dist',
  server: {
    url: 'https://25b70871-71bc-480c-9cf0-371c400e77ba.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;