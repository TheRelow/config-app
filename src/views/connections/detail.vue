<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
    <v-row justify="space-around">
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="picker"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="picker"
            label="Picker in dialog"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-model="picker"
          scrollable
          color="green lighten-1"
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

    </v-row>

    <div v-if="isLoading">loading...</div>
    <ComponentTableRegisters :fullPath="this.fullPath" v-else></ComponentTableRegisters>
  </div>
</template>

<script>

import ComponentTableRegisters from "@/components/ComponentTableRegisters";
export default {
  name: "detail",
  components: {ComponentTableRegisters},
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    pagination: {},
    picker: new Date().toISOString().substr(0, 10),
    date: new Date().toISOString().substr(0, 10),
    modal: false,
  }),
  beforeCreate() {
    this.fullPath = this.$route.params.fullPath
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    },
    portRegisters() {
      return this.$store.state.registers[this.fullPath]
    },
    isLoading() {
      return this.$store.state.loading[this.fullPath]
    },
    formatedDate() {
      return new Date(this.picker).getTime()
    }
  },
  methods: {
    connectionToPort() {
      this.$refs.dialog.save(this.picker)
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
  }
}
</script>
