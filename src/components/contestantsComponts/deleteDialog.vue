<template>
  <v-card>
    <v-card-title dark style="background-color: #900d16 !important">
      <div style="font-size: 18px; font-weight: bold; color: white" ;>
        確定刪除資料？
      </div>
    </v-card-title>

    <v-card-text style="font-size: 18px; font-weight: bold; color: #0c0c0c">
      確定刪除資料？
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
        v-if="scheduleType === 1"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="removeContstantsData('olympic')"
      >
        確定</v-btn
      >
      <v-btn
        v-if="scheduleType === 5"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="removeContstantsData('scienceLevel1')"
      >
        確定</v-btn
      >

      <v-btn
        v-if="scheduleType === 6"
        color="darken-1"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="removeContstantsData('scienceLevel2')"
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
  }),

  props: { scheduleType: 0, id: "" },

  watch: {},

  methods: {
    async removeContstantsData(type) {
      await this.tokenService.renewLT();
      this.loadShow = true;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.type = type;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/removeContstantsData", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.loadShow = false;
            this.$emit("updateDesserts", []);
            this.$emit("closeDeletepup", false);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    closeDialog() {
      this.$emit("closeDeletepup", false);
    },
  },
  async mounted() {},
};
</script>
