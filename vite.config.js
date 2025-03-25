// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'path'

export default defineConfig(async ({ mode }) => {
  const { default: openInEditor } = await import('launch-editor-middleware')

  const openInEditorPlugin = () => ({
    name: 'vite-plugin-open-in-editor',
    configureServer(server) {
      server.middlewares.use('/__open-in-editor', openInEditor('webstorm'))
    },
  })

  return {
    plugins: [
      vue(),
      mode === 'development' ? vueDevTools() : null,
      openInEditorPlugin(),
    ].filter(Boolean),

    server: {
      port: 5173,
      host: true,
    },

    resolve: {
      alias: {
        '@': path.resolve('./src'),
      },
    },
  }
})
