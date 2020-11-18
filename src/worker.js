'use strict'

const { ipcRenderer } = require("electron")
// eslint-disable-next-line no-unused-vars
import serialport from "serialport";
// eslint-disable-next-line no-unused-vars
import ModbusRTU from "modbus-serial";

let result = {
  data: []
}

function processRequest(reg_request, message, client) {
  let reg_result = {
    type: reg_request.type,
    address: reg_request.address
  }

  if (client.isOpen) {
    client.setID(message.address);
    client.readInputRegisters(reg_request.address, reg_request.length, function (err, data) {
      if (err) {
        reg_result.value = err
        reg_result.type = 'error'
        console.log(err);
      } else {
        reg_result.value = data
        console.log(data);
      }
    });
  }

  return reg_result
}


ipcRenderer.on('worker-request', (event, message) => {
  console.log('request recived')

  let timerId = setInterval(() => {
    console.log('interval enter')
    ipcRenderer.send("worker-response", result)
    result.data = [];
  }, message.timeout);
  console.log('timer started')

  const client = new ModbusRTU();
  console.log('client started')

  client.connectRTUBuffered(message.port, {
    baudRate: message.baudRate,
    databits: message.databits,
    parity: message.parity,
    stopbits: message.stopbits,
    autoOpen: false,
  })
    .then(()=>{
      console.log('client connected')
      try {
        console.log('for started')
        for (let value of message.data) {
          (async ()=>{
            console.log('for enter')
            let reg_value = await processRequest(value, message, client);
            result.data.push(reg_value);
            console.log(reg_value)
          })();
        }
      }
      catch (e) {
        console.log('for error')
        console.log(e)
      }
    })
    .then(()=>{
      console.log('for finally')
      clearInterval(timerId);
      if (result.data) {
        result.complete = true;
        console.log(result)
        ipcRenderer.send("worker-response", result)
        result.data = [];
        result.complete = false;
      }
      if (client.isOpen) {
        client.close();
      }
    })
    .catch((v)=>{
      throw v
    })
})