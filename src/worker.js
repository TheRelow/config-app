'use strict'

const { ipcRenderer } = require("electron")

ipcRenderer.on('ping', (event, message) => {
    console.log(message)
})

ipcRenderer.on('port-selection', (event, message) => {
    console.log(message)
    setTimeout(()=>{
        ipcRenderer.send("port-response");
    }, 500)
    console.log('server response was sent after 0.5 second')
})