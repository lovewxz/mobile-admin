import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)


// 应用初始状态
const state = {
    count: 10,
    user: ''
}

// 定义所需的 mutations
const mutations = {
    SAVEUSER(state, user) {
        state.user = user
        sessionStorage.setItem('user', JSON.stringify(state.user))
    },
    GETUSER(state) {
        var user = sessionStorage.getItem('user')
        if (user) {
            user = JSON.parse(user)
            state.user = user
        }
    },
    REMOVEUSER(state) {
        sessionStorage.removeItem('user');
    }
}

// 创建 store 实例
export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations
})