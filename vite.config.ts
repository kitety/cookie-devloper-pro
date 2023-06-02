import webExtension from '@samrum/vite-plugin-web-extension'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
// import eslint from 'vite-plugin-eslint'
import manifest from './src/manifest'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 9999,
  },
  plugins: [
    vue(),
    AutoImport({
      dts: true,
      imports: ['vue', '@vueuse/core'],
      resolvers: [ElementPlusResolver()],
      eslintrc: {
        enabled: true, // <-- this
      },
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    webExtension({
      manifest: {
        ...manifest,
      },
    }),
  ],
})
