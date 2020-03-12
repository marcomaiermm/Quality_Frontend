<template>
  <q-page class="flex flex-center">
    <DataTable />
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  components: {
    DataTable: () => import('../components/Table')
  }
}
</script>
