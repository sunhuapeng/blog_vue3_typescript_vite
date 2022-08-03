import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path';
import Markdown from 'vite-plugin-md'

const pathResolve = (pathStr: string) => {
  return path.resolve(__dirname, pathStr);
};

const model = (mode) => loadEnv(mode, process.cwd())

module.exports = ({ mode }) => {
  return defineConfig({
    base: model(mode).VITE_APP_NAME||'/',
    build: {
      assetsDir: 'assets'
    },
    plugins: [
      vue({ include: [/\.vue$/, /\.md$/], }), 
      vueJsx(), 
      Markdown(),
    ],
    server: {
      host: 'localhost',
      port: 8080,
      // 是否开启 https
      https: false,
    },
    resolve: {
      alias: {
        '@': pathResolve('./src'),
      },
    }
  });
}
