<template>
  <div>
    data: {{value.data[0]}}
  </div>
</template>

<script>

export default {
  name: "ComponentPortInfo",
  props: ['value'],
  created() {
    console.log(this.value)
  }
}
</script>

<style scoped>

</style>