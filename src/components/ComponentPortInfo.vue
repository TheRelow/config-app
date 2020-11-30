<template>
  <div>
    <span v-if="portData.data">
      data: {{portData.data.data[0]}}
    </span>
    <span v-else>
      empty
    </span>
  </div>
</template>

<script>

export default {
  name: "ComponentPortInfo",
  props: ['fullPath'],
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    }
  },
  beforeCreate() {
  },
  created() {
    console.log(this.portData)
    console.log(this.fullPath)
  }
}
</script>

<style scoped>

</style>