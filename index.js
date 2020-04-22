const merge = require("babel-merge");
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const isDevelopmentEnv = () => process.env.NODE_ENV === "development";
const isProductionEnv = () => process.env.NODE_ENV === "production";
module.exports = api => {
    api.chainWebpack(webpackChain => {
        webpackChain.module
            .rule("compile")
            .use("babel")
            .tap(options =>
                merge(options, {
                    plugins: [[require.resolve("babel-plugin-import"), {
                        "libraryName": "@jdcfe/yep-react",
                        "libraryDirectory": "es",
                        "style": true
                    }]]
                })
            );

        if (isDevelopmentEnv()) {
            webpackChain.module
                .rule('scss')
                .test(/\.(scss)$/)
                .use("style")
                .loader(require.resolve("style-loader"))
                .options({
                    sourceMap: true // FIXME: suport setting from --option
                })
                .end()
                .use("css")
                .loader(require.resolve("css-loader"))
                .options({
                    sourceMap: true // FIXME: suport setting from --option
                })
                .end()
                .use("postcss")
                .loader(require.resolve("postcss-loader"))
                .options({
                    sourceMap: true, // FIXME: suport setting from --option
                    plugins: [
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }),
                        require('postcss-pxtorem')({
                            rootValue: 100,
                            propWhiteList: [],
                        })
                    ],
                })
                .end()
                .use("scss")
                .loader(require.resolve("sass-loader"))
                .options({
                    sourceMap: true,
                })
                .end()
                .end()
        }
        if (isProductionEnv()) {
            webpackChain.module
                .rule("scss")
                .test(/\.(scss)$/)
                .use("mini-css-extract-plugin")
                .loader(MiniCssExtractPlugin.loader)
                .end()
                .use("css")
                .loader(require.resolve("css-loader"))
                .end()
                .use("postcss")
                .loader(require.resolve("postcss-loader"))
                .options({
                    sourceMap: true, // FIXME: suport setting from --option
                    plugins: [
                        require('postcss-preset-env')({
                            autoprefixer: {
                                flexbox: 'no-2009',
                            },
                            stage: 3,
                        }),
                        require('postcss-pxtorem')({
                            rootValue: 100,
                            propWhiteList: [],
                        })
                    ],
                })
                .end()
                .use("scss")
                .loader(require.resolve("sass-loader"))
                .options({
                })
                .end()
                .end();
        }


    });
};
