import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: 'TestPhone',
  isRouter: true,
  path: '/testphone',
  setup() {
    const state = reactive({
      text: ''
    })
    window.addEventListener('deviceorientation', (event) => {
      console.log('左右alpha', event.alpha)
      console.log('前后beta', event.beta)
      console.log('扭转gamma', event.gamma)
      state.text = `左右alpha: ${event.alpha},
      前后beta:${event.beta},
      扭转gamma: ${event.gamma}
      `
    }, false)
    return () => (
      <p>{state.text}</p>
    )
  }
})