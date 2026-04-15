<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" color="blue accent-4" left>
        <v-tab
          :value="1"
          style="color: black; font-weight: bolder"
          @click="getPersonnelInfo"
          >人員資料</v-tab
        >
        <v-tab
          :value="2"
          style="color: black; font-weight: bolder"
          @click="getExamAreaInfo"
          >考區資料</v-tab
        >
        <v-tab
          :value="3"
          style="color: black; font-weight: bolder"
          @click="getClassRoomInfo"
          >考場資料</v-tab
        >
        <v-tab
          :value="4"
          style="color: black; font-weight: bolder"
          @click="getContestantsInfo"
          :disabled="contestantShow"
          >應試資料</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="n in 4" :key="n" :value="n">
          <v-container v-if="n == 1" fluid>
            <personnel-info
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :headers="headers"
              :examCodeExist="examCodeExist"
              :menuType="menuType"
              :signupName="signupName"
              :passCount="passCount"
              :nopassCount="nopassCount"
              :failCount="failCount"
              @updateFilter="updateFilter"
            ></personnel-info>
          </v-container>
          <v-container v-if="n == 2" fluid>
            <exam-area
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :fixCodeName="fixCodeName"
              @updateFilter="updateFilter"
            ></exam-area>
          </v-container>
          <v-container v-if="n == 3" fluid>
            <class-room
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :loadList="loadList"
              :fixCodeName="fixCodeName"
              @updateFilter="updateFilter"
            >
            </class-room>
          </v-container>
          <v-container v-if="n == 4" fluid>
            <contestants
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :examSend="examSend"
              :scoreSend="scoreSend"
              :sendExamNotice="sendExamNotice"
              :sendExamScoreNoice="sendExamScoreNoice"
              @updateFilter="updateFilter"
            ></contestants>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script>
import PersonnelInfo from "./personnelInfo.vue";
import ExamArea from "./examArea.vue";
import ClassRoom from "./classRoom.vue";
import Contestants from "./contestants.vue";

export default {
  data: () => ({
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
    fixCodeName: true,
    tab: null,
  }),

  components: {
    PersonnelInfo,
    ExamArea,
    ClassRoom,
    Contestants,
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  methods: {
    async getExamAreaInfo() {
      await this.tokenService.renewLT();
      this.checkExamCodeExist(this.id);
      this.fixCodeName = this.$store.state.examCodeStatus;

      this.desserts = [];
      this.dessertsTemp = [];

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.mod = this.globalSystemValue.system;
      data.olympic = this.globalSystemValue.olympic;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getExamArea", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            response.data.resultData.forEach(function (data) {
              data.defaultNumber = parseInt(data.defaultNumber);
              data.totalSignup = parseInt(data.totalSignup);
            });
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.loadList = false;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getClassRoomInfo() {
      await this.tokenService.renewLT();
      this.checkExamCodeExist(this.id);
      this.fixCodeName = this.$store.state.examCodeStatus;

      this.desserts = [];
      this.dessertsTemp = [];

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getClassRoom", data)
        .then((response) => {
          this.loadList = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.loadList = false;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getContestantsInfo() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getContestants", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.loadList = false;

            this.examSend = 0;
            this.scoreSend = 0;

            const that = this;
            this.desserts.forEach(function (data) {
              data.emailContent = "";

              if (data.sendExamNotice) {
                that.sendExamNotice = true;
                that.examSend++;
              }

              if (data.sendExamScoreNoice) {
                that.sendExamScoreNoice = true;
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

    async getPersonnelInfo() {
      await this.tokenService.renewLT();

      this.desserts = [];
      this.dessertsTemp = [];

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

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

            this.passCount = 0;
            this.nopassCount = 0;
            this.failCount = 0;

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
                  that.globalSystemValue.olympic === "TOIREG"
                ) {
                  data.filterName = "schoolTypeName";
                }

                if (data.value === "statusName") {
                  data.width = "8%";
                }
                if (data.value === "chineseName") {
                  data.width = "8%";
                }
                if (data.value === "idCard") {
                  data.width = "8%";
                }
                if (data.value === "schoolName") {
                  data.width = "15%";
                }
                if (data.value === "grade") {
                  data.width = "8%";
                }
                if (data.value === "birthday") {
                  data.width = "8%";
                }
                if (data.value === "email") {
                  data.width = "8%";
                }
                if (data.value === "area") {
                  data.width = "10%";
                }
                if (data.value === "englishName") {
                  data.width = "8%";
                }
                if (data.value === "teacher") {
                  data.width = "8%";
                }
                if (data.value === "remark") {
                  data.width = "10%";
                }
                if (data.value === "actions") {
                  data.width = "10%";
                }
              }
            });

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

      if (data.createRole === "S") {
        data.createRole = "學校老師報名";
      }

      if (data.createRole === "A") {
        data.createRole = "專任助理新增";
      }

      if (data.createRole === "T") {
        data.createRole = "專任助理新增 (帳號已移除)";
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

    async checkExamCodeExist(olyId) {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = olyId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkExamCodeExist", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 208) {
            this.$store.dispatch("examCodeStatus", true);
            this.fixCodeName = true;
          } else if (response.data.code === 200) {
            this.$store.dispatch("examCodeStatus", false);
            this.fixCodeName = false;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    updateDesserts(value) {
      this.desserts = value;
      this.dessertsTemp = value;
    },

    updateFilter(value) {
      this.desserts = value;
    },
  },

  async mounted() {
    await this.tokenService.renewLT();
    if (this.globalSystemValue.level === "1") {
      this.levelStatus = false;
    }

    await this.getPersonnelInfo();

    if (
      this.$store.state.signupStartTime !== "" &&
      this.$store.state.signupEndTime !== ""
    ) {
      if (
        new Date(this.$store.state.signupStartTime) <=
          new Date(this.globalSystemTool.getNowDataTime()) &&
        new Date(this.globalSystemTool.getNowDataTime()) <=
          new Date(this.$store.state.signupEndTime)
      ) {
        this.contestantShow = true;
      } else if (
        new Date(this.$store.state.signupStartTime) >
        new Date(this.globalSystemTool.getNowDataTime())
      ) {
        this.contestantShow = true;
      }
    } else {
      if (
        localStorage.getItem(this.globalSystemValue.olympic + this.id + "T") !=
          null ||
        localStorage.getItem(this.globalSystemValue.olympic + this.id + "E") !=
          null
      ) {
        const signupStartTime = JSON.parse(
          localStorage.getItem(this.globalSystemValue.olympic + this.id + "T"),
        );
        const signupEndTime = JSON.parse(
          localStorage.getItem(this.globalSystemValue.olympic + this.id + "E"),
        );

        if (
          new Date(signupStartTime.value) <=
            new Date(this.globalSystemTool.getNowDataTime()) &&
          new Date(this.globalSystemTool.getNowDataTime()) <=
            new Date(signupEndTime.value)
        ) {
          this.contestantShow = true;
        } else if (
          new Date(signupStartTime.value) >
          new Date(this.globalSystemTool.getNowDataTime())
        ) {
          this.contestantShow = true;
        }
      } else {
        location.href = "/manage/optionMenu";
      }
    }
  },
};
</script>
