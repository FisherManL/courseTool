import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tsconfigPaths from 'vite-tsconfig-paths'
import topLevelAwait from 'vite-plugin-top-level-await'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.ELECTRON == "true" ? '/dist/' : "",
  plugins: [
    vue(),
    tsconfigPaths(),
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    })
  ],
  optimizeDeps: {
    include: ["xlsx"]
  },
  // build: {
  //   rollupOptions: {
  //     input: {
  //       main: resolve(__dirname, 'index.html'),
  //     }
  //   }
  // }

})
