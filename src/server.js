import {connect, readTime, close, read} from "@/modules/worker";

const express = require('express');
const cors = require('cors')
const serv = express()
serv.use(cors());
serv.use(express.json());
const serialport = require("serialport");

let connections = {}

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

    serv.post('/request-data', (req, res)=>{
      let answer = []
      // eslint-disable-next-line no-unused-vars
      let connection = connect({
        port: connections[req.body.fullPath].port
      })
      req.body.data.forEach((i)=>{
        if (i.type == "read") {
          let answerItem = {}
          answerItem.type = i.type
          answerItem.address = i.address
          connection = connection.then(()=>read(i.address))
          connection = connection.then((data) => {
            answerItem.answer = data.toString()
            answer.push(answerItem)
          })
        } else if (i.type == "readTime") {
          let answerItem = {}
          answerItem.type = i.type
          connection = connection.then(()=>readTime())
          connection = connection.then((data) => {
            answerItem.answer = data.toString()
            answer.push(answerItem)
          })
        }
      })
      connection = connection.finally(()=>{
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