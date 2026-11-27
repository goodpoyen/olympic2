<template>
  <v-card v-show="mailTypePup">
    <v-card-title dark style="background-color: #0046fe !important">
      <v-icon large style="font-size: 24px; color: white; margin-top: -3px">
        mdi-email-arrow-right-outline
      </v-icon>
      <span
        v-if="!reviewMod"
        style="
          font-size: 18px;
          margin-left: 4px;
          font-weight: bold;
          color: white;
        "
      >
        發送資料選擇
      </span>
      <span
        v-else
        style="
          font-size: 18px;
          margin-left: 4px;
          font-weight: bold;
          color: white;
        "
        >瀏覽資料選擇</span
      >
    </v-card-title>
    <v-card-text style="font-size: 20px; font-weight: bold">
      <div v-for="header in mailTypeHeader" :key="header.value">
        <v-checkbox
          v-if="header.show"
          v-model="mailType"
          :label="header.level"
          :value="header.value"
          :disabled="header.disabled"
          style="
            margin-top: -3px;
            font-size: 18px;
            font-weight: bold;
            color: black;
          "
          @update:modelValue="mailSelect = mailType === 'exam' ? 'student' : ''"
        ></v-checkbox>
        <div v-if="header.targetGroup">
          <v-radio-group
            v-if="mailType === 'exam'"
            v-model="mailSelect"
            style="margin-top: -18px; margin-left: 55px; margin-bottom: -16px"
            row
          >
            <v-radio label="應試學生" value="student"></v-radio>
            <v-radio
              v-if="globalSystemValue.system === 'olympic'"
              label="學校聯絡人"
              value="teacher"
            ></v-radio>
          </v-radio-group>
        </div>
        <div
          v-if="header.testMailConfirm"
          style="
            color: #2bcd2b;
            margin-top: -57px;
            margin-left: 114px;
            font-size: 12px;
          "
        >
          <v-icon small style="margin-top: -1px; color: #2bcd2b">
            mdi-check-circle
          </v-icon>
          已完成抽測確認
        </div>
        <div
          v-if="
            header.targetGroup2 &&
            (header.testMailConfirm || mailType === 'reviewScore')
          "
        >
          <v-radio-group
            v-if="mailType === 'score'"
            v-model="mailSelect"
            style="margin-top: 22px; margin-left: 55px; margin-bottom: -16px"
            row
          >
            <v-radio label="成績單 (成績複查使用)" value="query"></v-radio>
            <v-radio label="參賽證明 (最終結果使用)" value="final"></v-radio>
          </v-radio-group>
          <v-radio-group
            v-if="mailType === 'reviewScore'"
            v-model="mailSelect"
            style="margin-top: -20px; margin-left: 55px; margin-bottom: -16px"
            row
          >
            <v-radio label="成績單 (成績複查使用)" value="query"></v-radio>
            <v-radio label="參賽證明 (最終結果使用)" value="final"></v-radio>
          </v-radio-group>
        </div>
        <div v-if="header.testMail">
          <div style="font-size: 17px">
            <v-icon> mdi-email-arrow-right-outline </v-icon>
            成績證明寄送前抽測
          </div>
          <div
            v-show="!reviewMod"
            style="
              color: #114acc;
              font-size: 12px;
              margin-left: 4%;
              margin-top: 5px;
            "
          >
            首次寄送成績證明前，請先完成抽測確認，以確保資料與成績正確。
          </div>
          <div style="margin-left: 30px; margin-top: 5px">
            <v-btn
              v-show="!testMailOpen"
              elevation="1"
              small
              color="#114acc"
              dark
              @click="
                testMailOpen = true;
                stepperHeight = '100%';
                mailType = 'testScore';
              "
            >
              開始抽測
            </v-btn>
          </div>
          <div v-show="testMailOpen">
            <v-text-field
              style="width: 60%; margin-left: 27px"
              v-model="testMail"
              variant="underlined"
              label="成績證明（抽測確認）將寄送至："
            ></v-text-field>
            <div
              style="width: 60%; margin-left: 27px"
              class="text-subtitle-1 font-weight-bold text-grey-darken-3 mb-2"
            >
              發送資料選擇：
            </div>

            <v-sheet
              style="width: 70%; margin-left: 27px"
              color="grey-lighten-4"
              rounded="md"
              class="pa-3 mb-4 border"
            >
              <v-radio-group
                v-model="mailSelect"
                inline
                hide-details
                color="#0046fe"
              >
                <v-radio
                  label="成績單 (成績複查使用)"
                  value="query"
                  class="mr-6 font-weight-medium"
                />
                <v-radio
                  label="參賽證明 (最終結果使用)"
                  value="final"
                  class="font-weight-medium"
                />
              </v-radio-group>
            </v-sheet>
            <div>
              <email-stepper
                :mailSelect="mailSelect"
                :stepperHeight="stepperHeight"
                @getEmailContent="getEmailContent"
              ></email-stepper>
            </div>
            <div
              v-show="sendResult"
              style="
                font-size: 12px;
                margin-top: 5px;
                margin-left: 26px;
                color: #114acc;
              "
            >
              抽測信件 5封 已發送至 {{ testMail }} 信箱
            </div>
            <div style="font-size: 15px; margin-top: 25px; margin-left: 25px">
              抽測確認：
            </div>
            <div style="margin-left: 25px; margin-top: 7px">
              <v-btn
                elevation="1"
                small
                color="success"
                style="width: 53%"
                :disabled="testMailCheck"
                @click="confirmTestMail()"
              >
                <v-icon small style="margin-right: 6px"> mdi-check </v-icon>
                抽測無誤
              </v-btn>
            </div>
          </div>
        </div>
        <div v-if="header.subTitle">
          <div
            v-if="
              globalSystemValue.system !== 'olympic' && mailType === 'score'
            "
          >
            <v-text-field
              v-model="scoreSubject"
              label="請填寫信件主旨： "
              variant="underlined"
              style="width: 80%; margin-left: 6%"
            ></v-text-field>
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions style="margin-top: 3px">
      <v-spacer></v-spacer>
      <v-btn
        color="black darken-1"
        text
        style="font-weight: bold; font-size: 17px"
        @click="closeDialog()"
      >
        取消
      </v-btn>
      <v-btn
        :disabled="mailSelect === '' || mailSelect === null"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="controllerSnedTypeConfirm()"
      >
        確定</v-btn
      >
    </v-card-actions>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </v-card>
  <v-card v-show="stepperPup">
    <email-stepper
      :mailSelect="mailSelect"
      :stepperHeight="stepperHeight"
      @getEmailContent="getEmailContent"
    ></email-stepper>
    <v-card-actions style="margin-top: 3px">
      <v-spacer></v-spacer>
      <v-btn
        color="black darken-1"
        text
        style="font-weight: bold; font-size: 17px"
        @click="closeDialog()"
      >
        取消
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<style></style>

