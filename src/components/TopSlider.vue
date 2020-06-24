<!--
  Forked from:
  https://quasar.dev/vue-components/slider#Example--Custom-label-value
-->
<template>
  <div class="row ">
    <div class="col-2 q-pr-xs text-overline text-9">
      Top {{sliderValue}}
    </div>
    <div class="col-8 q-pr-xs">
    <q-slider
      v-model="sliderValue"
      :min="0"
      :max="maxValue"
      :step="1"
      label
      :label-value="'Top ' + sliderValue"
      color="#dd0333"
      ref="slider"
    ></q-slider>
    </div>
    <div class="col-2 q-pl-md">
      <q-btn dense flat :disable="DisableButton" icon="send" @click="refresh()" />
    </div>
  </div>
</template>

<script>
export default {
  name: "TopSlider",
  props: ["maxValue"],
  data () {
    return {
      sliderValue: 0
    }
  },
  computed: {
    DisableButton() {
      let disabled = false
      if (this.maxValue === 0) {
        disabled = true
      } else {
        disabled = false
      }
      return disabled
    }
  },
  methods: {
    refresh() {
      const args = this.sliderValue;
      this.$emit("sliderRefreshEmit", args);
    }
  }
}
</script>

<style>

</style>
