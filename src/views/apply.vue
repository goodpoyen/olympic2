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
      :loading="load"
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
              <v-col
                v-if="page === 'signup'"
                cols="12"
                sm="12"
                md="12"
                style="margin-top: -31px"
              >
                查詢人員：
              </v-col>
              <v-col
                v-if="page === 'signup'"
                cols="12"
                sm="12"
                md="12"
                style="margin-top: -31px"
              >
                <v-radio-group v-model="role" row>
                  <v-radio label="聯絡人" value="1"></v-radio>
                  <v-radio label="學生" value="2"></v-radio>
                </v-radio-group>
              </v-col>
              <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                <v-text-field
                  v-model="email"
                  label="報名信箱"
                  inputmode="email"
                  prepend-icon="mdi-email-check-outline"
                  :rules="emailRules"
                  required
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
              type="success"
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
            v-if="page === 'signup'"
            block
            depressed
            class="mr-4 white--text"
            color="#2D5BFF"
            :disabled="load"
            @click="applySignup()"
            autocomplete
            >送出</v-btn
          >
          <v-btn
            v-if="page === 'score'"
            block
            depressed
            class="mr-4 white--text"
            color="#2D5BFF"
            :disabled="load"
            @click="applyScore()"
            autocomplete
            >送出</v-btn
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
    page: "",
    imgaesCode: "",
    imgaesCodeLoading: true,
    load: false,
    role: "",
    email: "",
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
      (v) => !!v || "信箱不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v,
        ) || "信箱格式錯誤",
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
    email: function () {
      if (this.email !== "") {
        this.dialogMsg = "";
        this.dialog = false;
      }
    },
  },
  computed: {},

  methods: {
    async applySignup() {
      this.alertShow = false;
      this.dialog = false;

      let emailRule =
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

      if (this.verifycode === "" || !emailRule.test(this.email)) {
        this.dialogMsg = "請輸入信箱與驗證碼";
        this.dialog = true;

        return false;
      }

      this.load = true;

      const data = {};
      data.email = this.email;
      data.verifycode = this.verifycode;
      data.system = this.system;
      data.role = this.role;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/applySignup", data)
        .then((response) => {
          // console.log(response.data);
          this.load = false;
          if (response.data.code === 200) {
            this.alertShow = true;
            this.errorMsg = "報名結果已寄送至您報名的信箱";
          } else if (response.data.code === 215) {
            this.dialogMsg = "驗證碼錯誤";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else if (response.data.code === 216) {
            this.dialogMsg = "尚無報名活動可查詢";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else if (response.data.code === 217) {
            this.dialogMsg = "查無此信箱報名資訊 (請確認報名信箱是否正確)";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else {
            // this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async applyScore() {
      this.alertShow = false;
      this.dialog = false;

      let emailRule =
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;

      if (this.verifycode === "" || !emailRule.test(this.email)) {
        this.dialogMsg = "請輸入信箱與驗證碼";
        this.dialog = true;

        return false;
      }

      this.load = true;

      const data = {};
      data.email = this.email;
      data.verifycode = this.verifycode;
      data.system = this.system;
      data.role = this.role;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/applyScore", data)
        .then((response) => {
          // console.log(response.data);
          this.load = false;
          if (response.data.code === 200) {
            this.alertShow = true;
            this.errorMsg = "成績資料已寄送至您報名的信箱";
          } else if (response.data.code === 215) {
            this.dialogMsg = "驗證碼錯誤";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else if (response.data.code === 216) {
            this.dialogMsg = "尚無成績可查詢";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else if (response.data.code === 217) {
            this.dialogMsg = "查無信箱報名資訊或尚未開放成績查詢";
            this.dialog = true;
            this.verifycode = "";

            this.makeCode();
          } else {
            // this.globalSystemTool.removeLocalStorage();
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

    if (currentUrl.includes("/applySignup")) {
      this.page = "signup";
    } else {
      this.page = "score";
    }

    if (window.innerWidth <= 500) {
      this.device = "phone";
    } else {
      this.device = "PC";
    }

    if (this.systemENV.MOD === "prod" || this.systemENV.MOD === "dev") {
      if (this.page === "signup") {
        this.loginTitle = "查詢報名資訊";
      } else {
        this.loginTitle = "查詢成績";
      }

      this.system = "olympic";
    } else if (this.systemENV.MOD === "sit") {
      if (this.page === "signup") {
        this.loginTitle = "(測試環境)查詢報名資訊";
      } else {
        this.loginTitle = "(測試環境)查詢成績";
      }
      this.system = "olympic";
    }

    this.makeCode();
  },
};
</script>
