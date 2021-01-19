<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="modal"
      :return-value.sync="date"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">{{unixTimeDate}}</div>
      </template>
      <v-date-picker
        v-model="date"
        scrollable
      >
        <v-spacer></v-spacer>
        <v-btn
          text
          color="primary"
          @click="modal = false"
        >
          Cancel
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="connectionToPort"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
  </div>
</template>

<script>
import {uint32ToUnixTime} from "@/modules/worker"
export default {
  name: "ComponentUnixTimeEdit",
  props: ['fullPath', 'registers'],
  data: () => ({
    r: [
      30000,
      30001
    ],
    modal: false,
    date: new Date().toISOString().substr(0, 10),
  }),
  computed: {
    r1 () {
      return this.$store.getters.register({fullPath: this.fullPath,register: this.r[0]})
    },
    r2 () {
      return this.$store.getters.register({fullPath: this.fullPath,register: this.r[1]})
    },
    unixTime() {
      return uint32ToUnixTime([this.r1, this.r2]);
    },
    unixTimeDate() {
      return new Date(this.unixTime).toISOString().substr(0, 10)
    },
    formatedDate() {
      return new Date(this.date).getTime()
    }
  },
  methods: {
    connectionToPort() {
      this.$refs.dialog.save(this.date)
      let request = {
        fullPath: this.fullPath,
        data: [
          {
            type: "writeTime",
            value: this.formatedDate
          }
        ]
      }
      this.$store.dispatch("dataTransfer", request);
    },
  },
  created() {
    if (this.registers) {
      this.r = this.registers
    }
  }
}
</script>