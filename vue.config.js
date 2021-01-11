module.exports = {
    pages: {
        index: {
            // Entry page for the app
            entry: 'src/main.js'
        }
    },
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            nodeIntegration: true
        }
    }
}
