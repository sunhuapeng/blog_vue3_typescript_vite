import axios from "axios";
import { article } from './interface'
import Idb from '../utils/IndexedDB'
// import { loadEnv } from 'vite';

export const getMd = async function () {
  const indexDB = new Idb('articles')
  await indexDB.init()
  const modules = import.meta.glob('../../public/md/*.md')
  let fileList: article[] = []
  // console.log('modules', modules)
  for (const path in modules) {
    const names = path.split('md/')
    const name = names[1]
    // console.log('path', path)
    // console.log(window.location)

    // 判断开发环境还是生产环境
    // console.log(window.location.origin)
    const origin = window.location.origin
    const flag = import.meta.env.MODE === 'development'
    const asiosPath = flag ? path : (origin + '/md/' + name)
    // console.log('import.meta.env', import.meta.env)

    const data = await getAxios(asiosPath) as string
    // console.log('data', data)
    var dom = document.createElement("div");
    dom.innerHTML = data;
    // console.dir(dom)
    const title: string = (dom.getElementsByClassName('title')[0] as any).innerText
    const article_id: string = (dom.getElementsByClassName('article_id')[0] as any).innerText
    const create_time: string = (dom.getElementsByClassName('create_time')[0] as any).innerText
    const update_time: string = (dom.getElementsByClassName('update_time')[0] as any).innerText
    const cover_image: string = (dom.getElementsByClassName('cover_image')[0] as any).innerText
    const tag: string = (dom.getElementsByClassName('target')[0] as any).innerText
    let isHtml = false
    if(dom.getElementsByClassName('isHtml')[0]){
      console.log(name)
      isHtml = Boolean((dom.getElementsByClassName('isHtml')[0] as any).innerText)
    }
    const tags = tag.split('|')
    const brief_content: string = (dom.getElementsByClassName('brief_content')[0] as any).innerText
    const item = {
      name, // 文件名称
      title, // 文章标题
      article_id, // 文章id
      article_url: path,//文章本地地址
      brief_content, // 简介
      tags, // 标签
      create_time: Number(create_time),// 创建时间
      update_time: Number(update_time),// 更新时间
      detail: data, // 详情
      cover_image, // 封面
      isHtml
    }
    // console.log(item.isHtml)
    try {
      const res = await indexDB.getItem(article_id) as article
      // 判断更新时间
      const flag = res.update_time < item.update_time
      // 替换更新
      if (flag) {
        await indexDB.updateItem(article_id, item)
        fileList.push(item)
      } else {
        fileList.push(res)
      }
    } catch (error) {
      await indexDB.setItem(article_id, item)
      fileList.push(item)
    }
  }
  return fileList
}
export function getHtml (){
  const modules = import.meta.glob('../../public/html/**/*.html')
  const htmls = []
  for (const path in modules) {
    const names = path.split('中级案例html/')
    const name = names[1]
    const origin = window.location.origin
    const flag = import.meta.env.MODE === 'development'
    const asiosPath = flag ? path : (origin + '/html/中级案例html/' + name)
    htmls.push({
      name,
      path: asiosPath
    })
  }
  return htmls
}

export async function getAxios(path: string): Promise<any> {
  const res = await axios.get(path)
  if (res) {
    return res.data
  } else throw '请求失败'
}