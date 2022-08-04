import { defineComponent, reactive, watch } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import PageNav from './components/nav/nav'
import './style.scss'
export default defineComponent({
  name: 'App',
  components:{
    PageNav
  },
  setup() {
    const route = useRoute()
    console.log(route.path)
    const state = reactive({
      isHome:route.path === '/home'
    })
   
   watch(()=>route,()=>{
    state.isHome = route.path === '/home'||route.path === '/testPhone'
    console.log('home', state.isHome)
   },{ immediate: true, deep: true },)
    return () => (
      <>
        {state.isHome?'':<page-nav class="page-nav"></page-nav>}
        <RouterView />
      </>
    );
  }
});
