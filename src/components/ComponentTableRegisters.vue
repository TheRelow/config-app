<template>
  <div>
    <v-data-table
    :headers="tableHeaders"
    :items="portRegisters"
    :items-per-page="5"
    class="elevation-1"
    :loading="isLoading"
    loading-text="Loading... Please wait"
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
    <template v-slot:item.custom>
      just text
    </template>
    <template v-slot:item.formatted="props">
      {{ props.item.formatted }}
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
    <div v-if="!tableData.length">В этой таблице нет данных, возможно выбран не тот порт или адрес</div>
  </div>
</template>

<script>
import {driver} from "@/modules/driver";
import {fromUint32, uint32ToUnixTime} from "@/modules/worker";

export default {
  name: "ComponentTableRegisters",
  props: ["fullPath"],
  data: () => ({
    tableHeaders: [
      {
        text: 'Registers',
        align: 'start',
        sortable: false,
        value: 'address'
      },
      {
        text: 'formatted value',
        value: 'formatted'
      },
      {
        text: 'value',
        value: 'value'
      },
      {
        text: 'access',
        value: 'access'
      },
      {
        text: 'min',
        value: 'min'
      },
      {
        text: 'max',
        value: 'max'
      },
      {
        text: 'custom',
        value: 'custom'
      },
      {
        text: 'data type',
        value: 'dataType'
      },
      {
        text: 'length',
        value: 'length'
      },
      {
        text: 'знаков после запятой',
        value: 'decimal'
      },
    ],
    tableData: [],
    saving: false,
    max25chars: v => v.length <= 25 || 'Input too long!',
    driverIndex: []
  }),
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
  },
  methods: {
    updateTable() {
      let newTableData = []
      for (let i in this.portRegisters) {
        let newEl = {}
        // eslint-disable-next-line no-unused-vars
        let dataType = null
        let elIndex = this.driverIndex.indexOf(i)
        if (elIndex !== -1) {
          newEl = driver[elIndex]
        }
        newEl["value"] = this.portRegisters[i]
        newEl["address"] = i
        try {
          dataType = driver[elIndex]['dataType']
          // eslint-disable-next-line no-empty
        } catch (e) {
          // если типа данных нет, то регистр подгрузился не из драйыера, либо вместе с регистром, у которого длинна больше 1
        }
        if (dataType == 'unixTime') {
          let newFormattedVal = uint32ToUnixTime([this.portRegisters[i], this.portRegisters[+i+1]])
          newEl["formatted"] = newFormattedVal
        } else if (dataType == 'uint32') {
          let newFormattedVal = fromUint32([this.portRegisters[i], this.portRegisters[+i+1]])
          newEl["formatted"] = newFormattedVal
        }
        newTableData.push(newEl)
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
            address: +data.address,
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
    for (let i of driver) {
      this.driverIndex.push(i.address)
    }
    this.updateTable()
    console.log(this.driverIndex)
    console.log(this.portRegisters)
  }
}
</script>

<style scoped>

</style>