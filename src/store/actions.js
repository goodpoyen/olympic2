// import Vue from 'vue'
// import mutations from './mutations'
// 引入 mutations_type （引用同一個 key）
import * as types from './mutations_type.js'

export const actionIncrease = ({ commit }) => {
  commit(types.INCREASE)
}

export const actionDecrease = ({ commit }) => {
  commit(types.DECREASE)
}

export const title = ({ commit }, word) => {
  commit(types.title, word)
}

export const personnlFilter = ({ commit }, word) => {
  commit(types.personnlFilter, word)
}

export const signupStartTime = ({ commit }, word) => {
  commit(types.signupStartTime, word)
}

export const signupEndTime = ({ commit }, word) => {
  commit(types.signupEndTime, word)
}

export const examCodeStatus = ({ commit }, word) => {
  commit(types.examCodeStatus, word)
}
