const { defineConfig } = require("@vue/cli-service");
const TerserPlugin = require("terser-webpack-plugin");
const Timestamp = new Date().getTime();
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

  configureWebpack: (config) => {
    config.optimization.minimizer = [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false,
          compress: {
            drop_console: true, //是否清除所有console
            drop_debugger: true, //是否清除debugger
            pure_funcs: [
              "console.log",
              "console.info",
              "console.warn",
              "console.debug",
            ], //drop_console 设置false,需要特殊清除的
          },
          warnings: false,
          mangle: true,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ];

    config.output.filename = `[name].${Timestamp}.js`;
    config.output.chunkFilename = `[name].${Timestamp}.js`;
  },

  chainWebpack: (config) => {
    config.optimization.minimize(true);
    config.optimization.splitChunks({
      chunks: "all",
      maxInitialRequests: Infinity,
      maxSize: 20000,
      cacheGroups: {
        vendor: {
          reuseExistingChunk: false,
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(
              /[\\/]node_modules[\\/]([^\\/]+)([\\/]|$)/
            )[1];

            // npm package names are URL-safe, but some servers don't like @ symbols
            return `vendor_${packageName.replace("@", "")}`;
          },
        },
      },
    });
  },

  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
