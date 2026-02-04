import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/404",
    name: "404",
    component: () => import("../views/404.vue"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/loginView.vue"),
  },
  // {
  //   path: "/science/scilogin",
  //   name: "scienceScilogin",
  //   component: () => import("../views/loginView.vue"),
  // },
  // {
  //   path: "/change",
  //   name: "change",
  //   component: () => import("../views/change.vue"),
  // },
  // {
  //   path: "/science/change",
  //   name: "scienceChange",
  //   component: () => import("../views/change.vue"),
  // },
  // {
  //   path: "/science/signup",
  //   name: "scienceSignup",
  //   component: () => import("../views/scienceSignup.vue"),
  // },
  // {
  //   path: "/science/signup/:testName",
  //   name: "testScienceSignup",
  //   component: () => import("../views/scienceSignup.vue"),
  // },
  // {
  //   path: "/science/signupresult/:id",
  //   name: "signupresult",
  //   component: () => import("../views/scienceSignupFinish.vue"),
  // },
  // {
  //   path: "/science/verifyOPT/:signupKey",
  //   name: "verifyOPT",
  //   component: () => import("../views/loginOTP.vue"),
  // },
  // {
  //   path: "/science/editor/:signupKey/:editorKey",
  //   name: "editor",
  //   component: () => import("../views/scienceEditor.vue"),
  // },
  // {
  //   path: "/science/signupresult/:id",
  //   name: "signupresult",
  //   component: () => import("../views/scienceSignupFinish.vue"),
  // },
  // {
  //   path: "/science/editor/:signupKey/barcodeprint/:paymentNumber",
  //   name: "barcodeprint",
  //   component: () => import("../views/barcodeprint.vue"),
  // },
  // {
  //   path: "/science/checkback/:num",
  //   name: "checkback",
  //   component: () => import("../views/checkback.vue"),
  // },
  // {
  //   path: "/science/scoreload/:id",
  //   name: "scoreload",
  //   component: () => import("../views/scoreload.vue"),
  // },
  // {
  //   path: "/science/scoreload/review/:id",
  //   name: "scoreload",
  //   component: () => import("../views/scoreload.vue"),
  // },
  // {
  //   path: "/manage",
  //   name: "manage",
  //   component: () => import("../views/manageView.vue"),
  //   children: [
  //     {
  //       path: "optionMenu",
  //       name: "optionMenu",
  //       component: () => import("../components/optionMenu.vue"),
  //     },
  //     {
  //       path: "optionExam/:id",
  //       name: "optionExam",
  //       props: true,
  //       component: () => import("../components/optionExam.vue"),
  //     },
  //     {
  //       path: "optionCamp/:id",
  //       name: "optionCamp",
  //       props: true,
  //       component: () => import("../components/optionCamp.vue"),
  //     },
  //     {
  //       path: "optionOnlineExam/:id",
  //       name: "optionOnlineExam",
  //       props: true,
  //       component: () => import("../components/optionOnlineExam.vue"),
  //     },
  //     {
  //       path: "optionScienceExam/:id",
  //       name: "optionScienceExam",
  //       props: true,
  //       component: () => import("../components/optionScienceExam.vue"),
  //     },
  //     {
  //       path: "personnelInfo/:id",
  //       name: "personnelInfo",
  //       props: true,
  //       component: () => import("../components/personnelInfo.vue"),
  //     },
  //     {
  //       path: "examArea/:id",
  //       name: "examArea",
  //       props: true,
  //       component: () => import("../components/examArea.vue"),
  //     },
  //     {
  //       path: "classRoom/:id",
  //       name: "classRoom",
  //       props: true,
  //       component: () => import("../components/classRoom.vue"),
  //     },
  //     {
  //       path: "contestants/:id",
  //       name: "contestants",
  //       props: true,
  //       component: () => import("../components/contestants.vue"),
  //     },
  //     {
  //       path: "account",
  //       name: "account",
  //       component: () => import("../components/account.vue"),
  //     },
  //     {
  //       path: "schoolUser",
  //       name: "schoolUser",
  //       component: () => import("../components/schoolUser.vue"),
  //     },
  //     {
  //       path: "upload",
  //       name: "upload",
  //       component: () => import("../components/upload.vue"),
  //     },
  //     {
  //       path: "setting",
  //       name: "setting",
  //       component: () => import("../components/setting.vue"),
  //     },
  //     {
  //       path: "defaultscore/:olyid",
  //       name: "defaultscore",
  //       component: () => import("../components/defaultscore.vue"),
  //     },
  //   ],
  // },
  // {
  //   path: "/",
  //   name: "home",
  //   component: HomeView,
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
