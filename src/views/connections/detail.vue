<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <h1>{{fullPath}}</h1>
<!--    <v-btn @click="connectionToPort"> update data </v-btn>-->
    <ComponentPortInfo :fullPath="this.fullPath"></ComponentPortInfo>
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
    </v-data-table>
  </div>
</template>

<script>
// import { ipcRenderer } from "electron";
import ComponentPortInfo from "@/components/ComponentPortInfo";
export default {
  name: "detail",
  data: () => ({
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
    tableData: [
      {
        register: '40000',
        value: 12312
      },
      {
        register: '40001',
        value: 'empty'
      },
      {
        register: '40002',
        value: 12312
      },
    ]
  }),
  components: { ComponentPortInfo },
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
      this.$store.commit("dataTransfer", request);
    },
    logRegisters() {
      console.log(this.$store.state.registers)
    },
    updateTable() {
      let newTableData = []
      for (let i in this.portRegisters) {
        newTableData.push({
          register: i,
          value: this.portRegisters[i]
        })
      }
      this.tableData = newTableData
    }
  },
  created() {
  }
}
</script>

<style scoped>

</style>
