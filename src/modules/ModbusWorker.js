"use strict";
const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

function close() {
  console.log('close')
  if (client.isOpen) {
    client.close();
  }
}

// eslint-disable-next-line no-unused-vars
function readFc3() {
  return new Promise((resolve)=>{
    client.readHoldingRegisters(30000, 2)
      .then(function (data) {
        let unixtimestamp = (data.data[0] << 16) + data.data[1];
        console.log("Date is: " + new Date(unixtimestamp * 1000));
        resolve();
      })
  })
}

export function fn(request) {
  let answer = {};
  let connection = client.connectRTUBuffered(request.port, { baudRate: request.baudRate }).then(()=>{
    client.setID(request.address);
  })
  for (let i of request.data) {
    if (i.type === "FC3") {
      connection = connection.then(()=>{
        return new Promise((resolve)=>{
          client.readHoldingRegisters(i.address, i.length)
            .then(function (data) {
              let unixtimestamp = (data.data[0] << 16) + data.data[1];
              console.log("Date is: " + new Date(unixtimestamp * 1000));
              answer.unixtimestamp = unixtimestamp
              resolve();
            })
        })
      })
    }

    if (i.type === "FC4") {
      connection = connection.then(()=>{
        return new Promise((resolve)=>{
          client.readInputRegisters(i.address, i.length)
            .then(function (data) {
              console.log('fc4:', data);
              resolve();
            })
        })
      })
    }

    if (i.type === "write") {
      connection = connection.then(()=>{
        return new Promise((resolve)=>{
          let unixtimestamp
          if (i.value) {
            unixtimestamp = i.value / 1000;
          } else {
            unixtimestamp = new Date("2010.01.01").getTime() / 1000;
          }
          const data = [unixtimestamp >> 16, unixtimestamp & 0xffff];
          client.writeRegisters(30000, data)
            .then(resolve)

        })
      })
    }

    console.log(i)
  }
  connection.finally(close)
}
