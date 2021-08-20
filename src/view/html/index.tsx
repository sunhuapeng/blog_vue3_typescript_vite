import { defineComponent, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import SideBar from '../side-bar/index'
import './style.scss'

export default defineComponent({
  name: 'Html',
  path: '/html',
  isRouter: true,
  components:{
    SideBar
  },
  setup(){
    const state = reactive({
      path: '' as any
    })
    const router = useRouter()
    console.log(router)
    const route = useRoute()
    state.path = route.query.file
    const checkIframe = (h:any)=>{
      router.push({
        path: '/html',
        query: {
          file: h.path
        }
      })
      state.path = h.path
    }
      return ()=>(
        <div class="html-main">
          <side-bar onHandleHtml={checkIframe}></side-bar>
          <iframe src={state.path} frameborder="0"></iframe>
        </div>
      )
  }
})