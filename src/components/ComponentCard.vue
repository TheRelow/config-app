<template>
  <router-link :to="'/connections/' + value.item.port" class="x-row__item">
    {{ value.item.port }}: {{ value.item.address }}
  </router-link>
</template>

<script>
export default {
  name: "ComponentCard",
  props: ['value'],
}
</script>