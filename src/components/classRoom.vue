<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="50"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
      :loading="loadList"
      loading-text="資料處理中...."
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat style="background-color: white">
          <v-btn
            small
            color="#635BFF"
            dark
            class="mb-2"
            variant="flat"
            @click="editItem(editedItem)"
          >
            <v-icon small left> mdi-map-marker-radius-outline </v-icon>
            <p style="font-size: 13px">新增考場</p>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon title="下載考場資料" class="mr-2" @click="downloadsItem(item)">
          mdi-download-box-outline
        </v-icon>
        <v-icon
          v-if="globalSystemValue.system === 'olympic'"
          :style="item.chagneStatus === '1' ? { color: 'blue' } : { color: '' }"
          :disabled="fixCodeName"
          title="重新分配考場"
          class="mr-2"
          @click="showClassChangePup(item)"
        >
          mdi-gesture-swipe
        </v-icon>
        <v-icon title="編輯考場資料" class="mr-2" @click="editItem(item)">
          mdi-text-box-edit-outline
        </v-icon>
        <v-icon
          title="刪除考場資料"
          class="mr-2"
          @click="removeClassRoom(item)"
        >
          mdi-trash-can-outline
        </v-icon>
      </template>
      <template v-slot:item.total="{ item }">
        <div
          :style="
            item.total < item.defaultNumber ? { color: 'blue' } : { color: '' }
          "
        >
          {{ item.total }}
        </div>
      </template>
    </v-data-table>
    <v-dialog v-model="alertPup" max-width="500px">
      <v-card>
        <v-card-title
          v-if="pupTitleShow === '1'"
          style="background-color: #2d5bff; height: 48px"
        >
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            {{ pupTitleIcon }}
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >{{ pupTitle }}</span
          >
        </v-card-title>
        <v-card-title
          v-if="pupTitleShow === '2'"
          style="background-color: #900d16; height: 57px"
        >
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            {{ pupTitleIcon }}
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >{{ pupTitle }}</span
          >
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="cleanPupData"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="classChangePup" max-width="400px">
      <v-card>
        <v-card-title style="background-color: #2d5bff; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-gesture-swipe
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >重新分配考場</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="12" style="margin-top: 14px">
              <span style="font-size: 16px">
                考區名稱 ： {{ roomInfo.areaName }}
              </span>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -16px">
              <span style="font-size: 16px">
                考場名稱 ： {{ roomInfo.roomName }}
              </span>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -6px">
              <v-icon dense style="margin-top: -5px"> mdi-contrast-box </v-icon>
              <span style="font-size: 15px; font-weight: bold">
                重新分配 ：
              </span>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -15px">
              <v-text-field
                v-model="chagneRoomAccount"
                dense
                variant="underlined"
                label="調換考生總數"
              ></v-text-field>
            </v-col>
            <v-col
              v-show="changeAlertStatus2"
              cols="12"
              sm="6"
              md="12"
              style="margin-top: -42px"
            >
              <span style="font-size: 15px; color: red"
                >警告:{{ changeAlert2 }}</span
              >
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -11px">
              <v-select
                outlined
                dense
                v-model="examRoomId"
                :items="examRoom"
                item-title="roomName"
                item-value="roomId"
                variant="underlined"
                label="調換考場名稱"
              ></v-select>
            </v-col>
            <v-col
              v-show="changeAlertStatus"
              cols="12"
              sm="6"
              md="12"
              style="margin-top: -44px"
            >
              <span style="font-size: 15px; color: red"
                >警告:{{ changeAlert }}</span
              >
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            @click="
              classChangePup = false;
              roomInfo = [];
              examRoom = [];
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="chagneClassRoom"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title style="background-color: #0046fe; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-plus
          </v-icon>
          <span
            class="text-h5"
            style="font-size: 18px !important; font-weight: bold; color: white"
            >{{ formTitle }}</span
          >
        </v-card-title>
        <v-form ref="form" v-model="valid">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="2" md="6" style="margin-top: -15px">
                  <v-text-field
                    :disabled="fixCodeName && editedIndex !== -1"
                    :key="editedItem.roomId"
                    v-model="editedItem.codeName"
                    label="考場代碼"
                    variant="underlined"
                    :rules="[(v) => !!v || '考場代碼不能為空']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="6" style="margin-top: -15px">
                  <v-select
                    :key="editedItem.roomId"
                    v-model="editedItem.areaId"
                    :disabled="
                      (sendExamNotice || sendExamScoreNoice) &&
                      editedIndex !== -1
                    "
                    :items="examAreaList"
                    item-title="areaName"
                    item-value="areaId"
                    label="考區名稱"
                    return-object
                    variant="underlined"
                    :rules="[(v) => !!v || '考區不能為空']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="2" md="6" style="margin-top: -31px">
                  <v-text-field
                    :key="editedItem.roomId"
                    v-model="editedItem.roomName"
                    :disabled="
                      (sendExamNotice || sendExamScoreNoice) &&
                      editedIndex !== -1
                    "
                    label="考場名稱"
                    variant="underlined"
                    :rules="[(v) => !!v || '考場名稱不能為空']"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                  @click="
                    editedItem.rowNumber = '0';
                    editedItem.columnNumber = '0';
                  "
                >
                  <v-text-field
                    v-if="
                      globalSystemValue.olympic !== 'TMO' &&
                      globalSystemValue.olympic !== 'TWICHO'
                    "
                    :key="editedItem.roomId"
                    v-model="editedItem.defaultNumber"
                    label="總座數"
                    variant="underlined"
                    :rules="[(v) => !!v || '總座數不能為空']"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-else
                    :key="editedItem.roomId"
                    :disabled="fixCodeName && editedIndex !== -1"
                    v-model="editedItem.defaultNumber"
                    label="總座數"
                    variant="underlined"
                    :rules="[(v) => !!v || '總座數不能為空']"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color=" darken-1"
              text
              @click="close"
              style="font-weight: bold; font-size: 17px"
              >取消</v-btn
            >
            <v-btn
              color="blue darken-1"
              text
              @click="saveClassRoom"
              :disabled="!valid"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
          </v-card-actions>
        </v-form>
        <v-overlay :value="loadShow">
          <v-progress-circular
            :size="50"
            color="primary"
            indeterminate
          ></v-progress-circular>
          <div>處理中....</div>
        </v-overlay>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title style="background-color: red; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-minus
          </v-icon>
          <span
            class="text-h5"
            style="font-size: 18px !important; font-weight: bold; color: white"
            >確定刪除此承考場資訊？</span
          >
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color=" darken-1"
            text
            @click="closeDelete"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            color="blue darken-1"
            text
            @click="deleteItemConfirm"
            :disabled="!valid"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >刪除</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="download" width="28%">
      <v-card>
        <v-card-title
          dark
          style="background-color: #0046fe; height: 48px; color: white"
        >
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-download-box-outline
          </v-icon>
          <span style="font-size: 18px; font-weight: bold">考場下載</span>
        </v-card-title>

        <v-card-text style="font-size: 18px; font-weight: bold; color: #2d5bff"
          >{{ downloadItem.areaName }} - {{ downloadItem.roomName }}教室
        </v-card-text>
        <v-checkbox
          v-model="downloadSelected"
          label="考場資料"
          value="classFile"
          style="
            margin-left: 6.2%;
            font-size: 18px;
            font-weight: bold;
            color: black;
          "
        ></v-checkbox>
        <v-checkbox
          v-model="downloadSelected"
          label="座位標籤"
          value="seatFile"
          style="
            margin-left: 6.2%;
            font-size: 18px;
            font-weight: bold;
            color: black;
          "
        ></v-checkbox>

        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="colseDownloads(downloadItem)"
          >
            取消
          </v-btn>
          <v-btn
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="downloadClassFile(downloadItem)"
          >
            下載</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import TableFilter from "./utilsComponets/tableFilter.vue";

