let transformRemoveConsolePlugin = []
//生产环境
if (process.env.NODE_ENV === 'production') {
  transformRemoveConsolePlugin = ['transform-remove-console']
}

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ...transformRemoveConsolePlugin
  ]
}
