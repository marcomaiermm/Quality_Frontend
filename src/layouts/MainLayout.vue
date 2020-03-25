<template>
  <q-layout view="hHh Lpr fFf">
    <q-header elevated>
      <q-bar class="q-electron-drag">
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-space />
        <div>Quality Tools</div>
        <q-space />
        <q-btn dense flat icon="minimize" @click="minimize"></q-btn>
        <q-btn dense flat icon="crop_square" @click="maximize"></q-btn>
        <q-btn dense flat icon="close" @click="closeApp"></q-btn>
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
        <MenuItem v-for="link in menuItems" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page>
        <router-view />
      </q-page>
    </q-page-container>

    <!--Footer-->
    <q-footer>
      <q-bar elevated>
        <q-space />
        <div class="text-white">
          Allweier Präzisionsteile GmbH &copy; {{ new Date().getFullYear() }}
        </div>
      </q-bar>
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

<style>
.menu-img-aw {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
