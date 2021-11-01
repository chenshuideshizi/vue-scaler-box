
<template>
  <div id="app">
    <BetterScaleBox ref="scaleBox" source-src="https://lorempixel.com/1440/900/nature">

    </BetterScaleBox>

    <div>
        <button type="button" @click="reset">重置</button>
        <button type="button" @click="scaleBigger">放大</button>
        <button type="button" @click="scaleSmaller">缩小</button>
        <button type="button" @click="drag">拖拽</button>
    </div>
  </div>
</template>

<script>
import BetterScaleBox from './lib/scaler-box'

export default {
  name: 'App',
  components: {
    BetterScaleBox
  },
  data () {
    return {
      loaded: false,
      src: 'https://lorempixel.com/1440/900/nature'
    }
  },
  methods: {
      scaleBigger() {
          this.$refs.scaleBox.scaleBigger(0.1)
      },
      scaleSmaller() {
          this.$refs.scaleBox.scaleSmaller(0.1)
      },
      drag() {
          this.$refs.scaleBox.drag()
      },
      reset() {
          this.$refs.scaleBox.reset()
      }
  }
}
</script>

<style>
  html, body {
    margin: 0;
    width: 100%;
    height: 100%;
  }

  body{
    box-sizing: border-box;
    padding: 50px 0;
  }

  #app {
    width: 720px;
    height: 450px;
    margin: auto;
    background-color: #f9f9f9;
    box-shadow: rgba(0,0,0,.3) 0 2px 10px;
    border: #fff 1px solid;
  }
  img {
    display: block;
  }
  button {
    display: inline-block;
    margin: 15px 0;
  }
</style>
