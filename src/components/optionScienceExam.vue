<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" color="blue accent-4" left>
        <v-tab style="color: black; font-weight: bolder">人員資料</v-tab>
        <v-tab
          :value="1"
          style="color: black; font-weight: bolder"
          @click="getExamAreaInfo"
          >考區資料</v-tab
        >
        <v-tab
          :value="2"
          style="color: black; font-weight: bolder"
          @click="getClassRoomInfo"
          >考場資料</v-tab
        >

        <v-tab
          style="color: black; font-weight: bolder"
          @click="getContestantsInfo"
          :disabled="contestantShow && actionTest === ''"
          >甄選資料</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="n in 4" :key="n" :value="n">
          <v-container v-if="n == 1" fluid>
            <science-info></science-info>
          </v-container>
          <v-container v-if="n == 2" fluid>
            <exam-area
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
            ></exam-area>
          </v-container>
          <v-container v-if="n == 3" fluid>
            <class-room
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :loadList="loadList"
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
              :admissionCount="admissionCount"
              :handicappedCount="handicappedCount"
            ></contestants>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script>
// import ScienceInfo from "./scienceInfo.vue";
// import ExamArea from "./examArea.vue";
// import ClassRoom from "./classRoom.vue";
// import Contestants from "./contestants.vue";

export default {
  data: () => ({
    type: 0,
    actionTest: "",
    desserts: [],
    dessertsTemp: [],
    contestantShow: false,
    loadList: true,
    editedItem: {},
    defaultItem: {},
    defaultItemShow: {},
    headers: [],
    subjectConfig: [],
    examCodeExist: false,
    menuType: 0,
    signupName: "",
    admissionCount: 0,
    handicappedCount: 0,
    examSend: 0,
    scoreSend: 0,
    tab: null,
  }),

  components: {
    // ScienceInfo,
    // ExamArea,
    // ClassRoom,
    // Contestants,
  },

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  methods: {
    async getExamAreaInfo() {
      await this.tokenService.renewLT();

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
          // console.log(response.data);
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
          // console.log(response.data);
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

      this.desserts = [];
      this.dessertsTemp = [];

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      this.admissionCount = 0;
      this.handicappedCount = 0;
      this.examSend = 0;
      this.scoreSend = 0;

      this.loadList = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getContestants", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;

            const that = this;

            this.desserts.forEach(function (data) {
              if (data.admission === "2") {
                that.admissionCount++;
              }

              if (data.handicapped === "1") {
                that.handicappedCount++;
              }

              if (data.sendExamNotice) {
                that.examSend++;
              }

              if (data.sendExamScoreNoice) {
                that.scoreSend++;
              }

              if (data.pass === 30) {
                data.pass = that.type === 5 ? "未晉級" : "未錄取";
              } else if (data.pass === 10) {
                data.pass = that.type === 5 ? "晉級" : "錄取";
              } else if (data.pass === 20) {
                data.pass = "缺考";
              } else {
                data.pass = "";
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
  },

  async mounted() {
    await this.tokenService.renewLT();

    const data = {};
    data.AT = await this.tokenService.getFastAT();
    data.id = this.id;
    data.olympic = this.globalSystemValue.olympic;

    await this.axios
      .post(this.systemENV.APISERVERURL + "/getSchedule", data)
      .then((response) => {
        // console.log(response.data)
        this.type = response.data.resultData.type;
        this.actionTest = response.data.resultData.actionTest;
      })
      .catch(function (error) {
        // console.log(error);
      });

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
