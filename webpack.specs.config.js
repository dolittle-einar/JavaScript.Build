module.exports = {
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                enforce: 'post',
                exclude: /node_modules|\.spec\.js$/                
            },
            
            /*
            {
                test: /\.js/,
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: { esModules: true }
                },
                enforce: 'post',
                exclude: /node_modules|\.spec\.js$/                
            }*/
        ]
    }
};