import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        
        sassOptions: {
          quietDeps: true, // This silences warnings from dependencies, including the legacy JS API warning
          // silenceDeprecations: ['legacy-js-api'], // Not needed here as `quietDeps` should handle it
        },
      },
    },
  },
})
