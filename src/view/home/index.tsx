import { defineComponent, reactive } from "vue";
import { useRouter } from "vue-router";
// import RobotView from '../three'
import RobotView from '../three/robot'
import './style.scss'
export default defineComponent({
  name: 'Home',
  path: '/home',
  isRouter: true,
  components: {
    RobotView
  },
  setup() {
    const router = useRouter()
    const toarticle = () => {
      router.push({
        path: '/articles',
      })
    }
    return () => (
      <>
        <div class="home-view">
          <robot-view></robot-view>
        </div>
      </>
    )
  }
})
