const path = require('path');

module.exports = {
    mode: 'production',
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        library: {
            name: 'policy',
            type: 'var',
            export: 'default'
        }
    },
};