<template>
  <v-app v-show="loginShow">
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import { envValue } from "./utils/envValue.js";
import { globalValue } from "./utils/globalValue.js";
import { globalTool } from "./utils/tool.js";
import { recordService } from "./utils/record.js";
import { tokenService } from "./utils/token.js";
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
      link.href = "/images/scienceFav.png";
    } else {
      document.title = "臺灣奧林匹亞";
      link.href = "/images/fav.png";
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
    // this.systemENV = envValue();
    console.log(envValue());
    console.log(456);
    console.log(123);
    console.log(this.systemENV);
    const currentUrl = window.location.pathname;

    if (
      currentUrl.includes("/science/verifyOPT/") ||
      currentUrl.includes("/science/editor/") ||
      currentUrl.includes("/science/barcodeprint/") ||
      currentUrl.includes("/science/checkback/") ||
      currentUrl.includes("/science/signup") ||
      currentUrl.includes("/science/signup/") ||
      currentUrl.includes("/science/scoreload/")
    ) {
      if (
        this.systemENV.MOD === "sit" &&
        location.hostname !== "scibeta.csie.ntnu.edu.tw"
      ) {
        location.href = "https://scibeta.csie.ntnu.edu.tw";
      }

      if (
        this.systemENV.MOD === "prod" &&
        location.hostname !== "sciprograms.tpmso.org"
      ) {
        location.href = "https://sciprograms.tpmso.org";
      }
      this.loginShow = true;
      return true;
    }

    if (currentUrl.includes("/login") || currentUrl.includes("/scilogin")) {
      if (
        location.hostname === "reg.tpmso.org" ||
        location.hostname === "olybeta.csie.ntnu.edu.tw"
      ) {
        this.loginShow = true;
      } else {
        if (this.systemENV.MOD === "dev") {
          this.loginShow = true;
        } else if (
          location.hostname === "sciprograms.tpmso.org" ||
          location.hostname === "scibeta.csie.ntnu.edu.tw"
        ) {
          this.loginShow = true;
        }
      }
    }

    if (!(await this.tokenService.checkLogin())) {
      if (!currentUrl.includes("/login") && !currentUrl.includes("/scilogin")) {
        if (
          location.hostname === "reg.tpmso.org" ||
          location.hostname === "olybeta.csie.ntnu.edu.tw"
        ) {
          location.href = "/login";
        } else {
          if (this.systemENV.MOD === "dev") {
            if (currentUrl.includes("/manage")) {
              if (this.globalSystemValue.system === "science") {
                location.href = "/science/scilogin";
              } else {
                location.href = "/login";
              }
            } else {
              location.href = "/science/signup";
            }
          } else if (
            location.hostname === "sciprograms.tpmso.org" ||
            location.hostname === "scibeta.csie.ntnu.edu.tw"
          ) {
            location.href = "/science/signup";
          }
        }
      } else {
        if (
          (location.hostname === "reg.tpmso.org" ||
            location.hostname === "olybeta.csie.ntnu.edu.tw") &&
          currentUrl.includes("/science/")
        ) {
          if (this.systemENV.MOD === "sit") {
            location.href = "https://scibeta.csie.ntnu.edu.tw";
          }

          if (this.systemENV.MOD === "prod") {
            location.href = "https://sciprograms.tpmso.org";
          }
        }

        if (
          (location.hostname === "sciprograms.tpmso.org" ||
            location.hostname === "scibeta.csie.ntnu.edu.tw") &&
          !currentUrl.includes("/science/")
        ) {
          if (this.systemENV.MOD === "sit") {
            location.href = "https://olybeta.csie.ntnu.edu.tw";
          }

          if (this.systemENV.MOD === "prod") {
            location.href = "https://reg.tpmso.org";
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
            if (
              location.hostname === "reg.tpmso.org" ||
              location.hostname === "olybeta.csie.ntnu.edu.tw"
            ) {
              location.href = "/login";
            }

            if (
              location.hostname === "sciprograms.tpmso.org" ||
              location.hostname === "scibeta.csie.ntnu.edu.tw"
            ) {
              location.href = "/science/scilogin";
            }
          }
        }
      }
    }
  },
};
</script>
