import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.noah.conductor',
  appName: 'NOAH Conductor',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
}

export default config