export default {
  data: () => ({
    alertPup: false,
    changeAlertStatus: false,
    changeAlertStatus2: false,
    changeAlert: "",
    changeAlert2: "",
    classChangePup: false,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    examAreaList: [],
    valid: true,
    levelStatus: true,
    defaultOlympic: [],
    dialog: false,
    dialogDelete: false,
    download: false,
    loadShow: false,
    // fixCodeName: false,
    sendExamNotice: false,
    sendExamScoreNoice: false,
    signupName: "",
    year: "",
    roomInfo: [],
    examRoom: [],
    examRoomId: 0,
    inRoomData: {},
    chagneRoomAccount: 0,
    headers: [
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
      // { text: "行排", value: "rowNumber", filterName: "rowNumber" },
      // { text: "直排", value: "columnNumber", filterName: "columnNumber" },
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
    ],
    downloadSelected: [],
    defaultStatus: "2",
    editedIndex: -1,
    editedItem: {
      codeName: "",
      areaName: "",
      roomName: "",
      rowNumber: "0",
      columnNumber: "0",
      areaId: "",
      roomId: "",
      defaultNumber: "",
      total: "",
    },
    downloadIndex: -1,
    downloadItem: {
      codeName: "",
      areaName: "",
      roomName: "",
      defaultNumber: "",
      rowNumber: "0",
      columnNumber: "0",
    },
    defaultItem: {
      codeName: "",
      areaName: "",
      roomName: "",
      rowNumber: "0",
      columnNumber: "",
      areaId: "",
      roomId: "",
      defaultNumber: "",
      total: "",
    },
  }),

  props: {
    desserts: {
      type: Array,
      default: () => [],
    },
    dessertsTemp: {
      type: Array,
      default: () => [],
    },
    loadList: true,
    fixCodeName: true,
  },

  components: {
    TableFilter,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增考場" : "更改考場資訊";
    },

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
    download(val) {
      val || this.colseDownloads();
    },
  },

  methods: {
    async getSelectArea() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSelectArea", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.examAreaList = response.data.resultData;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadClassFile(item) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.classData = JSON.stringify(item);
      data.Selected = this.downloadSelected;
      data.olympic = this.globalSystemValue.olympic;
      data.type = "classRoom";

      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/downloadClassFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/zip" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute(
            "download",
            this.globalSystemValue.olympic +
              "_" +
              item.areaName +
              "_" +
              item.roomName +
              ".zip",
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    updateTable(filterData) {
      this.desserts = filterData;
    },

    async showClassChangePup(item) {
      this.classChangePup = true;

      this.roomInfo = item;

      this.getEnoughRoom(item);
    },

    async chagneClassRoom() {
      this.changeAlertStatus2 = false;
      this.changeAlertStatus = false;
      this.changeAlert2 = "";
      this.changeAlert = "";

      if (this.chagneRoomAccount > this.roomInfo.total) {
        this.changeAlertStatus2 = true;
        this.changeAlert2 = "調換學生總數超過原本考場人數";
      }

      if (
        this.chagneRoomAccount >
        this.examRoom[0].defaultNumber - this.examRoom[0].total
      ) {
        this.changeAlertStatus = true;
        this.changeAlert = "調換學生總數超過更換考場空位數";
      }

      if (!this.changeAlertStatus2 && !this.changeAlertStatus) {
        await this.tokenService.renewLT();

        const that = this;

        this.examRoom.forEach(function (info) {
          if (info.roomId === that.examRoomId) {
            that.inRoomData = info;
          }
        });

        const data = {};
        data.AT = await this.tokenService.getFastAT();
        data.id = this.id;
        data.outAreaId = this.roomInfo.areaId;
        data.outRoomId = this.roomInfo.roomId;
        data.defaultNumber = this.roomInfo.defaultNumber;
        data.inAreaId = this.inRoomData.areaId;
        data.inRoomId = this.inRoomData.roomId;
        data.roomAccount = this.chagneRoomAccount;

        this.loadShow = true;
        await this.axios
          .post(this.systemENV.APISERVERURL + "/chagneClassRoom", data)
          .then((response) => {
            // console.log(response.data);
            if (response.data.code === 200) {
              this.loadShow = false;
              this.classChangePup = false;
              this.getClassRoomInfo();
            } else {
              this.globalSystemTool.removeLocalStorage();
            }
          })
          .catch(function (error) {
            // console.log(error);
          });

        this.roomInfo = [];
        this.examRoom = [];
        this.inRoomData = {};
        this.examRoomId = 0;
        this.chagneRoomAccount = 0;
      }
    },

    async getEnoughRoom(item) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.examAreaId = item.areaId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getEnoughRoom", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.examRoom = response.data.resultData;
          } else if (response.data.code === 201) {
            this.classChangePup = false;
            this.alertPup = true;
            this.pupTitle = "無法重新分配考場";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "目前此考區所有考場都已額滿";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "選拔管理");
      return this.$store.state.title;
    },

    async editItem(item) {
      await this.getSelectArea();

      this.editedIndex = this.desserts.indexOf(item);
      if (this.editedIndex === -1) {
        this.valid = false;
      }

      await this.getSendNoticeStatus(item);

      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    downloadsItem(item) {
      this.downloadIndex = this.desserts.indexOf(item);
      this.downloadItem = Object.assign({}, item);
      this.download = true;
    },

    colseDownloads(item) {
      this.download = false;
      this.downloadSelected = [];
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this, this.defaultItem);
        this.downloadIndex = -1;
      });
    },

    removeClassRoom(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async deleteItemConfirm() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.roomId = this.editedItem.roomId;
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/removeClassRoom", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
          } else if (response.data.code === 211) {
            this.closeDelete();
            this.alertPup = true;
            this.pupTitle = "考場無法刪除";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "此考場尚有參賽學生";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    close() {
      this.$refs.form.reset();
      this.examRoomId = 0;
      this.chagneRoomAccount = 0;
      this.roomInfo = [];
      this.examRoom = [];
      this.inRoomData = {};
      this.dialog = false;
      this.valid = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
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

    async saveClassRoom() {
      await this.tokenService.renewLT();

      const data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      if (typeof data.areaId === "object") {
        data.areaName = data.areaId.areaName;
        data.areaId = data.areaId.areaId;
      }

      let setTotal =
        parseInt(data.rowNumber, 10) * parseInt(data.columnNumber, 10) +
        parseInt(data.defaultNumber, 10);

      if (this.globalSystemValue.system === "science" && setTotal > 99) {
        alert("座位數不能超過99位");
        return false;
      }

      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveClassRoom", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            data.roomId = response.data.resultData;
            data.defaultNumber =
              parseInt(data.rowNumber, 10) * parseInt(data.columnNumber, 10) +
              parseInt(data.defaultNumber, 10);
            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              data.total = 0;
              this.desserts.unshift(data);
            }

            this.close();
          } else if (response.data.code === 500) {
            this.alertPup = true;
            this.pupTitle = "考場代碼問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "考場代碼已被使用請重新設定";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSendNoticeStatus(item) {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.areaId = item.areaId;
      data.roomId = item.roomId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSendNoticeStatus", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.sendExamNotice = true;
            this.sendExamScoreNoice = true;
          } else if (response.data.code === 201) {
            this.sendExamNotice = false;
            this.sendExamScoreNoice = false;
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
    this.reloadTitle();
    if (this.globalSystemValue.level === "1") {
      this.levelStatus = false;
    }

    await this.tokenService.renewLT();
    await this.getSelectArea();
  },
};
</script>
