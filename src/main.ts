import { createApp } from 'vue'
import App from './App'

import '@/style/public.scss'

import { createStore } from "vuex";
import getVuexFile from './store/getStore'
import "highlight.js/scss/xcode.scss";
import "highlight.js/scss/paraiso-light.scss";
// import "highlight.js/scss/xt256.scss";
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';
import {vueRouters} from './router/get-router'

const app = createApp(App)
// 注册路由
const useRouter = async function () {
    const res = vueRouters()
    console.log(res)
    console.log('resres', res)
    const routes: RouteRecordRaw[] = [
      {
        path: '/',
        redirect: '/home',
      },
      ...res
    ];
    const router = createRouter({
      history: createWebHashHistory(),
      routes,
    });
    app.use(router);

    // 注册vuex
    let modules = {};
    getVuexFile(modules).then(() => {
      app.use(createStore({
        modules
      }));
      // 注册app
      app.mount('#app')
    })

}

useRouter()
