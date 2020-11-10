<template>
  <div class="ui-titlebar">
    <div class="ui-titleicon"></div>
    <div class="ui-titletext">
      {{ title }}
      <div id="drag-region"></div>
    </div>
    <div class="ui-titlecontrols">
      <button class="ui-btn minimize" v-on:click="onMinimize">
        <svg x="0px" y="0px" viewBox="0 0 10.2 1">
          <rect x="0" y="50%" width="10.2" height="1" />
        </svg>
      </button>
      <button
        class="ui-btn maximize"
        v-if="!isMaximized"
        v-on:click="onMaximize"
      >
        <svg viewBox="0 0 10.2 10.1">
          <path d="M0,0v10h10V0H0z M9,9H1V1h8V9z" />
        </svg>
      </button>
      <button
        class="ui-btn unmaximize"
        v-if="isMaximized"
        v-on:click="onUnmaximize"
      >
        <svg viewBox="0 0 10.2 10.1">
          <path
            d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"
          />
        </svg>
      </button>
      <button class="ui-btn close" v-on:click="onClose">
        <svg viewBox="0 0 10 10">
          <polygon
            points="10.2,0.7 9.5,0 5.1,4.4 0.7,0 0,0.7 4.4,5.1 0,9.5 0.7,10.2 5.1,5.8 9.5,10.2 10.2,9.5 5.8,5.1"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

export default {
  name: "TitleBar",

  components: {},

  props: ["title"],

  data: () => ({
    isMaximized: false,
  }),

  methods: {
    onMinimize() {
      ipcRenderer.send("window-minimize");
    },

    onMaximize() {
      ipcRenderer.send("window-maximize");
    },

    onUnmaximize() {
      ipcRenderer.send("window-unmaximize");
    },

    onClose() {
      ipcRenderer.send("window-close");
    },
  },

  created() {
    ipcRenderer.on("window-resize", (event, arg) => {
      this.isMaximized = arg;
    });
  },
};
</script>

<style scoped>
/* Got from: https://codepen.io/agrimsrud/pen/WGgRPP */
.ui-titlebar {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  user-select: none;
  cursor: default;
}
.ui-titleicon {
  flex-grow: 1;
  max-width: 32px;
  max-height: 32px;
}
.ui-titletext {
  flex-grow: 2;
  max-height: 32px;
  width: auto;
  font: 12px/32px "Segoe UI", Arial, sans-serif;
  text-indent: 10px;
  text-align: center;
}
#drag-region {
  top: 1px;
  left: 33px;
  display: block;
  position: absolute;
  height: calc(100% - 2px);
  width: calc(100% - 2px - 144px - 32px);
  z-index: -1;
  -webkit-app-region: drag;
  /* background: rgba(0, 255, 255, 0.5); */
}
.ui-titlecontrols {
  max-width: 144px;
  max-height: 32px;
  flex-grow: 1;
}
.ui-btn {
  margin: 0;
  width: 48px;
  height: 32px;
  border: 0;
  outline: 0;
  background: transparent;
}
.ui-btn:hover {
  background: rgba(255, 255, 255, 0.1);
}
.ui-btn.close:hover {
  background: #e81123;
}
.ui-btn svg path,
.ui-btn svg rect,
.ui-btn svg polygon {
  fill: rgba(255, 255, 255, 0.7);
}
.ui-btn svg {
  width: 10px;
  height: 10px;
}
</style>