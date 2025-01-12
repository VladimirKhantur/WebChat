const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  configureWebpack: {
    entry: path.resolve(__dirname, 'src/app/main.js'), 
  },
});