const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

export function uint32ToUnixTime(bit) {
  return ((+bit[0] << 16) + +bit[1]) * 1000
}

export function fromUint32(bit) {
  return ((+bit[0] << 16) + +bit[1])
}

export function uint32ToBit(uint32) {
  const data = [uint32 >> 16, uint32 & 0xffff];
  return data
}

export function unixTimeToBit(unixTime) {
  let unixTimestamp
  if (unixTime) {
    unixTimestamp = unixTime / 1000;
  } else {
    unixTimestamp = new Date().getTime() / 1000;
  }
  const data = [unixTimestamp >> 16, unixTimestamp & 0xffff];
  return data
}

export function connect(params) {
  if (params) {
    client.setTimeout(50);
    return client.connectRTUBuffered(params.port, { baudRate: params.baudRate || 9600 })
      .then(()=>{
        client.setID(params.address || 247);
      })
  }
}

export function write(address = 30000, data = null) {
  let answer = {
    status: 'success',
    value: {}
  }
  if (data) {
    return new Promise((resolve, reject) => {
      client.writeRegisters(address, data)
        .then(()=>{
          if (data.length < 2) {
            answer.value[address] = data
          } else {
            let currentAddress = address
            for (let i of data) {
              answer.value[currentAddress++] = i
            }
          }
          resolve(answer)
        })
        .catch(()=>{
          answer.status = 'error'
          reject(answer)
        })
    })
  } else {
    answer.status = 'error[you need to write something]'
  }
}

export function readFc4(address = 40000, length = 1) {
  if (length <= 1) {
    return new Promise(resolve => {
      client.readInputRegisters(address, length)
        .then((data)=>{
          resolve(data.data)
        })
        .catch((e)=>{
          resolve(e)
        })
    })
  }
  return new Promise(resolve => {
    let answer = {
    }
    let first = address
    // eslint-disable-next-line no-unused-vars
    let connection = null
    connection = client.readInputRegisters(address, 1)
    connection = connection.then((data)=>{
      answer[first] = data.data
    })
    for (let i = address; i < address + length; i++) {
      connection = connection.then(()=>{
        return new Promise((res)=> {
          client.readInputRegisters(i, 1)
            .then(function (data) {
              answer[i] = data.data
              res()
            })
            .catch(()=>{
              answer[i] = 'empty'
              res()
            })
        })
      })
    }
    connection = connection.catch(()=>{
      console.log('some error')
      resolve(answer)
    })
    connection = connection.finally(()=>{
      console.log(answer)
      resolve(answer)
    })
  })
}

export function readFc3(address = 30000, length = 1) {
  return new Promise((resolve, reject) => {
    client.readHoldingRegisters(address, length)
      .then((data)=>{
        resolve(data.data)
      })
      .catch((e)=>{
        reject(e)
      })
  })
}

export function read(address = 40000, length = 1, type = 'auto') {
  if (type.toLowerCase() == 'fc4') {
    return readFc4(address, length)
  }
  if (type.toLowerCase() == 'fc3') {
    return readFc3(address, length)
  }
  if (type.toLowerCase() == 'auto') {
    switch (address.toString()[0]) {
      case '4':
        return readFc4(address, length)
        // eslint-disable-next-line no-unreachable
        break;
      case '3':
        return readFc3(address, length)
        // eslint-disable-next-line no-unreachable
        break;
      default:
        console.log(address + ' : unknown address')
        return address + ' : unknown address'
    }
  }
}

export function close() {
  if (client.isOpen) {
    client.close();
  }
}