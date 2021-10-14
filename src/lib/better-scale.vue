<!-- Author: fanwenxiang -->
<!-- Create Time: 2020/08/09 15:30 -->
<!-- Description: scale-box -->

<template>
  <div ref="wrapper" class="scale-box-wrapper">
    <!-- 加载中 --->
    <loading v-if="!sourceReady" class="loading" color="#969696" />

    <!-- 内容容器 -->
    <div
      ref="content"
      class="content"
      :style="{
        width: contentWidth + 'px',
        height: contentHeight + 'px',
        left: offsetX + 'px',
        top: offsetY + 'px',
        transform: `scale(${zoomVal})`,
        'margin-left': -contentWidth / 2 + 'px',
        'margin-top': -contentHeight / 2 + 'px'
      }"
      @mousedown="onMousedown"
      @mousewheel="onMouseWheel"
    >
      <img class="source-img" border="0" :src="sourceSrc" @load="onLoad" />

      <!-- 内容插槽 -->
      <template v-if="sourceReady">
        <slot />
      </template>

    </div>
  </div>
</template>

<script>
import loading from './loading'
export default {
  name: 'BetterScale',
  components: {
    loading
  },
  props: {
    locked: {
      type: Boolean,
      default: false
    },
    sourceSrc: {
      type: String,
      default: ''
    },
    // 最大缩放比例
    maxRatio: {
      type: Number,
      default: 3
    },
    // 最小缩放比例
    minRatio: {
      type: Number,
      default: 0.1
    },
    /**
     * 当内容加载完成，默认显示比例
     * 'no-scaling': 初始化时不缩放，显示原始比例
     * 'fit-when-large': 初始化时仅当内容尺寸大于容器尺寸条件下按照适应页面缩小；
     * 'fit-when-small': 初始化时仅当内容尺寸小于容器尺寸条件下按照适应页面放大；
     *  number: 如果设置为正数数字，则初始化缩放比率设置为该值。
     *  auto: 初始化时，自动铺满
     */
    initRatioType: {
      type: [Number, String],
      default: 'fit-when-large'
    }
  },
  data() {
    return {
      sourceReady: false,
      flag: false,
      startPos: { // 鼠标开始的位置
        x: 0,
        y: 0
      },
      nowPos: {
        x: 0,
        y: 0
      },
      contentPos: { // 内容当前的位置
        left: 0,
        top: 0
      },
      zoomVal: 1,
      contentWidth: 0,
      contentHeight: 0,
      wrapperWidth: 0,
      wrapperHeight: 0,
      offsetX: 0,
      offsetY: 0,
      initOffsetX: 0, // 初始化完成时X轴的偏移量
      initOffsetY: 0, // 初始化完成时Y轴的偏移量
      dragable: false,
      largerScalable: false,
      smallerScalable: false,
      hasReset: false
    }
  },
  computed: {
    $content() {
      return this.$refs.content
    }
  },
  watch: {

  },
  mounted() {
    this.$nextTick(() => {
      this.calcInnerBoxSize()
    })
  },
  methods: {
    // 重置为初始状态
    reset() {
      this.hasReset = true
      this.smallerScalable = false
      this.largerScalable = false
      this.dragable = false
      this.offsetX = this.initOffsetX
      this.offsetY = this.initOffsetY
      this.scale(1)
    },
    // 状态修改为: 可拖拽移动
    drag() {
      this.dragable = true
      this.smallerScalable = false
      this.largerScalable = false
      this.hasReset = false
    },
    // 状态修改为: 可放大
    scaleBigger(val) {
      this.largerScalable = true
      this.dragable = false
      this.smallerScalable = false
      this.hasReset = false
      this.scale(this.zoomVal + val)
    },
    // 缩小
    scaleSmaller(val) {
      this.smallerScalable = true
      this.largerScalable = false
      this.dragable = false
      this.hasReset = false
      this.scale(this.zoomVal - val)
    },
    scale(zoomVal) {
      if (zoomVal < 0.2) {
        zoomVal = 0.2
      }
      this.zoomVal = zoomVal
    },
    // 图片缩放
    onMouseWheel(e) {
      if (!this.smallerScalable || !this.largerScalable) {
        return
      }
      const zoomVal = this.zoomVal + e.wheelDelta / 1200
      this.scale(zoomVal)
    },
    // 计算地图容器的宽高
    calcInnerBoxSize() {
      const { sourceSrc } = this

      // 获取外层容器的宽高
      const boundaryRect = this.$refs.wrapper.getBoundingClientRect()
      this.wrapperWidth = boundaryRect.width
      this.wrapperHeight = boundaryRect.height


      this.initOffsetX = this.wrapperWidth / 2
      this.initOffsetY = this.wrapperHeight / 2

      this.offsetX = this.initOffsetX
      this.offsetY = this.initOffsetY

      // 计算图片容器的宽高
      const imageElem = new Image()
      imageElem.src = sourceSrc
      imageElem.onload = () => {
        const sourceWidth = imageElem.width
        const sourceHeight = imageElem.height

        const aspectRatio = (sourceWidth / sourceHeight).toFixed(3)

        this.contentWidth = Math.min(this.wrapperWidth, this.wrapperHeight * aspectRatio)
        this.contentHeight = Math.min(this.wrapperHeight, this.wrapperWidth / aspectRatio)
      }
    },
    onLoad() {
      this.sourceReady = true
      this.$emit('loaded')
    },
    onMousedown(e) {
      if (!this.dragable) {
        return
      }
      console.log(this.locked, 'locked')
      if (this.locked) {
        return
      }
      const target = this.$content
      this.flag = true

      // 鼠标开始的位置
      this.startPos = {
        x: e.clientX,
        y: e.clientY
      }

      // 图片当前的位置
      if (getCss(target, 'left') !== 'auto') {
        this.contentPos.left = getCss(target, 'left')
      }
      if (getCss(target, 'top') !== 'auto') {
        this.contentPos.top = getCss(target, 'top')
      }

      document.addEventListener('mouseup', this.onMouseup)
      document.addEventListener('mousemove', this.onMousemove)


      // 获取相关CSS属性
      function getCss(o, key) {
        return o.currentStyle ? o.currentStyle[key] : document.defaultView.getComputedStyle(o, false)[key]
      }
    },
    onMouseup() {
      document.removeEventListener('mouseup', this.onMouseup)
      document.removeEventListener('mousemove', this.onMousemove)
      this.flag = false
    },
    onMousemove(e) {
      if (!this.flag) {
        return
      }

      e.preventDefault() // 这一句很重要

      this.nowPos = {
        x: e.clientX,
        y: e.clientY
      }


      const disX = this.nowPos.x - this.startPos.x
      const disY = this.nowPos.y - this.startPos.y

      this.offsetX = parseInt(this.contentPos.left) + disX
      this.offsetY = parseInt(this.contentPos.top) + disY

      this.$emit('drag', { offsetX: this.offsetX, offsetY: this.offsetY, initOffsetX: this.initOffsetX, initOffsetY: this.initOffsetY })

      return false
    }
  }
}
</script>

<style lang="scss" scoped>
  .scale-box-wrapper{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    .content {
      position: absolute;
      cursor:move;
      user-select: none;
      .source-img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }

  }
</style>
