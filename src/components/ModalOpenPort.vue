<template>
  <v-dialog v-model="dialog" @keydown.esc="onOk" @keydown.enter="onOk" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"> +NEW </v-btn>
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
const axios = require('axios').default;

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
  computed: {
    connections() {
      return this.$store.state.connections;
    },
  },
  methods: {
    logg() {
      console.log(123)
      this.dialog = false;
    },
    onOk() {
      console.log('ok')
      this.dialog = false;
      this.connection();
    },
    connection() {
      console.log('connection')
      let request = {
        port: this.port,
        baudRate: this.baudrate,
        databits: this.databits,
        parity: this.parity,
        stopbits: this.stopbits,
        timeout: 1000, // optional
        protocol: "RTU",
        address: this.address,
        fullPath: this.port + "_" + this.address,
      };

      this.$store.dispatch("addConnection", request);
      console.log("addConnection", request)
    },
  },
  created() {
    axios.get('http://localhost:1337/portlist')
      .then((response)=>{
        console.log(response.data);
        response.data.forEach((item) => {
          this.ports.push(item.path);
        });
        if (this.ports.length > 0) {
          this.port = this.ports[this.ports.length - 1];
        }
      })
    .catch((e)=>{
      console.log('error:', e)
    })
    if (this.protocols.length > 0) {
      this.protocol = this.protocols[0];
    }
    window.addEventListener('keyup', (e)=>{
      if (e.keyCode === 13) {
        // console.log(123)
      }
    })
  },
};
</script>
