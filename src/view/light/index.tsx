import { defineComponent, nextTick,reactive } from "vue";
import './style.scss'
import CreateThree from './createThree'
export default defineComponent({
  name: 'Light',
  path: '/light',
  isRouter: true,
  setup(){
    nextTick(() => {
      const tDom:HTMLDivElement|null = document.querySelector('#three')
      if (tDom) {
        console.dir(tDom);
        const w = tDom.offsetWidth; 
        const h = tDom.offsetHeight;
        console.log(w,h);
        const createThree = new CreateThree(tDom)
        console.log('createThree',createThree);
      }
    })
      return ()=>(
        <div class="light-main">
          <div id="three"></div>
        </div>
      )
  }
})