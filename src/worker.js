'use strict'

const { ipcRenderer } = require("electron")
// eslint-disable-next-line no-unused-vars
import ModbusRTU from "modbus-serial";
import { fn } from './modules/ModbusWorker'

// eslint-disable-next-line no-unused-vars
let result = {
  data: []
}

// eslint-disable-next-line no-unused-vars
function processRequest(reg_request, message, client) {

  console.log('message', message)
  console.log('reg_request', reg_request)

  let reg_result = {
    port: message.port,
    portAddress: message.address,
    fullPath: message.fullPath,
    type: reg_request.type,
    address: reg_request.address
  };

  return new Promise((resolve, reject)=>{

    switch (reg_request.type) {
      case "FC4":
        new Promise((resolveR, rejectR) => {
          console.log('myMessage', message)
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

      case "FC3":
        new Promise((resolveR, rejectR) => {
          if (client.isOpen) {
            client.setID(message.address);
            client.readHoldingRegisters(reg_request.address, reg_request.length, function (err, data) {
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

      case "write":
        // eslint-disable-next-line no-unused-vars
        new Promise((resolveR, rejectR) => {
          if (client.isOpen) {
            client.setID(message.address);
            client.writeRegisters(reg_request.address, reg_request.value)
            if (client.isOpen) {
              client.close();
            }
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


// eslint-disable-next-line no-unused-vars
ipcRenderer.on('worker-request', (event, message) => {

  console.log('event', event)
  console.log('message', message)

  fn(message)

  // const client = new ModbusRTU();
  //
  // let unixtimestamp;
  //
  // client.setID(247);
  //
  // client.connectRTUBuffered("COM5", { baudRate: 9600 }, write)
  //
  // function read() {
  //   // read the 2 registers starting at address 5
  //   // on device number 1.
  //   client.readHoldingRegisters(30000, 2).then(function (data) {
  //     unixtimestamp = (data.data[0] << 16) + data.data[1];
  //     console.log("Date is: " + new Date(unixtimestamp * 1000));
  //     if (client.isOpen) {
  //       client.close();
  //     }
  //   });
  // }
  //
  // function write() {
  //   unixtimestamp = new Date("2020.01.01").getTime() / 1000;
  //   let data = [unixtimestamp >> 16, unixtimestamp & 0xffff];
  //
  //   console.log("Setting date: " + new Date(unixtimestamp * 1000));
  //   client.writeRegisters(30000, data)
  //     .then(read)
  //     .catch((e)=>{
  //       console.log(e)
  //     });
  // }

  // let intervalEnters = 0;
  //
  // let timerId = setInterval(() => {
  //   ipcRenderer.send("worker-response", result)
  //   result.data = [];
  //   if (intervalEnters++ > 4) {
  //     clearInterval(timerId);
  //     ipcRenderer.send("worker-response", "Timeout")
  //     if (client.isOpen) {
  //       client.close();
  //     }
  //   }
  // }, message.timeout);
  //
  // console.log(message)

  // client.connectRTUBuffered(message.port, {
  //   baudRate: message.baudRate,
  //   databits: message.databits,
  //   parity: message.parity,
  //   stopbits: message.stopbits,
  //   autoOpen: false,
  // })
  //   .then(()=>{
  //     return new Promise(((resolve, reject) => {
  //       if (client.isOpen) {
  //         client.setID(247);
  //         client.readHoldingRegisters(30000, 2, function (err, data) {
  //           if (err) {
  //             console.log(err);
  //             reject(err)
  //           } else {
  //             console.log('data', data.data);
  //             console.log('data.buffer', data.buffer);
  //             resolve()
  //           }
  //         });
  //       }
  //     }))
  //   })
  //   .then(()=>{
  //     client.writeRegisters(30000, [24519,35752])
  //       .then((s)=>{
  //         console.log('s', s)
  //       })
  //   })
  //   .then(()=>{
  //     return new Promise(((resolve, reject) => {
  //       if (client.isOpen) {
  //         client.setID(247);
  //         client.readHoldingRegisters(30000, 2, function (err, data) {
  //           if (err) {
  //             console.log(err);
  //             reject(err)
  //           } else {
  //             console.log('data', data.data);
  //             console.log('data.buffer', data.buffer);
  //             resolve()
  //           }
  //           if (client.isOpen) {
  //             client.close();
  //           }
  //         });
  //       }
  //     }))
  //   })
    // .then(()=>{
    //   return new Promise((resolve)=>{
    //     try {
    //       for (let value of message.data) {
    //         console.log('message', message)
    //         let reg_value = null;
    //         processRequest(value, message, client)
    //           .then((v)=>{
    //             reg_value = v
    //             result.data.push(reg_value);
    //             resolve()
    //             intervalEnters = 0
    //           })
    //           .catch((v)=>{
    //             reg_value = v
    //             result.data.push(reg_value);
    //             resolve()
    //             intervalEnters = 0
    //           })
    //       }
    //     }
    //     catch (e) {
    //       console.log(e)
    //     }
    //   })
    // })
    // .then(()=>{
    //   if (result.data) {
    //     result.complete = true;
    //     ipcRenderer.send("worker-response", result)
    //   }
    // })
    // .catch(()=>{
    //   result.complete = true;
    //   ipcRenderer.send("worker-response", 'Доступ запрещен')
    //   if (client.isOpen) {
    //     client.close();
    //   }
    // })
    // .then(()=>{
    //   if (client.isOpen) {
    //     client.close();
    //   }
    // })
    // .finally(()=>{
    //   clearInterval(timerId);
    //   result.data = [];
    //   result.complete = false;
    //   if (client.isOpen) {
    //     client.close();
    //   }
    // })
})
