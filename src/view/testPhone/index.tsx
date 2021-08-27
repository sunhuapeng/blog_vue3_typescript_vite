import { defineComponent } from "vue";

export default defineComponent({
  name:'TestPhone',
  isRouter: true,
  path: '/testphone',
  setup(){
    window.addEventListener('deviceorientation', (event)=>{
      console.log('左右alpha', event.alpha)
      console.log('前后beta', event.beta)
      console.log('扭转gamma', event.gamma)
    }, false)
  }
})