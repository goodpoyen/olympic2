<template>
  <div>
    <div style="margin-top: 2%; font-weight: bold; margin-left: 5%">
      系統名稱設定：
    </div>
    <div style="margin-left: 5%; width: 60%">
      <v-text-field
        v-model="title"
        :rules="titleRules"
        :counter="20"
        label="系統標題"
      ></v-text-field>
    </div>
    <div style="margin-left: 5%; width: 60%">
      <v-text-field
        v-model="subTitle"
        :rules="subTitleRules"
        :counter="20"
        label="系統副標題"
      ></v-text-field>
    </div>
    <div style="margin-top: 2%; font-weight: bold; margin-left: 5%">
      LOGO上傳：
      <span style="font-size: 10px; color: gray">尺寸寬度360px~500px</span>
    </div>
    <v-card
      style="
        height: 71px;
        transform: none;
        font-size: 13px;
        margin-top: 16px;
        margin-left: 5%;
        width: 50%;
        background-color: #ebebeb;
      "
    >
      <div
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "
      >
        <v-btn small color="#635BFF" dark class="mb-2">
          <v-icon small left> mdi-cloud-upload-outline </v-icon>
          <p style="font-size: 14px; margin-top: 16px">上傳</p>
        </v-btn>
        <span style="font-size: 12px; margin-left: 10px"
          >檔案格式(jpg、png)</span
        >
      </div>
    </v-card>
    <v-simple-table style="margin-top: 16px; width: 50%; margin-left: 5%">
      <template v-slot:default>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td style="width: 97%">{{ item.name }}</td>
            <td style="width: 3%">
              <div>
                <v-icon class="mr-2" @click="deleteItem(item)">
                  mdi-trash-can-outline
                </v-icon>
              </div>
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    levelStatus: true,
    desserts: [
      {
        name: "TOI-LOGO.jpg",
      },
      {
        name: "IJSO-LOGO.png",
      },
    ],
    valid: false,
    title: "",
    titleRules: [
      (v) => v.length <= 20 || "title must be less than 20 characters",
    ],
    subTitle: "",
    subTitleRules: [
      (v) => v.length <= 20 || "subTitle must be less than 20 characters",
    ],
  }),

  computed: {},

  watch: {},

  methods: {
    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "專案設定");
      return this.$store.state.title;
    },
  },

  async mounted() {
    this.reloadTitle();
    if (this.globalSystemValue.level === "1") {
      this.levelStatus = false;
    }

    await this.tokenService.renewLT();
    // await this.getClassRoomInfo()
  },
};
</script>
