<template>
  <v-app v-show="loginShow">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  data: () => ({
    loginShow: false,
    userStatus: "",
    system: "",
  }),

  created() {
    const currentUrl = window.location.pathname;

    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.getElementsByTagName("head")[0].appendChild(link);
    }

    if (currentUrl.includes("/science/")) {
      document.title = "高級中等學校科學班";
      link.href = require("@/assets/images/scienceFav.png");
    } else {
      document.title = "臺灣奧林匹亞";
      link.href = require("@/assets/images/fav.png");
    }
  },

  methods: {
    async getUserStatus() {
      const data = {};
      data.AT = await this.tokenService.getFastAT();

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getUserStatus", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.userStatus = response.data.resultData;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },

  async mounted() {
    const currentUrl = window.location.pathname;

    if (
      currentUrl.includes("/science/verifyOPT/") ||
      currentUrl.includes("/science/editor/") ||
      currentUrl.includes("/science/barcodeprint/") ||
      currentUrl.includes("/science/checkback/") ||
      currentUrl.includes("/science/signupresult/") ||
      currentUrl.includes("/science/signup/") ||
      currentUrl.includes("/science/scoreload/") ||
      currentUrl.includes("/science/signup") ||
      currentUrl.toLowerCase().includes("/applysignup") ||
      currentUrl.toLowerCase().includes("/applyscore")
    ) {
      this.loginShow = true;

      return true;
    }

    if (
      currentUrl.includes("/login") ||
      currentUrl.includes("/scilogin") ||
      currentUrl.includes("/404")
    ) {
      this.loginShow = true;

      if (
        this.systemENV.MOD === "prod" &&
        location.hostname === this.systemENV.APLDOMAIN
      ) {
        return true;
      }
    }

    if (!(await this.tokenService.checkLogin())) {
      if (currentUrl !== "/login" && currentUrl !== "/science/scilogin") {
        if (location.hostname === this.systemENV.OLYDOMAIN) {
          location.href = "/login";
        } else if (location.hostname === this.systemENV.APLDOMAIN) {
          location.href = "/404";
        } else if (location.hostname === this.systemENV.SCIDOMAIN) {
          if (currentUrl.includes("/manage")) {
            location.href = "/science/scilogin";
          } else {
            location.href = "/science/signup";
          }
        } else {
          if (currentUrl.includes("/manage")) {
            if (this.globalSystemValue.system === "science") {
              location.href = "/science/scilogin";
            } else {
              location.href = "/login";
            }
          } else {
            location.href = "/science/signup";
          }
        }
      }
    } else {
      this.loginShow = true;
      await this.getUserStatus();

      if (this.userStatus === "1") {
        if (!currentUrl.includes("/change")) {
          location.href = "/change";
        }
      } else {
        if (
          (currentUrl.includes("/login") &&
            this.globalSystemValue.system === "olympic") ||
          currentUrl.includes("/change") ||
          (currentUrl.includes("/scilogin") &&
            this.globalSystemValue.system === "science")
        ) {
          location.href = "/manage/optionMenu";
        } else {
          if (currentUrl === "/") {
            if (this.systemENV.MOD === "dev") {
              if (this.globalSystemValue.system === "science") {
                location.href = "/science/scilogin";
              } else {
                location.href = "/login";
              }
            }
            if (location.hostname === this.systemENV.OLYDOMAIN) {
              location.href = "/login";
            }

            if (location.hostname === this.systemENV.SCIDOMAIN) {
              location.href = "/science/scilogin";
            }
          }
        }
      }
    }
  },
};
</script>
