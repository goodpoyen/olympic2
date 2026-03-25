<template>
  <div>
    <div style="margin-left: 5%; margin-top: 2%">
      <v-btn
        class="ma-3"
        small
        outlined
        color="indigo"
        style="font-weight: bold"
      >
        <v-icon small left> mdi-download-box-outline </v-icon>
        <p style="font-size: 14px; margin-top: 16px">測驗准考證模板</p>
      </v-btn>
      <v-btn
        class="ma-3"
        small
        outlined
        color="indigo"
        style="font-weight: bold"
      >
        <v-icon small left> mdi-download-box-outline </v-icon>
        <p style="font-size: 14px; margin-top: 16px">測驗成績證明模板</p>
      </v-btn>
      <v-btn
        class="ma-3"
        small
        outlined
        color="indigo"
        style="font-weight: bold"
      >
        <v-icon small left> mdi-download-box-outline </v-icon>
        <p style="font-size: 14px; margin-top: 16px">選訓營績證明模板</p>
      </v-btn>
    </div>
    <v-card
      style="
        height: 71px;
        transform: none;
        font-size: 13px;
        margin-top: 16px;
        margin-left: 5%;
        width: 85%;
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
        <span style="font-size: 12px; margin-left: 10px">檔案格式(PDF)</span>
      </div>
    </v-card>
    <v-simple-table style="margin-top: 16px; width: 85%; margin-left: 5%">
      <template v-slot:default>
        <tbody>
          <tr v-for="item in desserts" :key="item.name">
            <td style="width: 91%">{{ item.name }}</td>
            <td style="width: 9%">
              <div>
                <v-icon class="mr-2" @click="editItem(item)">
                  mdi-cloud-download-outline
                </v-icon>
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
        name: "海選准考證模板.pdf",
      },
      {
        name: "選訓營成績證明模板.pdf",
      },
    ],
  }),

  computed: {},

  watch: {},

  methods: {
    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "樣板上傳");
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
