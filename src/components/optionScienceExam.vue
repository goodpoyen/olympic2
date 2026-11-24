<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" color="blue accent-4" left>
        <v-tab
          :value="1"
          style="color: black; font-weight: bolder"
          @click="$refs.getScienceInfoRef?.[0]?.getScienceInfo()"
          >人員資料</v-tab
        >
        <v-tab
          :value="2"
          style="color: black; font-weight: bolder"
          @click="getExamAreaInfo"
          >考區資料
          <v-icon v-if="!areaExist" color="red" class="ms-1" size="large"
            >mdi-alert-octagram-outline</v-icon
          ></v-tab
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
          :disabled="contestantShow && actionTest === ''"
          >甄選資料</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="n in 4" :key="n" :value="n">
          <v-container v-if="n == 1" fluid>
            <science-info
              ref="getScienceInfoRef"
              @updateArea="updateArea"
            ></science-info>
          </v-container>
          <v-container v-if="n == 2" fluid>
            <exam-area
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :headers="headers"
              @updateFilter="updateFilter"
              @getExamAreaInfo="getExamAreaInfo"
              @updateArea="updateArea"
            ></exam-area>
          </v-container>
          <v-container v-if="n == 3" fluid>
            <class-room
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :headers="headers"
              :loadList="loadList"
              @updateFilter="updateFilter"
              @getClassRoomInfo="getClassRoomInfo"
            >
            </class-room>
          </v-container>
          <v-container v-if="n == 4" fluid>
            <contestants
              :loadList="loadList"
              :desserts="desserts"
              :dessertsTemp="dessertsTemp"
              :headers="headers"
              :scheduleType="scheduleType"
              :itemKey="itemKey"
              :examSend="examSend"
              :scoreSend="scoreSend"
              :admissionCount="admissionCount"
              :handicappedCount="handicappedCount"
              @getContestantsInfo="getContestantsInfo"
              @updateDesserts="updateDesserts"
              @updateFilter="updateFilter"
            ></contestants>
          </v-container>
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card>
  </div>
</template>

