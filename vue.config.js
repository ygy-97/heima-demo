module.exports = {
    publicPath: './',
    chainWebpack: config => {
        //发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
            config.set('externals', {//cdn
                'vue': 'Vue',
                'vue-router': 'VueRouter',
                'axios': 'axios',
                'echarts': 'echarts',
                'nprogress': 'NProgress',
                'vue-quill-editor': 'VueQuillEditor'
            })
            config.plugin('html').tap(args=>{
                args[0].isProduction = true;
                return args
            })
        })

        // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
            config.plugin('html').tap(args=>{
                args[0].isProduction = false;
                return args
            })
        })
    }
}