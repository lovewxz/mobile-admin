import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)

let sessionId = ''
let user = sessionStorage.getItem('user')

if (user) {
    user = JSON.parse(user);
    sessionId = user.SessionId
}

// 应用初始状态
const state = {
    count: 10,
    sessionId: sessionId
}



// 定义所需的 mutations
const mutations = {
    INCREMENT(state) {
        state.count++
    },
    DECREMENT(state) {
        state.count--
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})