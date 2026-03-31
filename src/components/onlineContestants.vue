<template>
  <div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :items-per-page="50"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
      multi-sort
      item-key="cId"
      class="elevation-1"
      @toggle-select-all="selectAllToggle"
    >
      <template v-slot:top>
        <v-toolbar flat style="background-color: white">
          <div v-if="selected.length > 0">
            <v-btn
              title="寄送考試通知"
              color="#635BFF"
              variant="outlined"
              small
              @click="sendMultiMailCheckAlert('examMulti')"
            >
              <v-icon> mdi-card-account-details-outline </v-icon>
            </v-btn>
            <v-btn
              title="寄送成績證明"
              color="#635BFF"
              variant="outlined"
              small
              @click="sendMultiMailCheckAlert('scoreMulti')"
            >
              <v-icon> mdi-license </v-icon>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="desserts.length == 0"
            @click="onButtonClick"
          >
            <v-icon small left> mdi-file-upload-outline </v-icon>
            <p style="font-size: 13px">匯入</p>
          </v-btn>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            @change="onFileChanged"
          />
          <v-btn
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="desserts.length == 0"
            @click="loadCMSFile"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px">匯出</p>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <!-- <v-icon title="檢視檔案" class="mr-4" @click="reviewFile(item)">
          mdi-file-eye-outline
        </v-icon>
        <v-icon
          title="寄送考試通知"
          class="mr-4"
          :style="item.sendExamNotice ? { color: 'green' } : { color: '' }"
          @click="sendMailCheckAlert(item, 'exam')"
        >
          mdi-card-account-details-outline
        </v-icon>
        <v-icon
          title="寄送成績證明"
          class="mr-4"
          :style="item.sendExamScoreNoice ? { color: 'green' } : { color: '' }"
          @click="sendMailCheckAlert(item, 'score')"
        >
          mdi-license
        </v-icon> -->
      </template>
      <template v-slot:item.score="{ item }">
        <v-text-field
          dense
          v-model="item.score"
          style="width: 90px; padding: 9px"
          variant="outlined"
          @keyup="scoreInput(item)"
        >
        </v-text-field>
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
        <v-card-text style="font-size: 20px; font-weight: bold">
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              cleanPupData;
              alertPup = false;
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendMailpup" max-width="500px">
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
        <v-card-text style="font-size: 20px; font-weight: bold">
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            @click="sendMailpup = false"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >

          <v-btn
            v-if="sendMailtype === 'score'"
            left
            color="blue darken-1"
            text
            @click="sendScroeMail()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >

          <v-btn
            v-if="sendMailtype === 'scoreMulti'"
            left
            color="blue darken-1"
            text
            @click="sendMultiScroeMail()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
        <v-overlay v-model="sendShow" class="align-center justify-center">
          <v-progress-circular indeterminate color="primary" :size="60">
          </v-progress-circular>
        </v-overlay>
      </v-card>
    </v-dialog>
    <v-dialog v-model="importPup" max-width="500px">
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
        <v-card-text style="font-size: 20px; font-weight: bold">
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            @click="
              cleanPupData;
              importPup = false;
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              cleanPupData;
              importPup = false;
              $refs.uploader.click();
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
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
export default {
  data: () => ({
    loadShow: false,
    sendShow: false,
    alertPup: false,
    importPup: false,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    selected: [],
    tempItem: {},
    valid: true,
    levelStatus: true,
    dialog: false,
    selectedFile: null,
    upgradeRaceList: [],
    filterList: [],
    schedulId: "",
    sendMailpup: false,
    sendMailtype: "",
    headers: [
      { title: "姓名", value: "chineseName", filterName: "chineseName" },
      { title: "學校", value: "schoolNameAll", filterName: "schoolNameAll" },
      { title: "指導老師", value: "teacherName", filterName: "teacherName" },
      { title: "帳號", value: "cmsA", filterName: "cmsA" },
      { title: "密碼", value: "cmsP", filterName: "cmsP" },
      { title: "信箱", value: "email", filterName: "email" },
      { title: "成績", value: "score", filterName: "score" },
      { title: "組別", value: "type", filterName: "type" },
      { title: "功能", value: "actions" },
    ],
    desserts: [],
    dessertsTemp: [],
    editedIndex: -1,
    editedItem: {
      cId: "",
      stId: "",
      chineseName: "",
      schoolNameAll: "",
      cmsA: "",
      cmsP: "",
      email: "",
      score: "",
      type: "",
      teacherName: "",
    },
    defaultItem: {
      cId: "",
      stId: "",
      chineseName: "",
      schoolNameAll: "",
      cmsA: "",
      cmsP: "",
      email: "",
      score: "",
      type: "",
      teacherName: "",
    },
  }),

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    selected(data) {},
  },

  methods: {
    onButtonClick() {
      window.addEventListener("focus", () => {}, { once: true });

      this.ouloadCheckAlert();
    },

    ouloadCheckAlert() {
      this.cleanPupData();
      this.importPup = true;
      this.pupTitle = "確認匯入檔案";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您確定要匯入資料？";
    },

    async onFileChanged(e) {
      this.loadShow = true;
      this.selectedFile = e.target.files[0];

      const formData = new FormData();

      const header = { "Content-type": "multipart/form-data" };

      formData.append("file", this.selectedFile);
      formData.append("AT", await this.tokenService.getFastAT());
      formData.append("id", this.id);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/importCMSFile", formData, {
          headers: header,
        })
        .then((response) => {
          // console.log(response.data)
          this.loadShow = false;
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "上傳成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您匯入的檔案已完成";
            this.getCMSInfo();
          } else if (response.data.code === 204) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入資料有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = response.data.resultData;
            this.getCMSInfo();
          } else if (response.data.code === 205) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入欄位有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = response.data.resultData;
          } else if (response.data.code === 401) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入檔案太大";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "請勿上傳超過六萬筆資料";
          } else if (response.data.code === 402) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入檔案有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您匯入的檔案無法讀取請重整頁面再試一次";
          } else if (response.data.code === 406) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "非法字元";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您匯入的檔案資料中含有特殊符號或英文詞彙請修正";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async updateCMSScore(item) {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.cId = item.cId;
      data.score = item.score;

      await this.axios.post(
        this.systemENV.APISERVERURL + "/updateCMSScore",
        data,
      );
    },

    async loadCMSFile() {
      await this.tokenService.renewLT();
      this.loadShow = true;
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        "CMS資料" +
        this.globalSystemTool.getNowDataTimeByString();

      await this.axios
        .post(this.systemENV.APISERVERURL + "/loadCMSFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response)
          this.loadShow = false;
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    selectAllToggle(props) {
      if (props.items.length > 0 && props.value) {
        const self = this;
        props.items.forEach((item) => {
          self.selected.push(item);
        });
      }

      if (!props.value) {
        this.selected = [];
      }
    },

    async reviewFile(item) {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = item.olyId;
      data.contestantsId = item.contestantsId;
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        "檢視內容" +
        this.globalSystemTool.getNowDataTimeByString();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/reviewFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/pdf" });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".pdf");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async sendScroeMail() {
      this.sendShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.stId = this.tempItem.stId;
      data.olyId = this.tempItem.olyId;
      data.stIdList = [];
      data.stIdList.push(this.tempItem.stId);
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/sendScroeMail", data)
        .then((response) => {
          this.sendShow = false;
          this.sendMailtype = "";
          // console.log(response)
          if (response.data.code === 200) {
            this.cleanPupData();
            this.sendMailpup = true;
            this.pupTitle = "信件發送成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "考生通知單已發送";
            this.tempItem.sendExamScoreNoice = true;
            Object.assign(
              this.desserts[this.desserts.indexOf(this.tempItem)],
              this.tempItem,
            );
          } else {
            this.cleanPupData();
            this.sendMailpup = true;
            this.pupTitle = "信件發送失敗";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "Gmail 服務過於忙碌 請稍後再試一次";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });

      this.tempItem = {};
    },

    async sendMultiScroeMail() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.stId = this.selected[0].stId;
      data.olyId = this.selected[0].olyId;
      data.stIdList = [];
      this.selected.forEach((item) => {
        data.stIdList.push(item.stId);
      });
      data.olympic = this.globalSystemValue.olympic;
      this.cleanPupData();
      this.sendMailpup = false;
      this.sendMailtype = "";
      this.cleanPupData();
      this.sendMailpup = true;
      this.pupTitle = "信件發送成功";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-alert-outline";
      this.pupText = "成績證明已發送";
      await this.axios.post(
        this.systemENV.APISERVERURL + "/sendScroeMail",
        data,
      );
    },

    sendMailCheckAlert(item, type) {
      this.sendMailtype = type;
      this.cleanPupData();
      this.sendMailpup = true;

      if (type === "exam") {
        if (item.sendExamNotice) {
          this.pupTitle = "此參賽者以發送過考生通知信，確定要再次發送？";
        } else {
          this.pupTitle = "確認要發送信件";
        }
      } else if (type === "score") {
        if (item.sendExamScoreNoice) {
          this.pupTitle = "此參賽者以發送過成績證明，確定要再次發送？";
        } else {
          this.pupTitle = "確認要發送信件";
        }
      }

      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您確定要發送信件？";

      this.tempItem = item;
    },

    sendMultiMailCheckAlert(type) {
      this.sendMailtype = type;
      this.cleanPupData();
      this.sendMailpup = true;
      const data = {};
      data.sendStatus = false;

      if (type === "examMulti") {
        this.selected.forEach((exam) => {
          if (exam.sendExamNotice) {
            data.sendStatus = true;
            return false;
          }
        });
        if (data.sendStatus) {
          this.pupTitle = "有參賽者以發送過成績證明，確定要再次發送？";
        } else {
          this.pupTitle = "確認要發送信件";
        }
      } else if (type === "scoreMulti") {
        this.selected.forEach((exam) => {
          if (exam.sendExamScoreNoice) {
            data.sendStatus = true;
            return false;
          }
        });
        if (data.sendStatus) {
          this.pupTitle = "有參賽者以發送過成績證明，確定要再次發送？";
        } else {
          this.pupTitle = "確認要發送信件";
        }
      }

      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您確定要發送信件？";
    },

    filteredDesserts(index, filterName) {
      const value = document.getElementById("contestnatsInput" + index).value;

      document.getElementById("contestnatsColor" + index).style.color =
        "rgb(25 118 210)";

      if (
        document.getElementById("contestnatsInput" + index).value.length !== 0
      ) {
        this.filterList.push(value + "_" + filterName);

        this.desserts = this.desserts.filter((dessert) => {
          if (dessert[filterName] !== undefined) {
            return dessert[filterName]
              .toString()
              .toLowerCase()
              .includes(value.toString().toLowerCase());
          } else {
            return dessert[filterName];
          }
        });
      } else {
        this.cleanDesserts(index, filterName);
      }

      return this.desserts;
    },

    cleanDesserts(index, filterName) {
      const value =
        document.getElementById("contestnatsInput" + index).value +
        "_" +
        filterName;

      if (this.filterList.length > 0) {
        this.filterList.forEach(function (data, index, object) {
          let search = data.split("_");
          if (search[1] === filterName) {
            object.splice(index, 1);
          }
        });
      }

      document.getElementById("contestnatsInput" + index).value = "";

      document.getElementById("contestnatsColor" + index).style.color = "";

      if (this.filterList.length > 0) {
        const that = this;
        this.filterList.forEach(function (data) {
          let search = data.split("_");
          that.desserts = that.dessertsTemp.filter((item) => {
            if (item[search[1]] !== undefined) {
              return item[search[1]]
                .toString()
                .toLowerCase()
                .includes(search[0].toString().toLowerCase());
            } else {
              return item[filterName];
            }
          });
        });
      } else {
        this.desserts = this.dessertsTemp.filter((dessert) => {
          return dessert[filterName];
        });
      }

      return this.desserts;
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

    async getCMSInfo() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getCMSInfo", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
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
    await this.getCMSInfo();
  },
};
</script>
