<template>
  <div>
    <v-toolbar dark class="pa-0" style="background-color: #2f365f">
      <v-toolbar-title
        v-if="menuType !== 6"
        :style="{
          margin: '10px 37%',
          fontWeight: 'bold',
          fontSize: titleFontSize,
          color: 'white',
        }"
        >高級中等學校科學班報名資料修改</v-toolbar-title
      >
      <v-toolbar-title
        v-else
        :style="{
          margin: '10px 37%',
          fontWeight: 'bold',
          fontSize: titleFontSize,
          color: 'white',
        }"
        >高級中等學校科學班實驗實作繳費</v-toolbar-title
      >
    </v-toolbar>

    <v-card
      v-if="show"
      class="mx-auto"
      :max-width="device === 'PC' ? '55%' : '100%'"
      style="margin: 10px; margin-top: 3%"
    >
      <v-btn
        v-for="(item, index) in desserts"
        :key="index"
        class="ma-2"
        regular
        style="font-weight: bold"
        :color="item.buttonChoose ? '#ddd8d8' : 'white'"
        @click="changeSchool(item.signupSchool, item.signupSchoolName)"
      >
        {{ item.signupSchoolName }}
      </v-btn>

      <v-card-text>
        <v-card
          v-if="selectedSchool.scheduleType !== 6"
          style="margin-top: 20px"
        >
          <v-card-title style="background-color: #ededf3; height: 50px">
            <v-icon style="margin-top: -2px"> mdi-face-man </v-icon>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 8px;
              "
              >修改甄選學生基本資料</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <v-form ref="form" v-model="valid">
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                      <v-text-field
                        v-model="selectedSchool.name"
                        label="學生姓名"
                        :counter="18"
                        variant="underlined"
                        :rules="[
                          (v) => !!v || '學生姓名不能為空',
                          (v) => v.length <= 18 || '超過規定字數',
                        ]"
                        required
                        :disabled="lock"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="2" md="6" style="margin-top: -31px">
                      <!-- <v-text-field
                        v-model="selectedSchool.birthday"
                        label="出生年月(民國/月)"
                        prepend-icon="mdi-calendar"
                        readonly
                        @click="birthdayPicker = true"
                        variant="underlined"
                        :rules="[(v) => !!v || '出生年月不能為空']"
                        required
                        :disabled="lock"
                      ></v-text-field>
                      <v-dialog v-model="birthdayPicker" width="290px">
                        <v-date-picker
                          v-model="birthdyPickerValue"
                          type="month"
                          scrollable
                          locale="zh-cn"
                        >
                          <v-spacer></v-spacer>
                          <v-btn
                            text
                            color="primary"
                            @click="birthdayPicker = false"
                          >
                            取消
                          </v-btn>
                          <v-btn
                            text
                            color="primary"
                            @click="inputBirthdayValue()"
                          >
                            確認
                          </v-btn>
                        </v-date-picker>
                      </v-dialog> -->
                    </v-col>
                    <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                      <v-text-field
                        v-if="idCardEditor"
                        v-model="selectedSchool.idCard"
                        label="身分證統一編號"
                        :rules="idCartRulesMask"
                        variant="underlined"
                        required
                        :disabled="idCardEditor"
                      ></v-text-field>
                      <v-text-field
                        v-if="!idCardEditor"
                        v-model="selectedSchool.idCard"
                        label="身分證統一編號"
                        :rules="idCartRules"
                        variant="underlined"
                        required
                        :disabled="idCardEditor"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                      <v-btn
                        v-if="idCardEditor"
                        color="darken-1"
                        small
                        style="
                          margin: 10px auto;
                          font-weight: bold;
                          font-size: 14px;
                        "
                        variant="tonal"
                        :disabled="lock"
                        @click="
                          idCardEditor = false;
                          selectedSchool.idCard = '';
                          verificationIdCard(selectedSchool.idCard);
                        "
                        >修改身分證</v-btn
                      >
                    </v-col>
                    <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                      <div>就讀國中：</div>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" style="margin-top: -20px">
                      <v-select
                        v-model="selectedSchool.cityNumber"
                        :items="cityList"
                        item-title="city_name"
                        item-value="city_number"
                        label="城市"
                        variant="underlined"
                        :rules="[(v) => !!v || '城市不能為空']"
                        required
                        :disabled="lock"
                        @click="
                          selectedSchool.institution = '';
                          selectedSchool.schoolNumber = '';
                        "
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" style="margin-top: -20px">
                      <v-select
                        v-model="selectedSchool.institution"
                        :items="institution"
                        item-title="state"
                        item-value="value"
                        label="公/私立"
                        variant="underlined"
                        :rules="[(v) => !!v || '公/私立不能為空']"
                        required
                        :disabled="lock"
                        @click="selectedSchool.schoolNumber = ''"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="4" style="margin-top: -20px">
                      <v-select
                        v-model="selectedSchool.schoolNumber"
                        :items="
                          selectStatus
                            ? schoolList[selectedSchool.cityNumber][
                                selectedSchool.institution
                              ]
                            : []
                        "
                        item-title="school_name"
                        item-value="school_number"
                        label="校名"
                        variant="underlined"
                        :rules="[(v) => !!v || '校名不能為空']"
                        required
                        :disabled="lock"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                      <v-text-field
                        v-if="!parentsEditor"
                        v-model="selectedSchool.parentsName"
                        label="緊急聯絡人姓名"
                        :counter="18"
                        variant="underlined"
                        :rules="parentsNameRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                      <v-text-field
                        v-if="!parentsEditor"
                        v-model="selectedSchool.parentsPhone"
                        label="緊急聯絡人手機"
                        :counter="20"
                        variant="underlined"
                        :rules="parentsNumberRules"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" style="margin-top: -20px">
                      <div
                        v-if="!parentsEditor"
                        class="v-messages theme--light error--text"
                        style="margin-bottom: 1%"
                      >
                        <div class="v-messages__wrapper">
                          <div
                            class="v-messages__message"
                            style="
                              font-size: 13px;
                              font-weight: bold;
                              color: rgb(61, 170, 61);
                            "
                          >
                            緊急聯絡人資料僅供學校緊急聯絡，非報名資料一部分。等同
                            「紙本收集」，以 Email 代替紙本，非系統收集。
                          </div>
                        </div>
                      </div>
                      <div
                        class="v-messages theme--light error--text"
                        style="margin-top: -14px"
                      >
                        <div class="v-messages__wrapper">
                          <div class="v-messages__message">
                            <v-checkbox
                              v-model="checkBoxStatus"
                              :disabled="lock"
                              @click="
                                parentsEditor = parentsEditor ? false : true
                              "
                              ><template v-slot:label>
                                <div
                                  :style="{
                                    fontSize: '14px',
                                    fontWeight: lock ? '' : 'bold',
                                    color: lock ? '#757575' : 'blue',
                                  }"
                                >
                                  需打勾才能修改緊急聯絡人資訊。
                                </div>
                              </template>
                            </v-checkbox>
                          </div>
                        </div>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="lock && !lockEditor"
              color="blue darken-1"
              variant="flat"
              @click="
                editorAction();
                reviewLock = true;
              "
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              >編輯</v-btn
            >
            <v-btn
              v-if="!lock"
              color="blue darken-1"
              @click="saveScinceInfoByEditor('info')"
              variant="flat"
              style="
                margin: 10px auto;
                font-weight: bold;
                font-size: 17px;
                color: white;
              "
              :disabled="!valid"
              >儲存</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card style="margin-top: 20px">
          <v-card-title style="background-color: #ededf3; height: 50px">
            <v-icon style="margin-top: -2px"> mdi-currency-usd </v-icon>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 8px;
              "
              >繳費身分</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <div
              v-if="selectedSchool.payStatus === '1'"
              style="font-size: 15px; font-weight: bold"
            >
              一般生
              <v-divider class="my-2"></v-divider>
              <div>繳款人：{{ selectedSchool.name }}</div>
              <div>繳費序號：{{ selectedSchool.paymentNumber }}</div>
              <div>付款金額： {{ price }} 元</div>
              <div>付款方式：{{ selectedSchool.paymentType }}</div>
              <div>付款狀態：{{ selectedSchool.paymentStatusName }}</div>
              <div
                v-if="
                  selectedSchool.payStatus === '1' &&
                  selectedSchool.paymentType.includes('預選')
                "
                style="
                  font-size: 13px;
                  font-weight: bold;
                  color: rgb(61, 170, 61);
                "
              >
                尚未繳費，於實際登入金流仍可修改繳費方式，系統則以實際登入金流所選繳費方式擷取繳費資訊
              </div>
              <div></div>
            </div>
            <div
              v-if="selectedSchool.payStatus === '2'"
              style="font-size: 15px; font-weight: bold"
            >
              <v-row>
                <v-col cols="12" sm="6" md="6">免繳費</v-col>
                <v-col cols="12" sm="6" md="6" style="text-align: center">
                  <v-chip
                    v-if="desserts[selectedSchool.index].payStatusPass === '1'"
                    style="background-color: #e3ffe5 !important"
                    color="#8CE38E"
                    outlined
                  >
                    <span style="margin-left: 7px; color: #2bcd2b">已審查</span>
                    <v-icon small style="margin-left: 7px; color: #2bcd2b">
                      mdi-check
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="
                selectedSchool.paymentStatus === '2' &&
                selectedSchool.paymentStatus !== '12' &&
                selectedSchool.payStatus !== '2' &&
                selectedSchool.paymentType === '超商條碼'
              "
              color="darken-1"
              variant="tonal"
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              @click="createPaymentNumberAlert('onlyCreditCard')"
              >更換繳費方式</v-btn
            >
            <v-btn
              v-if="
                selectedSchool.paymentStatus !== '1' &&
                selectedSchool.paymentStatus !== '12' &&
                selectedSchool.payStatus !== '2' &&
                selectedSchool.paymentStatus !== '0' &&
                selectedSchool.paymentType === '信用卡'
              "
              color="darken-1"
              variant="tonal"
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              @click="createPaymentNumberAlert('all')"
              >前往繳費</v-btn
            >
            <v-btn
              v-if="
                selectedSchool.paymentStatus === '0' &&
                selectedSchool.payStatus !== '2'
              "
              color="darken-1"
              variant="tonal"
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              @click="createPaymentNumberAlert('all')"
              >前往繳費</v-btn
            >
            <v-btn
              v-if="
                selectedSchool.paymentStatus === '10' &&
                selectedSchool.payStatus !== '2'
              "
              color="darken-1"
              variant="tonal"
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              @click="createPaymentNumberAlert('all')"
              >重新取得繳費方式</v-btn
            >
            <v-btn
              v-if="
                selectedSchool.paymentStatus !== '1' &&
                selectedSchool.paymentStatus !== '10' &&
                selectedSchool.paymentStatus !== '3' &&
                selectedSchool.paymentStatus !== '12' &&
                selectedSchool.payStatus !== '2' &&
                selectedSchool.paymentType === '超商條碼'
              "
              color="darken-1"
              variant="tonal"
              style="margin: 10px auto; font-weight: bold; font-size: 17px"
              @click="barCdoePrint()"
              >下載超商繳費條碼</v-btn
            >
          </v-card-actions>
        </v-card>
        <v-card
          v-if="selectedSchool.scheduleType !== 6"
          style="margin-top: 20px"
        >
          <v-card-title style="background-color: #ededf3; height: 50px">
            <v-btn
              x-small
              outlined
              class="ma-2 white--text"
              style="
                margin: 3px -4px 7px !important;
                height: 30px;
                width: 30px;
                color: black !important;
                background-color: #ededf3;
              "
              :disabled="
                (desserts[selectedSchool.index].studentStatusPass === '1' &&
                  desserts[selectedSchool.index].identityPass === '1') ||
                reviewLock ||
                lockEditor
              "
              @click="chagneIdentity = true"
            >
              <span style="font-size: 13px">編輯</span>
            </v-btn>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 17px;
              "
              >身分別</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <div
              v-if="selectedSchool.studentStatus === '1'"
              style="font-size: 15px; font-weight: bold"
            >
              國三應屆畢業生
            </div>
            <div
              v-if="selectedSchool.studentStatus === '2'"
              style="font-size: 15px; font-weight: bold"
            >
              <v-row>
                <v-col cols="12" sm="6" md="6"
                  >特殊教育國中生
                  <div
                    class="v-messages theme--light error--text"
                    role="alert"
                    s
                    style="margin-top: 5px"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        {{ postWord }}
                      </div>
                    </div>
                  </div></v-col
                >
                <v-col cols="12" sm="6" md="6" style="text-align: center">
                  <v-chip
                    v-if="
                      desserts[selectedSchool.index].studentStatusPass === '1'
                    "
                    style="background-color: #e3ffe5 !important"
                    color="#8CE38E"
                    outlined
                  >
                    <span style="margin-left: 7px; color: #2bcd2b">已審查</span>
                    <v-icon small style="margin-left: 7px; color: #2bcd2b">
                      mdi-check
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
            </div>
            <div
              v-if="selectedSchool.identity === '1'"
              style="font-size: 15px; font-weight: bold"
            >
              一般生
            </div>
            <div
              v-if="selectedSchool.identity === '2'"
              style="font-size: 15px; font-weight: bold; margin-top: 10px"
            >
              <v-row>
                <v-col cols="12" sm="6" md="6"
                  >特殊身分
                  <div
                    class="v-messages theme--light error--text"
                    role="alert"
                    s
                    style="margin-top: 5px"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        {{ postWord }}
                      </div>
                    </div>
                  </div></v-col
                >
                <v-col cols="12" sm="6" md="6" style="text-align: center">
                  <v-chip
                    v-if="desserts[selectedSchool.index].identityPass === '1'"
                    style="background-color: #e3ffe5 !important"
                    color="#8CE38E"
                    outlined
                  >
                    <span style="margin-left: 7px; color: #2bcd2b">已審查</span>
                    <v-icon small style="margin-left: 7px; color: #2bcd2b">
                      mdi-check
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>
        <v-card
          v-if="selectedSchool.scheduleType !== 6"
          style="margin-top: 20px"
        >
          <v-card-title style="background-color: #ededf3; height: 50px">
            <v-btn
              x-small
              outlined
              class="ma-2 white--text"
              style="
                margin: 3px -4px 7px !important;
                height: 30px;
                width: 30px;
                color: black !important;
                background-color: #ededf3;
              "
              :disabled="
                desserts[selectedSchool.index].rewardPass === '1' ||
                reviewLock ||
                lockEditor
              "
              @click="chagneReward = true"
            >
              <span style="font-size: 13px">編輯</span>
            </v-btn>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 17px;
              "
              >於國民中學就學期間之表現</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <div
              v-if="selectedSchool.reward === '1'"
              style="font-size: 15px; font-weight: bold; display: inline"
            >
              依各校自行訂定之評量規定，依序推薦。
            </div>
            <div
              v-if="selectedSchool.reward === '2'"
              style="font-size: 15px; font-weight: bold; display: inline"
            >
              經各該教育主管機關鑑定為數理資賦優異者。
            </div>
            <v-row>
              <v-col cols="12" sm="6" md="6">
                <div
                  v-if="selectedSchool.reward === '3'"
                  style="font-size: 15px; font-weight: bold"
                >
                  通過「國際國中科學奧林匹亞競賽」或「國際......
                  <div
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-top: 5px"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        {{ postWord }}
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="selectedSchool.reward === '4'"
                  style="font-size: 15px; font-weight: bold"
                >
                  曾獲教育部或國教署主辦有關數理科目之全國......
                  <div
                    v-if="selectedSchool.reward === '3'"
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-top: 5px"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        {{ postWord }}
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
              <v-col cols="12" sm="6" md="6" style="text-align: center">
                <v-chip
                  v-if="
                    (selectedSchool.reward === '3' ||
                      selectedSchool.reward === '4') &&
                    desserts[selectedSchool.index].rewardPass === '1'
                  "
                  style="background-color: #e3ffe5 !important"
                  color="#8CE38E"
                  outlined
                >
                  <span style="margin-left: 7px; color: #2bcd2b">已審查</span>
                  <v-icon small style="margin-left: 7px; color: #2bcd2b">
                    mdi-check
                  </v-icon>
                </v-chip>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <v-card
          v-if="selectedSchool.scheduleType !== 6"
          style="margin-top: 20px"
        >
          <v-card-title style="background-color: #ededf3; height: 50px">
            <v-btn
              x-small
              outlined
              class="ma-2 white--text"
              style="
                margin: 3px -4px 7px !important;
                height: 30px;
                width: 30px;
                color: black !important;
                background-color: #ededf3;
              "
              :disabled="
                desserts[selectedSchool.index].admissionPass === '1' ||
                reviewLock ||
                lockEditor
              "
              @click="
                editorType = 'admission';
                editorAlert = true;
              "
            >
              <span style="font-size: 13px">編輯</span>
            </v-btn>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 17px;
              "
              >錄取方式</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <div style="font-size: 15px; font-weight: bold">
              <div
                v-if="selectedSchool.admission === '1'"
                style="font-size: 15px; font-weight: bold"
              >
                甄選錄取
              </div>
              <div
                v-if="selectedSchool.admission === '2'"
                style="font-size: 15px; font-weight: bold"
              >
                <v-row>
                  <v-col cols="12" sm="6" md="6">
                    直接錄取
                    <div
                      class="v-messages theme--light error--text"
                      role="alert"
                      style="margin-top: 5px"
                    >
                      <div class="v-messages__wrapper">
                        <div
                          class="v-messages__message"
                          style="font-size: 13px; font-weight: bold"
                        >
                          {{ postWord }}
                        </div>
                      </div>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="6" md="6" style="text-align: center">
                    <v-chip
                      v-if="
                        desserts[selectedSchool.index].admissionPass === '1'
                      "
                      style="background-color: #e3ffe5 !important"
                      color="#8CE38E"
                      outlined
                    >
                      <span style="margin-left: 7px; color: #2bcd2b"
                        >已審查</span
                      >
                      <v-icon small style="margin-left: 7px; color: #2bcd2b">
                        mdi-check
                      </v-icon>
                    </v-chip>
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-card-text>
        </v-card>
        <v-card
          v-if="selectedSchool.scheduleType !== 6"
          style="margin-top: 20px"
        >
          <v-card-title
            v-if="device === 'PC'"
            style="background-color: #ededf3; height: 50px"
          >
            <v-btn
              x-small
              outlined
              class="ma-2 white--text"
              style="
                margin: 3px -4px 7px !important;
                height: 30px;
                width: 30px;
                color: black !important;
                background-color: #ededf3;
              "
              :disabled="
                desserts[selectedSchool.index].handicappedPass === '1' ||
                reviewLock ||
                lockEditor
              "
              @click="
                editorType = 'handicapped';
                editorAlert = true;
              "
            >
              <span style="font-size: 13px">編輯</span>
            </v-btn>
            <span
              style="
                font-size: 17px !important;
                font-weight: 900;
                margin-left: 17px;
              "
              >符合身心障礙生或緊急重大傷病生或懷孕生</span
            >
          </v-card-title>
          <v-card-title
            v-else
            style="
              background-color: #ededf3;
              height: 49px;
              line-height: 0rem;
              flex-wrap: nowrap;
            "
          >
            <v-btn
              x-small
              outlined
              class="ma-2 white--text"
              style="
                margin: -5px -4px 7px !important;
                height: 30px;
                width: 30px;
                color: black !important;
                background-color: #ededf3;
              "
              :disabled="
                desserts[selectedSchool.index].handicappedPass === '1' ||
                reviewLock ||
                lockEditor
              "
              @click="
                editorType = 'handicapped';
                editorAlert = true;
              "
            >
              <span style="font-size: 13px">編輯</span>
            </v-btn>
            <span
              style="
                font-size: 15px !important;
                font-weight: bold;
                margin-top: -11px;
                margin-left: 17px;
                line-height: 1rem;
              "
              >符合身心障礙生或緊急重大傷病生或懷孕生</span
            >
          </v-card-title>
          <v-card-text
            style="font-size: 20px; margin-top: 19px; font-weight: bold"
          >
            <div
              v-if="selectedSchool.handicapped === '1'"
              style="font-size: 15px; font-weight: bold"
            >
              <v-row>
                <v-col cols="12" sm="6" md="6">
                  是
                  <div
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-top: 5px"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        {{ handicappedWord }}
                      </div>
                    </div>
                  </div></v-col
                >
                <v-col cols="12" sm="6" md="6" style="text-align: center">
                  <v-chip
                    v-if="
                      desserts[selectedSchool.index].handicappedPass === '1'
                    "
                    style="background-color: #e3ffe5 !important"
                    color="#8CE38E"
                    outlined
                  >
                    <span style="margin-left: 7px; color: #2bcd2b">已審查</span>
                    <v-icon small style="margin-left: 7px; color: #2bcd2b">
                      mdi-check
                    </v-icon>
                  </v-chip>
                </v-col>
              </v-row>
            </div>
            <div
              v-if="selectedSchool.handicapped === '2'"
              style="font-size: 15px; font-weight: bold"
            >
              否
            </div>
          </v-card-text>
        </v-card>
        <div style="margin-top: 5%">
          <div style="color: rgb(143, 131, 131); font-weight: bolder">
            注意事項
          </div>
          <ol style="margin-top: 10px; margin-left: 20px">
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              線上刷卡繳費者，刷卡成功會收到系統通知信-報名繳費成功。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              超商條碼繳費者，繳費單時限為{{ systemENV.BARCODEDATE }}天，請於{{
                systemENV.BARCODEDATE
              }}天內至超商完成繳費，若超過{{
                systemENV.BARCODEDATE
              }}天未繳費，請在此頁面重新取得繳費方式。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              不論以線上刷卡或超商條碼繳費，帳款無法立即得知，毋須以電話詢問繳費結果，請務必耐心等候，報名期間若繳費成功，系統將會發送電子信箱通知。
            </li>
          </ol>
        </div>
      </v-card-text>
      <v-card-title
        class="d-flex justify-center"
        style="background-color: white; height: 27px; line-height: 0rem"
      >
        <div style="font-size: 10px; color: gray">
          @ {{ new Date().getFullYear() }} All Rights Reserved.
        </div>
      </v-card-title>
    </v-card>
    <v-dialog v-if="show" v-model="chagneIdentity" max-width="600px">
      <v-card>
        <v-card-title style="background-color: #434447; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-account-circle-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >身分別</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-radio-group
            v-model="selectedSchool.studentStatus"
            :disabled="desserts[selectedSchool.index].studentStatusPass === '1'"
            inline
          >
            <v-radio
              :value="'1'"
              label="國三應屆畢業生"
              style="width: 35%"
            ></v-radio>
            <v-radio
              :value="'2'"
              label="特殊教育國中生"
              style="width: 35%"
            ></v-radio>
            <div
              v-if="selectedSchool.studentStatus === '2'"
              class="v-messages theme--light error--text"
              role="alert"
              s
              style="margin-left: 38%; margin-top: 5px"
            >
              <div class="v-messages__wrapper">
                <div
                  class="v-messages__message"
                  style="font-size: 13px; font-weight: bold"
                >
                  {{ postWord }}
                </div>
              </div>
            </div>
          </v-radio-group>
          <v-divider class="my-2"></v-divider>
          <v-radio-group
            v-model="selectedSchool.identity"
            :disabled="desserts[selectedSchool.index].identityPass === '1'"
            inline
          >
            <v-radio :value="'1'" label="一般生" style="width: 35%"></v-radio>
            <v-radio :value="'2'" label="特殊身分" style="width: 35%"></v-radio>
            <div
              v-if="selectedSchool.identity === '2'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 38%; margin-top: 5px"
            >
              <div class="v-messages__wrapper">
                <div
                  class="v-messages__message"
                  style="font-size: 13px; font-weight: bold"
                >
                  {{ postWord }}
                </div>
              </div>
            </div>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="cancel('identity')"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              chagneIdentity = false;
              saveScinceInfoByEditor('review');
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="chagneReward" max-width="600px">
      <v-card>
        <v-card-title style="background-color: #434447; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-account-circle-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >於國民中學就學期間之表現</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-radio-group v-model="selectedSchool.reward">
            <v-radio
              :value="'1'"
              label="依各校自行訂定之評量規定，依序推薦。"
              style="width: 85%"
            ></v-radio>
            <v-radio
              :value="'2'"
              label="經各該教育主管機關鑑定為數理資賦優異者。"
              style="width: 85%"
            ></v-radio>
            <v-radio
              :value="'3'"
              label="通過「國際國中科學奧林匹亞競賽」或「國際數理學科奧林匹亞競賽」初選，或具備「亞太數學奧林匹亞競賽國家代表隊決選研習營」報名資格。"
              style="width: 85%"
            ></v-radio>
            <div
              v-if="selectedSchool.reward === '3'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 6%; margin-top: 5px; margin-bottom: 5px"
            >
              <div class="v-messages__wrapper">
                <div
                  class="v-messages__message"
                  style="font-size: 13px; font-weight: bold"
                >
                  {{ postWord }}
                </div>
              </div>
            </div>
            <v-radio
              :value="'4'"
              label="曾參加教育部或教育部國民及學前教育署辦理有關數理科目之全國競賽，獲得獎項。"
              style="width: 85%"
            ></v-radio>
            <div
              v-if="selectedSchool.reward === '4'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 6%; margin-top: 5px"
            >
              <div class="v-messages__wrapper">
                <div
                  class="v-messages__message"
                  style="font-size: 13px; font-weight: bold"
                >
                  {{ postWord }}
                </div>
              </div>
            </div>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            style="font-weight: bold; font-size: 17px"
            text
            @click="cancel('reward')"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              chagneReward = false;
              saveScinceInfoByEditor('review');
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="normalPup" max-width="500px">
      <v-card>
        <v-card-title
          v-if="pupType === '2'"
          style="background-color: #900d16; height: 48px"
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
          v-if="pupType === '1'"
          style="background-color: blue; height: 48px"
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
            style="font-weight: bold; font-size: 17px"
            @click="
              normalPup = false;
              editorProcess = false;
            "
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createPaymentNumbePup" max-width="500px">
      <v-card>
        <v-card-title style="background-color: blue; height: 48px">
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
            style="font-weight: bold; font-size: 17px"
            @click="
              createPaymentNumbePup = false;
              changePayment = false;
            "
            >取消</v-btn
          >
          <v-btn
            left
            color="darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="createPaymentNumber()"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="editorAlert" max-width="500px">
      <v-card>
        <v-card-title style="background-color: blue; height: 48px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-alert-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >您確定要修改資料？</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <div>您確定要修改資料？</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="editorAlert = false"
            >取消</v-btn
          >
          <v-btn
            left
            color="darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="saveScinceInfoByEditor('review')"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay v-model="editorProcess" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data: () => ({
    desserts: [],
    cityList: [],
    schoolList: [],
    institution: [
      { state: "公立", value: "公立" },
      { state: "私立", value: "私立" },
    ],
    selectedSchool: {},
    selectedSchoolTemp: {},
    birthdyPickerValue: "",
    alertText: "",
    birthdayPicker: false,
    idCartRules: [
      (v) => !!v || "身分證統一編號不能為空",
      (v) =>
        /^[A-Za-z][1-2]\d{8}$/.test(v) ||
        /^[A-Za-z][8-9]\d{8}$/.test(v) ||
        "身分證或居留證 統一編碼格式不對",
    ],
    idCartRulesMask: [
      (v) => !!v || "身分證統一編號不能為空",
      (v) =>
        /^[A-Za-z][1-2]\*\*\*\*\*[0-9][0-9][0-9]$/.test(v) ||
        /^[A-Za-z][8-9]\*\*\*\*\*[0-9][0-9][0-9]$/.test(v) ||
        "身分證或居留證 統一編碼格式不對",
    ],
    parentsNameRules: [
      (v) => !!v || "緊急聯絡人姓名不能為空",
      (v) =>
        /^[\u4E00-\u9FA5]{1,18}$/.test(v) ||
        "緊急聯絡人姓名只能為中文字(限18字)",
    ],
    parentsNumberRules: [
      (v) => !!v || "緊急聯絡人手機不能為空",
      (v) =>
        /^[0-9\d()-/#/*]{1,20}$/.test(v) ||
        "緊急聯絡人手機只能為數字和符號(限20字)",
    ],
    normalPup: false,
    createPaymentNumbePup: false,
    dialog: false,
    valid: true,
    selectStatus: false,
    editorProcess: false,
    reviewLock: false,
    lock: true,
    lockEditor: false,
    chagneReward: false,
    chagneIdentity: false,
    idCardEditor: true,
    parentsEditor: true,
    checkBoxStatus: false,
    changePayment: false,
    editorAlert: false,
    show: false,
    pupType: "",
    pupTitle: "",
    pupTitleIcon: "",
    pupText: "",
    alertTyep: "",
    loadingWord: "",
    postWord: "",
    handicappedWord: "",
    price: "600",
    menuType: 0,
    editorType: "",
    ET: "",
    device: "PC",
    titleFontSize: "23px",
  }),

  watch: {},

  computed: {
    key() {
      return this.$route.params.signupKey;
    },

    pass() {
      return this.$route.params.editorKey;
    },
  },

  methods: {
    parseDate(date) {
      if (!date) return null;

      const [year, month] = date.split("/");
      return `${year}/${month.padStart(2, "0")}`;
    },

    parseDate2(date) {
      if (!date) return null;

      if (date.includes("-")) {
        const [year, month] = date.split("-");
        const year1 = parseInt(`${year}`) + 1911;
        const month1 = `/${month.padStart(2, "0")}`;
        return year1.toString() + month1;
      } else if (date.includes("/")) {
        const [year, month] = date.split("/");
        const year1 = parseInt(`${year}`) + 1911;
        const month1 = `/${month.padStart(2, "0")}`;
        return year1.toString() + month1;
      } else {
        return date;
      }
    },

    inputBirthdayValue() {
      this.selectedSchool.birthday = this.parseDate(
        this.birthdyPickerValue.replace("-", "/"),
      );
      this.birthdayPicker = false;
    },

    barCdoePrint() {
      let link = document.createElement("a");

      link.style.display = "none";

      link.href = "barcodeprint/" + this.selectedSchool.paymentNumber;

      link.setAttribute("target", "_blank");

      document.body.append(link);

      link.click();
    },

    async editorAction() {
      this.lock = false;
    },

    async cancel(type) {
      if (type === "identity") {
        this.selectedSchool.studentStatus =
          this.desserts[this.selectedSchool.index].studentStatus;
        this.selectedSchool.identity =
          this.desserts[this.selectedSchool.index].identity;
        this.chagneIdentity = false;
      } else if (type === "reward") {
        this.selectedSchool.reward =
          this.desserts[this.selectedSchool.index].reward;
        this.chagneReward = false;
      }
    },

    async checkURIKey() {
      const data = {};
      data.key = this.key;
      data.pass = this.pass + this.ET;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkURIKey", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.email = response.data.resultData.email;
            this.name = response.data.resultData.name;
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async changeSchool(signupSchool, signupSchoolName) {
      await this.tokenService.renewET();
      this.loadingWord = "資料處理中....";
      this.lock = true;
      this.lockEditor = false;
      this.reviewLock = false;
      this.editorProcess = true;
      this.parentsEditor = true;
      this.idCardEditor = true;
      this.checkBoxStatus = false;

      const that = this;
      this.desserts.forEach(function (data) {
        if (data.signupSchool == signupSchool) {
          data.buttonChoose = true;
          that.selectedSchool = Object.assign({}, data);
          that.selectedSchool.buttonChoose = true;
          that.selectedSchool.parentsName = "";
          that.selectedSchool.parentsPhone = "";
          that.selectedSchoolTemp = Object.assign({}, data);
          that.selectedSchoolTemp.buttonChoose = true;
          that.selectedSchoolTemp.parentsName = "";
          that.selectedSchoolTemp.parentsPhone = "";

          if (that.selectedSchool.checkType === "2" && that.menuType !== 6) {
            that.lockEditor = true;
            that.normalPup = true;
            that.cleanPupData();
            that.pupType = "1";
            that.pupTitle = "資料學校已審查";
            that.pupTitleIcon = "mdi-alert-outline";
            that.pupText =
              signupSchoolName +
              "，已經審查資料，若要修改甄選生基本資料請聯繫招生辦公室";
            that.alertText = "";
          }

          if (that.selectedSchool.checkType === "3" && that.menuType !== 6) {
            that.lockEditor = true;
            that.normalPup = true;
            that.cleanPupData();
            that.pupType = "2";
            that.pupTitle = "資料學校已審查";
            that.pupTitleIcon = "mdi-alert-outline";
            that.pupText =
              signupSchoolName +
              "，已經審查資料，若要修改甄選生基本資料請聯繫招生辦公室";
            that.alertText = "";
          }
        } else {
          data.buttonChoose = false;
        }
      });
      setTimeout(() => {
        this.editorProcess = false;
      }, 500);
    },

    async saveScinceInfoByEditor(type) {
      await this.tokenService.renewET();
      this.loadingWord = "儲存資料中....";
      this.checkBoxStatus = false;
      this.editorProcess = true;
      this.cleanPupData();
      if (this.editorType === "admission") {
        this.selectedSchool.admission =
          this.selectedSchool.admission === "1" ? "2" : "1";
      }

      if (this.editorType === "handicapped") {
        this.selectedSchool.handicapped =
          this.selectedSchool.handicapped === "1" ? "2" : "1";
      }

      if (type === "info") {
        if (this.checkEditorData() === "2") {
          this.normalPup = true;
          this.pupType = "2";
          this.pupTitle = "修改資料有誤！！";
          this.pupTitleIcon = "mdi-alert-outline";
          this.pupText = this.alertText;
          this.alertText = "";

          return false;
        }
      }

      let editorStatus = false;

      const data = this.globalSystemTool.equestData(this.selectedSchool);

      data.pass = this.pass + this.ET;

      data.editorType = type;

      if (data.email !== this.selectedSchoolTemp.email) {
        data.email2 = "";
        editorStatus = true;
      }

      if (
        this.parseDate2(data.birthday) !==
        this.parseDate2(this.selectedSchoolTemp.birthday)
      ) {
        editorStatus = true;
        data.birthday = this.parseDate2(data.birthday);
        data.birthday2 = "";
      } else {
        data.birthday = this.parseDate2(data.birthday);
      }

      if (data.idCard !== this.selectedSchoolTemp.idCard) {
        data.idCard2 = "";
        editorStatus = true;
      }

      if (typeof data.schoolNumber === "object") {
        editorStatus = true;
        data.schoolName = data.schoolNumber.school_name;
        this.selectedSchool.schoolNameAll = data.schoolNumber.school_name;
        data.schoolNumber = data.schoolNumber.school_number;
      }

      this.selectStatus = false;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveScinceInfoByEditor", data)
        .then((response) => {
          // console.log(response.data);
          this.editorAlert = false;
          this.parentsEditor = true;
          this.editorType = "";
          if (response.data.code === 200) {
            let recordType = "";

            if (type === "review") {
              recordType = "signupReview";
            } else {
              recordType = "signupEditor";
            }

            this.recordService.setRecord(
              this.selectedSchool.olyId,
              this.selectedSchoolTemp,
              this.selectedSchool,
              this.selectedSchool.signupSchool,
              recordType,
            );

            this.editorProcess = false;
            this.reviewLock = false;
            this.lock = true;

            let index = this.selectedSchool.index;

            response.data.resultData.buttonChoose = true;
            response.data.resultData.index = index;
            response.data.resultData.signupSchoolName =
              this.globalSystemTool.getScienceAllName(
                response.data.resultData.signupSchool,
              );
            response.data.resultData = this.changeData(
              response.data.resultData,
            );

            this.desserts[index] = Object.assign({}, response.data.resultData);

            this.selectedSchool = Object.assign({}, this.desserts[index]);
            this.selectedSchool.buttonChoose = true;
            this.selectedSchool.index = index;

            this.selectedSchoolTemp = Object.assign({}, this.desserts[index]);
            this.selectedSchoolTemp.buttonChoose = true;
            this.selectedSchool.index = index;
            this.selectStatus = true;

            this.getEditorInfo(index);

            this.idCardEditor = true;
          } else if (response.data.code === 212) {
            this.cleanPupData();
            this.normalPup = true;
            this.pupType = "2";
            this.pupTitle = "已報名過此間學校！！";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "修改的學生資料已經報名過該校";
          } else {
            alert("發生異常，請重新整理後再做修改！");
          }
        })
        .catch(function (error) {
          // console.log(error);
          this.editorAlert = false;
          this.editorType = "";
          alert("發生異常，請重新整理後再做修改！");
        });
    },

    async getEditorInfo(indexType) {
      await this.tokenService.renewET();
      const data = {};
      data.key = this.key;
      data.pass = this.pass + this.ET;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getEditorInfo", data)
        .then((response) => {
          console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;

            const that = this;
            this.desserts.forEach(function (data, index) {
              if (data.price !== "") {
                that.price = data.price;
              }
              if (indexType === -1) {
                if (index === 0) {
                  data.buttonChoose = true;
                } else {
                  data.buttonChoose = false;
                }
              } else {
                if (index === indexType) {
                  data.buttonChoose = true;
                } else {
                  data.buttonChoose = false;
                }
              }
              data.parentsPhone = "";
              data.parentsName = "";
              data.index = index;
              data.signupSchoolName = that.globalSystemTool.getScienceAllName(
                data.signupSchool,
              );
              data = that.changeData(data);
            });

            if (indexType === -1) {
              indexType = 0;
            }

            let data = this.desserts[indexType];
            this.selectedSchool = Object.assign({}, this.desserts[indexType]);
            this.selectedSchool.buttonChoose = true;
            this.selectedSchool.parentsName = "";
            this.selectedSchool.parentsPhone = "";
            this.selectedSchoolTemp = Object.assign(
              {},
              this.desserts[indexType],
            );
            this.selectedSchoolTemp.buttonChoose = true;
            this.selectedSchoolTemp.parentsName = "";
            this.selectedSchoolTemp.parentsPhone = "";

            this.birthdyPickerValue = this.selectedSchool.birthday.replace(
              "/",
              "-",
            );
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
          return false;
        });

      await this.getScienceSchedule();

      if (this.selectedSchool.checkType === "2" && this.menuType !== 6) {
        this.lockEditor = true;
        this.normalPup = true;
        this.cleanPupData();
        this.pupType = "1";
        this.pupTitle = "資料學校已審查";
        this.pupTitleIcon = "mdi-alert-outline";
        this.pupText =
          this.selectedSchool.signupSchoolName +
          "，已經審查資料，若要修改甄選生基本資料請聯繫招生辦公室";
        this.alertText = "";
      }

      if (this.selectedSchool.checkType === "3" && this.menuType !== 6) {
        this.lockEditor = true;
        this.normalPup = true;
        this.cleanPupData();
        this.pupType = "1";
        this.pupTitle = "資料學校已審查";
        this.pupTitleIcon = "mdi-alert-outline";
        this.pupText =
          this.selectedSchool.signupSchoolName +
          "，已經審查資料，若要修改甄選生基本資料請聯繫招生辦公室";
        this.alertText = "";
      }
    },

    async getSchoolAddressList() {
      const data = {};
      data.system = "science";

      await this.axios
        .post(
          this.systemENV.APISERVERURL + "/getSchoolAddressListByScience",
          data,
        )
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cityList = response.data.resultData.cityList;
            this.schoolList = response.data.resultData.schoolList;
            this.selectStatus = true;
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    studenIdentity(type) {
      if (type === "studentStatus") {
        this.selectedSchool.studentStatusPass =
          this.selectedSchool.studentStatusPass === "0" ? "1" : "0";
      } else if (type === "identity") {
        this.selectedSchool.identityPass =
          this.selectedSchool.identityPass === "0" ? "1" : "0";
      }
    },

    async createPaymentNumber() {
      await this.tokenService.renewET();
      this.createPaymentNumbePup = false;
      this.loadingWord = "資料處理中....";
      this.editorProcess = true;
      const data = this.globalSystemTool.equestData(this.selectedSchool);
      data.birthday = this.parseDate2(data.birthday);
      data.pass = this.pass + this.ET;
      data.key = this.key;

      if (this.changePayment) {
        data.paymentType = "信用卡";
      } else {
        data.paymentType = "超商條碼";
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/createPaymentNumber", data)
        .then((response) => {
          // console.log(response.data);
          this.editorProcess = false;
          if (response.data.code === 200) {
            location.href =
              this.systemENV.APISERVERURL +
              "/ecpay/editorPayment/" +
              this.selectedSchool.sstId +
              "/" +
              this.key +
              "_" +
              this.pass +
              this.ET +
              "/" +
              this.selectedSchool.paymentNumber;
          } else if (response.data.code === 410) {
            alert("系統忙碌中 請稍等候再按下(確認資料)鍵");
            this.cleanPupData();
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          this.editorProcess = false;
          location.href = "/science/signup/";
          // console.log(error);
        });
    },

    createPaymentNumberAlert() {
      this.tokenService.renewET();
      this.cleanPupData();
      this.createPaymentNumbePup = true;

      if (
        this.selectedSchool.paymentType === "超商條碼" &&
        this.selectedSchool.paymentStatus === "2"
      ) {
        this.changePayment = true;
        this.pupTitle = "確定使用信用卡繳費?";
        this.pupTitleShow = "1";
        this.pupTitleIcon = "mdi-check";
        if (this.menuType === 6) {
          this.pupText =
            '<span style="color: red;">因為您超商繳費期限尚未過期，更換繳費方式將「限定為信用卡繳費」！</span>';
        } else {
          this.pupText =
            '<span style="color: red;">因為您超商繳費期限尚未過期，更換繳費方式將「限定為信用卡繳費」！</span><br><br>請注意：完成信用卡繳費步驟後，請務必按下，<span style="color: red;">「返回商店」</span> 按鈕，回到資料修改頁面，才算繳費成立。';
        }
      } else {
        this.pupTitle = "確定前往繳費?";
        this.pupTitleShow = "1";
        this.pupTitleIcon = "mdi-check";
        if (this.menuType === 6) {
          this.pupText = "確定前往繳費頁面！";
        } else {
          this.pupText =
            '確定前往繳費頁面！<br><br>請注意：完成信用卡繳費/列印超商繳費單步驟後，請務必按下，<span style="color: red;">「返回商店」</span> 按鈕，回到資料修改頁面，才算繳費成立。';
        }
      }
    },

    async getScienceSchedule() {
      const data = {};
      data.id = this.selectedSchool.olyId;
      data.type = "editor";
      data.olympic = this.selectedSchool.signupSchool;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getScienceSchedule", data)
        .then((response) => {
          // console.log(response.data);
          this.menuType = response.data.resultData.type;
          this.postDate(response.data.resultData.signup_end);
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    postDate(signupEnd) {
      signupEnd = signupEnd.substr(0, 10);

      const dateArray = signupEnd.split("-");

      let ROC = this.checkPostDate(dateArray[0], dateArray[1], dateArray[2]);

      let newDate = new Date(
        parseInt(ROC.year) + 1911 + "/" + ROC.month + "/" + ROC.date,
      );

      this.sendMailDate = ROC.year + "年" + ROC.month + "月" + ROC.date + "日";
      this.postWord =
        "請於" +
        this.sendMailDate +
        "(" +
        this.changeDataToChar(newDate.getDay()) +
        ")以前將證明文件紙本郵寄本校";

      this.handicappedWord =
        "請於" +
        this.sendMailDate +
        "(" +
        this.changeDataToChar(newDate.getDay()) +
        ")以前填妥甄選服務申請表並與相關證明文件紙本郵寄本校";
    },

    changeDataToChar(day) {
      if (day === 1) {
        return "星期一";
      } else if (day === 2) {
        return "星期二";
      } else if (day === 3) {
        return "星期三";
      } else if (day === 4) {
        return "星期四";
      } else if (day === 5) {
        return "星期五";
      } else if (day === 6) {
        return "星期六";
      } else {
        return "星期日";
      }
    },

    checkPostDate(year, month, date) {
      const data = {};

      if (month == "01" && date == "31") {
        year = parseInt(year) - 1911;
        month = 2;
        date = 1;
      } else if (month == "02" && date == "28") {
        year = parseInt(year) - 1911;
        month = 3;
        date = 1;
      } else if (month == "03" && date == "31") {
        year = parseInt(year) - 1911;
        month = 4;
        date = 1;
      } else if (month == "04" && date == "30") {
        year = parseInt(year) - 1911;
        month = 5;
        date = 1;
      } else if (month == "05" && date == "31") {
        year = parseInt(year) - 1911;
        month = 6;
        date = 1;
      } else if (month == "06" && date == "30") {
        year = parseInt(year) - 1911;
        month = 7;
        date = 1;
      } else if (month == "07" && date == "31") {
        year = parseInt(year) - 1911;
        month = 8;
        date = 1;
      } else if (month == "08" && date == "31") {
        year = parseInt(year) - 1911;
        month = 9;
        date = 1;
      } else if (month == "09" && date == "30") {
        year = parseInt(year) - 1911;
        month = 10;
        date = 1;
      } else if (month == "10" && date == "31") {
        year = parseInt(year) - 1911;
        month = 11;
        date = 1;
      } else if (month == "11" && date == "30") {
        year = parseInt(year) - 1911;
        month = 12;
        date = 1;
      } else if (month == "12" && date == "31") {
        year = parseInt(year) + 1 - 1911;
        month = 1;
        date = 1;
      } else {
        year = parseInt(year) - 1911;
        month = parseInt(month) - 0;
        date = parseInt(date) + 1;
      }

      data.year = year;
      data.month = month;
      data.date = date;

      return data;
    },

    changeData(data) {
      if (data.paymentStatus === "0") {
        data.paymentStatusName = "未選擇繳費方式";

        if (data.defaultPayment === 1) {
          data.paymentType = "預選信用卡繳費";
          data.paymentStatusName = "未繳費";
        } else if (data.defaultPayment === 2) {
          data.paymentType = "預選超商繳費";
          data.paymentStatusName = "未繳費";
        } else {
          data.paymentType = "未繳費";
          data.paymentStatusName = "未繳費";
        }
      }
      if (data.paymentStatus === "1") {
        data.paymentStatusName = "已繳費";
      }
      if (data.paymentStatus === "2") {
        data.paymentStatusName = "未繳費";
      }
      if (data.paymentStatus === "3") {
        data.paymentStatusName = "免繳費";
      }
      if (data.paymentStatus === "4") {
        data.paymentStatusName = "交易驗證失敗";
      }
      if (data.paymentStatus === "5") {
        data.paymentStatusName = "交易失敗";
      }
      if (data.paymentStatus === "6") {
        data.paymentStatusName = "待補費";
      }
      if (data.paymentStatus === "7") {
        data.paymentStatusName = "已退款";
      }
      if (data.paymentStatus === "8") {
        data.paymentStatusName = "未退款";
      }
      if (data.paymentStatus === "9") {
        data.paymentStatusName = "無須繳費";
      }
      if (data.paymentStatus === "10") {
        data.paymentStatusName =
          "逾期未繳 (已繳費者，系統確認帳款中，請勿重新繳費)";
      }
      if (data.paymentStatus === "11") {
        data.paymentStatusName = "綠界金流沒有此繳費序號資訊";
      }
      if (data.paymentStatus === "12") {
        data.paymentStatusName = "帳款確認中";
      }

      if (data.admission === "1") {
        data.admissionName = "甄選錄取";
      }
      if (data.admission === "2") {
        data.admissionName = "直接錄取";
      }

      data.parentsName = "";
      data.parentsPhone = "";

      return data;
    },

    checkEditorData() {
      if (this.selectedSchool.name === "") {
        this.alertText += "姓名不能為空 <br>";
      }

      if (this.selectedSchool.birthday === "") {
        this.alertText += "生日不能為空 <br>";
      } else {
        let birthday = this.selectedSchool.birthday.split("/");

        if (parseInt(birthday[0]) <= 94 || parseInt(birthday[0]) >= 101) {
          this.alertText += "您的年齡不符合報名資料 請與報名學校確認 <br>";
        }
      }

      if (this.selectedSchool.idCard === "") {
        this.alertText += "身分證統一編號不能為空 <br>";
      }

      if (this.selectedSchool.idCard !== "" && !this.idCardEditor) {
        const idcard = /^[A-Za-z][1-2]\d{8}$/.test(this.selectedSchool.idCard);

        if (!idcard) {
          this.alertText += "身分證統一編號格式錯誤 <br>";
        }

        if (
          !this.globalSystemTool.verificationIdCard(
            this.selectedSchool.idCard,
          ) &&
          !this.idCardEditor
        ) {
          this.alertText += "身分證統一編號檢核不通過 <br>";
        }
      }

      if (this.selectedSchool.signupSchool === "JGHS") {
        if (this.selectedSchool.idCard !== "") {
          let idCard = this.selectedSchool.idCard;
          if (idCard.slice(1, 2) !== "1" && idCard.slice(1, 2) !== "8") {
            this.alertText += "建國高中科學班 限收男同學 <br>";
          }
        }
      }

      if (this.selectedSchool.signupSchool === "TFGHS") {
        if (this.selectedSchool.idCard !== "") {
          let idCard = this.selectedSchool.idCard;
          if (idCard.slice(1, 2) !== "2" && idCard.slice(1, 2) !== "9") {
            this.alertText += "北一女中科學班 限收女同學 <br>";
          }
        }
      }

      if (this.selectedSchool.cityNumber === "") {
        this.alertText += "城市不能為空 <br>";
      }

      if (this.selectedSchool.institution === "") {
        this.alertText += "公私立不能為空 <br>";
      }

      if (this.selectedSchool.schoolNumber === "") {
        this.alertText += "學校不能為空 <br>";
      }

      if (this.alertText === "") {
        return "1";
      } else {
        return "2";
      }
    },

    cleanPupData() {
      this.signupPup = false;
      this.pupType = "";
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },
  },

  async mounted() {
    this.editorProcess = true;
    this.loadingWord = "資料處理中...";
    let systemDomain = "";

    if (window.innerWidth <= 500) {
      this.device = "phone";
      this.titleFontSize = "20px";
    } else {
      this.device = "PC";
    }

    if (this.systemENV.MOD === "dev") {
      systemDomain = "http://localhost:8080";
    } else if (this.systemENV.MOD === "sit") {
      systemDomain = "https://scibeta.csie.ntnu.edu.tw";
    } else {
      systemDomain = "https://sciprograms.tpmso.org";
    }
    if (window.performance.navigation.type === 2) {
      location.href = "/science/signup/";
    }
    let referrer = document.referrer;
    if (
      referrer.includes(systemDomain + "/science/verifyOPT/") ||
      referrer.includes(systemDomain + "/science/checkback/")
    ) {
      await this.tokenService.renewET();
      this.ET = JSON.parse(localStorage.getItem("ett")).value;
      await this.getEditorInfo(-1);
      await this.getSchoolAddressList();
    } else {
      location.href = "/science/signup/";
    }

    let year = new Date().getFullYear();
    if (this.systemENV.MOD === "prod") {
      this.birthdyPickerValue = parseInt(year - 16 - 1911) + "-01";
    } else {
      this.birthdyPickerValue = parseInt(year - 16 - 1911 + 1) + "-01";
    }

    this.editorProcess = false;
    this.show = true;
    this.loadingWord = "";
  },
};
</script>
