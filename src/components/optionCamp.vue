<template>
  <div>
    <v-card>
      <v-tabs color="blue accent-4" left>
        <v-tab
          style="color: black; font-weight: bolder"
          @click="getPersonnelInfo"
          >人員資料</v-tab
        >
        <v-tab
          style="color: black; font-weight: bolder"
          :disabled="contestantShow"
          @click="getContestantsInfo"
          >選訓成績</v-tab
        >

        <v-tab-item v-for="n in 2" :key="n">
          <v-container v-if="n == 1" fluid>
            <personnel-info
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :editedItem="editedItem"
              :defaultItem="defaultItem"
              :defaultItemShow="defaultItemShow"
              :headers="headers"
              :examCodeExist="examCodeExist"
              :menuType="menuType"
              :signupName="signupName"
              :passCount="passCount"
              :nopassCount="nopassCount"
              :failCount="failCount"
            ></personnel-info>
          </v-container>
          <v-container v-if="n == 2" fluid>
            <contestants
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :loadList="loadList"
              :examSend="examSend"
              :scoreSend="scoreSend"
              :sendExamNotice="sendExamNotice"
              :sendExamScoreNoice="sendExamScoreNoice"
            ></contestants>
          </v-container>
        </v-tab-item>
      </v-tabs>
    </v-card>
  </div>
</template>

<script>
import PersonnelInfo from "./personnelInfo.vue";
import Contestants from "./contestants.vue";
export default {
  data: () => ({
    type: 0,
    desserts: [],
    dessertsTemp: [],
    contestantShow: false,
    loadList: true,
    editedItem: {},
    defaultItem: {},
    defaultItemShow: {},
    headers: [],
    examCodeExist: false,
    menuType: 0,
    signupName: "",
    passCount: 0,
    nopassCount: 0,
    failCount: 0,
    examSend: 0,
    scoreSend: 0,
    sendExamNotice: false,
    sendExamScoreNoice: false,
  }),

  components: {
    PersonnelInfo,
    Contestants,
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  methods: {
    async getPersonnelInfo() {
      await this.tokenService.renewLT();

      this.desserts = [];
      this.dessertsTemp = [];

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      this.passCount = 0;
      this.nopassCount = 0;
      this.failCount = 0;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getPersonnel", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.headers = response.data.headers;
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.signupName = response.data.signupName;
            this.menuType = response.data.menuType;
            this.examCodeExist = response.data.examCodeExist;

            const that = this;
            this.desserts.forEach(function (data) {
              data = that.changeData(data);
              data.emailContent = "";

              if (data.signupStatus === "3") {
                that.passCount++;
              }

              if (data.signupStatus === "1") {
                that.nopassCount++;
              }

              if (data.signupStatus === "2") {
                that.failCount++;
              }
            });

            this.headers.forEach(function (data) {
              if (data.filterName !== undefined) {
                if (
                  data.filterName === "schoolType" &&
                  that.defaultOlympic === "TOIREG"
                ) {
                  data.filterName = "schoolTypeName";
                }
                that.editedItem[data.filterName] = "";
                that.defaultItem[data.filterName] = "";
                that.defaultItemShow[data.filterName] = true;
              }
            });

            this.editedItem.signupStatus = "";
            this.defaultItem.signupStatus = "";
            this.editedItem.emailContent = "";
            this.defaultItem.emailContent = "";
            this.editedItem.sendMail = "2";
            this.defaultItem.sendMail = "2";
            this.defaultItemShow.signupStatus = true;

            this.loadList = false;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    changeData(data) {
      if (data.signupStatus === "1") {
        data.statusName = "待審核";
      }
      if (data.signupStatus === "3") {
        data.statusName = "已通過";
      }
      if (data.signupStatus === "2") {
        data.statusName = "不通過";
      }
      if (data.signupStatus === "1") {
        data.statusName = "待審核";
      }

      if (data.schoolType === "e") {
        data.schoolTypeName = "國小";
      }
      if (data.schoolType === "j") {
        data.schoolTypeName = "國中";
      }
      if (data.schoolType === "s") {
        data.schoolTypeName = "高中";
      }
      if (data.schoolType === "I") {
        data.schoolTypeName = "國際";
      }

      return data;
    },

    async getContestantsInfo() {
      await this.tokenService.renewLT();

      this.desserts = [];
      this.dessertsTemp = [];
      this.examSend = 0;
      this.scoreSend = 0;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getContestants", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.loadList = false;

            const that = this;
            this.desserts.forEach(function (data) {
              data.emailContent = "";

              if (data.sendExamNotice) {
                that.sendExamNotice = true;
                that.examSend++;
              }

              if (data.sendExamScoreNoice) {
                that.sendExamScoreNoice = false;
                that.scoreSend++;
              }
            });
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },
  },

  async mounted() {
    await this.tokenService.renewLT();

    await this.getPersonnelInfo();
  },
};
</script>
