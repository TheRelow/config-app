'use strict'

const { ipcRenderer } = require("electron")
import ModbusRTU from "modbus-serial";

let result = {
  data: []
}

function processRequest(reg_request, message, client) {

  let reg_result = {
    type: reg_request.type,
    address: reg_request.address
  };

  return new Promise((resolve, reject)=>{

    switch (reg_request.type) {
      case "FC4":
        new Promise((resolveR, rejectR) => {
          if (client.isOpen) {
            client.setID(message.address);
            client.readInputRegisters(reg_request.address, reg_request.length, function (err, data) {
              if (err) {
                reg_result.value = err
                reg_result.type = 'error'
                if (client.isOpen) {
                  client.close();
                }
                rejectR(reg_result)
              } else {
                reg_result.value = data
                console.log(data)
                resolveR(reg_result)
                if (client.isOpen) {
                  client.close();
                }
              }
            });
          }
        }).then(r=>{
          resolve(r)
        }).catch(r=>{
          reg_result.value = null
          reg_result.type = r
          reject(reg_result)
        })
        break;

      default:
        reg_result.value = null
        reg_result.type = 'Unknown reqeust type'
        break;
    }
  })

}


ipcRenderer.on('worker-request', (event, message) => {

  let intervalEnters = 0;

  let timerId = setInterval(() => {
    ipcRenderer.send("worker-response", result)
    result.data = [];
    if (intervalEnters++ > 4) {
      clearInterval(timerId);
      ipcRenderer.send("worker-response", "Timeout")
    }
  }, message.timeout);

  const client = new ModbusRTU();

  console.log(message)

  client.connectRTUBuffered(message.port, {
    baudRate: message.baudRate,
    databits: message.databits,
    parity: message.parity,
    stopbits: message.stopbits,
    autoOpen: false,
  })
    .then(()=>{
      return new Promise((resolve)=>{
        try {
          for (let value of message.data) {
            let reg_value = null;
            processRequest(value, message, client)
              .then((v)=>{
                reg_value = v
                result.data.push(reg_value);
                resolve()
                intervalEnters = 0
              })
              .catch((v)=>{
                reg_value = v
                result.data.push(reg_value);
                resolve()
                intervalEnters = 0
              })
          }
        }
        catch (e) {
          console.log(e)
        }
      })
    })
    .then(()=>{
      if (result.data) {
        result.complete = true;
        ipcRenderer.send("worker-response", result)
      }
    })
    .catch(()=>{
      result.complete = true;
      ipcRenderer.send("worker-response", 'Доступ запрещен')
    })
    .finally(()=>{
      clearInterval(timerId);
      result.data = [];
      result.complete = false;
      if (client.isOpen) {
        client.close();
      }
    })
})