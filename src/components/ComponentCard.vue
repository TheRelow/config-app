<template>
  <router-link :to="'/connections/' + value.item.fullPath" class="x-row__item">
    {{ value.item.port }}: {{ value.item.address }}
    <div v-if="isLoading">
      <br>
      loading...
    </div>
  </router-link>
</template>

<script>
export default {
  name: "ComponentCard",
  props: ['value'],
  computed: {
    isLoading() {
      return this.$store.state.loading[this.fullPath]
    }
  },
  created() {
    console.log(this.value.item.fullPath)
  }
}
</script>