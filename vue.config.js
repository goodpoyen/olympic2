const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
const chalk = require("chalk");
const timestamp = new Date().getTime();

module.exports = defineConfig({
  // 生產環境的靜態資源路徑（若部署在子路徑，請修改此處，例如 '/my-app/'）
  publicPath: "/",

  // 打包輸出的目錄名稱，預設為 dist
  outputDir: "dist",

  // 放置生成的靜態資源 (js、css、img、fonts) 的目錄
  assetsDir: "static",

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

  configureWebpack: (config) => {
    // 1. 檔案命名與快取控制（加入時間戳記防止瀏覽器快取舊代碼）
    config.output.filename = `js/[name].${timestamp}.js`;
    config.output.chunkFilename = `js/[name].${timestamp}.js`;

    // 2. 任何環境都適用的外掛（如：漂亮的打包進度條）
    config.plugins.push(
      new ProgressBarPlugin({
        format: `  打包進度 [:bar] ${chalk.green.bold(
          ":percent",
        )} (:elapsed 秒)`,
        clear: false,
      }),
    );

    // 3. 僅在生產環境（Production）生效的進階優化
    // 3a. 啟用 Gzip 壓縮（大幅縮減 JS/CSS 傳輸體積，需後端 Nginx/CDN 配合開啟 gzip_static）
    config.plugins.push(
      new CompressionWebpackPlugin({
        algorithm: "gzip",
        test: /\.(js|css|html|svg)$/, // 壓縮這些類型的檔案
        threshold: 10240, // 超過 10KB 的檔案才壓縮
        minRatio: 0.8, // 壓縮率小於 0.8 才壓縮
      }),
    );

    // 3b. 效能分析工具（可選：執行 `npm run build --report` 時才啟動分析）
    if (process.env.npm_config_report) {
      config.plugins.push(new BundleAnalyzerPlugin());
    }

    // 3c. 修改 Webpack 5 內建的 Terser（移除 console/debugger）
    const TerserPlugin = config.optimization.minimizer.find(
      (p) => p.constructor.name === "TerserPlugin",
    );
    if (TerserPlugin) {
      TerserPlugin.options.parallel = true;
      TerserPlugin.options.extractComments = false;
      TerserPlugin.options.terserOptions = {
        ...TerserPlugin.options.terserOptions,
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            "console.log",
            "console.info",
            "console.warn",
            "console.debug",
          ],
        },
        mangle: true,
        output: { comments: false },
      };
    }
  },

  chainWebpack: (config) => {
    // Vue 3 功能標籤優化
    config.plugin("feature-flags").tap((args) => {
      args.__VUE_OPTIONS_API__ = true;
      args.__VUE_PROD_DEVTOOLS__ = false;
      args.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
      return args;
    });

    // 4. 利用 Webpack 5 的持久化快取 (Persistent Cache) 提升二次打包與開發啟動速度
    config.cache({
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    });

    // 5. 強化版分包策略
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: "all",
      maxInitialRequests: Infinity,
      minSize: 30000,
      maxSize: 400000, // 提高上限至 400KB，避免過度碎片化
      cacheGroups: {
        runtime: {
          test: /[\\/]node_modules[\\/](@vue|vue|vue-router|pinia|vuex)[\\/]/,
          name: "vendor_core",
          priority: 20,
          chunks: "initial",
        },
        // 將 Vuetify 單獨抽離，因為 UI 庫體積通常較大
        vuetify: {
          test: /[\\/]node_modules[\\/]vuetify[\\/]/,
          name: "vendor_vuetify",
          priority: 15,
          chunks: "initial",
        },
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
  },

  pluginOptions: {
    vuetify: {},
  },
});
