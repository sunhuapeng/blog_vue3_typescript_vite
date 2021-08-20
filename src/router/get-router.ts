// global.ts
import {defineAsyncComponent} from 'vue'
import { RouteRecordRaw, createRouter, createWebHashHistory } from 'vue-router';

function getModules() {
  const components = import.meta.glob('../view/**/*.tsx')
  return components
}
function getComponents() {
  const components = import.meta.globEager('../view/**/*.tsx')
  return components
}
// 自动注册组件
export const asyncComponent = function (app: any): void {
  const modules = getModules();
  const components = getComponents();
  Object.keys(modules).forEach((key: string) => {
    const viewSrc = components[key];
    const file = viewSrc.default;
    if (!file.isComponents) return
    const AsyncComponent = defineAsyncComponent(modules[key])
    app.component(file.name.toUpperCase(), AsyncComponent)
  });
  // console.log(app._component.components)
};

// 自动注册路由
export const vueRouters = function (): Array<RouteRecordRaw> {
  let routerList: Array<RouteRecordRaw> = [];
  const modules =  getModules();
  const components = getComponents();
  Object.keys(modules).forEach(key => {
     const viewSrc = components[key];
     const file = viewSrc.default;
     if (!file.isRouter) return
     // 首字母转小写 letterToLowerCase 首字母转大写 letterToUpperCase
     routerList.push({
       path: `/${file.name.toLowerCase()}`,
       name: `${file.name.toUpperCase()}`,
       component: modules[key]
     });
  })
  return routerList
}