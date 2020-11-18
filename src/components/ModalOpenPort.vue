<template>
  <v-dialog v-model="dialog" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <button class="x-row__item" v-bind="attrs" v-on="on">
        <img
          alt="plus icon"
          class="x-row__item-plus"
          src="../assets/add.svg"
        />{{ title }}
      </button>
      <v-btn @click="connection"> Test conection </v-btn>
    </template>
    <v-card>
      <v-card-title> Подключение к устройству </v-card-title>

      <v-card-text>
        Для подключения к устройству выберите порт, скорость, протокол и адрес
        устройства в сети Modbus.
      </v-card-text>

      <v-container class="px-6">
        <v-row>
          <v-col cols="4">
            <v-select v-model="port" :items="ports" required label="Порт" />
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="baudrate" required label="Скорость" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="databits" disabled label="Бит данных" />
          </v-col>
          <v-col>
            <v-text-field v-model="parity" disabled label="Четность" />
          </v-col>
          <v-col>
            <v-text-field v-model="stopbits" disabled label="Стоп бит" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="8">
            <v-select
                v-model="protocol"
                :items="protocols"
                required
                label="Протокол"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
                v-model="address"
                :rules="[numberRule]"
                required
                label="Адрес"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" text @click="onOk"> OK </v-btn>
        <v-btn color="green darken-1" text @click="dialog = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ipcRenderer } from "electron";
import serialport from "serialport";
import ModbusRTU from "modbus-serial";
export default {
  name: "ModalOpenPort",
  props: ["title"],
  data() {
    return {
      dialog: false,
      ports: [],
      protocols: ["Modbus RTU", "Modbus ASCII"],
      port: "",
      baudrate: 9600,
      databits: 8,
      parity: "none",
      stopbits: 1,
      protocol: "",
      address: 247,
      numberRule: (v) => {
        if (!v.trim) return true;
        if (!isNaN(parseFloat(v)) && v >= 1 && v <= 247) return true;
        return "1-247";
      },
    };
  },
  methods: {
    async onOk() {
      this.dialog = false;
      this.connection()
    },
    // В твою задачу входит переписать эту функция в асинхронную
    //  промисами или через anync / await
    testConnection() {
      const client = new ModbusRTU();
      client.connectRTUBuffered(this.port, {
        baudRate: this.baudrate,
        databits: this.databits,
        parity: this.parity,
        stopbits: this.stopbits,
        autoOpen: false,
      }).then((v)=>{
        console.log(v)
        if (client.isOpen) {
          client.setID(this.address);
          client.readInputRegisters(40000, 1, function (err, data) {
            if (err) {
              console.log(err);
              client.close();
            } else {
              console.log(data);
              client.close();
            }
          });
        }
      }).catch((v)=>{
        client.close();
        throw v
      })
    },
    connection() {
      let request = {
        port: this.port,
        baudRate: this.baudrate,
        databits: this.databits,
        parity: this.parity,
        stopbits: this.stopbits,
        timeout: 1000, // optional
        protocol: "RTU",
        address: this.address,
        data: [
          {
            // FC4 "Read Input Registers"
            type: "FC4",
            address: 40000,
            length: 1
          },
        ]
      }
      ipcRenderer.send("ui-request", request);
    },
  },
  created() {
    serialport.list().then((portslist) => {
      portslist.forEach((item) => {
        this.ports.push(item.path);
        console.log(item);
      });
      if (this.ports.length > 0) {
        this.port = this.ports[this.ports.length-1];
      }
    });
    if (this.protocols.length > 0) {
      this.protocol = this.protocols[0];
    }
    ipcRenderer.on("ui-response", (e, args) => {
      console.log(args);
    });
  },
};
</script>