<template>
  <router-link :to="'/connections/' + value.item.fullPath" class="x-row__item">
    {{ value.item.port }}: {{ value.item.address }}
  </router-link>
</template>

<script>
export default {
  name: "ComponentCard",
  props: ['value'],
  created() {
    console.log(this.value.item.fullPath)
  }
}
</script>