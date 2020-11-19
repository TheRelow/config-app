<template>
  <router-link to="/connections/detail" class="x-row__item">
    {{value.item.port}}
  </router-link>
</template>

<script>
export default {
  name: "ComponentCard",
  props: ['value'],
}
</script>