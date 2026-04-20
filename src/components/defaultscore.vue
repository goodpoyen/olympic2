<template>
  <div>
    <v-tabs v-model="tab" color="blue accent-4" left>
      <v-tab
        v-if="olyId === 0 || level === 1"
        style="color: black; font-weight: bolder"
        :value="1"
        @click="changeTab(1)"
        >科學能力</v-tab
      >
      <v-tab
        v-if="olyId === 0 || level === 2"
        style="color: black; font-weight: bolder"
        :value="2"
        @click="changeTab(2)"
        >實驗實作</v-tab
      >
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item v-for="n in 2" :key="n" :value="n">
        <v-container v-if="n == 1 || n == 2" fluid>
          <div style="font-size: 14px; font-weight: bold">
            設定對象:
            <v-btn
              v-if="level === 1 && olyId === 0"
              small
              rounded
              color="#e9f8ff"
              style="margin-left: 11px; margin-top: -2px"
            >
              <v-icon small left> mdi-cog-outline </v-icon>
              <p style="font-size: 14px">科學能力科目系統預設值</p>
            </v-btn>
            <v-btn
              v-if="level === 2 && olyId === 0"
              small
              rounded
              color="#f3ebff"
              style="margin-left: 11px; margin-top: -2px"
            >
              <v-icon small left> mdi-cog-outline </v-icon>
              <p style="font-size: 14px">實驗實作科目系統預設值</p>
            </v-btn>
            <v-btn
              v-if="level === 1 && olyId !== 0"
              small
              rounded
              color="#e9f8ff"
              style="margin-left: 11px; margin-top: -2px"
            >
              <v-icon small left> mdi-notebook-edit-outline </v-icon>
              <p style="font-size: 14px; margin-top: 13px">
                {{ signupName }}
              </p>
            </v-btn>
            <v-btn
              v-if="level === 2 && olyId !== 0"
              small
              rounded
              color="#f3ebff"
              style="margin-left: 11px; margin-top: -2px"
            >
              <v-icon small left> mdi-rotate-orbit </v-icon>
              <p style="font-size: 14px; margin-top: 13px">
                {{ signupName }}
              </p>
            </v-btn>
          </div>
          <v-data-table
            :headers="configHeaders"
            :items="configList"
            :items-per-page="70"
            :hide-default-footer="true"
            loading-text="資料處理中...."
            density="compact"
            class="elevation-1"
            style="margin: 2% auto"
          >
            <tr>
              <th style="width: 10%">科目排序</th>
              <th style="width: 20%">科目名稱</th>
              <th style="width: 10%">資料型態</th>
              <th style="width: 10%">成績長度限制</th>
              <th style="width: 10%">描述長度限制</th>
              <th style="width: 40%">科目描述(非必填)</th>
            </tr>
            <draggable
              v-model="configList"
              tag="tbody"
              item-key="slId"
              @change="dragChange"
            >
              <template #item="{ element, index }">
                <tr>
                  <td>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td>
                    <div>
                      <v-text-field
                        v-if="element['editorSubjectName'] === ''"
                        dense
                        v-model="element['tempSubjectName']"
                        variant="underlined"
                        color="rgb(255, 60, 1)"
                        style="margin-top: 22px; width: 100%"
                        @click="addTemp(element)"
                        @change="saveEditorConfig('editor')"
                      >
                      </v-text-field>
                      <v-text-field
                        v-else
                        dense
                        v-model="element['editorSubjectName']"
                        variant="underlined"
                        color="rgb(255, 60, 1)"
                        style="margin-top: 22px; width: 100%"
                        @click="addTemp(element)"
                        @change="saveEditorConfig('editor')"
                      >
                      </v-text-field>
                    </div>
                  </td>
                  <td>
                    <div>
                      <span v-if="element['dataType'] === 'num'">數字</span>
                      <span v-if="element['dataType'] === 'string'">文字</span>
                      <span v-if="element['dataType'] === 'boolean'"
                        >是/否</span
                      >
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ element["valueLength"] }}
                    </div>
                  </td>
                  <td>
                    <div>
                      {{ element["descriptionLength"] }}
                    </div>
                  </td>
                  <td>
                    <div>
                      <v-textarea
                        v-model="element['editorSubjectDescription']"
                        prepend-inner-icon="mdi-pencil"
                        variant="underlined"
                        color="rgb(255, 60, 1)"
                        :value="element['editorSubjectDescription']"
                        style="margin-top: 22px; font-size: 16px; width: 100%"
                        rows="2"
                        :maxlength="element.descriptionLength"
                        :counter="element.descriptionLength"
                        @click="addTemp(element)"
                        @change="saveEditorConfig('editor')"
                      ></v-textarea>
                    </div>
                  </td>
                </tr>
              </template>
            </draggable>
            <template v-slot:top>
              <v-toolbar flat style="background-color: white">
                <v-btn
                  v-if="globalSystemValue.level === '1'"
                  small
                  color="#635BFF"
                  variant="flat"
                  @click="
                    getSubjectLibaray();
                    libaryPup = true;
                  "
                >
                  <v-icon small left> mdi-format-list-checkbox </v-icon>
                  <p style="font-size: 13px">新增科目</p>
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  v-if="olyId !== 0"
                  small
                  color="#635BFF"
                  variant="flat"
                  style="font-weight: bold"
                  @click="saveSubjectConfig('updateDefault')"
                >
                  <v-icon small left> mdi mdi-update </v-icon>
                  <p style="font-size: 13px">同步更新系統預設值</p>
                </v-btn>
              </v-toolbar>
            </template>
          </v-data-table>
          <v-overlay v-model="saveLoading" class="align-center justify-center">
            <v-progress-circular indeterminate color="primary" :size="60">
            </v-progress-circular>
          </v-overlay>
        </v-container>
      </v-tabs-window-item>
    </v-tabs-window>
    <v-dialog v-model="libaryPup" width="50%">
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
            >選擇科目</span
          >
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-data-table
              v-model="selected"
              :headers="libaryHeaders"
              :items="libaryList"
              :item-value="slId"
              :items-per-page="500"
              :hide-default-footer="true"
              show-select
              loading-text="資料處理中...."
              class="elevation-1"
              return-object
            >
              <template v-slot:item.dataType="{ item }">
                <span v-if="item.dataType === 'num'">數字</span>
                <span v-if="item.dataType === 'string'">文字</span>
                <span v-if="item.dataType === 'boolean'">是/否</span>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color=" darken-1"
            text
            @click="libaryPup = false"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="saveSubjectConfig('saveSubject')"
            >儲存</v-btn
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

