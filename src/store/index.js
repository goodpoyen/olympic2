import { state, mutations } from "./mutations.js";
import * as getters from "./getters.js";
import * as actions from "./actions.js";
import { createStore } from "vuex";

export default createStore({
  state,
  mutations,
  getters,
  actions,
  strict: true,
});
