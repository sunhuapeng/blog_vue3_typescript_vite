import { defineComponent, nextTick, reactive } from "vue";
import './style.scss'
import { create } from '../../utils/createThree'
import {drawLight} from './drawLight'
export default defineComponent({
  name: 'StarrySky',
  path: '/starrySky',
  isRouter: true,
  setup() {
    nextTick(() => {
      const tDom: HTMLDivElement | null = document.querySelector('#three')
      if (tDom) {
        create(tDom);
        drawLight()
      }
    })
    return () => (
      <div class="light-main">
        <div id="three"></div>
      </div>
    )
  }
})