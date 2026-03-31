<template>
  <v-card>
    <v-card-title dark style="background-color: #0046fe !important">
      <v-icon large style="font-size: 24px; color: white">
        mdi-email-check-outline
      </v-icon>
      <span style="font-size: 18px; font-weight: bold; color: white"
        >成績證明寄送前抽測</span
      >
    </v-card-title>
    <v-card-text style="font-size: 20px; font-weight: bold">
      <div style="font-size: 17px">
        寄送成績證明前，請先完成抽測確認，以確保資料與成績正確。
      </div>
      <v-text-field
        style="width: 55%; margin-top: 20px"
        v-model="testMail"
        variant="underlined"
        label="成績證明（抽測確認）將寄送至："
      ></v-text-field>
      <div style="margin-left: 295px; margin-top: -59px">
        <v-btn
          v-if="!lock"
          elevation="1"
          small
          color="#114acc"
          dark
          :loading="bntLoad"
          @click="
            bntLoad = true;
            sendTimeDownStart();
            sendTestMail();
            sendResult = true;
          "
        >
          <div>{{ snedmailWordingBTN }}</div>
        </v-btn>
        <v-btn v-if="lock" elevation="1" small block>
          <div>{{ sendTime }}秒 再次抽測</div>
        </v-btn>
      </div>
      <div
        v-show="sendResult"
        style="font-size: 12px; margin-top: 5px; color: #114acc"
      >
        抽測信件 5封 已發送至 {{ testMail }} 信箱
      </div>
      <div style="font-size: 15px; margin-top: 25px">抽測確認：</div>
      <div v-show="!confirmTestmailStatus" style="margin-top: 7px">
        <v-btn
          elevation="1"
          small
          color="success"
          style="width: 50%"
          :disabled="testMailCheck"
          @click="confirmTestMail()"
        >
          <v-icon small style="margin-right: 6px"> mdi-check </v-icon>
          <div color="#white">抽測無誤</div>
        </v-btn>
      </div>
      <div
        v-show="confirmTestmailStatus"
        style="font-size: 13px; margin-top: 10px; color: #2bcd2b"
      >
        <v-icon small style="margin-top: -1px; color: #2bcd2b">
          mdi-check-circle
        </v-icon>
        已完成抽測確認，可寄送成績證明。
      </div>
    </v-card-text>
    <v-card-actions style="margin-top: 3px">
      <v-spacer></v-spacer>
      <v-btn
        color="black darken-1"
        text
        style="margin-top: -14px; font-weight: bold; font-size: 17px"
        @click="closeDialog()"
      >
        關閉
      </v-btn>
    </v-card-actions>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>
<style></style>
<script>
export default {
  data: () => ({
    bntLoad: false,
    loadShow: false,
    testMail: "",
    testMailCheck: true,
    snedmailWordingBTN: "寄送抽測信",
    sendResult: false,
    sendTime: 3,
    lock: false,
  }),

  props: { confirmTestmailStatus: false },

  beforeDestroy() {
    clearInterval(this.reciprocal);
  },

  watch: {},

  methods: {
    closeDialog() {
      this.testMail = "";
      this.testMailCheck = true;
      this.lock = false;
      this.sendTime = 3;
      this.bntLoad = false;
      this.sendResult = false;

      if (!this.confirmTestmailStatus) {
        this.confirmTestmailStatus = false;
        this.snedmailWordingBTN = "寄送抽測信";
      }

      clearInterval(this.reciprocal);
      this.$emit("closeSetMailpup", false);
    },

    confirmTestMail() {
      this.testMail = "";
      this.$emit("confirmTestMail", "setmail");
    },

    sendTestMail() {
      let result = this.$emit("sendTestMail", this.testMail);

      // if (result.testMail === "") {
      //   this.testMailCheck = true;
      // } else {
      //   this.testMailCheck = false;
      // }
    },

    sendTimeDownStart() {
      this.reciprocal = setInterval(this.sendTimedown, 1000);
    },

    sendTimedown() {
      this.lock = true;
      this.sendTime--;

      if (this.sendTime === 0) {
        this.sendTime = 61;
        this.lock = false;
        this.bntLoad = false;
        this.sendResult = false;
        this.snedmailWordingBTN = "再次抽測";
        clearInterval(this.reciprocal);
      }
    },
  },
  async mounted() {
    clearInterval(this.reciprocal);

    if (this.confirmTestmailStatus) {
      this.snedmailWordingBTN = "再次抽測";
    }
  },
};
</script>
