import { defineComponent, reactive } from "vue";
import { useRoute } from "vue-router";
import {getHtml} from '../../utils/index'
import './style.scss'
export default defineComponent({
  emits: ["handleHtml"],
  setup(props, {emit}){
    const state = reactive({
      htmls: getHtml(),
      path: '' as any
    })
    const handleHtml = (h:any)=>{
      console.log(h)
      state.path = h.path
      emit('handleHtml', h)
    }
    const route = useRoute()
    state.path = route.query.file

    const getHtmls = ()=>{
      const hs = state.htmls
      return hs.map(h=>{
        return <li class={{active: state.path === h.path}} onClick={()=>handleHtml(h)}>
          <p>{h.name}</p>
        </li>
      })
    }
    return ()=>(
      <>
        <ul class="side-bar">
          {getHtmls()}
        </ul>
      </>
    )
  }
})