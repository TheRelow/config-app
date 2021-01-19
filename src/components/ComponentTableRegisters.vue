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
      </v-toolbar>
    </template>
    <template v-slot:item.access="props">
      {{ driverInfo(props.item.address, 'access') }}
    </template>
    <template v-slot:item.min="props">
      {{ driverInfo(props.item.address, 'min') }}
    </template>
    <template v-slot:item.max="props">
      {{ driverInfo(props.item.address, 'max') }}
    </template>
    <template v-slot:item.dataType="props">
      {{ driverInfo(props.item.address, 'dataType') }}
    </template>
    <template v-slot:item.length="props">
      {{ driverInfo(props.item.address, 'length') }}
    </template>
    <template v-slot:item.decimal="props">
      {{ driverInfo(props.item.address, 'decimal') }}
    </template>
    <template v-slot:item.formatted="props">
      <div v-if="driverInfo(props.item.address, 'dataType') == 'unixTime'">
        <ComponentUnixTimeEdit :fullPath="fullPath"></ComponentUnixTimeEdit>
      </div>
      <div v-else-if="driverInfo(props.item.address, 'dataType') == 'uint32'">
        {{ fromUint32([ props.item.value, registerValue(+props.item.address + 1)]) }}
      </div>
      <div v-else-if="driverInfo(props.item.address, 'dataType') == 'uint16'">
        <v-edit-dialog v-if="driverInfo(props.item.address, 'access') == 'rw'"
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
      </div>
    </template>
    <template v-slot:item.value="props">
      <v-edit-dialog v-if="driverInfo(props.item.address, 'access') == 'rw'"
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
  <div v-if="!portRegisters.length">В этой таблице нет данных, возможно выбран не тот порт или адрес</div>
  </div>
</template>

<script>
import {driver} from "@/modules/driver";
// eslint-disable-next-line no-unused-vars
import {uint32ToUnixTime, fromUint32} from "@/modules/worker"
import ComponentUnixTimeEdit from "@/components/ComponentUnixTimeEdit";

export default {
  name: "ComponentTableRegisters",
  components: {ComponentUnixTimeEdit},
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
    driverIndex: [],
    registersIndex: []
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
    uint32ToUnixTime(i) {
      return uint32ToUnixTime(i)
    },
    fromUint32(i) {
      return fromUint32(i)
    },
    updateTable () {
      this.updateDriverIndex()
      this.updateRegistersIndex()
    },
    updateDriverIndex () {
      for (let i of driver) {
        this.driverIndex.push(i.address)
      }
    },
    driverInfo (address, param) {
      let newEl = {}
      let elIndex = this.driverIndex.indexOf(address)
      if (elIndex !== -1) {
        newEl = driver[elIndex]
        if (param) {
          return newEl[param]
        }
        return newEl
      }
      return null
    },
    updateRegistersIndex () {
      for (let i of this.portRegisters) {
        this.registersIndex.push(i.address)
      }
    },
    registerValue (address) {
      let newEl = {}
      let elIndex = this.registersIndex.indexOf(address.toString())
      if (elIndex !== -1) {
        newEl = this.portRegisters[elIndex]
        if (newEl['value']) {
          return newEl['value'].toString()
        }
      }
      return null
    },
    save (data) {
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
    this.updateTable()
  }
}
</script>

<style scoped>

</style>