const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/a.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname,"dist")
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    { 
                        loader: path.resolve(__dirname, 'loader/replace-loader.js'),
                        // loader自身的选项
                        options: {
                            // replaceRules: {
                            //     rule: /__REPLACE_PARAMS__/g,
                            //     replaceTxt: 'aaaa'
                            // }
                            // replaceRules: [
                            //     {
                            //         rule: /__REPLACE_PARAMS__/g,
                            //         replaceTxt: 'aaaa'
                            //     },
                            //     {
                            //         rule: /__REPLACE_PARAMS_1__/g,
                            //         replaceTxt: 'bbb'
                            //     },
                            //     {
                            //         rule: /__REPLACE_PARAMS_2__/g,
                            //         replaceTxt: 'bb'
                            //     },
                            // ]
                            jsonFile: path.resolve(__dirname, 'config/repalce.json')
                        }
                    }
                ]
            },
        ]
    },
    // plugins: [
    //     new AfterPlugin()
    // ]
}