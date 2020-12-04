<template>
  <div>
    <span v-if="portData.data">
      data: {{date}}
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
    },
    date() {
      return new Date(((this.portData.data.data[0] << 16) + this.portData.data.data[1]) * 1000)
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