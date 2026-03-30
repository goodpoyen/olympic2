<template>
  <div>
    <v-card>
      <v-card-title style="background-color: #ededf3; height: 41px">
        <span
          v-if="Object.keys(studentExamCode).length !== 0"
          style="
            font-size: 15px !important;
            font-weight: bold;
            margin-top: -8px;
          "
        >
          <span v-if="globalSystemValue.system === 'olympic'"
            >應試號碼 ： {{ studentExamCode.examCode }}</span
          >
          <span v-else>
            甄選號碼 ：
            {{ studentExamCode.examCode.split("_")[1] }}
          </span>
        </span>
        <span
          v-if="Object.keys(studentExamCode).length === 0"
          style="
            font-size: 15px !important;
            font-weight: bold;
            margin-top: -8px;
          "
        >
          <span v-if="globalSystemValue.system === 'olympic'"
            >應試號碼 ： 尚未分配</span
          >
          <span v-else>甄選號碼 ： 尚未分配</span>
        </span>
      </v-card-title>
      <v-card-text style="font-size: 14px; font-weight: bold">
        <v-row>
          <v-col
            v-if="Object.keys(studentExamCode).length !== 0"
            cols="12"
            sm="8"
            md="8"
          >
            <div style="margin-top: 10px">
              學生代碼 ： {{ studentExamCode.examCode.split("_")[0] }}
            </div>
            <div>考區名稱 ： {{ studentExamCode.areaName }}</div>
            <div>考場名稱 ： {{ studentExamCode.roomName }}</div>
            <div>座位號碼 ： {{ studentExamCode.seatNumber }}</div>
          </v-col>
          <v-col
            v-if="Object.keys(studentExamCode).length === 0"
            cols="12"
            sm="8"
            md="8"
          >
            <div style="margin-top: 10px">考區名稱 ： 尚未分配</div>
            <div>考場名稱 ： 尚未分配</div>
            <div>座位號碼 ： 尚未分配</div>
          </v-col>

          <hr
            role="separator"
            aria-orientation="vertical"
            class="v-divider v-divider--inset v-divider--vertical theme--light"
            style="min-height: 73px; margin-top: 21px; margin-right: 10px"
          />
          <v-col cols="6" sm="3" md="3">
            <v-btn
              small
              color="#54b5b5"
              class="mb-2"
              style="margin-top: 10px; color: #ededf3"
              @click="getEnoughArea()"
            >
              <v-icon small left> mdi-auto-mode </v-icon>
              <p style="font-size: 13px">自動分配</p>
            </v-btn>
            <v-btn
              small
              color="#2d5bff"
              class="mb-2"
              @click="getArea()"
              style="margin-top: 10px; color: #ededf3"
            >
              <v-icon small left> mdi-swap-horizontal </v-icon>
              <p style="font-size: 13px">指定分配</p>
            </v-btn>
            <span
              v-show="studentExamCode.sendExamNotice"
              style="
                color: red;
                font-weight: bold;
                font-size: 9px;
                margin-left: 10px;
              "
              >已發送考生通知信</span
            >
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-dialog v-model="examPup" :max-width="maxWidth">
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
            mdi-reload-alert
          </v-icon>
          <span
            v-if="globalSystemValue.system === 'olympic'"
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >應試號碼更新 -
            <span
              v-if="chagneType === 'distribution'"
              class=""
              style="
                font-size: 18px !important;
                font-weight: bold;
                color: white;
              "
              >指定分配</span
            >
            <span
              v-if="chagneType === 'auto'"
              class=""
              style="
                font-size: 18px !important;
                font-weight: bold;
                color: white;
              "
              >自動分配</span
            ></span
          >
          <span
            v-else
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >甄選號碼更新 -
            <span
              v-if="chagneType === 'distribution'"
              class=""
              style="
                font-size: 18px !important;
                font-weight: bold;
                color: white;
              "
              >指定分配</span
            >
            <span
              v-if="chagneType === 'auto'"
              class=""
              style="
                font-size: 18px !important;
                font-weight: bold;
                color: white;
              "
              >自動分配</span
            >
          </span>
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <v-row>
            <v-col cols="12" sm="6" md="12" style="margin-top: -5px">
              <v-select
                v-model="examAreaId"
                :items="examArea"
                :disabled="examAreaStatus"
                item-title="areaName"
                item-value="areaId"
                label="考區名稱"
                variant="underlined"
                @update:modelValue="
                  chagneType === 'auto' ? getEnoughRoom() : getRoomByArea()
                "
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -5px">
              <v-select
                v-model="examRoomId"
                :items="examRoom"
                :disabled="examRoomStatus"
                item-title="roomName"
                item-value="roomId"
                label="考場名稱"
                variant="underlined"
                @update:modelValue="
                  chagneType === 'distribution' ? getRoomInfo() : ''
                "
              ></v-select>
            </v-col>
          </v-row>
          <v-divider
            v-if="chagneType === 'distribution' && roomInfoData.length != 0"
            style="border-color: red; border-top-width: 3px"
          ></v-divider>
          <v-data-table
            v-if="chagneType === 'distribution' && roomInfoData.length != 0"
            v-model="choice"
            :headers="roomInfoHeaders"
            :items="roomInfoData"
            :item-value="itemKey"
            :items-per-page="100"
            show-select
            loading-text="資料處理中...."
          >
            <template v-slot:item.examCode="{ item }">
              <span v-if="globalSystemValue.system === 'olympic'"
                >{{ item.examCode }}
              </span>
              <span v-else>{{ item.examCode.split("_")[1] }} </span>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            @click="
              examPup = false;
              examAreaId = 0;
              examRoomId = 0;
              examRoom = [];
              examArea = [];
              examAreaStatus = false;
              examRoomStatus = false;
              roomInfoData = [];
            "
            style="font-weight: bold; font-size: 17px"
          >
            <span v-if="chagneType === 'auto'">取消</span>
            <span v-else>關閉</span>
          </v-btn>
          <v-btn
            v-if="chagneType === 'auto'"
            left
            color="blue darken-1"
            text
            @click="changeExamCode"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="distritionPup" width="24%">
      <v-card>
        <v-card-title style="background-color: #900d16; color: white">
          <div
            v-if="distributionData.schoolNameAll !== ''"
            style="font-size: 18px; font-weight: bold"
          >
            確定與此學生交換座位？
          </div>
          <div
            v-if="distributionData.schoolNameAll === ''"
            style="font-size: 18px; font-weight: bold"
          >
            確定分配至此空座位？
          </div>
        </v-card-title>

        <v-card-text
          v-if="distributionData.schoolNameAll !== ''"
          style="
            margin-top: 5%;
            font-size: 18px;
            font-weight: bold;
            color: #0c0c0c;
          "
        >
          <span v-if="editedItem.stId === distributionData.stId">
            您選擇到同一位學生！請重新選擇！
          </span>
          <span v-else-if="globalSystemValue.system === 'olympic'">
            {{ editedItem.chineseName }} 與
            {{ distributionData.chineseName }} 交換座位
          </span>
          <span v-else>
            {{ editedItem.name }} 與 {{ distributionData.name }} 交換座位
          </span>
        </v-card-text>

        <v-card-text
          v-if="distributionData.schoolNameAll === ''"
          style="
            margin-top: 5%;
            font-size: 18px;
            font-weight: bold;
            color: #0c0c0c;
          "
        >
          <span v-if="globalSystemValue.system === 'olympic'">
            {{ editedItem.chineseName }} 分配至
            {{ distributionData.seatNumber }}號空位
          </span>
          <span v-else>
            {{ editedItem.name }} 分配至 {{ distributionData.seatNumber }}號空位
          </span>
        </v-card-text>

        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="closeSelectData"
          >
            取消
          </v-btn>
          <v-btn
            v-if="
              editedItem.stId !== distributionData.stId ||
              distributionData.contestantsId === ''
            "
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="distributionExamCode"
          >
            確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    itemKey: "seatNumber",
    chagneType: "",
    examArea: [],
    examRoom: [],
    headers: [],
    roomInfoHeaders: [],
    roomInfoData: [],
    choice: [],
    distributionData: {},
    examAreaId: 0,
    examRoomId: 0,
    maxWidth: "400px",
    examAreaStatus: false,
    examRoomStatus: false,
    examPup: false,
    distritionPup: false,
    distributionStatus: false,
  }),

  props: {
    examCodeExist: false,
    studentExamCode: {},
    editedItem: {},
    desserts: {
      type: Array,
      default: () => [],
    },
    editedIndex: null,
    id: "",
  },

  watch: {
    choice(item) {
      if (item.length > 0) {
        this.distributionData = Object.assign({}, this.roomInfoData[item - 1]);
        this.distritionPup = true;
      } else {
        this.distritionPup = false;
      }
    },
  },

  methods: {
    async getEnoughArea(type) {
      await this.tokenService.renewLT();

      this.maxWidth = "400px";
      this.chagneType = "auto";

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.studentExamCode = JSON.stringify(this.editedItem);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getEnoughArea", data)
        .then((response) => {
          // console.log(response.data);
          this.examPup = true;

          if (response.data.code === 200) {
            if (this.examCodeExist) {
              this.examArea = response.data.resultData;
              this.examAreaList = response.data.resultData;
            } else {
              this.examAreaList = response.data.resultData;
            }
          } else if (response.data.code === 201) {
            alert("目前所有考區都沒有空位");
            this.examAreaStatus = true;
            this.examRoomStatus = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getEnoughRoom() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.examAreaId = this.examAreaId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getEnoughRoom", data)
        .then((response) => {
          // console.log(response.data);
          this.examPup = true;
          if (response.data.code === 200) {
            this.examRoom = response.data.resultData;
          } else if (response.data.code === 201) {
            alert("目前所有考場都沒有空位");
            this.examRoomStatus = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getRoomInfo() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;
      data.systemName = this.globalSystemValue.system;
      data.olympic = this.globalSystemValue.olympic;
      data.roomId = this.examRoomId;
      data.areaId = this.examAreaId;
      data.defaultNumber = this.studentExamCode.defaultNumber;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getRoomInfo", data)
        .then((response) => {
          // console.log(response.data);
          this.roomInfoData = response.data.resultData;
          this.setRoomInfoHeaders();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async setRoomInfoHeaders() {
      if (this.globalSystemValue.system === "olympic") {
        this.roomInfoHeaders = [
          { title: "座號", value: "seatNumber", sortable: false },
          {
            title: "應試號碼",
            value: "examCode",
            sortable: false,
          },
          {
            title: "姓名",
            value: "chineseName",
            sortable: false,
          },
          {
            title: "學校",
            value: "schoolNameAll",
            sortable: false,
          },
        ];
      } else {
        this.roomInfoHeaders = [
          { title: "座號", value: "seatNumber", sortable: false },
          {
            title: "學生代碼",
            value: "examOnly",
            sortable: false,
          },
          {
            title: "甄選號碼",
            value: "examCode",
            sortable: false,
          },
          {
            title: "姓名",
            value: "name",
            sortable: false,
          },
          {
            title: "學校",
            value: "schoolNameAll",
            sortable: false,
          },
        ];
      }
    },

    async changeExamCode() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.areaId = this.examAreaId;
      data.roomId = this.examRoomId;

      if (this.globalSystemValue.system === "olympic") {
        data.stId = this.editedItem.stId;
      } else {
        data.stId = this.editedItem.sstId;
      }

      data.examCode = this.studentExamCode.examCode;

      const that = this;
      this.examAreaList.forEach(function (data) {
        if (data.areaId === that.examAreaId) {
          that.editedItem.areaName = data.areaName;
          that.editedItem.area = data.areaName;
          that.editedItem.codeName = data.codeName;
        }
      });

      Object.assign(this.desserts[this.editedIndex], this.editedItem);
      this.$emit("updateTable", this.desserts);
      this.$emit("updateEditedItem", this.editedItem);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/changeExamCode", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.studentExamCode = response.data.resultData;
            this.examPup = false;
            this.examAreaId = 0;
            this.examRoomId = 0;
            this.examRoom = [];
            this.examArea = [];
            this.choice = [];
            this.roomInfoData = [];
            this.$emit("updateStudentExamCode", this.studentExamCode);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async distributionExamCode() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.areaId = this.examAreaId;
      data.roomId = this.examRoomId;

      if (this.globalSystemValue.system === "olympic") {
        data.stId = this.editedItem.stId;
        data.changeStId = this.distributionData.stId;
      } else {
        data.stId = this.editedItem.sstId;
        data.changeStId = this.distributionData.stId;
      }

      data.seatNumber = this.distributionData.seatNumber;
      data.examCode = this.studentExamCode.examCode;
      data.examOnly = this.studentExamCode.examOnly;

      const that = this;
      this.examAreaList.forEach(function (data) {
        if (data.areaId === that.examAreaId) {
          that.editedItem.areaName = data.areaName;
          that.editedItem.area = data.areaName;
          that.editedItem.codeName = data.codeName;
        }
      });

      Object.assign(this.desserts[this.editedIndex], this.editedItem);
      this.$emit("updateTable", this.desserts);
      this.$emit("updateEditedItem", this.editedItem);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/distributionExamCode", data)
        .then((response) => {
          // console.log(response.data);
          this.distritionPup = false;
          if (response.data.code === 200) {
            this.$emit("updateStudentExamCode", response.data.resultData);
            this.examPup = false;
            this.examAreaId = 0;
            this.examRoomId = 0;
            this.examRoom = [];
            this.examArea = [];
            this.choice = [];
            this.roomInfoData = [];
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getArea() {
      this.maxWidth = "800px";
      await this.tokenService.renewLT();

      this.chagneType = "distribution";

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.studentExamCode = JSON.stringify(this.editedItem);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getArea", data)
        .then((response) => {
          // console.log(response.data);
          this.examPup = true;

          if (response.data.code === 200) {
            if (this.examCodeExist) {
              this.examArea = response.data.resultData;
              this.examAreaList = response.data.resultData;
            } else {
              this.examAreaList = response.data.resultData;
            }
          } else if (response.data.code === 201) {
            alert("未建立考區");
            this.examAreaStatus = true;
            this.examRoomStatus = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getRoomByArea() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.examAreaId = this.examAreaId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getRoomByArea", data)
        .then((response) => {
          // console.log(response.data);
          this.examPup = true;
          if (response.data.code === 200) {
            this.examRoom = response.data.resultData;
          } else if (response.data.code === 201) {
            alert("未建立考場");
            this.examRoomStatus = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async closeSelectData() {
      this.distributionData = {};
      this.choice = [];
      // this.roomInfoData = [];
    },
  },
  async mounted() {},
};
</script>
