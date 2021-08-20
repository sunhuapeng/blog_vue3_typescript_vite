import { defineComponent, reactive} from "vue";
import { useRouter } from "vue-router";
import RobotView from '../three/robot'
export default defineComponent({
  name: 'Home',
  path: '/home',
  isRouter: true,
  components:{
    RobotView
  },
  setup() {
    const router = useRouter()
    const toarticle = ()=>{
      router.push({
        path: '/articles',
      })
    }
    return () => (
      <>
        <p class="w" onClick={()=>toarticle()}>首页</p>
      </>
    )
  }
})
