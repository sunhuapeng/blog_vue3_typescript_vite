import { defineComponent, reactive,nextTick } from "vue";

export default defineComponent({
  name: 'TestPhone',
  isRouter: true,
  path: '/testphone',
  setup() {
    const state = reactive({
      text: '2'
    })
    nextTick(() => {
      window.addEventListener('deviceorientation', (event) => {

        console.log(event);
        
        console.log('左右alpha', event.alpha)
        console.log('前后beta', event.beta)
        console.log('扭转gamma', event.gamma)
        state.text = `左右alpha: ${event.alpha},
        前后beta:${event.beta},
        扭转gamma: ${event.gamma}
        `
      })
    })
    return () => (
      <p>1{state.text}2</p>
    )
  }
})