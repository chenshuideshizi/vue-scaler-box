import betterScale from './better-scale.vue'

betterScale.install = function (Vue) {
  Vue.component(betterScale.name, betterScale)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(betterScale)
}

export default betterScale