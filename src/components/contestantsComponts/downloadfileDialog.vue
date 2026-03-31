<template>
  <v-card>
    <v-card-title dark style="background-color: #0046fe !important">
      <v-icon large style="font-size: 24px; color: white">
        mdi-tray-arrow-down
      </v-icon>
      <span style="font-size: 18px; font-weight: bold; color: white"
        >下載選擇</span
      >
    </v-card-title>

    <v-card-text style="font-size: 18px; font-weight: bold">
      <v-radio-group v-model="selectDowloadTyep" column>
        <v-radio label="甄選資料" value="contestantsList"></v-radio>
        <v-radio
          v-if="globalSystemValue.system === 'science'"
          label="成績總表"
          value="scoreList"
        ></v-radio>
      </v-radio-group>
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
        :disabled="selectDowloadTyep === ''"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="controllerDownloadFileConfirm()"
      >
        確定</v-btn
      >
    </v-card-actions>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  data: () => ({
    loadShow: false,
    selectDowloadTyep: "",
  }),

  props: { id: "", scheduleType: "" },

  watch: {},

  methods: {
    async controllerDownloadFileConfirm() {
      if (this.selectDowloadTyep === "contestantsList") {
        await this.downloadContestantsFile();
      } else if (this.selectDowloadTyep === "scoreList") {
        await this.downlodExamTranscrip();
      }
    },

    async downloadContestantsFile() {
      await this.tokenService.renewLT();

      this.loadShow = true;

      let uri = "";
      if (this.globalSystemValue.system === "olympic") {
        uri = "/loadContestantsFile";
      } else {
        uri = "/downloadContestantsExcelByScience";
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.fileName = this.globalSystemValue.olympic;
      +"_" + "應試資料" + this.globalSystemTool.getNowDataTimeByString();

      await this.axios
        .post(this.systemENV.APISERVERURL + uri, data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response)
          this.loadShow = false;
          this.$emit("closeDownlodpup", false);
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downlodExamTranscrip() {
      await this.tokenService.renewLT();

      this.loadShow = true;

      let uri = "/downlodExamTranscrip";

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.fileName =
        this.scheduleType === 5
          ? this.globalSystemValue.olympic +
            "_" +
            "科學能力成績單_" +
            this.globalSystemTool.getNowDataTimeByString()
          : this.globalSystemValue.olympic +
            "_" +
            "實驗實作成績單_" +
            this.globalSystemTool.getNowDataTimeByString();
      data.level = this.scheduleType === 5 ? 1 : 2;

      await this.axios
        .post(this.systemENV.APISERVERURL + uri, data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response)
          this.loadShow = false;
          this.$emit("closeDownlodpup", false);
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    closeDialog() {
      this.$emit("closeDownlodpup", false);
    },
  },
  async mounted() {},
};
</script>
