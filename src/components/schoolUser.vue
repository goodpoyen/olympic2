<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="desserts"
      :loading="loadList"
      multi-sort
      loading-text="資料處理中...."
      class="elevation-1"
      :items-per-page="50"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
    >
      <template
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
      </template>
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
          v-if="item.statusName == '待審核'"
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
        <v-chip
          v-if="item.statusName == '帳號已移除'"
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
      <template v-slot:item.signupStatusName="{ item }">
        <span v-if="item.signupStatusName == '報名完成'" title="報名完成">
          <v-icon medium style="color: blue"> mdi-check-circle-outline </v-icon>
        </span>
        <span v-if="item.signupStatusName == '報名失敗'" title="報名失敗">
          <v-icon medium style="color: red"> mdi-close-circle-outline </v-icon>
        </span>
        <span v-if="item.signupStatusName == '已了解'" title="已了解">
          <v-icon medium style="color: rgb(24, 216, 168)">
            mdi-eye-outline
          </v-icon>
        </span>
      </template>
      <template v-slot:item.title="{ item }">
        <v-icon
          medium
          :title="item.title"
          @click="
            snackMail = snackMail && item.uId === copyUId ? false : true;
            copyName = '頭銜';
            copyValue = item.title;
            copyUId = item.uId;
          "
          color="black"
        >
          mdi-subtitles-outline
        </v-icon>
      </template>
      <template v-slot:item.email="{ item }">
        <v-icon
          medium
          :title="item.email"
          @click="
            snackMail = snackMail && item.uId === copyUId ? false : true;
            copyName = '信箱';
            copyValue = item.email;
            copyUId = item.uId;
          "
          color="black"
        >
          mdi-email-outline
        </v-icon>
      </template>
      <template v-slot:item.signupKey="{ item }">
        <v-icon
          medium
          :title="item.signupKey"
          :disabled="item.status === '1' || item.status === '3'"
          @click="
            snackMail = snackMail && item.uId === copyUId ? false : true;
            copyName = '代碼';
            copyValue = item.signupKey;
            copyUId = item.uId;
          "
          color="black"
        >
          mdi-key
        </v-icon>
      </template>
      <template v-slot:item.updateTime="{ item }">
        <v-icon
          medium
          :disabled="item.status === '1' || item.status === '3'"
          :title="item.updateTime"
          @click="
            snackMail = snackMail && item.uId === copyUId ? false : true;
            copyName = '啟用時間';
            copyValue = item.updateTime;
            copyUId = item.uId;
          "
          style="color: rgb(24, 216, 168)"
        >
          mdi-stamper
        </v-icon>
      </template>
      <template v-slot:top>
        <v-toolbar flat style="margin-top: 10px">
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                small
                color="#635BFF"
                dark
                class="mb-2"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon small left> mdi-account-box-multiple </v-icon>
                <p style="font-size: 13px; margin-top: 16px">新增聯絡人</p>
              </v-btn>
            </template>
            <v-card>
              <v-card-title style="background-color: #0046fe; height: 57px">
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
                  style="
                    font-size: 18px !important;
                    font-weight: bold;
                    color: white;
                  "
                  >{{ formTitle }}</span
                >
              </v-card-title>
              <v-form ref="form" v-model="valid">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                        <div>學校：</div>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                        <v-select
                          :key="editedItem.uId"
                          v-model="editedItem.cityNumber"
                          :items="cityList"
                          item-text="city_name"
                          item-value="city_number"
                          label="城市"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                        <v-select
                          :key="editedItem.uId"
                          v-model="editedItem.areaNumber"
                          :items="areaList[editedItem.cityNumber]"
                          item-text="area_name"
                          item-value="area_number"
                          label="鄉鎮區"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                        <v-select
                          :key="editedItem.uId"
                          v-model="editedItem.schoolNumber"
                          :items="schoolList[editedItem.areaNumber]"
                          item-text="school_name"
                          item-value="school_number"
                          return-object
                          label="校名"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                        <v-text-field
                          :key="editedItem.uId"
                          v-model="editedItem.name"
                          label="姓名"
                          :counter="18"
                          :rules="[(v) => !!v || '姓名不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                        <v-text-field
                          :key="editedItem.uId"
                          v-model="editedItem.title"
                          label="頭銜"
                          :counter="20"
                          :rules="[(v) => !!v || '頭銜不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                        <v-text-field
                          :key="editedItem.uId"
                          v-model="editedItem.email"
                          label="信箱"
                          :rules="emailRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                        <v-text-field
                          :key="editedItem.uId"
                          v-model="editedItem.tel"
                          label="公務電話"
                          :rules="[(v) => !!v || '公務電話不能為空']"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                        <div>帳號狀態：</div>
                      </v-col>
                      <v-col cols="12" sm="2" md="12" style="margin-top: -31px">
                        <v-radio-group
                          :key="editedItem.uId"
                          v-model="editedItem.status"
                          row
                          required
                        >
                          <v-radio
                            :value="'2'"
                            style="width: 25%"
                            @click="editedItem.sendMail = '2'"
                          >
                            <template v-slot:label>
                              <v-chip
                                style="
                                  background-color: #e3ffe5 !important;
                                  width: 90%;
                                "
                                color="#8CE38E"
                                outlined
                              >
                                <span style="margin-left: 7px; color: #2bcd2b"
                                  >啟用</span
                                >
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
                                style="
                                  background-color: #ebebeb !important;
                                  width: 90%;
                                "
                                color="#B2B5B7"
                                outlined
                              >
                                <span style="margin-left: 7px; color: #6b6b6b"
                                  >停權</span
                                >
                                <v-icon
                                  small
                                  style="margin-left: 7px; color: #6b6b6b"
                                >
                                  mdi-bell-alert
                                </v-icon>
                              </v-chip>
                            </template>
                          </v-radio>
                          <v-radio
                            :value="'1'"
                            style="width: 25%"
                            @click="editedItem.sendMail = '2'"
                          >
                            <template v-slot:label>
                              <v-chip
                                style="
                                  background-color: #ffe8e1 !important;
                                  width: 90%;
                                "
                                color="#EB7C7A"
                                outlined
                              >
                                <span style="margin-left: 7px; color: #ff3c01"
                                  >待審核</span
                                >
                                <v-icon
                                  small
                                  style="margin-left: 7px; color: #ff3c01"
                                >
                                  mdi-stamper
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
                          row
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
                          v-model="editedItem.emailContent"
                          outlined
                          name="input-7-4"
                          label="請輸入信件內容"
                          :counter="500"
                          :rules="[(v) => v.length <= 500 || '超過規定字數']"
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
                          @click="sendMailCheckAlert(editedItem, 2)"
                        >
                          <v-icon small left>
                            mdi-email-arrow-right-outline
                          </v-icon>
                          <p style="font-size: 13px; margin-top: 16px">
                            寄送信件
                          </p>
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions style="margin-top: -50px">
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
                    @click="saveSchoolUser"
                    :disabled="!valid || editedItem.status === ''"
                    style="color: #2d5bff; font-weight: bold; font-size: 17px"
                    >儲存</v-btn
                  >
                </v-card-actions>
              </v-form>
              <v-overlay :value="loadShow">
                <v-progress-circular
                  :size="50"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
                <div>處理中....</div>
              </v-overlay>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title style="background-color: red; height: 57px">
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
                  style="
                    font-size: 18px !important;
                    font-weight: bold;
                    color: white;
                  "
                  >確定刪除此聯絡人資訊？</span
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
                  @click="removeSchoolUser"
                  :disabled="!valid"
                  style="color: #2d5bff; font-weight: bold; font-size: 17px"
                  >刪除</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-spacer></v-spacer>
          <div
            v-if="globalSystemValue.olympic !== 'TOIREG'"
            style="margin-top: 8px; margin-right: 30px; max-width: 20%"
          >
            <v-select
              v-model="selectOlyId"
              label="篩選選拔活動"
              :items="scheduleList"
              item-text="signupName"
              item-value="olyId"
              @change="selectSchebuleList('change')"
            >
            </v-select>
          </div>
          <v-btn
            class="ma-2"
            small
            outlined
            color="indigo"
            style="font-weight: bold"
            @click="downloadPup = true"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px; margin-top: 16px">匯出</p>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          :disabled="item.title === '專任助理'"
          title="編輯聯絡人"
          class="mr-2"
          @click="editItem(item)"
        >
          mdi-text-box-edit-outline
        </v-icon>
        <v-icon
          v-if="selectOlyId !== 0"
          :disabled="item.signupKey === '新增資料'"
          title="報名信件內容"
          class="mr-2"
          @click="getSignupMailContact(item)"
        >
          mdi-email-search-outline
        </v-icon>
        <v-btn
          v-if="selectOlyId !== 0 && item.signupStatusName === '報名失敗'"
          class="ma-2"
          color="blue"
          :disabled="item.signupKey === '新增資料'"
          title="已了解"
          @click="isRead(item)"
          dark
          x-small
        >
          <v-icon dark small> mdi-check-all </v-icon>
        </v-btn>
        <!-- <v-icon
          v-if="defaultOlympic !== 'TOIREG'"
          title="補發送聯絡人金鑰"
          class="mr-2"
          :disabled="item.status === '1' || item.status === '3' ? true : false"
          @click="sendMailCheckAlert(item, 1)"
        >
          mdi-email-arrow-right-outline
        </v-icon> -->
        <!-- <v-icon title="刪除聯絡人" class="mr-2" @click="deleteItem(item)">
          mdi-trash-can-outline
        </v-icon> -->
      </template>
    </v-data-table>
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
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          {{ pupText }}
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
    <v-dialog v-model="sendMailpup" max-width="500px">
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
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
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
            v-if="sendMailtype === 1"
            left
            color="blue darken-1"
            text
            @click="sendKeyMail()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >

          <v-btn
            v-if="sendMailtype === 2"
            left
            color="blue darken-1"
            text
            @click="sentStopSchoolUser"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="downloadPup" width="24%">
      <v-card>
        <v-card-title
          dark
          class="text-h5 grey lighten-2 white--text"
          style="background-color: #0046fe !important"
        >
          <v-icon large class="mr-2 white--text" style="font-size: 24px">
            mdi-tray-arrow-down
          </v-icon>
          <div
            v-if="filetype === 'mailAll'"
            style="font-size: 18px; font-weight: bold"
          >
            下載類型選擇
          </div>
          <div v-else style="font-size: 18px; font-weight: bold">下載選擇</div>
        </v-card-title>

        <v-card-text
          style="
            margin-top: -6%;
            font-size: 18px;
            font-weight: bold;
            color: #2d5bff;
          "
        >
        </v-card-text>
        <v-checkbox
          v-model="downloadTyepSelected"
          label="聯絡人通訊錄"
          value="schoolUsers"
          style="
            margin-left: 6.2%;
            font-size: 18px;
            font-weight: bold;
            color: black;
          "
        ></v-checkbox>
        <v-checkbox
          v-if="selectOlyId !== 0"
          v-model="downloadTyepSelected"
          label="學校報名統計"
          value="schoolSignup"
          style="
            margin-top: -5px;
            margin-left: 6.2%;
            font-size: 18px;
            font-weight: bold;
            color: black;
          "
        ></v-checkbox>

        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="downloadPup = false"
          >
            取消
          </v-btn>
          <v-btn
            v-if="
              downloadTyepSelected === 'schoolUsers' ||
              downloadTyepSelected === ''
            "
            :disabled="downloadTyepSelected === ''"
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="downloadSchoolUsersFile()"
          >
            確定</v-btn
          >
          <v-btn
            v-if="downloadTyepSelected === 'schoolSignup'"
            :disabled="downloadTyepSelected === ''"
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="downloadSchoolSignupFile()"
          >
            確定</v-btn
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
    </v-dialog>
    <v-dialog v-model="mailContactPup" width="35%">
      <v-card>
        <v-card-title
          dark
          class="text-h6 grey lighten-2 white--text"
          style="font-weight: bold; background-color: #0046fe !important"
        >
          <v-icon large class="mr-2 white--text" style="font-size: 24px">
            mdi-book-open-blank-variant
          </v-icon>
          <span v-if="mailStatus === 1">信件內容-報名完成</span>
          <span v-if="mailStatus === 2">信件內容-報名失敗</span>
          <span v-if="mailStatus === 3">信件內容-報名失敗(已了解)</span>
        </v-card-title>

        <v-card-text
          v-if="mailStatus === 1"
          style="
            font-weight: bold;
            font-size: 17px;
            color: blue;
            margin-top: 3%;
          "
          v-html="mailContact"
        >
        </v-card-text>
        <v-card-text
          v-if="mailStatus === 2 || mailStatus === 3"
          style="font-weight: bold; font-size: 17px; color: red; margin-top: 3%"
          v-html="mailContact"
        >
        </v-card-text>

        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="mailContactPup = false"
          >
            關閉
          </v-btn>
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
    </v-dialog>
    <v-overlay :value="loadFile">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div>處理中....</div>
    </v-overlay>
    <v-snackbar v-model="snackMail" :timeout="snackbarTimeout">
      {{ copyName }}：{{ copyValue }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text @click="copyText(copyValue)" v-bind="attrs">
          複製
        </v-btn>
        <v-btn color="blue" text @click="snackMail = false" v-bind="attrs">
          關閉
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import TableFilter from "./utilsComponets/tableFilter.vue";

export default {
  data: () => ({
    snackMail: false,
    snackbarTimeout: 10000,
    copyValue: "",
    copyName: "",
    copyUId: 0,
    alertPup: false,
    sendMailpup: false,
    downloadPup: false,
    mailContactPup: false,
    mailContact: "",
    mailStatus: 0,
    downloadTyepSelected: "",
    sendMailtype: 0,
    selectOlyId: 0,
    tempItem: {},
    filetype: "",
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    cityList: [],
    areaList: [],
    schoolList: [],
    statusName: "",
    valid: true,
    levelStatus: true,
    dialog: false,
    dialogDelete: false,
    loadShow: false,
    loadList: true,
    loadFile: false,
    headers: [],
    scheduleList: {},
    emailRules: [
      (v) => !!v || "帳號(信箱)不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v
        ) || "帳號(信箱)格式不對",
    ],
    desserts: [],
    dessertsTemp: [],
    editedIndex: -1,
    editedItem: {
      olympic: "",
      areaNumber: "",
      cityNumber: "",
      email: "",
      emailContent: "",
      lastTime: "",
      name: "",
      schoolName: "",
      schoolNameAll: "",
      schoolNumber: "",
      status: "",
      statusName: "",
      suoId: "",
      tel: "",
      title: "",
      uId: "",
      sendMail: "2",
      signupKey: "",
    },
    defaultItem: {
      olympic: "",
      areaNumber: "",
      cityNumber: "",
      email: "",
      emailContent: "",
      lastTime: "",
      name: "",
      schoolName: "",
      schoolNameAll: "",
      schoolNumber: "",
      status: "",
      statusName: "",
      suoId: "",
      tel: "",
      title: "",
      uId: "",
      sendMail: "2",
      signupKey: "",
    },
  }),

  components: {
    TableFilter,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增聯絡人" : "更改聯絡人資訊";
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
    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {});
    },

    async getSchoolAddressList() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSchoolAddressList", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cityList = response.data.resultData.cityList;
            this.areaList = response.data.resultData.areaList;
            this.schoolList = response.data.resultData.schoolList;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadSchoolUsersFile() {
      await this.tokenService.renewLT();
      this.loadShow = true;
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.selectOlyId;
      data.olympic = this.globalSystemValue.olympic;
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        "聯絡人資訊" +
        this.globalSystemTool.getNowDataTimeByString();
      await this.axios
        .post(this.systemENV.APISERVERURL + "/loadSchoolUsersFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
          this.downloadPup = false;
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadSchoolSignupFile() {
      await this.tokenService.renewLT();
      this.loadShow = true;
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.selectOlyId;
      data.olympic = this.globalSystemValue.olympic;
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        "學校報名統計" +
        this.globalSystemTool.getNowDataTimeByString();
      await this.axios
        .post(this.systemENV.APISERVERURL + "/downloadSchoolSignupFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          this.loadShow = false;
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
          this.downloadPup = false;
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    updateTable(filterData) {
      this.desserts = filterData;
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "聯絡人管理");
      return this.$store.state.title;
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    editItem(item) {
      item.schoolNumber = item.schoolNumber + "_" + item.schoolType;

      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    readItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
    },

    sendMailCheckAlert(item, type) {
      this.sendMailtype = type;

      if (type === 2) {
        if (item.emailContent.length > 500) {
          this.tempItem = item;
          alert("您輸入的字數超過500個字");
          return false;
        }
      }

      this.cleanPupData();
      this.sendMailpup = true;
      this.pupTitle = "確認要發送信件";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您確定要發送信件？";

      this.tempItem = item;
    },

    async sendKeyMail() {
      await this.tokenService.renewLT();

      this.sendMailpup = false;
      this.cleanPupData();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.suoId = this.tempItem.suoId;
      data.email = this.tempItem.email;
      data.suId = this.tempItem.uId;
      data.name = this.tempItem.name;
      data.title = this.tempItem.title;
      data.olympic = this.globalSystemValue.olympic;
      data.schoolNumber = this.tempItem.schoolNumber;
      this.loadFile = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/sentSignupKey", data)
        .then((response) => {
          this.loadFile = false;
          this.sendMailtype = 0;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您的信件已寄送完成！";
            this.tempItem.signupKey = response.data.signupKey;
            Object.assign(this.desserts[this.editedIndex], this.tempItem);
            this.tempItem = {};
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

    async sentStopSchoolUser() {
      this.sendMailpup = false;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.name = this.tempItem.name;
      data.email = this.tempItem.email;
      data.olympic = this.globalSystemValue.olympic;
      data.title = this.tempItem.title;
      data.text = this.tempItem.emailContent;
      this.tempItem = {};
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/sentStopSchoolUser", data)
        .then((response) => {
          this.loadShow = false;
          this.sendMailtype = 0;
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

    async removeSchoolUser() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.editedItem.olyId;
      data.uId = this.editedItem.uId;
      data.suoId = this.editedItem.suoId;
      data.olympic = this.globalSystemValue.olympic;
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/removeSchoolUser", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
          } else if (response.data.code === 403) {
            alert("操作有誤請重新確認");
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSignupMailContact(item) {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.selectOlyId;
      data.uId = parseInt(item.uId);
      data.olympic = this.globalSystemValue.olympic;

      this.loadShow = true;
      this.mailStatus = 0;
      this.mailContact = "";
      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSignupMailContact", data)
        .then((response) => {
          this.loadShow = false;
          this.mailContactPup = true;
          console.log(response.data);
          if (response.data.code === 200) {
            this.mailStatus = response.data.resultData.status;
            this.mailContact = response.data.resultData.errorMsg;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
          this.mailStatus = 0;
          this.mailContact = "";
        });
    },

    close() {
      if (this.editedIndex !== -1) {
        this.desserts[this.editedIndex].schoolNumber = this.desserts[
          this.editedIndex
        ].schoolNumber
          .replace("_e", "")
          .replace("_j", "")
          .replace("_s", "")
          .replace("_c", "")
          .replace("_jc", "")
          .replace("_I", "");
      }
      this.$refs.form.reset();
      this.dialog = false;
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

    async saveSchoolUser() {
      await this.tokenService.renewLT();

      this.editedItem.olympic = this.globalSystemValue.olympic;

      let data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      this.loadShow = true;
      if (typeof data.schoolNumber === "object") {
        data.schoolName = data.schoolNumber.school_name;
        data.schoolNameAll = data.schoolNumber.school_name;
        data.schoolNumber = data.schoolNumber.school_number;
      }

      data.schoolNumber = data.schoolNumber
        .replace("_e", "")
        .replace("_j", "")
        .replace("_s", "")
        .replace("_c", "")
        .replace("_jc", "")
        .replace("_I", "");

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveSchoolUser", data)
        .then((response) => {
          this.loadShow = false;
          this.close();
          // console.log(response.data);
          if (response.data.code === 200) {
            data.uId = response.data.resultData.uId;
            data.suoId = response.data.resultData.suoId;
            data.signupKey = response.data.resultData.signupKey;
            data.schoolType = response.data.resultData.schoolType;
            data = this.changeData(data);
            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              this.desserts.unshift(data);
            }
            if (response.data.resultData.sendStatus) {
              this.sendSignupKey(data.uId);
            }
          } else if (response.data.code === 403) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "寄送失敗";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "信箱已存在，請再次確認！";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          this.loadShow = false;
          this.close();
          alert("系統忙碌中，請再重新操作一次！");
          // console.log(error);
        });
    },

    async isRead(item) {
      this.desserts.indexOf(item);
      this.readItem(item);
      item.signupStatusName = "已了解";
      Object.assign(this.desserts[this.editedIndex], item);

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.selectOlyId;
      data.uId = item.uId;

      await this.axios.post(this.systemENV.APISERVERURL + "/setIsRead", data);
    },

    async sendSignupKey(uId) {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.uId = uId;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/sendSignupKey", data)
        .then((response) => {
          // console.log(response.data);
        });
    },

    changeData(data) {
      if (data.status === "1") {
        data.statusName = "待審核";
      }
      if (data.status === "2") {
        data.statusName = "啟用";
      }
      if (data.status === "3") {
        data.statusName = "停權";
      }
      if (data.status === "4") {
        data.statusName = "帳號已移除";
      }

      if (data.signupStatus === 1) {
        data.signupStatusName = "報名完成";
      }
      if (data.signupStatus === 2) {
        data.signupStatusName = "報名失敗";
      }
      if (data.signupStatus === 3) {
        data.signupStatusName = "已了解";
      }

      if (data.signupStatus === "報名完成") {
        data.signupStatusName = "報名完成";
      }

      return data;
    },

    getColor(status) {
      if (status === "啟用") return "#8CE38E";
      else if (status === "待審核") return "#EB7C7A";
      else return "#B2B5B7";
    },

    async getSchoolUsers() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSchoolUsers", data)
        .then((response) => {
          this.loadList = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            const that = this;
            this.desserts.forEach(function (data) {
              data = that.changeData(data);
              data.emailContent = "";
              data.sendMail = "2";
              if (data.lastTime !== undefined) {
                data.lastTime = data.lastTime.toString();
              } else {
                data.lastTime = "";
              }
            });
            this.dessertsTemp = this.desserts;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async selectSchebuleList(type) {
      this.loadFile = true;
      if (type !== "change") {
        if (this.$route.query.olyId !== undefined) {
          this.selectOlyId = parseInt(this.$route.query.olyId);
        } else {
          this.loadFile = false;
          return false;
        }
      }

      await this.tokenService.renewLT();
      this.loadList = true;
      this.headers = [];
      this.desserts = [];
      this.dessertsTemp = [];

      if (this.selectOlyId === 0) {
        this.headers = [
          {
            text: "帳號狀態",
            value: "statusName",
            filterName: "statusName",
            type: "select",
            selectItem: ["啟用", "待審核", "停權"],
            statusName_M: "",
            statusName_C: "",
          },
          {
            text: "學校代碼",
            value: "schoolNumber",
            filterName: "schoolNumber",
            type: "text",
            schoolNumber_M: "",
            schoolNumber_C: "",
          },
          {
            text: "學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            schoolNameAll_M: "",
            schoolNameAll_C: "",
            width: "10%",
          },
          {
            text: "姓名",
            value: "name",
            filterName: "name",
            type: "text",
            name_M: "",
            name_C: "",
            width: "8%",
          },
          {
            text: "頭銜",
            value: "title",
            filterName: "title",
            type: "text",
            title_M: "",
            title_C: "",
            width: "",
          },
          {
            text: "信箱",
            value: "email",
            filterName: "email",
            type: "text",
            email_M: "",
            email_C: "",
          },
          {
            text: "公務電話",
            value: "tel",
            filterName: "tel",
            type: "text",
            tel_M: "",
            tel_C: "",
          },
          {
            text: "代碼",
            value: "signupKey",
            filterName: "signupKey",
            type: "text",
            signupKey_M: "",
            signupKey_C: "",
            width: "2%",
          },
          {
            text: "報名年份",
            value: "lastTime",
            filterName: "lastTime",
            type: "text",
            lastTime_M: "",
            lastTime_C: "",
            width: "3%",
          },
          {
            text: "審核時間",
            value: "updateTime",
            filterName: "updateTime",
            type: "text",
            updateTime_M: "",
            updateTime_C: "",
            width: "3%",
          },
          { text: "功能", value: "actions", width: "10%" },
        ];
        this.getSchoolUsers();
      } else {
        this.headers = [
          {
            text: "帳號狀態",
            value: "statusName",
            filterName: "statusName",
            type: "select",
            selectItem: ["啟用", "待審核", "停權"],
            statusName_M: "",
            statusName_C: "",
          },
          {
            text: "報名狀態",
            value: "signupStatusName",
            filterName: "signupStatusName",
          },
          {
            text: "學校代碼",
            value: "schoolNumber",
            filterName: "schoolNumber",
            type: "text",
            schoolNumber_M: "",
            schoolNumber_C: "",
          },
          {
            text: "學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            schoolNameAll_M: "",
            schoolNameAll_C: "",
            width: "20%",
          },
          {
            text: "姓名",
            value: "name",
            filterName: "name",
            type: "text",
            name_M: "",
            name_C: "",
            width: "10%",
          },
          {
            text: "頭銜",
            value: "title",
            filterName: "title",
            type: "text",
            title_M: "",
            title_C: "",
            width: "",
          },
          {
            text: "信箱",
            value: "email",
            filterName: "email",
            type: "text",
            email_M: "",
            email_C: "",
          },
          {
            text: "公務電話",
            value: "tel",
            filterName: "tel",
            type: "text",
            tel_M: "",
            tel_C: "",
          },
          {
            text: "代碼",
            value: "signupKey",
            filterName: "signupKey",
            type: "text",
            signupKey_M: "",
            signupKey_C: "",
            width: "2%",
          },
          {
            text: "已報名人數",
            value: "signupTotal",
            filterName: "signupTotal",
            type: "text",
            signupTotal_M: "",
            signupTotal_C: "",
          },
          { text: "功能", value: "actions", width: "13%" },
        ];

        const data = {};
        data.AT = await this.tokenService.getFastAT();
        data.olympic = this.globalSystemValue.olympic;
        data.olyId = this.selectOlyId;

        await this.axios
          .post(this.systemENV.APISERVERURL + "/selectSchebuleList", data)
          .then((response) => {
            this.loadList = false;
            // console.log(response.data);
            if (response.data.code === 200) {
              this.desserts = response.data.resultData;
              const that = this;
              this.desserts.forEach(function (data) {
                data = that.changeData(data);
                data.emailContent = "";
                data.sendMail = "2";
                if (data.lastTime !== undefined) {
                  data.lastTime = data.lastTime.toString();
                } else {
                  data.lastTime = "";
                }
              });
              this.dessertsTemp = this.desserts;
            } else {
              this.globalSystemTool.removeLocalStorage();
            }
          })
          .catch(function (error) {
            // console.log(error);
          });
      }
      this.loadFile = false;
    },

    async getUsersSchedule() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getUsersSchedule", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.scheduleList = response.data.resultData;

            const allSchedule = {};

            allSchedule.olyId = 0;

            allSchedule.signupName = "全部";

            this.scheduleList.unshift(allSchedule);
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
      this.headers = [
        {
          text: "帳號狀態",
          value: "statusName",
          filterName: "statusName",
          type: "select",
          selectItem: ["啟用", "待審核", "停權"],
          statusName_M: "",
          statusName_C: "",
        },
        {
          text: "學校代碼",
          value: "schoolNumber",
          filterName: "schoolNumber",
          type: "text",
          schoolNumber_M: "",
          schoolNumber_C: "",
        },
        {
          text: "學校",
          value: "schoolNameAll",
          filterName: "schoolNameAll",
          type: "text",
          schoolNameAll_M: "",
          schoolNameAll_C: "",
          width: "20%",
        },
        {
          text: "姓名",
          value: "name",
          filterName: "name",
          type: "text",
          name_M: "",
          name_C: "",
          width: "8%",
        },
        {
          text: "頭銜",
          value: "title",
          filterName: "title",
          type: "text",
          title_M: "",
          title_C: "",
          width: "8%",
        },
        {
          text: "信箱",
          value: "email",
          filterName: "email",
          type: "text",
          email_M: "",
          email_C: "",
          width: "8%",
        },
        {
          text: "公務電話",
          value: "tel",
          filterName: "tel",
          type: "text",
          tel_M: "",
          tel_C: "",
        },
        {
          text: "代碼",
          value: "signupKey",
          filterName: "signupKey",
          type: "text",
          signupKey_M: "",
          signupKey_C: "",
          width: "8%",
        },
        {
          text: "報名年份",
          value: "lastTime",
          filterName: "lastTime",
          type: "text",
          lastTime_M: "",
          lastTime_C: "",
          width: "8%",
        },
        {
          text: "審核時間",
          value: "updateTime",
          filterName: "updateTime",
          type: "text",
          updateTime_M: "",
          updateTime_C: "",
          width: "8%",
        },
        { text: "功能", value: "actions", width: "10%" },
      ];
    } else {
      if (this.globalSystemValue.olympic === "TOIREG") {
        this.headers = [
          {
            text: "帳號狀態",
            value: "statusName",
            filterName: "statusName",
            type: "select",
            selectItem: ["啟用", "待審核", "停權"],
            statusName_M: "",
            statusName_C: "",
          },
          {
            text: "學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            schoolNameAll_M: "",
            schoolNameAll_C: "",
            width: "20%",
          },
          {
            text: "姓名",
            value: "name",
            filterName: "name",
            type: "text",
            name_M: "",
            name_C: "",
            width: "8%",
          },
          {
            text: "頭銜",
            value: "title",
            filterName: "title",
            type: "text",
            title_M: "",
            title_C: "",
            width: "8%",
          },
          {
            text: "信箱",
            value: "email",
            filterName: "email",
            type: "text",
            email_M: "",
            email_C: "",
            width: "8%",
          },
          {
            text: "公務電話",
            value: "tel",
            filterName: "tel",
            type: "text",
            tel_M: "",
            tel_C: "",
          },
          {
            text: "老師代碼",
            value: "signupKey",
            filterName: "signupKey",
            type: "text",
            signupKey_M: "",
            signupKey_C: "",
          },
          {
            text: "報名年份",
            value: "lastTime",
            filterName: "lastTime",
            type: "text",
            lastTime_M: "",
            lastTime_C: "",
            width: "5%",
          },
          { text: "功能", value: "actions", width: "10%" },
        ];
      } else {
        this.headers = [
          {
            text: "帳號狀態",
            value: "statusName",
            filterName: "statusName",
            type: "select",
            selectItem: ["啟用", "待審核", "停權"],
            statusName_M: "",
            statusName_C: "",
          },
          {
            text: "學校代碼",
            value: "schoolNumber",
            filterName: "schoolNumber",
            type: "text",
            schoolNumber_M: "",
            schoolNumber_C: "",
          },
          {
            text: "學校",
            value: "schoolNameAll",
            filterName: "schoolNameAll",
            type: "text",
            schoolNameAll_M: "",
            schoolNameAll_C: "",
            width: "20%",
          },
          {
            text: "姓名",
            value: "name",
            filterName: "name",
            type: "text",
            name_M: "",
            name_C: "",
            width: "8%",
          },
          {
            text: "頭銜",
            value: "title",
            filterName: "title",
            type: "text",
            title_M: "",
            title_C: "",
            width: "8%",
          },
          {
            text: "信箱",
            value: "email",
            filterName: "email",
            type: "text",
            email_M: "",
            email_C: "",
            width: "8%",
          },
          {
            text: "公務電話",
            value: "tel",
            filterName: "tel",
            type: "text",
            tel_M: "",
            tel_C: "",
          },
          {
            text: "金鑰代碼",
            value: "signupKey",
            filterName: "signupKey",
            type: "text",
            signupKey_M: "",
            signupKey_C: "",
            width: "2%",
          },
          {
            text: "報名年份",
            value: "lastTime",
            filterName: "lastTime",
            type: "text",
            lastTime_M: "",
            lastTime_C: "",
            width: "5%",
          },
          {
            text: "審核時間",
            value: "updateTime",
            filterName: "updateTime",
            type: "text",
            updateTime_M: "",
            updateTime_C: "",
            width: "5%",
          },
          { text: "功能", value: "actions", width: "15%" },
        ];
      }
    }

    await this.tokenService.renewLT();
    if (this.$route.query.olyId !== undefined) {
      await this.selectSchebuleList();
    } else {
      await this.getSchoolUsers();
      await this.getSchoolAddressList();
    }

    await this.getUsersSchedule();
  },
};
</script>
