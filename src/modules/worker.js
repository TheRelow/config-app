const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

export function bitToUnixTime(bit) {
  return ((bit[0] << 16) + bit[1]) * 1000
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
    return client.connectRTUBuffered(params.port, { baudRate: params.baudRate || 9600 })
      .then(()=>{
        client.setID(params.address || 247);
      })
  }
}

export function write(address = 30000, data = null) {
  if (data) {
    return new Promise((resolve, reject) => {
      // console.log(`writing ${data} in ${address}`)
      client.writeRegisters(address, data)
        .then((k)=>{
          // console.log('success')
          resolve(k)
        })
        .catch(()=>{
          // console.log('you cant edit this address')
          reject('you cant edit this address')
        })
    })
  } else {
    return 'you need to write something'
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
  return new Promise(resolve => {
    client.readHoldingRegisters(address, length)
      .then((data)=>{
        console.log(data.data)
        resolve(data.data)
      })
      .catch((e)=>{
        console.log(e)
        resolve(e)
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