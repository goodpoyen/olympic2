<template>
  <v-card>
    <v-card-title dark style="background-color: #0046fe !important">
      <v-icon large style="font-size: 24px; color: white; margin-top: -3px">
        mdi-file-upload-outline
      </v-icon>
      <span style="font-size: 18px; font-weight: bold; color: white">
        匯入選擇
      </span>
    </v-card-title>

    <v-card-text style="font-size: 18px; font-weight: bold">
      <v-radio-group v-model="selectImportTyep" column>
        <v-radio
          v-if="globalSystemValue.system !== 'science'"
          label="甄選資料"
          value="contestantsList"
        ></v-radio>
        <div
          v-if="globalSystemValue.system !== 'science'"
          style="margin-left: 30px; color: red; font-size: 13px"
        >
          (請上傳 應試號碼 中文姓名 考區名稱 考場 座號 成績 PR值 欄位)
        </div>
        <v-radio
          v-if="globalSystemValue.system === 'science'"
          label="成績總表"
          value="scoreList"
        ></v-radio>
      </v-radio-group>
    </v-card-text>
    <v-card-actions style="margin-top: 3px">
      <v-spacer></v-spacer>
      <v-btn
        color="black darken-1"
        text
        style="font-weight: bold; font-size: 17px"
        @click="closeImportpup()"
      >
        取消
      </v-btn>
      <v-btn
        color="darken-1"
        :disabled="selectImportTyep === ''"
        text
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        @click="uploadFile()"
      >
        確定</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  data: () => ({ selectImportTyep: "" }),

  props: {},

  watch: {},

  methods: {
    uploadFile() {
      this.$emit("uploadFile", this.selectImportTyep);
    },

    closeImportpup() {
      this.$emit("closeImportpup", false);
    },
  },
  async mounted() {},
};
</script>
