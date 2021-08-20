import { getMd } from '../../utils/index'

const state = {
  articles: [],
}

// getters
const getters = {
  getArticles: (state: any) => state.articles,
  getTags: (state: any) => {
    let tags = [] as any
    state.articles.forEach((item:any) => {
      tags.push(...item.tags)
      tags = [...new Set(tags)]
    })
    return tags
  },
}

// actions
const actions = {
  async setArticles({ commit, state }: any) {
    const mds = await getMd()
    const articles = [...mds]
    commit('articles', articles)
  },
}

// mutations
const mutations = {
  articles(state: any, data: any) {
    state.articles = data
  },
  
}

export const articles = {
  state,
  getters,
  actions,
  mutations
}

