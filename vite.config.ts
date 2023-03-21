import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 如果报错__dirname找不到，需要安装node,执行yarn add @types/node --save-dev
      "@": resolve(__dirname, "./src"),
      "~antd": resolve(__dirname, "./node_modules/antd")
    }
  },
  plugins: [react(), svgr()],
  server: {
    proxy: {
      "/api": {
        target: "http://dev-mlp-api-gateway.deeproute.cn/evaluation/v1/clearml/api/v2.23",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api", ""),
        bypass: (r, s, o) => {
          console.log(r.url)
        }
      },
      "/auth": {
        target: "http://dev-mlp-api-gateway.deeproute.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace("/auth", ""),
        bypass: (r, s, o) => {
          console.log(r.url)
        }
      },
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "@/styles/var.scss";`
      }
    },
    postcss: {
      plugins: [{
        postcssPlugin: "internal:charset-removal",
        AtRule: {
          charset: (rule) => {
            if (rule.name === "charset") {
              rule.remove();
            }
          }
        }
      }]
    }
  },
  build: {
    minify: "esbuild",
  }
})
