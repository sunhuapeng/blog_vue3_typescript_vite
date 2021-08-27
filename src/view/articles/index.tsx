import { defineComponent, ref, onMounted, onBeforeMount, reactive, toRef, toRefs } from "vue";
import './css.scss'
import { article } from '../../utils/interface'
import { moment } from 'tools-sj'
import SideBar from '../side-bar'
import { useRouter } from "vue-router";
import { Base64 } from '../../utils/base64'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Articles',
  isRouter: true,
  path: '/articles',
  components: {
    SideBar,
  },
  setup() {
    const store = useStore()
    const router = useRouter()
    const state = reactive({
      articles: [] as article[],
      tags: ['全部'] as string[],
      tagActive: '全部' as string,
      articlesSort: [] as article[]
    })
    // 排序 过滤
    const sortArticleList = () => {
      const arr = state.articles.filter((tiem: article) => {
        return state.tagActive === '全部' || tiem.tags.indexOf(state.tagActive) !== -1
      })
      const mds = arr.sort((a, b) => {
        return b.create_time - a.create_time
      })
      state.articlesSort = mds
    }
    const getMdlist = async () => {
      await store.dispatch('setArticles')
      state.articles = store.getters['getArticles']
      const tags = store.getters['getTags']
      state.tags.push(...tags)
      sortArticleList()
    }
    const formatDate = (date: number) => {
      return moment(date).format('yyyy/mm/dd')
    }

    const sortArticle = (tag: string) => {
      if (state.tagActive === tag) return
      state.tagActive = tag
      sortArticleList()
    }

    (async () => await getMdlist())();

    const toDetail = (item: any) => {
      const id = item.article_id
      const base46 = new Base64()
      const base64_id = base46.encode(id)
      router.push({
        path: '/articledetail',
        query: {
          id:base64_id
        }
      })
    }
    const getDomList = () => state.articlesSort.map(item => (
      <li class="article-item" onClick={() => toDetail(item)}>
        <div class="title ellipsis">{item.title}</div>
        <div class="article-main">
          <div class="left-count">
            <p class="brief_content ellipsis">{item.brief_content}</p>
            <p class="tags-item">
              {item.tags.map((tag: string) => (<span>{tag}</span>))}
            </p>
            <p class="create_time">{formatDate(item.create_time)}</p>
          </div>
          <div class="cover_image">
            <img src={item.cover_image} alt="" />
          </div>
        </div>
      </li>
    ))
    const tagList = () => (
      state.tags.map(tag => (
        <>
          <li onClick={() => sortArticle(tag)} class={{ active: state.tagActive === tag }}>
            <p>{tag}</p>
          </li>
        </>
      ))
    )
    const checkIframe = (h:any)=>{
      router.push({
        path: '/html',
        query: {
          file: h.path
        }
      })
    }
    return {
      ...toRefs(state),
      getDomList,
      tagList,
      checkIframe
    }
  },
  render() {
    return (
      <>
        <div class="main w">
          <div class="tags">
            <ul>
              {this.tagList()}
            </ul>
          </div>
          <div class="article-list">
            <ul class="articles">
              {this.getDomList()}
            </ul>
            <side-bar onHandleHtml={this.checkIframe}></side-bar>
            {/* <div class="side-bar">
              {+new Date()}
            </div> */}
          </div>
        </div>

      </>
    )
  }
})
