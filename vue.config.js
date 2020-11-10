module.exports = {
    pages: {
        index: {
            // Entry page for the app
            entry: 'src/main.js'
        },
        worker: {
            // Worker
            entry: 'src/worker.js'
        }
    },
    pluginOptions: {
        electronBuilder: {
            externals: ['serialport'],
            nodeIntegration: true
        }
    }
}
