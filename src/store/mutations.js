import * as types from './mutations_type.js'
// import Vue from 'vue'

export const state = {
  count: 0,
  title: '',
  personnlFilter: '',
  signupName: '',
  signupStartTime: '',
  signupEndTime: ''
}

// mutations
export const mutations = {
  [types.INCREASE] (state) {
    state.count += 1
  },
  [types.DECREASE] (state) {
    state.count -= 1
  },

  [types.title] (state, status) {
    state.title = status
  },

  [types.personnlFilter] (state, status) {
    state.personnlFilter = status
  },

  [types.signupStartTime] (state, status) {
    state.signupStartTime = status
  },

  [types.signupEndTime] (state, status) {
    state.signupEndTime = status
  },

  [types.examCodeStatus] (state, status) {
    state.examCodeStatus = status
  }
}
