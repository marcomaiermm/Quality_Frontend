<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-bar class="q-electron-drag q-pr-none">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <div class="noselect">Quality Tools</div>
        <q-space />
        <q-btn class="frame-btn" flat icon="minimize" @click="minimize"></q-btn>
        <q-btn
          class="frame-btn"
          flat
          icon="crop_square"
          @click="maximize"
        ></q-btn>
        <q-btn class="frame-btn" flat icon="close" @click="closeApp"></q-btn>
      </q-bar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      mini
      side="left"
      elevated
      content-class="bg-grey-3"
    >
      <q-list>
        <p />
        <img
          src="../assets/allweier-logo-small.png"
          class="menu-img-aw"
          width="50%"
        />
        <p />
        <q-separator />
        <MenuItem
          v-for="link in menuItems"
          :key="link.title"
          v-bind="link"
          :active="link === link.title"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <!--Footer-->
    <q-footer>
      <div class="copyright-text">
        Allweier Präzisionsteile GmbH &copy; {{ new Date().getFullYear() }}
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import MenuItem from "components/MenuItem";

export default {
  name: "MainLayout",

  components: {
    MenuItem
  },

  data() {
    return {
      year: null,
      leftDrawerOpen: false,
      menuItems: [
        {
          title: "Dashboard",
          icon: "mdi-home-analytics",
          link: "/"
        },
        {
          title: "Analyse",
          icon: "mdi-chart-bar",
          link: "/analytics"
        },
        {
          title: "PartsPerMillion",
          icon: "mdi-percent",
          link: "/ppm"
        }
      ]
    };
  },

  methods: {
    minimize() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().minimize();
      }
    },

    maximize() {
      if (process.env.MODE === "electron") {
        const win = this.$q.electron.remote.BrowserWindow.getFocusedWindow();

        if (win.isMaximized()) {
          win.unmaximize();
        } else {
          win.maximize();
        }
      }
    },

    closeApp() {
      if (process.env.MODE === "electron") {
        this.$q.electron.remote.BrowserWindow.getFocusedWindow().close();
      }
    }
  }
};
</script>

<style style lang="sass">
.copyright-text
  text-align: right
  padding: 3px
  font-size: 11px
.frame-btn
  border-radius: 0px
.menu-img-aw
  display: block
  margin-left: auto
  margin-right: auto
</style>
