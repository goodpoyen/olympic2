<template>
  <div
    :style="{
      'background-image': 'url(/images/loginOTPBackgroud.png)',
      'background-repeat': 'no-repeat',
      'background-position': '50% 100%',
      height: '100%',
      width: '100%',
    }"
  >
    <v-toolbar dark class="pa-0" style="background-color: #2f365f">
      <v-toolbar-title
        v-if="device === 'PC'"
        style="
          margin: 10px 37%;
          font-weight: bold;
          font-size: 23px;
          color: white;
        "
        >{{ pageTitle }}
      </v-toolbar-title>
      <v-toolbar-title
        v-else
        style="
          margin: 10px 37%;
          font-weight: bold;
          font-size: 20px;
          color: white;
        "
        >{{ pageTitle }}
      </v-toolbar-title>
    </v-toolbar>

    <v-card
      v-if="show"
      class="mx-auto"
      :max-width="device === 'PC' ? '50%' : '100%'"
      style="margin: 10px; margin-top: 3%"
    >
      <div style="margin-bottom: 10px; color: white">.</div>
      <div
        style="
          margin-left: 3%;
          margin-bottom: 10px;
          font-weight: bold;
          font-size: 17px;
        "
      >
        甄選生您好
      </div>
      <div
        style="
          margin-left: 3%;
          margin-bottom: 20px;
          font-weight: bold;
          font-size: 17px;
          color: red;
        "
      >
        修改資料請先按下『寄送驗證碼』按鈕，驗證碼將會寄到您報名時所填的電子信箱。
      </div>
      <v-card-title
        style="
          background-color: #ededf3;
          height: 49px;
          line-height: 0rem;
          width: 93%;
          margin-left: 2%;
        "
      >
        <v-icon medium>mdi-email-check</v-icon>
        <div style="margin: -15px 35px; font-weight: bold; font-size: 16px">
          電子信箱驗證
        </div>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="3"
                  style="
                    margin-top: -13px;
                    margin-left: -26px;
                    max-width: 163px;
                  "
                >
                  <v-btn
                    v-if="!lockSend"
                    class="flex-grow-1"
                    variant="tonal"
                    style="font-weight: bold"
                    :loading="loadView || OTPBtnlock"
                    @click="
                      sendLoginOPTNumber();
                      OTPBtnlock = true;
                    "
                  >
                    <v-icon medium left style="color: black">
                      mdi-email-arrow-right-outline
                    </v-icon>
                    寄送驗證碼
                  </v-btn>
                  <v-btn v-if="lockSend" block>
                    <div><v-icon>mdi-alarm-check</v-icon></div>
                    <div>鎖定{{ sendOTPTime }}秒</div>
                  </v-btn>
                </v-col>
                <v-col
                  v-if="device === 'PC'"
                  cols="12"
                  sm="6"
                  md="9"
                  style="margin-top: -24px"
                >
                  <v-text-field
                    v-model="OTPNumber"
                    label="輸入信箱驗證碼"
                    maxlength="4"
                    variant="underlined"
                    required
                    @keydown.enter.prevent="verifyOPTLogin()"
                  ></v-text-field>
                  <div
                    v-if="!OTPPass"
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-top: -3%"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 15px; font-weight: bold"
                      >
                        驗證失敗
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col v-else cols="6" sm="6" md="6" style="margin-top: -24px">
                  <v-text-field
                    v-model="OTPNumber"
                    label="輸入信箱驗證碼"
                    maxlength="4"
                    required
                    @keydown.enter.prevent="verifyOPTLogin()"
                  ></v-text-field>
                  <div
                    v-if="!OTPPass"
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-top: -3%"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 15px; font-weight: bold"
                      >
                        驗證失敗
                      </div>
                    </div>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <div>
          <div style="color: rgb(143, 131, 131); font-weight: bolder">
            注意事項
          </div>
          <ol style="margin-top: 10px; margin-left: 20px">
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              若信箱未收到驗證碼，可再點選『寄送驗證碼』按鈕，重新取得新的驗證碼。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              如未收到信箱驗證碼請耐心等待幾分鐘或至垃圾信箱查看。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              如有任何問題，請致電報名學校承辦人。
            </li>
          </ol>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn
          rounded
          style="margin: 10px auto; font-weight: bold; width: 20%"
          :loading="loadVerify"
          variant="tonal"
          @click="verifyOPTLogin()"
        >
          驗證
        </v-btn>
      </v-card-actions>
      <v-card-title
        class="d-flex justify-center"
        style="background-color: white; height: 27px; line-height: 0rem"
      >
        <div style="font-size: 10px; color: gray">
          @ {{ new Date().getFullYear() }} All Rights Reserved.
        </div>
      </v-card-title>
    </v-card>
    <v-card
      v-else
      class="mx-auto"
      :max-width="device === 'PC' ? '50%' : '100%'"
      style="margin: 0px auto; margin-top: 3%"
    >
      <v-card-title
        class="d-flex justify-center"
        style="background-color: white; height: 27px; line-height: 0rem"
      >
        <div style="font-size: 16px; color: red">
          {{ this.warningWord }}
        </div>
      </v-card-title>
      <v-card-title
        class="d-flex justify-center"
        style="background-color: white; height: 27px; line-height: 0rem"
      >
        <div style="font-size: 10px; color: gray">
          @ {{ new Date().getFullYear() }} All Rights Reserved.
        </div>
      </v-card-title>
    </v-card>
  </div>
