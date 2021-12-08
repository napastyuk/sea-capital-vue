module.exports = {
    //отключаем линтинг
    lintOnSave: false,

    //настраиваем пути для ci/cd
    publicPath: '/',
    // publicPath: process.env.NODE_ENV === 'development'
    //     ? '/sea-capital-spa/'
    //     : '/',

    chainWebpack: (config) => {
        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();

        svgRule
            .use('babel-loader')
            .loader('babel-loader')
            .end()
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({svgo: false})
    },
}