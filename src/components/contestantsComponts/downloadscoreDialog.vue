<template>
  <v-card>
    <v-card-title dark style="background-color: #0046fe !important">
      <v-icon large style="font-size: 24px; color: white">
        mdi-tray-arrow-down
      </v-icon>
      <span style="font-size: 18px; font-weight: bold; color: white"
        >各學校實體成績單下載</span
      >
    </v-card-title>

    <v-card-text style="font-size: 18px; font-weight: bold">
      <v-autocomplete
        v-model="selectedSchools"
        :items="schoolList"
        item-title="title"
        item-value="value"
        label="多選學校（可搜尋）"
        multiple
        chips
        closable-chips
        clearable
        @update:model-value="alertShow = false"
      ></v-autocomplete>
      <v-alert
        v-show="alertShow"
        variant="outlined"
        type="warning"
        style="width: 100%; margin-top: 5px; font-weight: lighter"
      >
        最多選擇十所學校！
      </v-alert>
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
        :disabled="selectedSchools.length === 0"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="downloadScores()"
      >
        下載</v-btn
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
    alertShow: false,
    loadShow: false,
    schoolList: [],
    selectedSchools: [],
  }),

  props: { id: "", scheduleType: "" },

  watch: {},

  methods: {
    async getSignupSchool() {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSignupSchool", data)
        .then((response) => {
          // console.log(response.data);
          this.schoolList = response.data.resultData;
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadScores() {
      if (this.selectedSchools.length > 10) {
        this.alertShow = true;
      } else {
        this.loadShow = true;

        const data = {};
        data.AT = await this.tokenService.getFastAT();
        data.olyId = this.id;
        data.olympic = this.globalSystemValue.olympic;
        data.schoolList = this.selectedSchools.join(",");

        await this.axios
          .post(this.systemENV.APISERVERURL + "/downloadScorePDF", data, {
            responseType: "blob",
          })
          .then((response) => {
            // console.log(response.data);
            this.loadShow = false;

            const d = new Date();
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, "0");
            const day = String(d.getDate()).padStart(2, "0");
            const hours = String(d.getHours()).padStart(2, "0");
            const minutes = String(d.getMinutes()).padStart(2, "0");
            const seconds = String(d.getSeconds()).padStart(2, "0");

            const timeString = `${year}${month}${day}${hours}${minutes}${seconds}`;

            const link = document.createElement("a");
            const blob = new Blob([response.data], { type: "application/zip" });
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute(
              "download",
              "甄選生成績單PDF檔案" + timeString + ".zip",
            );
            document.body.appendChild(link);
            link.click();

            this.closeDialog();
          })
          .catch(function (error) {
            // console.log(error);
          });
      }
    },

    closeDialog() {
      this.$emit("closeDownlodScorepup", false);
    },
  },

  async mounted() {
    this.getSignupSchool();
  },
};
</script>
