import { defineComponent } from "vue";

export default defineComponent({
  name: 'Market',
  path: '/market',
  isRouter: true,
  setup() {
    const origin = window.location.origin
    const flag = import.meta.env.MODE === 'development'
    const path = '../../../public/iframe/market/index.html'
    const asiosPath = flag ? path : (origin + '/iframe/market/index.html')
    return () => (
      <iframe src={asiosPath} frameborder="0"></iframe>
    )
  }
})