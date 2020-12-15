const ModbusRTU = require("modbus-serial");
const client = new ModbusRTU();

function bitToUnixTime(bit) {
  return ((bit[0] << 16) + bit[1]) * 1000
}

export function unixTimeToBit(unixTime) {
  let unixTimestamp
  if (unixTime) {
    unixTimestamp = unixTime / 1000;
  } else {
    unixTimestamp = new Date().getTime() / 1000;
    console.log('time:', unixTimestamp)
  }
  const data = [unixTimestamp >> 16, unixTimestamp & 0xffff];
  return data
}

export function connect(params) {
  return client.connectRTUBuffered(params.port || 'COM4', { baudRate: params.baudRatel || 9600 })
    .then(()=>{
      client.setID(params.address || 247);
    })
}

export function write(address = 30000, data = null) {
  if (data) {
    return new Promise(resolve => {
      client.writeRegisters(address, data)
        .then((k)=>{
          resolve(k)
        })
        .catch((e)=>{
          console.log('you cant edit this address')
          resolve(e)
        })
    })
  } else {
    return 'you need to write something'
  }
}

export function readFc4(address = 40000, length = 1) {
  return new Promise(resolve => {
    client.readInputRegisters(address, length)
      .then((data)=>{
        console.log(address + ' :', data)
        resolve(data.data)
      })
      .catch((e)=>{
        // console.log('error in ' + address + ' :', e)
        console.log(address + ' : empty')
        resolve()
      })
  })
}

export function readFc3(address = 40000, length = 1) {
  return new Promise(resolve => {
    client.readHoldingRegisters(address, length)
      .then((data)=>{
        console.log(address + ' :', data)
        resolve(data.data)
      })
      .catch((e)=>{
        // console.log('error in ' + address + ' :', e)
        console.log(address + ' : empty')
        resolve()
      })
  })
}

export function readTime(address = 30000, length = 2) {
  return new Promise(resolve => {
    client.readHoldingRegisters(address, length)
      .then((data)=>{
        let unixTimestamp = bitToUnixTime(data.data)
        console.log(address + ' :', new Date(unixTimestamp))
        resolve(unixTimestamp)
      })
      .catch((e)=>{
        // console.log('error in ' + address + ' :', e)
        console.log(address + ' : empty')
        resolve()
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
  if (type.toLowerCase() == 'time') {
    return readTime(address, length)
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