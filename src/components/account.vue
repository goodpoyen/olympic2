<template>
  <div>
    <v-card>
      <v-tabs v-model="tab" align-tabs="left" color="primary">
        <v-tab
          v-if="
            globalSystemValue.level === '1' &&
            globalSystemValue.system === 'olympic'
          "
          :value="1"
          style="color: black; font-weight: bolder"
          @click="chagneAccountList('olympic')"
          >奧林匹亞</v-tab
        >
        <v-tab
          v-if="
            (globalSystemValue.level === '1' ||
              globalSystemValue.level === '3') &&
            (globalSystemValue.system === 'science' ||
              globalSystemValue.system === 'olympic')
          "
          :value="2"
          style="color: black; font-weight: bolder"
          @click="chagneAccountList('science')"
          >科學班</v-tab
        >
      </v-tabs>
      <v-tabs-window v-model="tab">
        <v-tabs-window-item v-for="n in 2" :key="n" :value="n">
          <v-container v-if="n == 1 || n == 2" fluid>
            <v-data-table
              :headers="headers"
              :items="desserts"
              item-key="name"
              :loading="loadList"
              loading-text="資料處理中...."
              :items-per-page="50"
              :footer-props="{
                'items-per-page-options': [50, 100, 150, 200, 250, -1],
              }"
            >
              <template v-slot:top>
                <v-toolbar flat style="background-color: white">
                  <v-btn
                    small
                    color="#635BFF"
                    dark
                    variant="flat"
                    class="mb-2"
                    @click="dialog = true"
                  >
                    <v-icon small left> mdi-account-plus-outline </v-icon>
                    <p style="font-size: 13px">新增帳號</p>
                  </v-btn>
                </v-toolbar>
              </template>
              <template
                v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }"
              >
                <tr>
                  <template v-for="column in columns" :key="column.key">
                    <th>
                      <div class="d-flex align-center">
                        <span
                          class="me-2 cursor-pointer"
                          @click="toggleSort(column)"
                          v-text="column.title"
                        ></span>
                      </div>
                    </th>
                  </template>
                </tr>
              </template>
              <!-- <template
                v-for="(header, index) in headers"
                v-slot:[`header.${header.value}`]="{ header }"
              >
                <span>{{ header.text }} </span>
                <br />
                <v-menu offset-y :close-on-content-click="false">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      v-if="header.text === '功能'"
                      icon
                      v-bind="attrs"
                      v-on="on"
                      style="visibility: hidden"
                    >
                      <v-icon small :color="header[header.filterName + '_C']">
                        mdi-filter
                      </v-icon>
                    </v-btn>
                    <v-btn v-else icon v-bind="attrs" v-on="on">
                      <v-icon small :color="header[header.filterName + '_C']">
                        mdi-filter
                      </v-icon>
                    </v-btn>
                  </template>
                  <table-filter
                    :desserts="desserts"
                    :dessertsTemp="dessertsTemp"
                    :header="header"
                    @updateTable="updateTable"
                  >
                  </table-filter>
                </v-menu>
              </template> -->
              <template v-slot:item.statusName="{ item }">
                <v-chip
                  v-if="item.statusName == '啟用'"
                  style="background-color: #e3ffe5 !important"
                  :color="getColor(item.statusName)"
                  outlined
                >
                  <span style="margin-left: 7px; color: #2bcd2b">{{
                    item.statusName
                  }}</span>
                  <v-icon small style="margin-left: 7px; color: #2bcd2b">
                    mdi-check
                  </v-icon>
                </v-chip>
                <v-chip
                  v-if="item.statusName == '更新密碼中'"
                  style="background-color: #ffe8e1 !important"
                  :color="getColor(item.statusName)"
                  outlined
                >
                  <span style="margin-left: 7px; color: #ff3c01">{{
                    item.statusName
                  }}</span>
                  <v-icon small style="margin-left: 7px; color: #ff3c01">
                    mdi-stamper
                  </v-icon>
                </v-chip>
                <v-chip
                  v-if="item.statusName == '停權'"
                  style="background-color: #ebebeb !important"
                  :color="getColor(item.statusName)"
                  outlined
                >
                  <span style="margin-left: 7px; color: #6b6b6b">{{
                    item.statusName
                  }}</span>
                  <v-icon small style="margin-left: 7px; color: #6b6b6b">
                    mdi-bell-alert
                  </v-icon>
                </v-chip>
              </template>
              <template v-slot:item.levelName="{ item }">
                <v-icon
                  v-if="item.levelName === '系統管理員'"
                  medium
                  style="color: red"
                  title="系統管理員"
                >
                  mdi-account-cog
                </v-icon>
                <v-icon
                  v-if="item.levelName === '專任助理'"
                  medium
                  style="color: green"
                  title="專任助理"
                >
                  mdi-account
                </v-icon>
                <v-icon
                  v-if="item.levelName === '管理員'"
                  medium
                  style="color: rgb(255, 0, 200)"
                  title="管理員"
                >
                  mdi-account-edit
                </v-icon>
                <v-icon
                  v-if="item.levelName === '業務人員'"
                  medium
                  style="color: green"
                  title="業務人員"
                >
                  mdi-account
                </v-icon>
              </template>
              <template v-slot:item.majorName="{ item }">
                <v-icon
                  v-if="item.majorName === '負責人'"
                  medium
                  style="color: blue"
                  title="負責人"
                >
                  mdi-account-star-outline
                </v-icon>
                <v-icon
                  v-if="item.majorName === '代理人'"
                  medium
                  style="color: black"
                  title="代理人"
                >
                  mdi-account-outline
                </v-icon>
                <v-icon
                  v-if="item.majorName === '兼奧匹負責人'"
                  medium
                  style="color: red"
                  title="兼奧匹負責人"
                >
                  mdi-account-outline
                </v-icon>
              </template>
              <template v-slot:item.mailingAddress="{ item }">
                <v-icon
                  medium
                  :title="item.mailingAddress"
                  @click="
                    snackMail = true;
                    copyMail = item.mailingAddress;
                  "
                >
                  mdi-email-fast
                </v-icon>
              </template>
              <template v-slot:item.actions="{ item }">
                <v-icon
                  title="編輯帳號資料"
                  class="mr-2"
                  @click="editItem(item)"
                >
                  mdi-text-box-edit-outline
                </v-icon>
                <v-icon
                  title="補發送密碼"
                  class="mr-2"
                  @click="sendForgetMail(item)"
                >
                  mdi-email-arrow-right-outline
                </v-icon>
              </template>
            </v-data-table>
          </v-container>
        </v-tabs-window-item></v-tabs-window
      >
    </v-card>
    <v-dialog v-model="alertPup" max-width="500px">
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
        <v-card-text style="font-size: 20px; font-weight: bold">
          {{ pupText }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            @click="cleanPupData"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" width="35%" persistent :retain-focus="false">
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
                <v-col
                  v-if="globalSystemValue.system === 'olympic'"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -22px"
                >
                  <div style="font-size: 16px; font-weight: bold">系統：</div>
                </v-col>
                <v-col
                  v-if="globalSystemValue.system === 'olympic'"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -20px"
                >
                  <v-radio-group
                    v-model="editedItem.system"
                    :rules="[(v) => !!v || '系統不能為空']"
                    inline
                    required
                  >
                    <v-radio
                      v-if="globalSystemValue.level === '1'"
                      :value="'olympic'"
                      @click="getUnitList('olympic')"
                    >
                      <template v-slot:label>
                        <span>olympic</span>
                      </template>
                    </v-radio>
                    <v-radio :value="'science'" @click="getUnitList('science')">
                      <template v-slot:label>
                        <span>science</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -40px">
                  單位
                  <v-select
                    v-model="editedItem.olympic"
                    :items="unitList"
                    :disabled="editedItem.major === '3'"
                    item-title="unit"
                    item-value="unitCode"
                    :rules="[(v) => !!v || '奧林匹亞不能為空']"
                    variant="underlined"
                    required
                    style="margin-top: -17px"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -27px">
                  <v-text-field
                    v-model="editedItem.name"
                    label="姓名"
                    :counter="18"
                    :rules="[
                      (v) => !!v || '姓名不能為空',
                      (v) => v.length <= 18 || '超過規定字數',
                    ]"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -27px">
                  <v-text-field
                    v-model="editedItem.email"
                    label="帳號"
                    :rules="emailRules"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -27px">
                  <v-text-field
                    v-model="editedItem.mailingAddress"
                    label="聯絡信箱"
                    :rules="mailingAddressRules"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -27px">
                  <v-text-field
                    v-model="editedItem.tel"
                    label="連絡電話"
                    :rules="[(v) => !!v || '連絡電話不能為空']"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -30px">
                  <div style="font-size: 16px; font-weight: bold">角色：</div>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -20px">
                  <v-radio-group
                    v-model="editedItem.level"
                    inline
                    :rules="[(v) => !!v || '角色不能為空']"
                    required
                  >
                    <v-radio
                      v-if="editedItem.system === 'olympic'"
                      :value="'1'"
                    >
                      <template v-slot:label>
                        <span>系統管理員</span>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="editedItem.system === 'olympic'"
                      :value="'2'"
                      @click="editedItem.major = '2'"
                    >
                      <template v-slot:label>
                        <span>專任助理</span>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="editedItem.system === 'science'"
                      :value="'3'"
                    >
                      <template v-slot:label>
                        <span>管理人</span>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="editedItem.system === 'science'"
                      :value="'4'"
                    >
                      <template v-slot:label>
                        <span>業務人員</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -30px">
                  <div style="font-size: 16px; font-weight: bold">權責：</div>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -20px">
                  <v-radio-group
                    v-model="editedItem.major"
                    inline
                    :rules="[(v) => !!v || '權責不能為空']"
                    required
                  >
                    <v-radio :value="'1'">
                      <template v-slot:label>
                        <span>負責人</span>
                      </template>
                    </v-radio>
                    <v-radio :value="'2'">
                      <template v-slot:label>
                        <span>代理人</span>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="globalSystemValue.system === 'olympic'"
                      :disabled="editedItem.level === '2'"
                      :value="'3'"
                    >
                      <template v-slot:label>
                        <span>兼任奧匹負責人</span>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="editedIndex != -1"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -30px"
                >
                  <div style="font-size: 16px; font-weight: bold">狀態：</div>
                </v-col>
                <v-col
                  v-if="editedIndex != -1"
                  cols="12"
                  sm="2"
                  md="12"
                  style="margin-top: -20px"
                >
                  <v-radio-group
                    :key="editedItem.uId"
                    v-model="editedItem.status"
                    inline
                    :rules="[(v) => !!v || '狀態不能為空']"
                    required
                  >
                    <v-radio
                      :value="'2'"
                      style="width: 25%"
                      @click="editedItem.sendMail = '2'"
                    >
                      <template v-slot:label>
                        <v-chip
                          style="background-color: #e3ffe5 !important"
                          color="#8CE38E"
                          outlined
                        >
                          <span style="color: #2bcd2b">啟用</span>
                          <v-icon
                            small
                            style="margin-left: 7px; color: #2bcd2b"
                          >
                            mdi-check
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-radio>
                    <v-radio :value="'3'" style="width: 25%">
                      <template v-slot:label>
                        <v-chip
                          style="background-color: #ebebeb !important"
                          color="#B2B5B7"
                          outlined
                        >
                          <span style="color: #6b6b6b">停權</span>
                          <v-icon
                            small
                            style="margin-left: 7px; color: #6b6b6b"
                          >
                            mdi-bell-alert
                          </v-icon>
                        </v-chip>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="editedItem.status === '3'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -22px"
                >
                  <div>是否寄送通知信：</div>
                </v-col>
                <v-col
                  v-if="editedItem.status === '3'"
                  cols="12"
                  sm="2"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-radio-group
                    :key="editedItem.uId"
                    v-model="editedItem.sendMail"
                    inline
                  >
                    <v-radio label="是" :value="'1'"></v-radio>
                    <v-radio label="否" :value="'2'"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="editedItem.sendMail === '1'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <div>停權通知信內容：</div>
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -17px"
                  v-if="editedItem.sendMail === '1'"
                >
                  <v-textarea
                    outlined
                    name="input-7-4"
                    label="請輸入信件內容"
                    v-model="editedItem.emailContent"
                  ></v-textarea>
                </v-col>
                <v-col
                  v-if="editedItem.sendMail === '1'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-btn
                    small
                    color="#635BFF"
                    dark
                    class="mb-2"
                    @click="sendStopAccount(editedItem)"
                  >
                    <v-icon small left> mdi-email-arrow-right-outline </v-icon>
                    <p style="font-size: 13px">寄送信件</p>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions style="margin-top: -50px">
            <v-spacer></v-spacer>
            <v-btn
              color=" darken-1"
              @click="close"
              style="font-weight: bold; font-size: 17px"
              >取消</v-btn
            >
            <v-btn
              color="blue darken-1"
              :disabled="!valid"
              @click="saveAccount"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
    <v-snackbar v-model="snackMail" :timeout="snackbarTimeout">
      聯絡信箱：{{ copyMail }}
      <v-btn
        color="red"
        variant="text"
        @click="copyText(copyMail)"
        style="margin-left: 15px"
      >
        複製
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import TableFilter from "./utilsComponets/tableFilter.vue";

