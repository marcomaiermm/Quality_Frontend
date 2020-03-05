<template>
  <q-layout
  view="lHh Lpr lFf"
  >
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      v-model="leftDrawerOpen"
      side="left"
      elevated
      content-class="bg-grey-1"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          Tools
        </q-item-label>
        <MenuItem
          v-for="link in menuItems"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <!--Footer-->
    <q-footer elevated class="text-white text-right">
      <q-toolbar>
        <q-toolbar-title>
          Allweier Präzisionsteile GmbH
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>

  </q-layout>
</template>

<script>
import MenuItem from 'components/MenuItem'

export default {
  name: 'MainLayout',

  components: {
    MenuItem
  },

  data () {
    return {
      leftDrawerOpen: false,
      menuItems: [
        {
          title: 'Dashboard',
          icon: 'dashboard',
          link: '/dashboard'
        },
        {
          title: 'Analyse',
          icon: 'scatter_plot',
          link: '/scatter'
        }
      ]
    }
  }
}
</script>
