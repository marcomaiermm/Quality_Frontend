<template>
  <!--<q-page class="flex flex-center">-->
  <div class="q-app">
    <lottie
      :options="defaultOptions"
      :height="600"
      :width="600"
      v-on:animCreated="handleAnimation"
    />
    <button v-on:click="stop">stop</button>
    <button v-on:click="pause">pause</button>
    <button v-on:click="play">play</button>
  </div>
</template>

<script>
import Lottie from "vue-lottie";
import * as animationData from "../assets/aw-spin.json";
export default {
  name: "Analytics",
  components: {
    lottie: Lottie
  },
  data() {
    return {
      defaultOptions: { animationData: animationData.default },
      animationSpeed: 1
    };
  },
  methods: {
    handleAnimation: function(anim) {
      this.anim = anim;
    },
    stop: function() {
      this.anim.stop();
    },
    play: function() {
      this.anim.play();
    },
    pause: function() {
      this.anim.pause();
    },
    onSpeedChange: function() {
      this.anim.setSpeed(this.animationSpeed);
    }
  }
};
</script>
