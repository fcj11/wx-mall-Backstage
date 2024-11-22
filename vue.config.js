const { defineConfig } = require('@vue/cli-service')
const webpack = require('webpack')

module.exports = defineConfig({
  publicPath: '/',
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          ...process.env,
          VUE_APP_API_BASE_URL: JSON.stringify(process.env.VUE_APP_API_BASE_URL || '/api'),
          NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development')
        }
      })
    ]
  }
}) 