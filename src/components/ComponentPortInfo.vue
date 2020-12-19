<template>
  <div>
<!--    <span v-if="date">-->
<!--      data: {{date}}-->
<!--    </span>-->
<!--    <span v-else>-->
<!--      empty-->
<!--    </span>-->
  </div>
</template>

<script>

export default {
  name: "ComponentPortInfo",
  props: ['fullPath'],
  computed: {
    portData() {
      return this.$store.state.registers[this.fullPath]
    },
    date() {
      if (this.portData) {
        return new Date(this.portData.date)
      } else {
        return 'empty'
      }
    }
  },
  methods: {
    logg() {
      console.log(this.portData)
    }
  },
  created() {
    if (this.date) {
      let request = {
        fullPath: this.fullPath,
        data: [
          {type: "readTime"},
          {
            type: "read",
            address: 40000,
            length: 38,
          },
        ]
      }
      this.$store.commit("dataTransfer", request);
    }
  }
}
</script>

<style scoped>

</style>