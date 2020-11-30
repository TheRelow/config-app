<template>
  <v-row class="x-row" align="center" justify="center">
    <ModalOpenPort title="Open Port" />
    <ComponentCard v-for="(item, index) in connections" :key="item.fullPath" :value="{item, index}" />
  </v-row>
</template>

<script>

// @ is an alias to /src
import ModalOpenPort from "@/components/ModalOpenPort";
import ComponentCard from "@/components/ComponentCard";

export default {
  name: "index",

  data: () => ({}),

  props: [""],

  components: { ModalOpenPort, ComponentCard },

  computed: {
    connections () {
      return this.$store.state.connections
    }
  },
}
</script>