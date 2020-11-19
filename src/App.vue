<template>
  <v-app>
    <v-system-bar class="px-0" app window>
      <title-bar title="Window title - Visual Studio Code" />
    </v-system-bar>

    <v-app-bar app>
      <!-- -->
    </v-app-bar>

    <v-navigation-drawer app floating expand-on-hover permanent>
      <nav-bar />
    </v-navigation-drawer>

    <!-- Sizes your content based upon application components -->
    <v-main>
      <!-- Provides the application the proper gutter -->
      <v-container fill-height fluid>
        <!-- If using vue-router -->
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-footer app>
      <!-- -->
    </v-footer>
  </v-app>
</template>

<style>
html {
  overflow: scroll;
  overflow-x: hidden;
}
::-webkit-scrollbar {
  width: 0; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
/* Optional: show position indicator in red */
::-webkit-scrollbar-thumb {
  background: #ff0000;
}
</style>

<script>
import TitleBar from "./components/TitleBar.vue";
import NavBar from "./components/NavBar.vue";
import {ipcRenderer} from "electron";

export default {
  name: "App",

  components: {
    TitleBar,
    NavBar,
  },

  data: () => ({}),

  computed: {
    var () {
      return this.$store.state.some
    }
  },

  created() {
    this.$vuetify.theme.dark = true;

    ipcRenderer.on("messageToWin", (e, args) => {

      console.log(args)
    });

    console.log(this.var)
  },
};
</script>
