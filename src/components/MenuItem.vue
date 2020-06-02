<template>
  <q-item clickable tag="a" :to="link" active-class="my-menu-link">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" class="mini-icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "MenuItem",
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ""
    },

    link: {
      type: String,
      default: "#"
    },

    icon: {
      type: String,
      default: ""
    }
  }
};
</script>

<style lang="sass">
.my-menu-link
  background-color: $info
.menu-link
  color: white
  background: #F2C037
.mini-icon
  color: $secondary
.q-item:hover
  transform: scale(1.1)
.q-item
  transition: 0.1s
</style>
