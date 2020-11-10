<template>
  <v-row class="x-row">
    <ModalOpenPort title="Open Port" />
  </v-row>
</template>

<script>
import { ipcRenderer } from "electron";

// @ is an alias to /src
import ModalOpenPort from "@/components/ModalOpenPort";

export default {
  name: "About",

  components: { ModalOpenPort },

  props: [""],

  data: () => ({}),

  methods: {
    onClick() {
      ipcRenderer.send("click-from-renderer");
    },
  },
};
</script>
