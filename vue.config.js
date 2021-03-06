const isProd = process.env.NODE_ENV === 'production'

/** @type {import('@vue/cli-service').ProjectOptions} */
module.exports = {
    publicPath: `/`,
    // assetsDir: process.env.VUE_APP_ASSETS,
    // runtimeCompiler: true,
    // lintOnSave: true,
    configureWebpack () {
    },
    // 默认babel-loader会忽略node_modules中的文件
    // 但是dolphin-plugin-tools用了es6的语法, 配置对其显示转译
    // 配合babel sourceType: 'unambiguous'来使用 https://github.com/babel/babel/issues/9187,
    transpileDependencies: [
    ],
    chainWebpack: (config) => {

    },
    // 用于开发环境下与后端联调
    // 如有需要, 还可以配合easy-proxy进行使用
    devServer: {
        // 如果改动node_modules内的代码, 不会触发热重载, 则取消下面的注释
        // watchOptions: {
        //   ignored: []
        // },
        proxy: {
            '^/': {
                target: 'http://120.78.155.149:3001',
                changeOrigin: true,
                https: true,
            }
        },
        https: true
    }
}
