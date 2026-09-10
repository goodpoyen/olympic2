<template>
  <text-Editor
    :enableVariableFeatures="enableVariableFeatures"
    :variables="variables"
    :enableReviewFile="enableReviewFile"
    @saveEditorContent="saveEditorContent"
  ></text-Editor>
</template>

<script>
import TextEditor from "./utilsComponets/textEditor.vue";

export default {
  data: () => ({
    enableReviewFile: true,
    enableVariableFeatures: true,
  }),

  computed: {
    variables() {
      if (this.globalSystemValue?.system === "science") {
        return [
          {
            title: "甄選項目",
            label: "{{自動帶入-甄選項目}}",
            id: "signupName",
          },
          { title: "考區", label: "{{自動帶入-考區}}", id: "areaName" },
          { title: "校址", label: "{{自動帶入-校址}}", id: "address" },
          { title: "時間", label: "{{自動帶入-時間}}", id: "examTime" },
          {
            title: "甄選號碼",
            label: "{{自動帶入-甄選號碼}}",
            id: "examCode",
          },
          { title: "試場", label: "{{自動帶入-試場}}", id: "roomName" },
          { title: "座位", label: "{{自動帶入-座位}}", id: "seatNumber" },
          {
            title: "甄選生",
            label: "{{自動帶入-甄選生}}",
            id: "name",
          },
        ];
      } else {
        return [
          {
            title: "考試項目",
            label: "{{自動帶入-考試項目}}",
            id: "signupName",
          },
          { title: "考區", label: "{{自動帶入-考區}}", id: "areaName" },
          { title: "考試地址", label: "{{自動帶入-考試地址}}", id: "address" },
          { title: "時間", label: "{{自動帶入-時間}}", id: "examTime" },
          {
            title: "准考證號碼",
            label: "{{自動帶入-准考證號碼}}",
            id: "examCode",
          },
          { title: "試場", label: "{{自動帶入-試場}}", id: "roomName" },
          { title: "座位", label: "{{自動帶入-座位}}", id: "seatNumber" },
          {
            title: "考生姓名",
            label: "{{自動帶入-考生姓名}}",
            id: "chineseName",
          },
          { title: "辨識碼", label: "{{自動帶入-辨識碼}}", id: "idCard" },
        ];
      }
    },
  },

  components: {
    TextEditor,
  },

  methods: {
    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "考生通知檔設定");
      return this.$store.state.title;
    },

    async saveEditorContent(value) {
      console.log(value);
    },
  },

  mounted() {
    this.reloadTitle();
  },
};
</script>
