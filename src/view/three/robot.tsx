import { defineComponent, onMounted, reactive } from "vue";
import './style.scss'

import { init } from './index'
export default defineComponent({
  name: 'robot-view',
  setup() {
    onMounted(() => {
      init('view')
    })
    return () => (
      <>
        <div id="view"></div>
      </>
    )
  }
})