<style>
.handle {
  cursor: move;
}
</style>

<script>
import draggable from "vuedraggable";

export default {
  data: () => ({
    configHeaders: [
      { title: "科目排序", value: "sort" },
      {
        title: "科目名稱",
        value: "subjectName",
        sortable: false,
        width: "35%",
      },
      {
        title: "資料型態",
        value: "dataType",
        sortable: false,
      },
      {
        title: "成績長度限制",
        value: "valueLength",
        sortable: false,
      },
      {
        title: "描述長度限制",
        value: "descriptionLength",
        sortable: false,
      },
      {
        title: "科目描述(非必填)",
        value: "description",
        sortable: false,
        width: "20%",
      },
    ],
    libaryHeaders: [
      { title: "科目", value: "subjectName" },
      {
        title: "資料型態",
        value: "dataType",
      },
      {
        title: "成績長度限制",
        value: "valueLength",
      },
      {
        title: "描述長度限制",
        value: "descriptionLength",
      },
    ],
    signupName: "",
    itemKey: "slId",
    headers: [],
    libaryList: [],
    configList: [],
    newConfigList: [],
    editedTempIndex: -1,
    selected: [],
    configIdLsit: [],
    level: 1,
    libaryPup: false,
    loadShow: false,
    dropLock: false,
    saveLoading: false,
    tab: null,
  }),

  components: {
    draggable,
  },

  computed: {
    olyId() {
      return parseInt(this.$route.params.olyid);
    },
  },

  watch: {
    libaryPup(val) {
      val || this.close();
    },
  },

  methods: {
    async dragChange() {
      await this.saveEditorConfig("sort");
    },

    async changeTab(level) {
      this.level = level;
      this.getSubjectConfig();
    },

    async addTemp(item) {
      this.dropLock = true;
      this.editedTempIndex = this.configList.indexOf(item);
    },

    async saveEditorConfig(type) {
      await this.tokenService.renewLT();

      this.newConfigList = [];

      const that = this;
      if (type === "editor") {
        this.configList.forEach((item, index) => {
          that.newConfigList[index] = {};
          that.newConfigList[index].slId = item.slId;
          that.newConfigList[index].editorSubjectDescription =
            that.configList[index].editorSubjectDescription;

          if (index === this.editedTempIndex) {
            if (item.subjectName == "") {
              that.newConfigList[index].editorSubjectName = "";
              this.getSubjectConfig();
              return false;
            }
            if (item.editorSubjectName === "") {
              if (item.subjectName !== item.tempSubjectName) {
                that.newConfigList[index].editorSubjectName =
                  item.tempSubjectName;
              } else {
                that.newConfigList[index].editorSubjectName = "";
              }
            } else {
              if (item.subjectName !== item.editorSubjectName) {
                that.newConfigList[index].editorSubjectName =
                  item.editorSubjectName;
              } else {
                that.newConfigList[index].editorSubjectName = "";
              }
            }
          } else {
            if (item.editorSubjectName !== "") {
              that.newConfigList[index].editorSubjectName =
                item.editorSubjectName;
            } else {
              that.newConfigList[index].editorSubjectName = "";
            }

            if (item.editorSubjectDescription !== "") {
              that.newConfigList[index].editorSubjectDescription =
                item.editorSubjectDescription;
            } else {
              that.newConfigList[index].editorSubjectDescription = "";
            }
          }
        });
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.olyId;
      data.systemName = this.globalSystemValue.system;
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.level;
      if (type === "editor") {
        data.subjecList = JSON.stringify(this.newConfigList);
      } else {
        data.subjecList = JSON.stringify(this.configList);
      }

      // this.saveLoading = true;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveEditorConfig", data)
        .then((response) => {
          // console.log(response.data);
          // this.saveLoading = false;
        })
        .catch(function (error) {
          this.editedTempIndex = -1;
          this.dropLock = false;
          this.saveLoading = false;
        });

      this.editedTempIndex = -1;
      this.dropLock = false;
      this.saveLoading = false;
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "成績單設定");
      return this.$store.state.title;
    },

    close() {
      this.subjectList = [];
      this.selected = [];
      this.configIdLsit = [];
      this.libaryPup = false;
      this.editedTempIndex = -1;
      this.dropLock = false;
    },

    orderNumber(item) {
      return this.configList.indexOf(item) + 1;
    },

    async getSubjectConfig() {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.olyId;
      data.systemName = this.globalSystemValue.system;
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.level;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSubjectConfig", data)
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;

          if (response.data.code === 200) {
            this.subjectList = [];
            this.selected = [];
            this.configIdLsit = [];
            this.configList = response.data.resultData;

            const that = this;
            this.configList.forEach((item, index) => {
              item.tempSubjectName = item.subjectName;

              let temp = {};
              temp.slId = item.slId;
              temp.valueLength = item.valueLength;
              temp.descriptionLength = item.descriptionLength;
              temp.dataType = item.dataType;
              temp.subjectName = item.subjectName;

              this.selected.push(temp);
            });
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSchedule() {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.olyId;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSchedule", data)
        .then((response) => {
          // console.log(response.data);
          this.signupName = response.data.resultData.signupName;
          this.level = response.data.resultData.type === 5 ? 1 : 2;
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSubjectLibaray(type) {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.systemName = this.globalSystemValue.system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSubjectLibaray", data)
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;

          if (response.data.code === 200) {
            this.libaryList = response.data.resultData;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }

          this.getSubjectConfig();
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async saveSubjectConfig(type) {
      this.loadShow = true;
      await this.tokenService.renewLT();

      const that = this;
      this.selected.forEach((item, index) => {
        that.configIdLsit.push(item.slId);
      });

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.systemName = this.globalSystemValue.system;
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.level;
      data.subjecList = this.configIdLsit.toString();
      data.olyId = this.olyId;
      data.type = type;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveSubjectConfig", data)
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;
          this.libaryPup = false;

          if (response.data.code === 200) {
            this.getSubjectConfig();
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

    if (this.olyId !== 0) {
      await this.getSchedule();
    }

    await this.tokenService.renewLT();

    await this.getSubjectConfig();
  },
};
</script>
