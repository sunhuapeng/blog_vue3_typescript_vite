import { defineComponent } from "vue";

export default defineComponent({
  name: 'Maze',
  path: '/maze',
  isRouter: true,
  setup() {
    const origin = window.location.origin
    const flag = import.meta.env.MODE === 'development'
    const path = '../../../public/iframe/game-maze/index.html'
    const asiosPath = flag ? path : (origin + '/iframe/game-maze/index.html')
    return () => (
      <iframe src={asiosPath} frameborder="0"></iframe>
    )
   
  }
})