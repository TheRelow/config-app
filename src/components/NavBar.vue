<template>
  <v-list class="pa-0">
    <v-list-item-group active-class="selected">
      <v-list-item
        class="px-4"
        v-for="item in items"
        :key="item.icon"
        :to="item.href"
      >
        <v-list-item-icon>
          <icon-base><component v-bind:is="item.icon"></component></icon-base>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<style scoped>
.v-list-item {
  border-left: 1px solid transparent;
}
.selected {
  border-left-color: #2196f3;
}
.selected::before {
  opacity: 0.05 !important;
}
</style>

<script>
import IconBase from "./IconBase";
import IconDashboard from "./icons/IconDashboard";
import IconSettings from "./icons/IconSettings.vue";
import IconHelp from "./icons/IconHelp.vue";

export default {
  name: "NavBar",

  components: {
    IconBase,
    IconDashboard,
    IconSettings,
    IconHelp,
  },

  data: () => ({
    items: [
      { icon: "IconDashboard", title: "Dashboard", href: "/" },
      { icon: "IconSettings", title: "About", href: "/about" },
      { icon: "IconHelp", title: "Help", href: "#" },
    ],
  }),

  methods: {},
};
</script>
