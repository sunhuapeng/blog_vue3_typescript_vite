import { defineComponent, onMounted, reactive } from "vue";
import './style.scss'
import PageNav from '../../components/nav/nav'
import init from './index'
export default defineComponent({
  name: 'robot-view',
  components:{
    PageNav
  },
  setup() {
    onMounted(() => {
      init('view')
    })
   
    return () => (
      <>
        <div id="view"></div>
        <page-nav></page-nav>
      </>
    )
  }
})