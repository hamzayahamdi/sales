import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import macrosPlugin from 'vite-plugin-babel-macros'
import eslint from 'vite-plugin-eslint'
import path from 'path'

// https://vitejs.dev/config/

export default defineConfig({
    plugins: [
        react(),
        eslint(),
        svgrPlugin(),
        macrosPlugin(),
    ],
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            treeshake: 'recommended',
            output: {
                manualChunks: undefined,
            }
        }
    },
    server: {
        port: 3000,
        historyApiFallback: true,
        proxy: {
            '/api': {
                target: 'https://ratio.sketchdesign.ma/ratio',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
                secure: false,
                configure: (proxy, _options) => {
                    proxy.on('error', (err, _req, _res) => {
                        console.log('proxy error', err);
                    });
                    proxy.on('proxyReq', (proxyReq, req, _res) => {
                        console.log('Sending Request to the Target:', req.method, req.url);
                    });
                    proxy.on('proxyRes', (proxyRes, req, _res) => {
                        console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
                    });
                }
            }
        }
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@layout': '/src/layout',
            '@ui': '/src/ui',
            '@pages': '/src/pages',
            '@assets': '/src/assets',
            '@styles': '/src/styles',
            '@db': '/src/db',
            '@hooks': '/src/hooks',
            '@fonts': '/src/fonts',
            '@utils': '/src/utils',
            '@widgets': '/src/widgets',
            '@contexts': '/src/contexts',
            '@constants': '/src/constants',
            '@config': path.resolve(__dirname, './src/config'),
        }
    },
    define: {
        'process.env': process.env
    }
})