export default {
  data: () => ({
    snackMail: false,
    snackbarTimeout: 5000,
    copyMail: "",
    alertPup: false,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    valid: true,
    dialog: false,
    loadShow: false,
    loadList: true,
    headers: [],
    tab: null,
    emailRules: [
      (v) => !!v || "帳號不能為空",
      (v) => /.+@.+/.test(v) || "帳號格式不對(email格式)",
    ],
    mailingAddressRules: [
      (v) => !!v || "聯絡信箱不能為空",
      (v) => /.+@.+/.test(v) || "聯絡信箱格式不對",
    ],
    unitList: [],
    desserts: [],
    dessertsTemp: [],
    editedIndex: -1,
    editedItem: {
      adId: "",
      olympic: "",
      name: "",
      email: "",
      tel: "",
      status: "",
      major: "",
      level: "",
      mailingAddress: "",
      system: "",
    },
    defaultItem: {
      adId: "",
      olympic: "",
      name: "",
      email: "",
      tel: "",
      status: "",
      major: "",
      level: "",
      mailingAddress: "",
    },
  }),

  components: {
    TableFilter,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增帳號" : "更新帳號資訊";
    },
  },

  watch: {
    dialog(val) {
      if (this.globalSystemValue.system === "science") {
        this.editedItem.system = "science";
      }
      val || this.close();
    },
  },

  methods: {
    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {});
    },

    updateTable(filterData) {
      this.desserts = filterData;
    },

    editItem(item) {
      this.getUnitList(item.system);
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.valid = true;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async saveAccount() {
      await this.tokenService.renewLT();

      let data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveAccount", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            data = response.data.resultData;
            data = this.changeData(data);
            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              this.desserts.unshift(data);
            }

            this.close();
          } else if (response.data.code === 408) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "負責人重複";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "每一個單位負責人只能有一位";
          } else if (response.data.code === 409) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "帳號重複";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "此帳號已有人使用";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async sendStopAccount(item) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.email = item.email;
      data.name = item.name;
      data.olympic = item.olympic;
      data.text = item.emailContent;
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/sentStopAccount", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您的信件已寄送完成！";
          } else if (response.data.code === 404) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送失敗";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "由於寄件系統過於忙碌，請稍後片刻再試！";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    changeData(data) {
      if (data.level === "1") {
        data.levelName = "系統管理員";
      }
      if (data.level === "2") {
        data.levelName = "專任助理";
      }
      if (data.level === "3") {
        data.levelName = "管理員";
      }
      if (data.level === "4") {
        data.levelName = "業務人員";
      }

      if (data.status === "2") {
        data.statusName = "啟用";
      }
      if (data.status === "3") {
        data.statusName = "停權";
      }
      if (data.status === "1") {
        data.statusName = "更新密碼中";
      }

      if (data.major === "1") {
        data.majorName = "負責人";
      }
      if (data.major === "2") {
        data.majorName = "代理人";
      }
      if (data.major === "3") {
        data.majorName = "兼奧匹負責人";
      }

      return data;
    },

    getColor(status) {
      if (status === "停權") return "#B2B5B7";
      else if (status === "認證") return "#EB7C7A";
      else return "#8CE38E";
    },

    async sendForgetMail(item) {
      await this.tokenService.renewLT();
      this.loadShow = true;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.adId = item.adId;
      data.name = item.name;
      data.email = item.email;
      data.olympic = item.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/sendForgetMail", data)
        .then((response) => {
          // console.log(response.data)
          this.loadShow = false;
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您的信件已寄送完成！";
          } else if (response.data.code === 404) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送失敗";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "由於寄件系統過於忙碌，請稍後片刻再試！";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    async getUnitList(system) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.globalSystemValue.level;
      data.system = system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getUnitList", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.unitList = response.data.resultData;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "帳號管理");
      return this.$store.state.title;
    },

    async getAccountList() {
      this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.globalSystemValue.level;
      data.system = this.globalSystemValue.system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getAccountList", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.loadList = false;
            this.desserts = response.data.resultData;
            const that = this;
            this.desserts.forEach(function (data) {
              data = that.changeData(data);
              data.emailContent = "";
              data.sendMail = "2";
            });
            this.dessertsTemp = this.desserts;
          } else if (response.data.code === 203) {
            location.href = "/manage";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async chagneAccountList(system) {
      this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.level = this.globalSystemValue.level;
      data.system = system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getAccountList", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.loadList = false;
            this.desserts = response.data.resultData;
            const that = this;
            this.desserts.forEach(function (data) {
              data = that.changeData(data);
              data.emailContent = "";
              data.sendMail = "2";
            });
            this.dessertsTemp = this.desserts;
          } else if (response.data.code === 203) {
            location.href = "/manage";
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
    if (
      this.globalSystemValue.level === "2" ||
      this.globalSystemValue.level === "4"
    ) {
      location.href = "/manage";
    }

    this.headers = [
      {
        title: "單位",
        value: "unit",
        filterName: "unit",
        type: "text",
        unit_M: "",
        unit_C: "",
        width: "13%",
      },
      {
        title: "狀態",
        value: "statusName",
        filterName: "statusName",
        type: "select",
        selectItem: ["啟用", "停權", "更新密碼中"],
        statusName_M: "",
        statusName_C: "",
        width: "7%",
      },
      {
        title: "姓名",
        value: "name",
        filterName: "name",
        type: "text",
        name_M: "",
        name_C: "",
        width: "10%",
      },
      {
        title: "角色",
        value: "levelName",
        filterName: "levelName",
        type: "text",
        levelName_M: "",
        levelName_C: "",
        width: "8%",
      },
      {
        title: "權責",
        value: "majorName",
        filterName: "majorName",
        type: "text",
        majorName_M: "",
        majorName_C: "",
        width: "8%",
      },
      {
        title: "聯絡信箱",
        value: "mailingAddress",
        filterName: "mailingAddress",
        type: "text",
        mailingAddress_M: "",
        mailingAddress_C: "",
        width: "11%",
      },
      {
        title: "帳號",
        value: "email",
        filterName: "email",
        type: "text",
        email_M: "",
        email_C: "",
        width: "5%",
      },
      {
        title: "連絡電話",
        value: "tel",
        filterName: "tel",
        type: "text",
        tel_M: "",
        tel_C: "",
        width: "10%",
      },
      // { text: '建立時間', value: 'createTime', filterName: 'createTime' },
      // { text: '修改時間', value: 'updateTime', filterName: 'updateTime' },
      { title: "功能", value: "actions", width: "10%" },
    ];

    await this.reloadTitle();
    await this.tokenService.renewLT();
    await this.getAccountList();

    if (this.globalSystemValue.system === "science") {
      await this.getUnitList("science");
    }
  },
};
</script>
