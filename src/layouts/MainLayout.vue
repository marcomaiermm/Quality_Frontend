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
        <div class="noselect">QVue</div>
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
        <div class="main-icon q-ma-md">
          <router-link to="/">
            <img src="../assets/allweier-logo-small.png" class="menu-img-aw" />
          </router-link>
        </div>

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
      <q-page class="row no-wrap">
        <div class="col">
          <div class="column full-height">
            <q-scroll-area
              class="col"
              :thumb-style="thumbStyle"
              :bar-style="barStyle"
            >
              <transition name="fade" mode="out-in">
                <router-view />
              </transition>
            </q-scroll-area>
          </div>
        </div>
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
      thumbStyle: {
        right: "4px",
        backgroundColor: "#172c3f",
        width: "6px",
        opacity: 0.75
      },
      barStyle: {
        right: "2px",
        backgroundColor: "#172c3f",
        width: "9px",
        opacity: 0.2
      },
      leftDrawerOpen: false,
      menuItems: [
        {
          title: "Dashboard",
          icon: "mdi-home-analytics",
          link: "/dashboard"
        },
        {
          title: "DefectCollectionCard",
          icon: "mdi-chart-bar",
          link: "/defectcollectioncard"
        },
        {
          title: "QualityControlChart",
          icon: "mdi-current-ac",
          link: "/qualitycontrolchart"
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
  width: 50px
  display: block
  margin-left: auto
  margin-right: auto
  transition: 0.1s
  max-width: 100%
.menu-img-aw:hover
  transform: scale(1.2)
.fade-enter
  opacity: 0
.fade-enter-active
  transition: opacity 0.1s ease
.fade-leave
.fade-leave-active
  transition: opacity 0.1s ease
  opacity: 0
</style>
