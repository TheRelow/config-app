import {connect, readTime, close, read, write, unixTimeToBit} from "@/modules/worker";

const express = require('express');
const cors = require('cors')
const serv = express()
serv.use(cors());
serv.use(express.json());
const serialport = require("serialport");

let connections = {}

// eslint-disable-next-line no-unused-vars
let registers = {

}

export default class MainServer {
  constructor() {
    serv.get('/portlist', function (req, res) {
      serialport.list().then((resolve) => {
        res.send(resolve)
      });
    })

    serv.post('/new-connection', (req, res)=>{
      if (req.body.fullPath) {
        console.log('fullPath in request body defined')
        connections[req.body.fullPath] = req.body
      } else if (req.query.fullPath) {
        console.log('fullPath in query params defined')
      } else {
        console.log('fullPath is not defined')
      }
      res.send(req.body)
    })

    serv.post('/data-transfer', (req, res)=>{
      let answer = {}
      answer[req.body.fullPath] = {}
      // eslint-disable-next-line no-unused-vars
      let connection = connect({
        port: connections[req.body.fullPath].port
      })
      req.body.data.forEach((i)=>{
        // eslint-disable-next-line no-unused-vars
        let length = 1
        if (i["length"]) {
          length = +i["length"]
        }
        if (i.type == "read") {
          connection = connection.then(()=>read(i.address, length))
          connection = connection.then((data) => {
            console.log('read data', data)
            if (length <= 1) {
              answer[req.body.fullPath][i.address] = data
            } else {
              for (let k in data) {
                if (Array.isArray(data[k]) && data[k].length == 1) {
                  console.log('arr')
                  answer[req.body.fullPath][k] = data[k][0]
                } else {
                  console.log('not arr')
                  answer[req.body.fullPath][k] = data[k]
                }
              }
            }
          })
        } else if (i.type == "readTime") {
          connection = connection.then(()=>readTime())
          connection = connection.then((data) => {
            answer[req.body.fullPath]["date"] = data
          })
        } else if (i.type == "write") {
          connection = connection.then(()=>write(i.address, i.value))
          connection = connection.then(() => {
            answer[req.body.fullPath][i.address] = i.value
          })
        } else if (i.type == "writeTime") {
          let address = 30000
          if (i.address) {
            address = i.address
          }
          let date = unixTimeToBit(i.value)
          connection = connection.then(()=>write(address, date))
          connection = connection.then(() => {
            answer[req.body.fullPath]["date"] = i.value
          })
        }
      })
      connection = connection.finally(()=>{
        for (let i in answer) {
          registers[i] = answer[i]
        }
        res.send(answer)
        close()
      })
    })

    // eslint-disable-next-line no-unused-vars
    serv.get('/time/:fullPath', function (req, res) {
      connect({
        port: connections[req.params.fullPath].port
      })
        .then(()=>readTime())
        .then((data) => {
          res.send(data.toString())
        })
        .finally(close)
    })

    serv.listen(1337, function () {
      console.log('API started')
    })
  }
}