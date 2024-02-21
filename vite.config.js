import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: ``,
  
  build: {
    outDir: './docs',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        html1: resolve(__dirname, 'html/retrogames.html'),
        html2: resolve(__dirname, 'html/riseofkingdoms.html'),
        img1: resolve(__dirname, 'img/80millionpower.png'),
        img2: resolve(__dirname, 'img/anuncio-movil.png'),
        img3: resolve(__dirname, 'img/juegos-retro-80.jpg'),
      },
      
    },
  },
})


