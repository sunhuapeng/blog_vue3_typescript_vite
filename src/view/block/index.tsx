import { defineComponent } from "vue";

export default defineComponent({
  name: 'Block',
  path: '/block',
  isRouter: true,
  setup() {
    const origin = window.location.origin
    const flag = import.meta.env.MODE === 'development'
    const path = '../../../public/iframe/game-block/index.html'
    const asiosPath = flag ? path : (origin + '/iframe/game-block/index.html')
    return () => (
      <iframe src={asiosPath} frameborder="0"></iframe>
    )
  }
})