<script>
import ScienceInfo from "./scienceInfo.vue";
import ExamArea from "./examArea.vue";
import ClassRoom from "./classRoom.vue";
import Contestants from "./contestants.vue";

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
    areaExist: false,
    scheduleType: "",
    itemKey: "",
  }),

  components: {
    ScienceInfo,
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

            this.headers = [
              {
                title: "考區代碼",
                value: "codeName",
                filterName: "codeName",
                type: "text",
                codeName_M: "",
                codeName_C: "",
              },
              {
                title: "考區名稱",
                value: "areaName",
                filterName: "areaName",
                type: "text",
                areaName_M: "",
                areaName_C: "",
              },
              {
                title: "地址",
                value: "address",
                filterName: "address",
                type: "text",
                address_M: "",
                address_C: "",
              },
              {
                title: "總座位數",
                value: "defaultNumber",
                filterName: "defaultNumber",
                type: "text",
                defaultNumber_M: "",
                defaultNumber_C: "",
              },
              {
                title: "報名人數",
                value: "totalSignup",
                filterName: "totalSignup",
                type: "text",
                totalSignup_M: "",
                totalSignup_C: "",
              },
              { title: "功能", value: "actions" },
            ];

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

            this.headers = [
              {
                title: "考場代碼",
                value: "codeName",
                filterName: "codeName",
                type: "text",
                codeName_M: "",
                codeName_C: "",
              },
              {
                title: "考區名稱",
                value: "areaName",
                filterName: "areaName",
                type: "text",
                areaName_M: "",
                areaName_C: "",
              },
              {
                title: "考場名稱",
                value: "roomName",
                filterName: "roomName",
                type: "text",
                roomName_M: "",
                roomName_C: "",
              },
              {
                title: "考生總座數",
                value: "defaultNumber",
                filterName: "defaultNumber",
                type: "text",
                defaultNumber_M: "",
                defaultNumber_C: "",
              },
              {
                title: "已安排座位數量",
                value: "total",
                filterName: "total",
                type: "text",
                total_M: "",
                total_C: "",
              },
              { title: "功能", value: "actions" },
            ];

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

            this.scheduleType = response.data.scheduleType;

            this.getContestantsScheduleType();

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

    async getContestantsScheduleType() {
      if (this.scheduleType === 2) {
        this.itemKey = "stId";
        this.headers = [
          {
            title: "選訓號碼",
            value: "stId",
            filterName: "stId",
            type: "text",
            stId_M: "",
            stId_C: "",
          },
          {
            title: "中文姓名",
            value: "chineseName",
            filterName: "chineseName",
            type: "text",
            chineseName_M: "",
            chineseName_C: "",
          },
          {
            title: "成績",
            value: "score",
            filterName: "score",
            type: "text",
            score_M: "",
            score_C: "",
          },
          {
            title: "PR值",
            value: "pr",
            filterName: "pr",
            type: "text",
            pr_M: "",
            pr_C: "",
          },
          { title: "功能", value: "actions", width: "15%" },
        ];
      } else if (this.scheduleType === 5 || this.scheduleType === 6) {
        this.itemKey = "stId";
        this.headers = [
          {
            title: "學生代碼",
            value: "examOnly",
            filterName: "examOnly",
            type: "text",
            examOnly_M: "",
            examOnly_C: "",
            width: "7%",
          },
          {
            title: "甄選號碼",
            value: "examCode",
            filterName: "examCode",
            type: "text",
            examCode_M: "",
            examCode_C: "",
            width: "8%",
          },
          {
            title: "姓名",
            value: "chineseName",
            filterName: "chineseName",
            type: "text",
            chineseName_M: "",
            chineseName_C: "",
            width: "8%",
          },
          {
            title: "畢業學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            chineseName_M: "",
            chineseName_C: "",
            width: "14%",
          },
          {
            title: "考區名稱",
            value: "areaName",
            filterName: "areaName",
            type: "text",
            areaName_M: "",
            areaName_C: "",
          },
          {
            title: "考場",
            value: "roomName",
            filterName: "roomName",
            type: "text",
            roomName_M: "",
            roomName_C: "",
          },
          {
            title: "座號",
            value: "seatNumber",
            filterName: "seatNumber",
            type: "text",
            seatNumber_M: "",
            seatNumber_C: "",
            width: "7%",
          },
        ];
        if (this.scheduleType === 5) {
          let temp = {
            title: "晉級結果",
            value: "pass",
            filterName: "pass",
            type: "text",
            pass_M: "",
            pass_C: "",
            width: "8%",
          };
          this.headers.push(temp);
          this.headers.push({ title: "功能", value: "actions", width: "17%" });
        } else {
          let temp = {
            title: "甄選結果",
            value: "pass",
            filterName: "pass",
            type: "text",
            pass_M: "",
            pass_C: "",
            width: "8%",
          };
          this.headers.push(temp);
          this.headers.push({ title: "功能", value: "actions", width: "17%" });
        }
      } else {
        this.itemKey = "examCode";
        this.headers = [
          {
            title: "應試號碼",
            value: "examCode",
            filterName: "examCode",
            type: "text",
            examCode_M: "",
            examCode_C: "",
          },
          {
            title: "中文姓名",
            value: "chineseName",
            filterName: "chineseName",
            type: "text",
            chineseName_M: "",
            chineseName_C: "",
            width: "10%",
          },
          {
            title: "學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            schoolNameAll_M: "",
            schoolNameAll_C: "",
            width: "15%",
          },
          {
            title: "考區名稱",
            value: "areaName",
            filterName: "areaName",
            type: "text",
            areaName_M: "",
            areaName_C: "",
          },
          {
            title: "考場",
            value: "roomName",
            filterName: "roomName",
            type: "text",
            roomName_M: "",
            roomName_C: "",
          },
          {
            title: "座號",
            value: "seatNumber",
            filterName: "seatNumber",
            type: "text",
            seatNumber_M: "",
            seatNumber_C: "",
            width: "7%",
          },
          {
            title: "成績",
            value: "score",
            filterName: "score",
            type: "text",
            score_M: "",
            score_C: "",
          },
          {
            title: "PR值",
            value: "pr",
            filterName: "pr",
            type: "text",
            pr_M: "",
            pr_C: "",
          },
          { title: "功能", value: "actions", width: "15%" },
        ];
      }
    },

    updateDesserts(value) {
      this.desserts = value;
      this.dessertsTemp = value;
    },

    updateFilter(value) {
      this.desserts = value;
    },

    updateArea(value) {
      this.areaExist = value;
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
