import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    plugins: [
        VitePWA({
            includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
            manifest: {
              name: 'BPM Metronome',
              short_name: 'BPM',
              description: 'Cool Metronome',
              theme_color: 'rgb(33, 37, 41)',
              icons: [
                {
                  src: 'pwa-192x192.png',
                  sizes: '192x192',
                  type: 'image/png'
                },
                {
                  src: 'pwa-512x512.png',
                  sizes: '512x512',
                  type: 'image/png'
                }
              ]
            },
            registerType: 'autoUpdate',
        }),
        vue(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
