<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
<!--    <v-btn @click="connectionToPort"> update data </v-btn>-->
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
<!--            @click="$refs.dialog.save(picker)"-->
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>

    </v-row>
    <v-data-table
      :headers="tableHeaders"
      :items="tableData"
      :items-per-page="5"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-btn class="save-btn" color="primary" elevation="2" :loading="saving" @click="updateTable">
            Обновить
          </v-btn>
<!--          <v-spacer></v-spacer>-->
<!--          <v-switch-->
<!--            class="switch-autosave"-->
<!--            label="Автосохранение"-->
<!--          ></v-switch>-->
        </v-toolbar>
      </template>
      <template v-slot:item.value="props">
        <v-edit-dialog v-if="props.item.access == 'rw'"
          :return-value.sync="props.item.value"
          large
          persistent
          @save="save(props.item)"
          @cancel="cancel"
          @open="open"
          @close="close"
        >
          <div>{{ props.item.value }}</div>
          <template v-slot:input>
            <div class="mt-4 title">
              Update value
            </div>
            <v-text-field
              v-model="props.item.value"
              :rules="[max25chars]"
              label="Edit"
              single-line
              counter
              autofocus
            ></v-text-field>
          </template>
        </v-edit-dialog>
        <span v-else>{{ props.item.value }}</span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
// import { ipcRenderer } from "electron";
export default {
  name: "detail",
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    max25chars: v => v.length <= 25 || 'Input too long!',
    pagination: {},
    picker: new Date().toISOString().substr(0, 10),
    date: new Date().toISOString().substr(0, 10),
    modal: false,
    saving: false,
    tableHeaders: [
      {
        text: 'Registers',
        align: 'start',
        sortable: false,
        value: 'register'
      },
      {
        text: 'value',
        value: 'value'
      }
    ],
    tableData: []
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
    logRegisters() {
      console.log(this.$store.state.registers)
    },
    updateTable() {
      let newTableData = []
      for (let i in this.portRegisters) {
        if (i == '30101') {
          newTableData.push({
            access: "rw",
            register: i,
            value: this.portRegisters[i]
          })
        } else {
          newTableData.push({
            access: "ro",
            register: i,
            value: this.portRegisters[i]
          })
        }
      }
      this.tableData = newTableData
    },
    save (data) {
      console.log(data)
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
      let request = {
        fullPath: this.fullPath,
        data: [
          {
            type: "write",
            address: +data.register,
            value: [+data.value],
          },
        ]
      }
      this.$store.dispatch("dataTransfer", request);
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close () {
      console.log('Dialog closed')
    },
  },
  created() {
    this.updateTable()
  }
}
</script>
