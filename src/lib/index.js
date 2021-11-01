import scalerBox from './scaler-box.vue'

scalerBox.install = function (Vue) {
  Vue.component(scalerBox.name, scalerBox)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(scalerBox)
}

export default scalerBox