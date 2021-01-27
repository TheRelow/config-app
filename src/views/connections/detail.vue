<template>
  <div>
    <router-link to="/connections">
      back
    </router-link>
    <div style="display: flex; justify-content: space-between">
      <h1>{{fullPath}}</h1>
      <div>
        <modal-edit-port :full-path="this.fullPath"></modal-edit-port>
        <close-connection :full-path="this.fullPath"></close-connection>
      </div>
    </div>
    <div v-if="portData.onloadError">В выбранном порте нет регистра 40000</div>
    <div v-else-if="!isCreated">loading...</div>
    <ComponentTableRegisters :fullPath="this.fullPath" v-else></ComponentTableRegisters>
  </div>
</template>

<script>
import ComponentTableRegisters from "@/components/ComponentTableRegisters";
import ModalEditPort from "@/components/ModalEditPort";
import CloseConnection from "@/components/CloseConnection";

export default {
  name: "detail",
  // eslint-disable-next-line vue/no-unused-components
  components: {ComponentTableRegisters, ModalEditPort, CloseConnection},
  data: () => ({
    snack: false,
    snackColor: '',
    snackText: '',
    pagination: {},
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
    isCreated() {
      return this.$store.state.created[this.fullPath]
    },
  }
}
</script>