</template>

<script>
export default {
  data: () => ({
    pageTitle: "高級中等學校科學班報名資料修改",
    OTPPass: true,
    lockSend: false,
    loadView: false,
    loadVerify: false,
    OTPBtnlock: false,
    reciprocalOTP: null,
    warningWord: "",
    sendOTPTime: 3,
    timeTemp: 3,
    num: "",
    email: "",
    name: "",
    OTPNumber: "",
    num2: "",
    device: "PC",
    show: true,
  }),

  watch: {},

  beforeDestroy() {
    clearInterval(this.reciprocalOTP);
  },

  computed: {
    key() {
      return this.$route.params.signupKey;
    },
  },

  methods: {
    async checkURIKey() {
      const data = {};
      data.key = this.key;

      if (window.innerWidth <= 500) {
        this.device = "phone";
      } else {
        this.device = "PC";
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkURIKey", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.email = response.data.resultData.email;
            this.name = response.data.resultData.name;
            if (response.data.resultData.scheduleType === "5") {
              this.pageTitle = "高級中等學校科學班報名資料修改";
            } else if (response.data.resultData.scheduleType === "6") {
              this.pageTitle = "高級中等學校科學班實驗實作繳費";
            }
          } else if (response.data.code === 412) {
            const date = this.globalSystemTool.getNowDataTime();

            if (date < response.data.signupStart) {
              if (response.data.scheduleType === "5") {
                location.href = "/science/signup/";
              } else {
                this.show = false;
                this.warningWord = "繳費尚未開始";
              }
            } else if (date > response.data.signupEnd) {
              if (response.data.scheduleType === "5") {
                this.show = false;
                this.warningWord = "報名已結束，無法再修正報名資料";
              } else {
                this.show = false;
                this.warningWord = "繳費已結束";
              }
            }
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    sendOPTtimeDownStart() {
      this.reciprocalOTP = setInterval(this.sendOTPTimedown, 1000);
    },

    sendOTPTimedown() {
      this.lockSend = true;
      this.sendOTPTime--;

      if (this.sendOTPTime === 0) {
        this.timeTemp = this.timeTemp * 2;
        this.sendOTPTime = this.timeTemp;

        this.lockSend = false;
        this.OTPBtnlock = false;
        clearInterval(this.reciprocalOTP);
      }
    },

    async sendLoginOPTNumber() {
      this.loadView = true;
      const data = {};
      data.email = this.email;
      data.name = this.name;

      this.num = "";
      await this.axios
        .post(this.systemENV.APISERVERURL + "/sendLoginOPTNumber", data)
        .then((response) => {
          this.sendOPTtimeDownStart();
          // console.log(response.data);
          if (response.data.code === 200) {
            this.loadView = false;
            this.num = response.data.resultData.num;
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async verifyOPTLogin() {
      this.loadVerify = true;
      const data = {};
      data.email = this.email;
      data.OTPNumber = this.OTPNumber;
      data.num = this.num;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/verifyOPTLogin", data)
        .then((response) => {
          this.loadVerify = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            this.lock = false;
            this.num2 = response.data.resultData.key2;
            this.num = "";
            this.verifyPass = true;
            this.tokenService.setET(this.num2.substring(4, 8));
            clearInterval(this.reciprocalOTP);
            location.href =
              "/science/editor/" + this.key + "/" + this.num2.substring(0, 4);
          } else if (response.data.code === 411) {
            this.OTPPass = false;
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      clearInterval(this.reciprocalOTP);
    },
  },

  async mounted() {
    clearInterval(this.reciprocalOTP);

    if (window.performance.navigation.type === 2) {
      location.href = "/science/signup/";
    }

    await this.checkURIKey();
  },
};
</script>
