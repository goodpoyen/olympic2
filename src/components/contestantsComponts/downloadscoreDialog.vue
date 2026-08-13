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
      // console.log(this.selectedSchools);
      if (this.selectedSchools.length > 2) {
        this.alertShow = true;
      } else {
        this.loadShow = true;
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
