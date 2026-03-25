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
    <v-card-text style="font-size: 20px; margin-top: 19px; font-weight: bold">
      <div v-html="pupText"></div>
    </v-card-text>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        v-if="importCheck"
        left
        color="blue darken-1"
        text
        @click="closeImportContestants()"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >取消</v-btn
      >
      <v-btn
        v-if="importCheck && selectImportTyep !== 'scoreList'"
        left
        color="blue darken-1"
        text
        @click="$emit('importContestantsFile', {})"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >確定</v-btn
      >
      <v-btn
        v-if="importCheck && selectImportTyep === 'scoreList'"
        left
        color="blue darken-1"
        text
        @click="$emit('importExamTranscrip', {})"
        style="color: #2d5bff; font-weight: bold; font-size: 17px"
        >確定</v-btn
      >
      <v-btn
        v-if="!importCheck"
        left
        color="blue darken-1"
        text
        @click="closeImportContestants()"
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
  data: () => ({
    loadShow: false,
  }),

  props: {
    pupTitle: "",
    pupTitleShow: "",
    pupTitleIcon: "",
    pupText: "",
    importCheck: "",
    selectImportTyep: "",
  },

  watch: {},

  methods: {
    closeImportContestants() {
      this.$emit("closeImportContestants", false);
    },
  },
  async mounted() {},
};
</script>
