import { defineComponent } from "vue";
import { useRouter } from "vue-router";
import './style.scss'
export default defineComponent({
  setup() {
    const router = useRouter()

    const routerlist = [{
      name: '首页',
      router: '/home'
    },{
      name: '博客列表',
      router: '/articles'
    }, {
      name: '应用案例',
      router: '/html'
    }, {
      name: '商场案例',
      router: '/market'
    }, {
      name: '迷宫案例',
      router: '/maze'
    }, {
      name: '堆叠游戏',
      router: '/block'
    },{
      name: '满眼星星',
      router: '/starrySky'
    }]
    const toPage = (path: string) => {
      if(path === '/html') {
        router.push({
          path,
          query: {
            file: '../../public/html/中级案例html/astar算法-单象限.html'
          }
        })
      } else {
        router.push({
          path,
        })
      }
    }
    const getLi = () => {
      return routerlist.map(item => (
        <li onClick={() => toPage(item.router)}>
          <span>{item.name}</span>
        </li>
      ))
    }
    return () => (
      <ul class="label">
        {getLi()}
      </ul>
    )
  }
})