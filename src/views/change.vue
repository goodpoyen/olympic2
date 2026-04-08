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
      style="position: relative; top: 7%; left: 25%"
      :max-width="device === 'PC' ? '50%' : '80%'"
    >
      <v-card-title
        style="display: flex; justify-content: center; margin-top: 40px"
      >
        <span style="font-size: 18px; font-weight: bold; color: #3041d6"
          >重設密碼</span
        >
      </v-card-title>
      <v-form ref="form" v-model="valid" style="padding: 20px">
        <v-card-text>
          <v-container>
            <v-row style="display: flex; justify-content: center">
              <v-col cols="12" sm="6" md="6">
                <span style="font-weight: bold">重設密碼：</span>
                <v-text-field
                  style="margin-top: 3%"
                  dense
                  outlined
                  v-model="loginWord"
                  :append-icon="showPWD ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showPWD = !showPWD"
                  :type="showPWD ? 'text' : 'password'"
                  variant="underlined"
                  :rules="PWDRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row style="display: flex; justify-content: center">
              <v-col cols="12" sm="6" md="6">
                <span style="font-weight: bold">確認密碼：</span>
                <v-text-field
                  style="margin-top: 3%"
                  dense
                  outlined
                  v-model="confirmPassword"
                  :append-icon="showConfirm ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append="showConfirm = !showConfirm"
                  :type="showConfirm ? 'text' : 'password'"
                  variant="underlined"
                  :rules="confirmPWDRules"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions style="margin-top: -50px">
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            :disabled="!valid"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="changeLogin"
            >儲存</v-btn
          >
        </v-card-actions>
      </v-form>
      <v-alert
        v-show="alertShow"
        outlined
        type="warning"
        prominent
        border="left"
      >
        {{ errorMsg }}
      </v-alert>
      <!-- </div> -->
    </v-card>
    <div
      class="py-8 white--text text-center"
      style="
        font-size: 10px;
        position: absolute;
        color: white;
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
  components: {},
  data: function () {
    return {
      loginWord: "",
      confirmPassword: "",
      showPWD: false,
      showConfirm: false,
      alertShow: false,
      errorMsg: "",
      valid: true,
      device: "PC",
      PWDRules: [
        (v) => !!v || "密碼不能為空",
        (v) =>
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\w_-]).{4,16}$/.test(v) ||
          "密碼格式為 長度 8~16 英文大小寫 數字 符號",
      ],
      confirmPWDRules: [
        (v) => !!v || "密碼不能為空",
        (v) => v === this.loginWord || "確認密碼有誤",
      ],
    };
  },

  watch: {},

  computed: {},

  methods: {
    async changeLogin() {
      const user = {};
      user.loginWord = this.loginWord;
      user.system = this.globalSystemValue.system;
      user.AT = await this.tokenService.getFastAT();

      await this.axios
        .post(this.systemENV.APISERVERURL + "/changeLogin", user)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.tokenService.store(
              "act",
              response.data.resultData.act,
              "1800000",
            );
            this.tokenService.store(
              "ret",
              response.data.resultData.ret,
              "1800000",
            );
            this.tokenService.store(
              "level",
              response.data.resultData.level,
              "1800000",
            );
            this.tokenService.store(
              "olympic",
              response.data.resultData.olympic,
              "1800000",
            );
            this.tokenService.store(
              "system",
              response.data.resultData.system,
              "1800000",
            );
            location.href = "/manage/optionMenu";
          } else if (response.data.code === 207) {
            this.alertShow = true;
            this.loginWord = "";
            this.confirmPassword = "";
            this.errorMsg = "不能與現在密碼一樣";
          } else if (response.data.code === 201 || response.data.code === 501) {
            this.globalSystemTool.removeLocalStorage();
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error)
        });
    },
  },

  async mounted() {
    await this.tokenService.renewLT();
    // console.log(this.system)

    if (window.innerWidth <= 500) {
      this.device = "phone";
    } else {
      this.device = "PC";
    }
  },
};
</script>
