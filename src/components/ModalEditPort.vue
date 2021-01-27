<template>
  <v-dialog v-model="dialog" @keydown.esc="dialog = false" @keydown.enter="onOk" persistent max-width="400">
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on"> Edit connection </v-btn>
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
            <v-select v-model="portData.port" :items="[portData.port]" disabled required label="Порт" />
          </v-col>
          <v-col cols="8">
            <v-text-field v-model="portData.baudRate" required label="Скорость" />
          </v-col>
        </v-row>

        <v-row>
          <v-col>
            <v-text-field v-model="portData.databits" disabled label="Бит данных" />
          </v-col>
          <v-col>
            <v-text-field v-model="portData.parity" disabled label="Четность" />
          </v-col>
          <v-col>
            <v-text-field v-model="portData.stopbits" disabled label="Стоп бит" />
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="8">
            <v-select
              v-model="portData.protocol"
              :items="protocols"
              required
              label="Протокол"
            />
          </v-col>
          <v-col cols="4">
            <v-text-field
              v-model="portData.address"
              :rules="[numberRule]"
              required
              label="Адрес"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="onOk"> OK </v-btn>
        <v-btn color="primary" text @click="dialog = false">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "ModalEditPort",
  props: {
    fullPath: {
      type: String
    }
  },
  data: ()=>({
    ports: [],
    protocols: ["Modbus RTU", "Modbus ASCII"],
    numberRule: (v) => {
      if (!v.trim) return true;
      if (!isNaN(parseFloat(v)) && v >= 1 && v <= 247) return true;
      return "1-247";
    },
    dialog: false,
    portData: {}
  }),
  computed: {
    connection() {
      return this.$store.state.connections[this.fullPath]
    },
  },
  methods: {
    onOk() {
      this.dialog = false;
    },
  },
  created() {
    this.portData = this.connection
  }
}
</script>

<style scoped>

</style>