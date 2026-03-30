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
            <v-icon small left> mdi-domain </v-icon>
            <p style="font-size: 13px">新增考區</p>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            @click="downloadAllAreaFile()"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px">匯出所有考區場務資料</p>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.defaultNumber="{ item }">
        <div
          :style="
            item.defaultNumber < item.totalSignup
              ? { color: 'red' }
              : { color: '' }
          "
        >
          {{ item.defaultNumber }}
        </div>
      </template>
      <template v-slot:item.totalSignup="{ item }">
        <div
          :style="
            item.defaultNumber < item.totalSignup
              ? { color: 'red' }
              : { color: '' }
          "
        >
          {{ item.totalSignup }}
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          title="下載考區所有資料"
          :disabled="item.defaultNumber == '0' ? true : false"
          class="mr-2"
          @click="downloadAreaFile(item)"
        >
          mdi-download-box-outline
        </v-icon>
        <v-icon
          v-if="globalSystemValue.system === 'olympic'"
          :disabled="fixCodeName"
          title="重新分配考區"
          class="mr-2"
          @click="showAreaChangePup(item)"
        >
          mdi-gesture-swipe
        </v-icon>
        <v-icon title="編輯考區" class="mr-2" @click="editItem(item)">
          mdi-text-box-edit-outline
        </v-icon>
        <v-icon title="刪除考區" class="mr-2" @click="deleteItem(item)">
          mdi-trash-can-outline
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="areaChangePup" max-width="400px">
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
            >重新分配考區</span
          >
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" sm="6" md="12" style="margin-top: 14px">
              <span style="font-size: 16px">
                考區名稱 ： {{ areaInfo.areaName }}
              </span>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -6px">
              <span style="font-size: 15px; font-weight: bold">
                分配方式 ：
              </span>
              <v-radio-group v-model="chagneAreaMod" inline>
                <v-radio value="R" label="隨機分配"></v-radio>
                <v-radio value="S" label="依據學校"></v-radio>
              </v-radio-group>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -6px">
              <v-icon dense style="margin-top: -5px"> mdi-contrast-box </v-icon>
              <span style="font-size: 15px; font-weight: bold">
                重新分配 ：
              </span>
            </v-col>
            <v-col
              v-if="chagneAreaMod === 'R'"
              cols="12"
              sm="6"
              md="12"
              style="margin-top: -15px"
            >
              <v-text-field
                v-model="chagneAreaAmount"
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
            <v-col v-if="chagneAreaMod === 'S'">
              <v-select
                v-model="cityNum"
                :items="cityList"
                item-title="city_name"
                item-value="city_number"
                variant="underlined"
                label="城市"
              ></v-select>
            </v-col>
            <v-col v-if="chagneAreaMod === 'S'">
              <v-select
                v-model="institutionNum"
                :items="institution"
                item-title="state"
                item-value="value"
                variant="underlined"
                label="公/私立"
              ></v-select>
            </v-col>
            <v-col v-if="chagneAreaMod === 'S'" cols="12" sm="6" md="12">
              <v-select
                v-model="schoolNum"
                :items="
                  institutionNum !== ''
                    ? schoolList[cityNum][institutionNum]
                    : schoolList[cityNum]
                "
                item-title="school_name"
                item-value="school_number"
                variant="underlined"
                label="校名"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" md="12" style="margin-top: -11px">
              <v-select
                outlined
                dense
                v-model="areaId"
                :items="examAreaList"
                item-title="areaName"
                item-value="areaId"
                variant="underlined"
                label="調換考區名稱"
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
              areaChangePup = false;
              close();
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="chagneArea()"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
                <v-col cols="12" sm="6" md="8" style="margin-top: -15px">
                  <v-text-field
                    :disabled="fixCodeName && editedIndex !== -1"
                    v-model="editedItem.codeName"
                    label="考區代碼"
                    :counter="10"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '考區代碼不能為空',
                      (v) => v.length <= 10 || '超過規定字數',
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="8" style="margin-top: -31px">
                  <v-text-field
                    v-model="editedItem.areaName"
                    label="考區名稱"
                    :counter="50"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '考區名稱不能為空',
                      (v) => v.length <= 50 || '超過規定字數',
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="8" style="margin-top: -31px">
                  <v-text-field
                    v-model="editedItem.address"
                    label="地址"
                    :counter="50"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '地址不能為空',
                      (v) => v.length <= 50 || '超過規定字數',
                    ]"
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
              @click="saveExamArea"
              :disabled="!valid"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
          </v-card-actions>
        </v-form>
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
            >確定刪除此考區資訊？</span
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
            @click="removeExamArea"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >刪除</v-btn
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
    valid: true,
    alertPup: false,
    changeAlertStatus: false,
    changeAlertStatus2: false,
    changeAlert: "",
    changeAlert2: "",
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    cityNum: "",
    institutionNum: "",
    chagneAreaMod: "R",
    chagneAreaAmount: 0,
    areaId: 0,
    schoolNum: 0,
    examAreaList: [],
    areaInfo: {},
    cityList: [],
    schoolList: [],
    levelStatus: true,
    dialog: false,
    dialogDelete: false,
    loadShow: false,
    // fixCodeName: false,
    areaChangePup: false,
    institution: [
      { state: "公立", value: "公立" },
      { state: "私立", value: "私立" },
    ],
    headers: [
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
    ],
    editedIndex: -1,
    editedItem: {
      areaId: "",
      codeName: "",
      areaName: "",
      address: "",
    },
    defaultItem: {
      areaId: "",
      codeName: "",
      areaName: "",
      address: "",
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
      return this.editedIndex === -1 ? "新增考區" : "更改考區資訊";
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
  },

  methods: {
    async downloadAllAreaFile() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.type = "allArea";

      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/downloadAllAreaFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response);
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/zip" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute(
            "download",
            this.globalSystemValue.olympic + "_所有考區場務資料.zip",
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadAreaFile(item) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.areaData = JSON.stringify(item);
      data.areaId = item.areaId;
      data.olympic = this.globalSystemValue.olympic;
      data.type = "examArea";

      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/downloadAreaFile", data, {
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
              item.codeName +
              "_" +
              item.areaName +
              ".zip",
          );
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async showAreaChangePup(item) {
      this.areaInfo = item;

      await this.getEnoughArea();

      if (!this.alertPup) {
        this.areaChangePup = true;
      }
    },

    async getEnoughArea() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.studentExamCode = JSON.stringify(this.editedItem);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getEnoughArea", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.examAreaList = response.data.resultData;
          } else if (response.data.code === 201) {
            this.cleanPupData();
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

    async chagneArea() {
      let examArea = {};

      const that = this;
      this.examAreaList.forEach(function (info) {
        if (info.areaId === that.areaId) {
          examArea = info;
        }
      });

      if (this.chagneAreaMod === "R") {
        if (this.chagneAreaAmount > this.areaInfo.totalSignup) {
          this.changeAlertStatus2 = true;
          this.changeAlert2 = "調換學生總數超過原本考區人數";
        }

        if (
          this.chagneAreaAmount >
          examArea.defaultNumber - examArea.totalSignup
        ) {
          this.changeAlertStatus = true;
          this.changeAlert = "調換學生總數超過更換考區空位數";
        }
      }

      if (
        (!this.changeAlertStatus2 && !this.changeAlertStatus) ||
        this.chagneAreaMod === "S"
      ) {
        await this.tokenService.renewLT();

        const data = {};
        data.AT = await this.tokenService.getFastAT();
        data.id = this.id;
        data.mode = this.chagneAreaMod;
        data.outAreaId = this.areaInfo.areaId;
        data.outCodeName = this.areaInfo.codeName;
        data.defaultNumber = this.areaInfo.defaultNumber;
        data.inAreaId = examArea.areaId;
        data.inCodeName = examArea.codeName;
        data.areaAmount = this.chagneAreaAmount;
        data.schoolNumber = this.schoolNum;

        this.loadShow = true;
        await this.axios
          .post(this.systemENV.APISERVERURL + "/chagneArea", data)
          .then((response) => {
            // console.log(response.data);
            if (response.data.code === 200) {
              this.loadShow = false;
              this.areaInfo = {};
              this.chagneAreaAmount = 0;
              that.areaId = 0;
              this.changeAlertStatus2 = false;
              this.changeAlertStatus = false;
              this.changeAlert2 = "";
              this.changeAlert = "";
              this.cityNum = "";
              this.institutionNum = "";
              this.schoolNum = 0;
            } else {
              this.globalSystemTool.removeLocalStorage();
            }
          })
          .catch(function (error) {
            // console.log(error);
          });
        this.getExamAreaInfo();
        this.areaChangePup = false;
      }
    },

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

    updateTable(filterData) {
      this.desserts = filterData;
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "選拔管理");
      return this.$store.state.title;
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      if (this.editedIndex === -1) {
        this.valid = false;
      }
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    async removeExamArea() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.areaId = this.editedItem.areaId;
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/removeExamArea", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
          } else if (response.data.code === 211) {
            this.closeDelete();
            this.alertPup = true;
            this.pupTitle = "考區無法刪除";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "此考區尚有參賽學生";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    close() {
      this.dialog = false;
      this.areaId = 0;
      this.chagneAreaAmount = 0;
      this.areaInfo = {};
      this.changeAlertStatus2 = false;
      this.changeAlertStatus = false;
      this.changeAlert2 = "";
      this.changeAlert = "";
      this.cityNum = "";
      this.institutionNum = "";
      this.schoolNum = 0;
      this.valid = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async saveExamArea(item) {
      await this.tokenService.renewLT();

      if (
        this.globalSystemValue.system === "science" &&
        this.desserts.length >= 1 &&
        this.editedIndex === -1
      ) {
        this.loadShow = false;

        this.cleanPupData();
        this.alertPup = true;
        this.pupTitle = "提醒";
        this.pupTitleShow = "2";
        this.pupTitleIcon = "mdi-alert-outline";
        this.pupText = "科學班考區只能設定一組";

        return false;
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.areaId = parseInt(this.editedItem.areaId);
      data.olyId = parseInt(this.id);
      data.codeName = this.editedItem.codeName;
      data.areaName = this.editedItem.areaName;
      data.address = this.editedItem.address;
      data.olympic = this.globalSystemValue.olympic;

      if (this.editedIndex !== -1) {
        data.oldCodeName = this.desserts[this.editedIndex].codeName;
      } else {
        data.oldCodeName = "";
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveExamArea", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            data.areaId = response.data.resultData;
            data.defaultNumber = 0;
            data.totalSignup = 0;
            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              this.desserts.unshift(data);
            }

            this.close();
          } else if (response.data.code === 500) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "考區代碼問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "考區代碼已被使用請重新設定";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSchoolAddressList() {
      const data = {};
      data.system = "science";
      data.olyId = parseInt(this.id);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSchoolAddressListByArea", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.cityList = response.data.resultData.cityList;
            this.schoolList = response.data.resultData.schoolList;
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

    await this.getSchoolAddressList();

    await this.tokenService.renewLT();
  },
};
</script>
