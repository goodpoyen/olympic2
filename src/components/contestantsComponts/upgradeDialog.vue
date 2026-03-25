<template>
  <v-card>
    <v-card-title style="background-color: #2d5bff; height: 57px">
      <v-icon
        large
        style="
          font-size: 23px;
          font-weight: bold;
          color: white;
          margin-right: 7px;
        "
      >
        mdi-account-multiple-check-outline
      </v-icon>
      <span
        v-if="globalSystemValue.system === 'olympic'"
        class=""
        style="font-size: 18px !important; font-weight: bold; color: white"
        >請選擇選拔賽事？</span
      >
      <span
        v-if="globalSystemValue.system === 'science'"
        class=""
        style="font-size: 18px !important; font-weight: bold; color: white"
        >請選擇實驗實作活動？</span
      >
    </v-card-title>
    <v-card-text style="font-size: 20px; margin-top: 19px; font-weight: bold">
      <v-radio-group v-if="!campData" v-model="schedulId">
        <v-radio
          v-for="data in upgradeRaceList"
          :key="data.oly_id"
          :label="data.signup_name"
          :value="data.oly_id"
        ></v-radio>
      </v-radio-group>
      <div v-if="campData">沒有任何選訓營活動！</div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        left
        color="blue darken-1"
        text
        @click="closeDialog()"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >取消</v-btn
      >
      <v-btn
        v-if="!campData"
        left
        color="blue darken-1"
        text
        @click="saveUpgrade()"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >確定</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  data: () => ({
    loadShow: false,
  }),

  props: { id: "", selected: [], upgradePup: false, upgradeRaceList: [] },

  watch: {},

  methods: {
    async saveUpgrade() {
      this.upgradePup = false;
      this.loadShow = true;
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.systemName = this.globalSystemValue.system;
      data.schedulId = this.schedulId;
      data.student = JSON.stringify(this.selected);

      if (this.schedulId === "") {
        this.$emit("closeUpgradepup", false);
        this.loadShow = false;
        return false;
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveUpgrade", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.$emit("closeUpgradepup", false);
            this.$emit("updateSelectd", false);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    closeDialog() {
      this.$emit("closeUpgradepup", false);
    },
  },
  async mounted() {},
};
</script>
