import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from "path";
import svgr from "vite-plugin-svgr";
import viteCompression from "vite-plugin-compression";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // 如果报错__dirname找不到，需要安装node,执行yarn add @types/node --save-dev
      "@": resolve(__dirname, "./src"),
      "~antd": resolve(__dirname, "./node_modules/antd")
    }
  },
  plugins: [react(), svgr(), viteCompression(),],
  server: {
    proxy: {
      "/api": {
        target: "http://stg-mlp-api-gateway.deeproute.cn/evaluation/v1/clearml/api/v2.23",
        changeOrigin: true,
        rewrite: (path) => path.replace("/api", ""),
        bypass: (r, s, o) => {
          r.headers["X-DR-Swimlane"] = '(ml-platform-api-evaluation=swimlane-00)'
          console.log(r.url)
        }
      },
      "/auth": {
        target: "http://stg-mlp-api-gateway.deeproute.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace("/auth", ""),
        bypass: (r, s, o) => {
          r.headers["X-DR-Swimlane"] = '(ml-platform-api-evaluation=swimlane-00)'
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
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/chunk-[hash].js",
        assetFileNames: (e) => {
          let dir = "";
          if (e.name) {
            const ext = e.name.split(".")[1];
            if (["eot", "ttf", "woff", "woff2"].indexOf(ext) !== -1) {
              dir = "fonts";
            }
            if (["svg", "png", "jpg", "jpeg"].indexOf(ext) !== -1) {
              dir = "images";
            }
            if (["css", "scss"].indexOf(ext) !== -1) {
              dir = "css";
            }
          }
          return "static/" + dir + "/" + "chunk-[hash][extname]";
        },
        entryFileNames: "static/js/index.[hash].js"
      }
    }
  }
})
