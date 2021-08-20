import { Base64 } from '../../utils/base64'
import { defineComponent, nextTick, reactive, toRefs } from "vue";
import { useRoute } from 'vue-router'
import markdown from "../../utils/markdown";
import Idb from '../../utils/IndexedDB'
import "./index.scss"
import { article } from '../../utils/interface'

export default defineComponent({
  name: 'ArticleDetail',
  isRouter: true,
  path: '/article-detail',
  setup() {
    const indexDB = new Idb('articles')
    const base64 = new Base64()
    const router = useRoute()
    const base64_id = router.query.id as string
    const id = base64.decode(base64_id)
    const state = reactive({
      html: '' as string,
      detail: {} as article,
      iddomArr: [] as any[],
      activeId: '' as string,
      scrollTop: 0 as number,
      navList: [] as any[]
    })
    // 获取indexdb上的文章内容
    const getMd = async () => {
      await indexDB.init()
      try {
        state.detail = await indexDB.getItem(id) as any
      } catch (error) {
        state.detail = {} as article
      }
      if (state.detail && state.detail.detail) {
        const detail = markdown.marked(state.detail.detail);
        detail.then((res: any) => {
          console.log(state.detail.isHtml)
          state.html = state.detail.isHtml?state.detail.detail:res.content
          // console.log(state.html)
          nextTick(() => {
            const md = document.querySelector('#md')
            if (md) {
              const iddoms = md.querySelectorAll('[id]') as any
              if (iddoms.length !== 0) {
                state.iddomArr = [...iddoms]
              }
            }
          })
        })
      } else {
        state.html = '没数据'
        // return marked('# Marked in the browser\n\nRendered by **marked**.');
      }
    }
    const scrollTo = (id: string, top: number) => {
      const app = document.querySelector('#app')
      if (app) {
        // state.activeId = id
        app.scrollTo(0, top)
      }

    }
    const getIdDoms = () => {
      if (state.iddomArr.length !== 0) {
        const ids = state.iddomArr
        return ids.map((dom) => {
          const id = dom.getAttribute('id')
          dom.setAttribute('name', id)
          const text = dom.innerText
          const top = dom.offsetTop
          state.navList.push({
            id,
            top,
            text
          })
          return (
            <li onClick={() => scrollTo(id, top)} class={{ active: id === state.activeId }}>
              <a class="ellipsis" href="javascript:;">{text}</a>
            </li>
          )
        })
      } else return
    }
    getMd()
    // 监听app滚动
    nextTick(() => {
      const app = document.querySelector('#app') as any
      const dom = document.querySelector('.mark-down>div') as any
      if (app) {
        const limit = 100
        app.addEventListener('scroll', () => {
          let height = 0
          if (dom) {
            height = dom.offsetHeight - window.innerHeight
          }
          const appT = app.scrollTop
          let item = state.navList.find(nav => {
            const t = nav.top
            return t <= (appT + limit) && t >= (appT - limit)
          })
          if (item) {
            state.activeId = item.id
          } else {
            if (height === appT) {
              state.activeId = state.navList[state.navList.length - 1].id
            }
          }
        })
      }
    })
    return () => {
      const { cover_image, title } = state.detail
      return (
        <>
          <div class="mark-down" id="md" ref="mark-down">
            <div>
              <div class="title">
                <div class="cover_image">
                  <img src={cover_image} alt="" />
                </div>
                <div class="title">
                  <h1>{title}</h1>
                </div>
              </div>
              <div v-html={state.html}></div>
            </div>
            <ul class="md-nav">
              <li class="menu"><p>目录</p></li>
              {getIdDoms()}
            </ul>
          </div>
        </>
      )
    }
  }
});