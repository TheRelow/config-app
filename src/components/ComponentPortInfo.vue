<template>
  <div>
    <span v-if="portData.date">
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
  methods: {
    logg() {
      console.log(this.portData)
    },
    logg2() {
      console.log(this.date)
    }
  },
  computed: {
    portData() {
      return this.$store.state.connections[this.fullPath]
    },
    date() {
      return new Date(this.portData.date)
    }
  },
  beforeCreate() {
  },
  created() {
    if (this.portData.port) {
      this.$store.commit("addDate", {
        fullPath: this.portData.fullPath
      });
    }
  }
}
</script>

<style scoped>

</style>