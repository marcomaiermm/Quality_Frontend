<template>
  <q-page class="flex flex-center">
    <DataTable />
    <DataChart />
  </q-page>
</template>

<script>
export default {
  name: 'PageIndex',
  components: {
    DataTable: () => import('../components/Table'),
    DataChart: () => import('../components/LineChart')
  }
}
</script>
