<template>
  <v-app>
    <v-system-bar class="px-0" app window>
      <title-bar title="Window title - Visual Studio Code" />
    </v-system-bar>

    <v-app-bar app>
      <!-- -->
    </v-app-bar>

    <v-navigation-drawer app floating mini-variant permanent>
      <nav-bar />
      <!-- <template v-slot:append>
        <v-list dense nav>
          <v-list-item v-for="item in items" :key="item.icon" link>
            <v-list-item-icon>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ item.icon }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>-->
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
  width: 0px; /* Remove scrollbar space */
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

export default {
  name: "App",

  components: {
    TitleBar,
    NavBar,
  },

  data: () => ({}),

  created() {
    this.$vuetify.theme.dark = true;
  },
};
</script>
