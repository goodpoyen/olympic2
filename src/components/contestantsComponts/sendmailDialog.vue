<template>
  <v-card>
    <v-card-title
      v-if="pupTitleShow === '1'"
      style="background-color: #2d5bff; height: 48px"
    >
      <v-icon
        large
        style="
          font-size: 23px;
          font-weight: bold;
          color: white;
          margin-right: 7px;
        "
      >
        {{ pupTitleIcon }}
      </v-icon>
      <span
        class=""
        style="font-size: 18px !important; font-weight: bold; color: white"
        >{{ pupTitle }}</span
      >
    </v-card-title>
    <v-card-text style="font-size: 20px; font-weight: bold">
      <div v-html="pupText"></div>
      <div
        v-if="
          (scheduleType === 5 || scheduleType === 6) &&
          (sendMailtype === 'score' || sendMailtype === 'multiScore')
        "
      >
        <v-text-field
          v-model="scoreSubject"
          label="請填寫信件主旨： "
        ></v-text-field>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="darken-1"
        text
        @click="closeDialog()"
        style="font-weight: bold; font-size: 17px"
        >取消</v-btn
      >
      <v-btn
        color="blue darken-1"
        text
        @click="controllerSnedMailConfirm()"
        :disabled="
          (scheduleType === 5 || scheduleType === 6) &&
          (sendMailtype === 'score' || sendMailtype === 'multiScore') &&
          scoreSubject === ''
        "
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >確定</v-btn
      >
    </v-card-actions>
    <v-overlay v-model="sendShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    sendShow: false,
    scoreSubject: "",
  }),

  props: {
    id: "",
    sendMailpup: false,
    scheduleType: 0,
    sendMailtype: "",
    pupTitle: "",
    pupTitleShow: "",
    pupTitleIcon: "",
    pupText: "",
    target: "",
    sendType: "",
    tempItem: {},
    multiSelect: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
  },

  watch: {},

  methods: {
    async controllerSnedMailConfirm() {
      if (this.sendMailtype === "exam") {
        await this.sendExamCodeMail();
      } else if (this.sendMailtype === "score") {
        await this.sendScroeMail();
      } else if (this.sendMailtype === "multiExam") {
        this.sendMultiExamCodeMail();
      } else if (this.sendMailtype === "multiScore") {
        this.sendMultiScroeMail();
      } else {
        this.closeDialog();
      }
    },

    async sendExamCodeMail() {
      this.sendShow = true;
      await this.tokenService.renewLT();

      this.sendShow = false;

      this.chagneSendMailContent();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.stId = this.tempItem.stId;
      data.olyId = this.tempItem.olyId;
      data.contestantsIdList = [];
      data.sendMailSelected = "student";
      data.contestantsIdList.push(this.tempItem.contestantsId);
      data.olympic = this.globalSystemValue.olympic;

      this.tempItem.sendExamNotice = true;

      this.setDesserts();

      await this.axios.post(
        this.systemENV.APISERVERURL + "/sendExamCodeMail",
        data,
      );
    },

    async sendScroeMail() {
      this.sendShow = true;
      await this.tokenService.renewLT();

      this.sendShow = false;

      this.chagneSendMailContent();

      if (this.globalSystemValue.system === "olympic") {
        let data = {};
        data.AT = await this.tokenService.getFastAT();
        data.stId = this.tempItem.stId;
        data.olyId = this.tempItem.olyId;
        data.stIdList = [];
        data.stIdList.push(this.tempItem.stId);
        data.olympic = this.globalSystemValue.olympic;
        data.scheduleType = this.scheduleType;
        data.subject = this.scoreSubject;

        await this.axios.post(
          this.systemENV.APISERVERURL + "/sendScroeMail",
          data,
        );
      } else {
        let data = {};
        data.AT = await this.tokenService.getFastAT();
        data.sstId = this.tempItem.stId;
        data.olyId = this.tempItem.olyId;
        data.olympic = this.globalSystemValue.olympic;
        data.scheduleType = this.scheduleType;
        data.subject = this.scoreSubject;

        await this.axios.post(
          this.systemENV.APISERVERURL + "/sendScienceScroeMail",
          data,
        );
      }

      this.tempItem.sendExamScoreNoice = true;

      this.setDesserts();
    },

    async sendMultiExamCodeMail() {
      const queueCount = 0;
      const queueIdList = [];
      await this.tokenService.renewLT();

      this.sendShow = false;

      this.chagneSendMailContent();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.stId = this.selected[0].stId;
      data.olyId = this.id;
      data.contestantsIdList = [];
      data.sendMailSelected = "student";
      data.olympic = this.globalSystemValue.olympic;

      this.multiSelect.forEach((item, index) => {
        if (this.scheduleType === 1) {
          data.contestantsIdList.push(item.contestantsId);
        } else if (this.scheduleType === 5 || this.scheduleType === 6) {
          if (item.admission === "1") {
            data.contestantsIdList.push(item.contestantsId);
          }
        }
      });

      this.closeSendMultiMail("exam");

      this.axios.post(this.systemENV.APISERVERURL + "/sendExamCodeMail", data);
    },

    async sendMultiScroeMail() {
      await this.tokenService.renewLT();

      this.chagneSendMailContent();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.stId = this.selected[0].stId;
      data.olyId = this.id;
      data.scheduleType = this.scheduleType;
      data.stIdList = [];
      data.subject = this.scoreSubject;

      this.selected.forEach((item) => {
        if (this.scheduleType === 1) {
          data.stIdList.push(item.stId);
        } else if (this.scheduleType === 5 || this.scheduleType === 6) {
          if (item.admission === "1") {
            data.stIdList.push(item.stId);
          }
        }
      });

      this.closeSendMultiMail("score");

      this.axios.post(this.systemENV.APISERVERURL + "/sendScroeMail", data);
    },

    closeDialog() {
      this.$emit("closeSendMailpup", false);
    },

    setDesserts() {
      this.$emit("setDesserts", this.tempItem);
    },

    chagneSendMailContent(title, text, type) {
      let value = {};

      (value.title = "信件發送成功"),
        (value.text = this.target + this.sendType + "已發送"),
        (value.type = "");

      this.$emit("chagneSendMailContent", value);
    },

    closeSendMultiMail(value) {
      this.$emit("closeSendMultiMail", value);
    },
  },
  async mounted() {},
};
</script>
