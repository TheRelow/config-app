<template>
  <div>
    <ModalOpenPort title="Open Port" />
    <v-btn class="ma-2"> READ </v-btn>
    <v-tabs class="my-6">
      <v-tab
        v-for="(item, index) in connections"
        :key="item.fullPath"
        :value="{ item, index }"
        >{{ item.port }}: {{ item.address }}</v-tab
      >

      <v-tab-item
        v-for="item in connections"
        :key="item.fullPath"
        :transition="false"
        :reverse-transition="false"
      >
        <v-container fluid>
          <div class="body-2 my-6">{{ item.port }} @ {{ item.address }}</div></v-container
        >
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script>
// @ is an alias to /src
import ModalOpenPort from "@/components/ModalOpenPort";

export default {
  name: "Home",

  components: { ModalOpenPort },

  computed: {
    connections() {
      return this.$store.state.connections;
    },
  },
};
</script>
