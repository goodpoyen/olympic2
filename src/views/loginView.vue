<template>
  <v-main
    :style="{
      'background-image': 'url(/images/loginBackground.png)',
      'background-size': '100% 100%',
      'background-repeat': 'no-repeat',
      height: '100%',
    }"
  >
    <v-card
      style="margin: 40px auto"
      :max-width="device === 'PC' ? '50%' : '80%'"
    >
      <v-card-title
        style="display: flex; justify-content: center; margin-top: 40px"
      >
        <span style="font-size: 18px; font-weight: bold; color: #3041d6">{{
          loginTitle
        }}</span>
      </v-card-title>
      <v-form>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                <v-text-field
                  v-model="account"
                  label="帳號"
                  inputmode="email"
                  prepend-icon="mdi-account-circle-outline"
                  :rules="emailRules"
                  required
                  @keyup.enter="login"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                <v-text-field
                  v-model="loginWord"
                  :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                  label="密碼"
                  :type="show1 ? 'text' : 'password'"
                  prepend-icon="mdi-key"
                  autocomplete="new-password"
                  :rules="[(v) => !!v || '密碼不能為空']"
                  required
                  @click:append="show1 = !show1"
                  @keyup.enter="login"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                <v-text-field
                  v-model="verifycode"
                  :counter="4"
                  label="驗證碼"
                  :type="'verifycode'"
                  prepend-icon="mdi-keyboard-outline"
                  :rules="[
                    (v) => !!v || '驗證碼不能為空',
                    (v) => v.length <= 4 || '超過規定字數',
                  ]"
                  required
                  @keyup.enter="login"
                ></v-text-field>
                <v-progress-circular
                  v-show="imgaesCodeLoading"
                  :size="20"
                  :width="2"
                  color="green"
                  indeterminate
                ></v-progress-circular>
                <img :src="imgaesCode" v-show="!imgaesCodeLoading" />
                <v-btn
                  icon
                  color="green"
                  v-show="!imgaesCodeLoading"
                  @click="refreshCode"
                >
                  <v-icon>mdi-cached</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-alert
              v-show="alertShow"
              outlined
              type="warning"
              prominent
              border="left"
            >
              {{ errorMsg }}
            </v-alert>
            <v-alert
              v-show="dialog"
              border="left"
              colored-border
              type="error"
              elevation="2"
              style="margin-top: 20px"
            >
              {{ dialogMsg }}
            </v-alert>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            block
            depressed
            class="mr-4 white--text"
            color="#2D5BFF"
            :disabled="invalid"
            @click="login()"
            autocomplete
            >登入</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
    <div
      class="py-8 white--text text-center"
      style="
        font-size: 10px;
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 60px;
      "
    >
      @ {{ new Date().getFullYear() }} ALL Rights Reserved.
    </div>
  </v-main>
</template>

