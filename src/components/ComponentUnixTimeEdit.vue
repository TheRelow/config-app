<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="modal"
      :return-value.sync="date"
      persistent
      width="580px"
    >
      <template v-slot:activator="{ on, attrs }">
        <div v-bind="attrs" v-on="on">{{unixTimeDate}}</div>
      </template>
      <div style="display: flex">
        <v-date-picker
          v-model="date"
          scrollable
        >
        </v-date-picker>
        <v-time-picker
          v-model="time"
          class="mt-4"
          format="24hr"
          scrollable
        ></v-time-picker>
      </div>
      <div style="display: flex">
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
          @click="setTimeOnPort"
        >
          OK
        </v-btn>
        <v-btn
          text
          color="primary"
          @click="setCurrentTimeOnPort"
        >
          Set current time
        </v-btn>
      </div>
    </v-dialog>
  </div>
</template>

<script>
import {uint32ToUnixTime} from "@/modules/worker"
export default {
  name: "ComponentUnixTimeEdit",
  props: ['fullPath', 'register'],
  data: () => ({
    r: 30000,
    modal: false,
    date: new Date().toISOString().substr(0, 10),
    time: '11:15',
    timeOffset: new Date().getTimezoneOffset()*60*1000,
  }),
  computed: {
    r1 () {
      return this.$store.getters.register({fullPath: this.fullPath,register: this.r})
    },
    r2 () {
      return this.$store.getters.register({fullPath: this.fullPath,register: this.r + 1})
    },
    unixTime() {
      return uint32ToUnixTime([this.r1, this.r2]);
    },
    unixTimeDate() {
      return new Date(this.unixTime).toISOString().substr(0, 10)
    },
    formattedDate() {
      return new Date(this.date).getTime()
    },
    formattedFullDate() {
      return new Date(`${this.date}T${this.time}:00`).getTime()
    },
  },
  methods: {
    setTimeOnPort() {
      this.$refs.dialog.save(this.date)
      let request = {
        fullPath: this.fullPath,
        data: [
          {
            type: "writeTime",
            value: new Date(this.formattedFullDate - this.timeOffset).getTime()
          }
        ]
      }
      this.$store.dispatch("dataTransfer", request);
    },
    setCurrentTimeOnPort() {
      this.$refs.dialog.save(this.date)
      let request = {
        fullPath: this.fullPath,
        data: [
          {
            type: "writeTime",
            value: new Date(new Date().getTime() - this.timeOffset).getTime()
          }
        ]
      }
      this.$store.dispatch("dataTransfer", request);
    },
  },
  created() {
    if (this.register) {
      this.r = this.register
    }
  }
}
</script>
<style scoped lang="scss">
//$time-picker-title-btn-height: 22px
</style>