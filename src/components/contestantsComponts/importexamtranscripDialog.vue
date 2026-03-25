<template>
  <v-card>
    <v-card-title
      v-if="pupTitleShow === '1'"
      style="background-color: #2d5bff; height: 57px"
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
    <v-card-text style="margin-top: 19px">
      <div v-if="pupText.length > 20">
        <div>
          您上傳的資料中有超過20筆格式錯誤，請下載錯誤明細查看內容，並依據下方規則修正後重新匯入。
        </div>
        <br />
        <div>匯入規則：</div>
        <div>- 所有欄位皆不可為空</div>
        <div v-for="data in subjectConfig">
          <div>
            <div v-if="data.dataType === 'num'">
              - {{ data.subjectName }} => 須為數字格式，長度限制
              {{ data.valueLength }}字元
            </div>
            <div v-if="data.dataType === 'string'">
              - {{ data.subjectName }} => 須為文字格式，長度限制
              {{ data.valueLength }}字元
            </div>
            <div v-if="data.dataType === 'boolean'">
              - {{ data.subjectName }} => 僅可填入「是」或「否」
            </div>
          </div>
        </div>
        <div style="margin-left: -9px; margin-top: 15px">
          <v-btn
            class="ma-2"
            small
            outlined
            color="indigo"
            @click="downloadImprotErrorFile()"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px; margin-top: 16px">下載錯誤明細</p>
          </v-btn>
        </div>
      </div>
      <div v-else>
        <div>匯入資料時發現以下錯誤，請根據提示內容修正後重新匯入：</div>
        <br />
        <div v-for="data in pupText">
          <div v-if="data.header !== ''">
            <div>{{ data.header }}</div>
          </div>
          <div v-else>
            <div>{{ data.rowData }}</div>
            <div v-for="subData in data.rowValue">
              <div style="margin-left: 19px">{{ subData }}</div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="!importCheck"
        left
        color="blue darken-1"
        text
        @click="closeImporEexamTranscrip()"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >確定</v-btn
      >
    </v-card-actions>
    <v-overlay :value="loadShow">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div>處理中....</div>
    </v-overlay>
  </v-card>
</template>

<script>
export default {
  data: () => ({ loadShow: false }),

  props: {
    pupTitle: "",
    pupTitleShow: "",
    pupTitleIcon: "",
    pupText: "",
    subjectConfig: [],
    errorData: [],
  },

  watch: {},

  methods: {
    async downloadImprotErrorFile() {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.errorList = JSON.stringify(this.errorData);
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        "匯入錯誤明細_" +
        this.globalSystemTool.getNowDataTimeByString();

      await this.axios
        .post(this.systemENV.APISERVERURL + "/downloadImprotErrorFile", data, {
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

    closeImporEexamTranscrip() {
      this.$emit("closeImporEexamTranscrip", false);
    },
  },
  async mounted() {},
};
</script>
