import { defineComponent, reactive, nextTick } from "vue";
import './style.scss'
import { create } from '../../utils/createThree'
import { HandleCube, changeCube } from './handle'
export default defineComponent({
  name: 'TestPhone',
  isRouter: true,
  path: '/testphone',
  setup() {
    const state = reactive({
      text: '2',
      _event: {} as DeviceOrientationEvent,
      dom: null as HTMLDivElement | null
    })
    nextTick(() => {
      const tDom: HTMLDivElement | null = document.querySelector('#three')
      if (tDom) {
        create(tDom);
        HandleCube()
      }

      window.addEventListener('deviceorientation', (event: DeviceOrientationEvent) => {
        state._event = event
        console.log('左右alpha', event.alpha)
        console.log('前后beta', event.beta)
        console.log('扭转gamma', event.gamma)
        changeCube(event)

      })
    })

    return () => (
      // <p>1{state.text}2</p>
      <div class="testPhone-main">
        <div id="three"></div>
      </div>
    )
  }
})