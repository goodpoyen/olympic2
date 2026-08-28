const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const timestamp = new Date().getTime();
module.exports = defineConfig({
  devServer: {
    host: "0.0.0.0",
    port: process.env.VUE_APP_LOCALPORT,
    https: false,
    // public: "http://140.122.183.174:8080"

    // proxy: {
    //   '/api': {
    //     target: process.env.VUE_APP_APISERVERURL,
    //     changOrigin: true,
    //     pathRewrite: {
    //       '^/api': ''
    //     }
    //   }
    // }
  },

  transpileDependencies: true,
  productionSourceMap: false,
  lintOnSave: false,

  // Webpack 原生變更 (Webpack 5 風格)
  configureWebpack: (config) => {
    // 輸出檔案名稱加上時間戳記，並統一分類到 js 資料夾
    config.output.filename = `js/[name].${timestamp}.js`;
    config.output.chunkFilename = `js/[name].${timestamp}.js`;

    // 僅在生產環境（Production）進行壓縮與代碼混淆
    if (process.env.NODE_ENV === "production") {
      // 善用 Webpack 5 內建的 terser 設置，無需另外 require 插件
      const TerserPlugin = config.optimization.minimizer.find(
        (p) => p.constructor.name === "TerserPlugin",
      );

      if (TerserPlugin) {
        TerserPlugin.options.parallel = true;
        TerserPlugin.options.extractComments = false; // 不產出獨立的 .LICENSE.txt 註解檔案
        TerserPlugin.options.terserOptions = {
          ...TerserPlugin.options.terserOptions,
          compress: {
            drop_console: true, // 移除 console
            drop_debugger: true, // 移除 debugger
            pure_funcs: [
              "console.log",
              "console.info",
              "console.warn",
              "console.debug",
            ],
          },
          mangle: true, // 開啟代碼混淆
          output: {
            comments: false, // 移除所有程式碼註解
          },
        };
      }
    }
  },

  // Webpack 鏈式配置（優化分包策略與 Vue 3 特性標籤）
  chainWebpack: (config) => {
    // Vue 3 功能標籤優化 (Feature Flags)，關閉不需要的功能可減少 Tree Shaking 體積
    config.plugin("feature-flags").tap((args) => {
      args[0].__VUE_OPTIONS_API__ = true; // 如果你完全使用 Composition API，可改為 false 縮減體積
      args[0].__VUE_PROD_DEVTOOLS__ = false; // 生產環境關閉 Devtools
      args[0].__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false; // 關閉不必要的錯誤詳情
      return args;
    });

    if (process.env.NODE_ENV === "production") {
      config.optimization.minimize(true);
      config.optimization.splitChunks({
        chunks: "all",
        maxInitialRequests: Infinity,
        minSize: 30000, // Webpack 5 預設建議 30KB
        maxSize: 300000, // 單個檔案最大限制（300KB），超過會再拆分
        cacheGroups: {
          // 基礎公共庫（通常包含 vue, vue-router, vuetify 等）
          runtime: {
            test: /[\\/]node_modules[\\/](@vue|vue|vue-router|pinia|vuex)[\\/]/,
            name: "vendor_core",
            priority: 20,
            chunks: "initial",
          },
          // 剩餘的第三方套件
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            name(module) {
              const match = module.context.match(
                /[\\/]node_modules[\\/]([^\\/]+)([\\/]|$)/,
              );
              const packageName = match ? match[1] : "pack";
              return `vendor_${packageName.replace("@", "")}`;
            },
            reuseExistingChunk: true,
          },
        },
      });
    }
  },

  pluginOptions: {
    vuetify: {
      // https://github.com
    },
  },
});