<script>
export default {
  data: () => ({
    imgaesCode: "",
    imgaesCodeLoading: true,
    invalid: false,
    account: "",
    loginWord: "",
    system: "",
    verifycode: "",
    identifyCode: "",
    alertShow: false,
    errorMsg: "",
    dialogMsg: "",
    dialog: false,
    show1: false,
    loginTitle: "",
    loginCount: 0,
    device: "PC",
    emailRules: [
      (v) => !!v || "帳號不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v
        ) || "帳號錯誤",
    ],
  }),

  watch: {
    verifycode: function () {
      if (this.verifycode !== "") {
        this.errorMsg = "";
        this.alertShow = false;
        this.dialogMsg = "";
        this.dialog = false;
      }
    },
    account: function () {
      if (this.account !== "") {
        this.dialogMsg = "";
        this.dialog = false;
      }
    },
    loginWord: function () {
      if (this.loginWord !== "") {
        this.dialogMsg = "";
        this.dialog = false;
      }
    },
  },
  computed: {},

  methods: {
    async login() {
      let emailRule =
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

      if (
        this.loginWord === "" ||
        this.verifycode === "" ||
        !emailRule.test(this.account)
      ) {
        return false;
      }

      const user = {};
      user.account = this.account;
      user.loginWord = this.loginWord;
      user.verifycode = this.verifycode;
      user.system = this.system;

      if (
        localStorage.getItem("Lcount") !== null &&
        JSON.parse(localStorage.getItem("Lcount")).value >= 3
      ) {
        if (
          new Date().getTime() -
            JSON.parse(localStorage.getItem("Lcount")).time >=
          JSON.parse(localStorage.getItem("Lcount")).expire
        ) {
          localStorage.removeItem("Lcount");
        } else {
          this.alertShow = true;
          this.errorMsg = "登入失敗多次，請稍後再登入";
          this.verifycode = "";
          return false;
        }
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/login", user)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            localStorage.removeItem("Lcount");
            this.tokenService.store(
              "act",
              response.data.resultData.act,
              "1800000"
            );
            this.tokenService.store(
              "ret",
              response.data.resultData.ret,
              "1800000"
            );
            this.tokenService.store(
              "level",
              response.data.resultData.level,
              "1800000"
            );
            this.tokenService.store(
              "olympic",
              response.data.resultData.olympic,
              "1800000"
            );
            this.tokenService.store(
              "system",
              response.data.resultData.system,
              "1800000"
            );
            location.href = "/manage/optionMenu";
          } else if (response.data.code === 201 || response.data.code === 501) {
            this.dialogMsg = "帳號密碼有誤";
            this.dialog = true;
            this.account = "";
            this.loginWord = "";
            this.verifycode = "";
            if (localStorage.getItem("Lcount") === null) {
              this.tokenService.store("Lcount", 1, "900000");
            } else {
              this.loginCount = JSON.parse(
                localStorage.getItem("Lcount")
              ).value;
              this.tokenService.store("Lcount", this.loginCount + 1, "900000");
            }
            this.refreshCode();
          } else if (response.data.code === 206) {
            this.tokenService.store(
              "act",
              response.data.resultData.act,
              "1800000"
            );
            this.tokenService.store(
              "ret",
              response.data.resultData.ret,
              "1800000"
            );
            this.tokenService.store(
              "level",
              response.data.resultData.level,
              "1800000"
            );
            this.tokenService.store(
              "olympic",
              response.data.resultData.olympic,
              "1800000"
            );
            this.tokenService.store(
              "system",
              response.data.resultData.system,
              "1800000"
            );
            if (this.system === "science") {
              location.href = "/science/change";
            } else {
              location.href = "/change";
            }
          } else if (response.data.code === 215) {
            this.alertShow = true;
            this.errorMsg = "驗證碼錯誤";
            this.verifycode = "";
            if (localStorage.getItem("Lcount") === null) {
              this.tokenService.store("Lcount", 1, "900000");
            } else {
              this.loginCount = JSON.parse(
                localStorage.getItem("Lcount")
              ).value;
              this.tokenService.store("Lcount", this.loginCount + 1, "900000");
            }
            this.makeCode();
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    refreshCode() {
      this.imgaesCodeLoading = true;
      this.identifyCode = "";
      this.makeCode();
    },

    async makeCode() {
      const data = {};
      data.system = this.system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/makeCode", data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response);
          this.imgaesCodeLoading = false;
          this.imgaesCode = window.URL.createObjectURL(response.data);
        })
        .catch(function (error) {
          // console.log(error);
        });
    },
  },

  mounted() {
    this.identifyCode = "";
    const currentUrl = window.location.pathname;

    if (window.innerWidth <= 500) {
      this.device = "phone";
    } else {
      this.device = "PC";
    }
    if (this.systemENV.MOD === "prod" || this.systemENV.MOD === "dev") {
      if (currentUrl.includes("/science/")) {
        this.loginTitle = "高級中等學校科學班系統";
        this.system = "science";
      } else {
        this.loginTitle = "奧林匹亞選訓支援系統";
        this.system = "olympic";
      }
    } else if (this.systemENV.MOD === "sit") {
      if (currentUrl.includes("/science/")) {
        this.loginTitle = "(測試環境)高級中等學校科學班系統";
        this.system = "science";
      } else {
        this.loginTitle = "(測試環境)奧林匹亞選訓支援系統";
        this.system = "olympic";
      }
    }

    this.makeCode();
  },
};
</script>