<script>
import emailStepper from "./emailStepper.vue";

export default {
  data: () => ({
    loadShow: false,
    scoreSubject: "",
    testMailOpen: false,
    testMailCheck: true,
    testMail: "",
    mailType: "",
    mailSelect: "student",
    sendResult: false,
    bntLoad: false,
    lock: false,
    stepperPup: false,
    mailTypePup: true,
    emailPayload: { subject: "", content: "" },
    stepperHeight: "100%",
  }),

  props: {
    id: "",
    reviewMod: false,
    confirmTestmailStatus: false,
    mailTypeHeader: {
      type: Array,
      default: () => [],
    },
    sendMailtype: "",
    sendMailSelected: "",
    scheduleType: 0,
    tempReviewItem: {},
    selected: {
      type: Array,
      default: () => [],
    },
    target: "",
    sendType: "",
  },

  emits: [
    "getEmailContent",
    "close",
    "closeSendTypepup",
    "updateReview",
    "chagneSendTypeContent",
    "updateSendAllMail",
    "sendTestMail",
    "confirmTestMail",
  ],

  components: { emailStepper },

  watch: {},

  beforeDestroy() {},

  methods: {
    async controllerSnedTypeConfirm() {
      if (this.mailType === "reviewExam") {
        await this.reviewExam();
      } else if (this.mailType === "reviewScore") {
        await this.reviewScore();
      } else if (this.mailType === "exam") {
        await this.sendAllMail("exam");
      } else if (this.mailType === "score") {
        if (this.globalSystemValue.system === "olympic") {
          this.stepperPup = true;
          this.mailTypePup = false;
        } else {
          await this.sendAllMail("score");
        }
      }
    },

    async reviewExam() {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.tempReviewItem.olyId;
      data.contestantsId = this.tempReviewItem.contestantsId;
      data.stId = this.tempReviewItem.stId;
      data.fileName = this.globalSystemValue.olympic;
      +"_" + "檢視內容" + this.globalSystemTool.getNowDataTimeByString();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/reviewExamFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/pdf" });
          window.open(URL.createObjectURL(blob));

          this.updateReview();
        })
        .catch(function (error) {
          this.updateReview();
        });
      this.updateReview();
    },

    async reviewScore() {
      if (this.globalSystemValue.system === "science") {
        window.open("/science/scoreload/review/" + this.tempReviewItem.stId);
        return false;
      }

      this.loadShow = true;
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.tempReviewItem.olyId;
      data.contestantsId = this.tempReviewItem.contestantsId;
      data.stId = this.tempReviewItem.stId;
      data.fileName = this.globalSystemValue.olympic;
      +"_" + "檢視內容" + this.globalSystemTool.getNowDataTimeByString();
      data.olympic = this.globalSystemValue.olympic;
      data.sendMailSelected = this.mailSelect;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/reviewScoreFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/pdf" });
          window.open(URL.createObjectURL(blob));

          this.updateReview();
        })
        .catch(function (error) {
          this.updateReview();
        });

      this.updateReview();
    },

    async sendAllMail(type) {
      await this.tokenService.renewLT();
      let stopSend = false;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;
      data.sendMailType = this.mailType;
      data.sendMailSelected = this.mailSelect;
      data.olympic = this.globalSystemValue.olympic;
      data.scheduleType = this.scheduleType;

      if (this.globalSystemValue.system === "science") {
        data.subject = this.scoreSubject;
      } else {
        data.subject = this.emailPayload.subject;
      }

      data.emailContact = this.emailPayload.content;

      const that = this;
      this.selected.forEach((exam) => {
        if (
          exam.scoreStatus === 0 &&
          exam.admission === "1" &&
          type === "score"
        ) {
          stopSend = true;
          return false;
        }
      });

      if (stopSend) {
        alert("有甄選生尚未輸入成績！");
        this.updateSendAllMail(type);

        return false;
      }

      this.chagneSendTypeContent();

      this.updateSendAllMail(type);

      this.axios.post(this.systemENV.APISERVERURL + "/sendAllMail", data);
    },

    closeDialog() {
      this.$emit("closeSendTypepup", false);
      this.testMailOpen = false;
      this.testMail = "";

      this.testMailCheck = true;
      this.lock = false;
      this.bntLoad = false;
      this.sendResult = false;
    },

    updateReview() {
      this.$emit("updateReview", false);
    },

    getEmailContent(val) {
      this.emailPayload = val;

      if (this.mailType === "score") {
        this.sendAllMail(this.mailType);
      } else if (this.mailType === "testScore") {
        if (this.testMail !== "") {
          this.testMail !== ""
            ? (this.sendResult = true)
            : (this.sendResult = false);

          this.emailPayload.testMail = this.testMail;
          this.emailPayload.mailSelect = this.mailSelect;
          this.$emit("sendTestMail", this.emailPayload);
          this.testMailCheck = false;
        }
      }
    },

    chagneSendTypeContent(title, text, type) {
      let value = {};

      (value.title = "信件發送成功"),
        (value.show = "1"),
        (value.icon = "mdi-alert-outline"),
        (value.text = this.target + this.sendType + "已發送"),
        (value.type = "");

      this.$emit("chagneSendTypeContent", value);
    },

    updateSendAllMail(value) {
      this.$emit("updateSendAllMail", value);
    },

    confirmTestMail() {
      this.testMail = "";
      this.$emit("confirmTestMail", "sendtype");
    },
  },
  async mounted() {},
};
</script>
