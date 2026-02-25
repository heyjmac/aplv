import { defineConfig } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[64, 'favicon.ico'], [48, 'favicon-48x48.png']],
    },
    maskable: {
      sizes: [512],
      padding: 0.1,
      resizeOptions: { background: '#ffffff' },
    },
    apple: {
      sizes: [180],
      padding: 0.1,
      resizeOptions: { background: '#ffffff' },
    },
  },
  images: ['public/icon.svg'],
})
