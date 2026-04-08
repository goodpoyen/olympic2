<template>
  <v-main>
    <div>
      <v-toolbar dark class="pa-0" style="background-color: #2f365f">
        <v-toolbar-title style="margin: 10px 40%; color: white"
          >高級中等學校科學班報名網</v-toolbar-title
        >
      </v-toolbar>

      <v-card
        v-show="openStatus && !maintain"
        class="mx-auto"
        :max-width="device === 'PC' ? '60%' : '100%'"
        style="margin: 10px"
      >
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-school</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            選擇報名學校
          </div>
        </v-card-title>

        <v-card-text>
          <v-container fluid>
            <div>
              <v-btn
                small
                style="
                  margin-top: 13px;
                  margin-bottom: 20px;
                  font-size: 14px;
                  font-weight: bolder;
                "
                @click="signupStepPop = true"
              >
                觀看報名教學影片
              </v-btn>
              <br v-if="device === 'phone'" />
              <span
                v-if="device === 'PC'"
                style="margin-left: 15px; font-weight: bolder; color: blue"
                >請先觀看報名步驟教學了解報名資訊。</span
              >
              <span v-else style="font-weight: bolder; color: blue"
                >請先觀看報名步驟教學了解報名資訊。</span
              >
            </div>
            <span style="color: red; font-weight: bold"
              >一次填寫僅能報名一校，若要報名多校，請分別填寫資料及繳費。</span
            >
            <v-radio-group v-model="studentData.signupSchool" inline>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="JGHS" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoJGHS.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  建國高中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="HSNU" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoHSNU.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  師大附中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="TFGHS" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoTFGHS.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  北一女中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="WLSH" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoWLSH.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  武陵高中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="NEHS" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoNEHS.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  竹科實中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="TCFSH" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoTCFSH.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  臺中一中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="CHSH" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoCHSH.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  彰化高中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="CYSH" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoCYSH.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  嘉義高中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="TNFSH" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoTNFSH.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  臺南一中
                </v-card-title>
              </v-card>
              <v-card
                style="
                  margin-right: 20px;
                  margin-top: 10px;
                  height: 50%;
                  width: 17%;
                "
              >
                <v-card-title style="margin-right: -8px">
                  <v-radio value="KSHS" style="margin: -2px 30px"></v-radio>
                </v-card-title>
                <v-img
                  max-height="80"
                  max-width="80"
                  src="/images/logoKSHS.png"
                  style="margin: -2px 25px"
                ></v-img>
                <v-card-title
                  style="
                    font-size: 16px;
                    font-weight: bolder;
                    margin: -2px 20px;
                  "
                >
                  高雄高中
                </v-card-title>
              </v-card>
            </v-radio-group>
          </v-container>
        </v-card-text>
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-account-school</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            填寫甄選學生基本資料
          </div>
        </v-card-title>
        <v-form ref="form" v-model="infoStatus">
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-text-field
                    v-model="studentData.name"
                    label="姓名"
                    :counter="18"
                    variant="underlined"
                    :rules="nameRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="4" style="margin-top: -31px">
                  <!-- <v-text-field
                    v-model="studentData.birthday"
                    label="出生年月(民國/月)"
                    prepend-icon="mdi-calendar"
                    readonly
                    @click="birthdayPicker = true"
                    :rules="[(v) => !!v || '出生年月不能為空']"
                    required
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
                      <v-btn text color="primary" @click="inputBirthdayValue()">
                        確認
                      </v-btn>
                    </v-date-picker>
                  </v-dialog> -->
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-text-field
                    v-model="maskIdCard"
                    type="email"
                    label="身分證統一編號"
                    variant="underlined"
                    :rules="[checkIdcard]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  style="margin-top: -31px; margin-left: 2px"
                >
                  <v-text-field
                    v-model="studentData.email"
                    label="電子信箱"
                    inputmode="email"
                    variant="underlined"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  style="margin-top: -18px; margin-left: -13px"
                >
                  <v-btn
                    v-if="!lockSend"
                    class="flex-grow-1"
                    variant="tonal"
                    style="font-weight: bold"
                    :loading="loadView"
                    :disabled="
                      studentData.email == '' ||
                      studentData.email == null ||
                      studentData.signupSchool == '' ||
                      studentData.signupSchool == null ||
                      studentData.name == '' ||
                      studentData.name == null ||
                      OTPBtnlock
                    "
                    @click="
                      checkEmail('email');
                      OTPBtnlock = true;
                    "
                  >
                    <v-icon medium left style="color: black">
                      mdi-email-arrow-right-outline
                    </v-icon>
                    寄送驗證碼
                  </v-btn>
                  <v-btn v-if="lockSend" block>
                    <div><v-icon>mdi-alarm-check</v-icon></div>
                    <div>鎖定{{ sendOTPTime }}秒</div>
                  </v-btn>
                </v-col>
                <v-col cols="12" sm="12" md="6" style="margin-top: -31px">
                  <v-text-field
                    v-model="studentData.OTPNumber"
                    label="輸入驗證碼"
                    maxlength="4"
                    required
                    variant="underlined"
                    :disabled="sendOTPStauts"
                  ></v-text-field>
                  <div
                    v-if="!OTPPass"
                    class="v-messages theme--light error--text"
                    role="alert"
                    style="margin-left: 3%; margin-top: -8%"
                  >
                    <div class="v-messages__wrapper">
                      <div
                        class="v-messages__message"
                        style="font-size: 13px; font-weight: bold"
                      >
                        驗證失敗
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col
                  cols="12"
                  sm="12"
                  md="6"
                  style="margin-top: -18px; margin-left: -13px"
                >
                  <v-btn
                    v-if="!verifyPass"
                    :loading="loadVerify"
                    class="flex-grow-1"
                    variant="tonal"
                    style="font-weight: bold"
                    :disabled="sendOTPStauts"
                    @click="verifyOPTNumber()"
                  >
                    驗證
                  </v-btn>
                  <v-chip
                    v-if="verifyPass"
                    style="background-color: #e3ffe5 !important"
                    color="#8CE38E"
                    outlined
                  >
                    <span style="margin-left: 7px; color: #2bcd2b">已驗證</span>
                    <v-icon small style="margin-left: 7px; color: #2bcd2b">
                      mdi-check
                    </v-icon>
                  </v-chip>
                </v-col>
                <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                  <v-text-field
                    v-model="studentData.parentsName"
                    label="緊急聯絡人姓名"
                    :counter="18"
                    variant="underlined"
                    :rules="parentsNameRules"
                    required
                    :disabled="lock"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                  <v-text-field
                    v-model="studentData.parentsPhone"
                    label="緊急聯絡人手機"
                    :counter="20"
                    variant="underlined"
                    :rules="parentsNumberRules"
                    required
                    :disabled="lock"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="12" md="12" style="margin-top: -20px">
                  <div
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
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                  <div>就讀國中：</div>
                </v-col>
                {{ studentData.cityNumber }} {{ studentData.institution }}
                {{ studentData.schoolNumber }}
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-select
                    :items="cityList"
                    v-model="studentData.cityNumber"
                    item-title="city_name"
                    item-value="city_number"
                    label="城市"
                    variant="underlined"
                    :disabled="lock"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-select
                    v-model="studentData.institution"
                    :items="institution"
                    item-title="state"
                    item-value="value"
                    label="公/私立"
                    variant="underlined"
                    :rules="[(v) => !!v || '公/私立不能為空']"
                    required
                    :disabled="lock"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <!-- <v-select
                    v-model="studentData.schoolNumber"
                    :items="
                      studentData.institution !== ''
                        ? schoolList[studentData.cityNumber][
                            studentData.institution
                          ]
                        : schoolList[studentData.cityNumber]
                    "
                    item-title="school_name"
                    item-value="school_number"
                    label="校名"
                    variant="underlined"
                    :rules="[(v) => !!v || '校名不能為空']"
                    required
                    :disabled="lock"
                  ></v-select> -->
                  <!-- <v-select
                    v-model="studentData.schoolNumber"
                    :items="schoolList[17]['公立']"
                    item-title="school_name"
                    item-value="school_number"
                    label="校名"
                    variant="underlined"
                    :rules="[(v) => !!v || '校名不能為空']"
                    required
                    :disabled="lock"
                  ></v-select> -->
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                  <v-radio-group
                    v-model="studentData.studentStatus"
                    inline
                    :disabled="lock"
                  >
                    <v-radio label="國三應屆畢業生" value="1"></v-radio>
                    <v-radio
                      label="特殊教育學生調整入學年齡及修業年限之國中學生"
                      value="2"
                    ></v-radio>
                    <div
                      v-if="studentData.studentStatus === '2'"
                      class="v-messages theme--light error--text"
                      role="alert"
                      style="margin-left: 23%; margin-top: 1%"
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
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-form>
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-account-circle-outline</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            身分別
          </div>
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="studentData.identity"
            :disabled="lock"
            style="margin-top: 20px"
          >
            <v-radio label="一般生" value="1"></v-radio>
            <v-radio
              label="特殊身分 (身障生、僑生、蒙藏生、原住民、政府派外工作人員子女、境外優秀科技人才子女)"
              value="2"
            ></v-radio>
            <div
              v-if="studentData.identity === '2'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 5%"
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
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-currency-usd</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            繳費身分
          </div>
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="studentData.payStatus"
            :disabled="lock"
            inline
            style="margin-top: 25px"
          >
            <v-radio
              label="免繳費"
              value="2"
              @click="studentData.defaultPayment = '3'"
            ></v-radio>
            <v-radio
              label="一般生"
              value="1"
              @click="studentData.defaultPayment = '1'"
            ></v-radio>
          </v-radio-group>
          <div
            v-if="studentData.payStatus === '2'"
            class="v-messages theme--light error--text"
            role="alert"
            style="margin-left: 4%; margin-top: -2%"
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
          <v-radio-group
            v-if="studentData.payStatus === '1'"
            v-model="studentData.defaultPayment"
            inline
            style="color: rgba(0, 0, 0, 0.6)"
          >
            預選繳費方式：
            <v-radio label="信用卡繳費" value="1"></v-radio>
            <v-radio label="超商繳費" value="2"></v-radio>
            <div
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-top: 1%"
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
                  請擇一預選繳費方式，於實際登入金流仍可修改繳費方式，系統則以實際登入金流所選繳費方式擷取繳費資訊
                </div>
              </div>
            </div>
          </v-radio-group>
        </v-card-text>
        <v-card-title
          style="
            background-color: #ededf3;
            height: 49px;
            line-height: 0rem;
            flex-wrap: nowrap;
          "
        >
          <v-icon>mdi-text-box-check-outline</v-icon>
          <div
            class="v-messages__message"
            style="
              margin: -22px 35px;
              font-size: 16px;
              font-weight: bold;
              line-height: 18px;
            "
          >
            於國民中學就學期間之表現，符合下列規定之一：
          </div>
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="studentData.reward"
            :disabled="lock"
            style="margin-top: 25px"
          >
            <v-radio
              label="依各校自行訂定之評量規定，依序推薦。"
              value="1"
            ></v-radio>
            <v-radio
              label="經各該教育主管機關鑑定為數理資賦優異者。"
              value="2"
            ></v-radio>
            <v-radio
              label="通過「國際國中科學奧林匹亞競賽」或「國際數理學科奧林匹亞競賽」初選，或具備「亞太數學奧林匹亞競賽國家代表隊決選研習營」報名資格。"
              value="3"
            ></v-radio>
            <div
              v-if="studentData.reward === '3'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 5%; margin-bottom: 1%"
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
              label="曾參加教育部或教育部國民及學前教育署辦理有關數理科目之全國競賽，獲得獎項。"
              value="4"
            ></v-radio>
            <div
              v-if="studentData.reward === '4'"
              class="v-messages theme--light error--text"
              role="alert"
              style="margin-left: 5%; margin-bottom: 1%"
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
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-card-account-details-outline</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            錄取方式
          </div>
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="studentData.admission"
            inline
            :disabled="lock"
            style="margin-top: 25px"
          >
            <v-radio label="甄選錄取" value="1"></v-radio>
            <v-radio label="直接錄取 (需經審查後通知)" value="2"></v-radio>
          </v-radio-group>
          <div
            v-if="studentData.admission === '2'"
            class="v-messages theme--light error--text"
            role="alert"
            style="margin-left: 20%; margin-top: -2%"
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
        </v-card-text>
        <v-card-title
          style="
            background-color: #ededf3;
            height: 49px;
            line-height: 0rem;
            flex-wrap: nowrap;
          "
        >
          <v-icon>mdi-script-text-outline</v-icon>
          <div
            class="v-messages__message"
            style="
              margin: -22px 35px;
              font-size: 16px;
              font-weight: bold;
              line-height: 18px;
            "
          >
            須申請「身心障礙生或緊急重大傷病生或懷孕生甄選服務」
          </div>
        </v-card-title>
        <v-card-text>
          <v-radio-group
            v-model="studentData.handicapped"
            inline
            :disabled="lock"
            style="margin-top: 25px"
          >
            <v-radio label="否" value="2"></v-radio>
            <v-radio label="是" value="1"></v-radio>
          </v-radio-group>
          <div
            v-if="studentData.handicapped === '1'"
            class="v-messages theme--light error--text"
            role="alert"
            style="margin-left: 13%; margin-top: -2%"
          >
            <div class="v-messages__wrapper">
              <div
                class="v-messages__message"
                style="font-size: 13px; font-weight: bold"
              >
                {{ handicappedWord }}
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <v-icon>mdi-alert-circle-outline</v-icon>
          <div style="margin: -14px 35px; font-weight: bold; font-size: 16px">
            注意事項
          </div>
        </v-card-title>
        <v-card-text>
          <ol style="margin-top: 10px">
            <li style="color: black; font-weight: bolder">
              須符合簡章肆、報名資格，經國民中學推薦者，始得報名甄選入學科學班。
            </li>
            <li style="color: black; font-weight: bolder">
              簡章中的報名表，請備妥紙本，於線上報名後不需郵寄，惟進入實驗實作時現場繳驗必要表件。
            </li>
            <li style="color: black; font-weight: bolder">
              本甄選採個別報名，限1人以一電子信箱報名。
            </li>
            <li style="color: black; font-weight: bolder">
              建議使用Chrome、Safari、Edge報名，不建議使用手機、平板報名。
            </li>
          </ol>
        </v-card-text>
        <v-card-actions>
          <v-btn
            v-if="confirmStatus"
            color="#FFC75F"
            style="margin: 10px auto; font-weight: bold; width: 20%"
            rounded
            variant="flat"
            :disabled="lock || confirmBtnlock"
            @click="
              timeDownStart();
              confirmBtnlock = true;
            "
          >
            確認資料
          </v-btn>
          <v-btn
            v-if="chooseStatus"
            style="margin: 10px auto; font-weight: bold; width: 20%"
            :disabled="lock"
            variant="flat"
            @click="
              confirmStatus = true;
              chooseStatus = false;
            "
          >
            <div>繼續編輯</div>
            <div><v-icon>mdi-text-box-edit-outline</v-icon></div>
          </v-btn>
          <v-btn
            v-if="chooseStatus"
            color="#FFC75F"
            style="margin: 10px auto; font-weight: bold; width: 20%"
            rounded
            variant="flat"
            :disabled="lock"
            @click="signupAlert()"
          >
            確認無誤
          </v-btn>
          <v-btn
            v-if="confirmRead"
            style="margin: 10px auto; font-weight: bold; width: 20%"
            block
            :disabled="lock"
          >
            <div>請確認上述填寫資料是否正確</div>
            <div><v-icon>mdi-alarm-check</v-icon></div>
            <div>確認倒數...{{ confirmTime }}秒</div>
          </v-btn>
        </v-card-actions>
        <v-card-title
          style="background-color: white; height: 27px; line-height: 0rem"
        >
          <div style="margin: 0px auto; font-size: 10px; color: gray">
            @ {{ new Date().getFullYear() }} All Rights Reserved.
          </div>
        </v-card-title>
      </v-card>
      <v-card
        v-show="!openStatus && !maintain"
        class="mx-auto"
        max-width="50%"
        style="margin: 10px"
      >
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <div style="margin: 0px auto; font-weight: bold; font-size: 20px">
            {{ colseWord }}
          </div>
        </v-card-title>
      </v-card>
      <v-card
        v-show="maintain"
        class="mx-auto"
        max-width="50%"
        style="margin: 10px"
      >
        <v-card-title
          style="background-color: #ededf3; height: 49px; line-height: 0rem"
        >
          <div style="margin: 0px auto; font-weight: bold; font-size: 20px">
            系統例行維護中<span v-show="maintainTime">(凌晨12:00~01:00)</span>
          </div>
        </v-card-title>
      </v-card>
    </div>
    <v-dialog v-model="signupPup" max-width="500px">
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
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="alertTyep !== '1'"
            left
            color="darken-1"
            text
            @click="
              cleanPupData;
              signupPup = false;
              confirmStatus = true;
              chooseStatus = false;
              signupLock = false;
              alertText = '';
              alertTyep = '';
            "
            style="font-weight: bold; font-size: 17px"
            >關閉</v-btn
          >
          <v-btn
            v-if="alertTyep === '1'"
            left
            color="darken-1"
            text
            @click="
              cleanPupData;
              signupPup = false;
              confirmStatus = true;
              chooseStatus = false;
              signupLock = false;
              alertText = '';
              alertTyep = '';
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            v-if="alertTyep === '1'"
            left
            color="blue darken-1"
            text
            :disabled="signupLock || !infoStatus"
            @click="
              signupLock = true;
              checkEmail('signup');
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="signupStepPop" max-width="600px">
      <v-card>
        <v-card-title style="background-color: black; height: 57px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-script-text-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >報名步驟教學</span
          >
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <v-btn
            class="ma-2"
            small
            :color="teachVideoColor"
            style="font-weight: bold"
            @click="
              teachVideoColor = 'grey';
              teachBookColor = 'white';
              teachType = 'yt';
            "
          >
            <v-icon small left style="color: black"> mdi-youtube </v-icon>
            <p style="font-size: 13px; color: black">教學影片</p>
          </v-btn>
          <v-btn
            class="ma-2"
            small
            dark
            :color="teachBookColor"
            style="font-weight: bold"
            @click="
              teachVideoColor = 'white';
              teachBookColor = 'grey';
              teachType = 'pdf';
            "
          >
            <v-icon small left style="color: black">
              mdi-script-text-outline
            </v-icon>
            <p style="font-size: 13px; color: black">教學手冊</p>
          </v-btn>
          <div v-if="teachType === 'yt'">
            <v-progress-circular
              v-if="editorProcess"
              :size="50"
              color="primary"
              indeterminate
              style="left: 50%; margin-top: 10%"
            ></v-progress-circular>
            <div
              v-if="editorProcess"
              style="font-size: 15px; margin-left: 50%; margin-top: 2%"
            >
              載入中....
            </div>
            <!-- <youtube
              v-if="!editorProcess"
              :video-id="videoId"
              :player-width="560"
              :player-height="315"
              @ready="ready"
            ></youtube> -->
            <iframe
              width="560"
              height="315"
              :src="videoId"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div v-if="teachType === 'pdf'">
            <v-btn-toggle
              style="margin-top: 40px; background-color: rgb(180, 180, 184)"
            >
              <v-btn @click="getInstructionFile('review')">
                {{
                  new Date().getFullYear() - 1911
                }}學年度科學班甄選教學手冊(預覽)
                <v-icon style="margin-left: 10px">mdi-eye-outline</v-icon>
              </v-btn>
            </v-btn-toggle>
            <v-btn-toggle
              style="margin-top: 40px; background-color: rgb(180, 180, 184)"
            >
              <v-btn @click="getInstructionFile('download')">
                {{
                  new Date().getFullYear() - 1911
                }}學年度科學班甄選教學手冊(下載)
                <v-icon style="margin-left: 10px">mdi-download</v-icon>
              </v-btn>
            </v-btn-toggle>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="
              signupStepPop = false;
              teachType = 'yt';
            "
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendOPTPup" max-width="500px">
      <v-card>
        <v-card-title style="background-color: #2d5bff; height: 57px">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-check-bold
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >驗證碼已寄出</span
          >
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          驗證碼已寄至您的信箱，將信件內的四位數驗證碼，輸入至下方(輸入驗證碼)，再按下驗證，方可繼續以下報名動作。
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              sendOPTPup = false;
              sendOTPStauts = false;
              sendOPTtimeDownStart();
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
        <v-card-title
          v-if="pupTitleShow === '1'"
          style="background-color: blue; height: 57px"
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
            style="font-weight: bold; font-size: 17px"
            @click="normalPup = false"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="signupProcess">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div>報名處理中....</div>
    </v-overlay>
  </v-main>
</template>
<script>
// import { getIdFromURL } from "vue-youtube-embed";
// let videoId = getIdFromURL("https://www.youtube.com/embed/FaS52wDBAy8");

export default {
  data: () => ({
    videoId: "https://www.youtube.com/embed/oo5YfX-j_i4?si=DKZx6qqxXju2ClZR",
    birthdyPickerValue: "",
    teachVideoColor: "grey",
    teachBookColor: "white",
    OTPBtnlock: false,
    confirmBtnlock: false,
    sendOTPStauts: true,
    editorProcess: false,
    lock: false,
    lockSend: false,
    signupStepPop: false,
    sendOPTPup: false,
    normalPup: false,
    signupProcess: false,
    OTPPass: true,
    num: "",
    num2: "",
    checkNum: "",
    verifyPass: false,
    loadView: false,
    loadVerify: false,
    postWord: "",
    signupLock: false,
    handicappedWord: "",
    reciprocal: null,
    reciprocalOPT: null,
    confirmTime: 30,
    sendOTPTime: 3,
    confirmRead: false,
    confirmStatus: true,
    chooseStatus: false,
    birthdayPicker: false,
    signupPup: false,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    alertText: "",
    alertTyep: "",
    olyId: "",
    sendMailDate: "",
    infoStatus: true,
    timeTemp: 3,
    device: "PC",
    maskIdCard: "",
    maskTemp: [],
    emailRules: [
      (v) => !!v || "電子信箱不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v,
        ) || "電子信箱格式不對",
    ],
    nameRules: [
      (v) => !!v || "姓名不能為空",
      (v) => /^[\u4E00-\u9FA5]{1,18}$/.test(v) || "姓名只能為中文字(限18字)",
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
    cityList: [],
    institution: [
      { state: "公立", value: "公立" },
      { state: "私立", value: "私立" },
      { state: "國際", value: "國際" },
    ],
    schoolList: [],
    studentData: {
      signupSchool: "",
      name: "",
      birthday: "",
      idCard: "",
      email: "",
      cityNumber: null,
      institution: null,
      schoolNumber: null,
      studentStatus: "",
      identity: "",
      payStatus: "",
      reward: "",
      admission: "",
      handicapped: "",
      parentsName: "",
      parentsPhone: "",
      defaultPayment: "1",
    },
    openStatus: false,
    colseWord: "",
    maintain: false,
    maintainTime: true,
    teachType: "yt",
  }),

  computed: {
    testName() {
      if (this.$route.params.testName === undefined) {
        return null;
      }
      return this.$route.params.testName;
    },
  },

  beforeDestroy() {
    clearInterval(this.reciprocal);

    clearInterval(this.reciprocalOTP);
  },

  methods: {
    checkIdcard(value) {
      let input = value.split("");
      let tempId = this.studentData.idCard;

      if (value.length === 0) {
        this.maskTemp = [];
        this.studentData.idCard = "";
        return "不能為空值";
      } else if (!value.includes("*")) {
        this.maskTemp = [];
        this.studentData.idCard = "";
      }

      this.studentData.idCard = "";
      this.maskIdCard = "";

      for (let i = 0; i < input.length; i++) {
        if (i >= 3 && i <= 6) {
          if (input[i] !== "*") {
            if (value.includes("****") && value.length >= 7) {
              if (tempId.length > value.length) {
                this.maskTemp.push(input[i]);
              } else {
                input.splice(7, 0, this.maskTemp.pop());
                this.maskTemp.unshift(input[i]);
              }
            }

            this.maskIdCard += "*";
            this.studentData.idCard += input[i];
            let startValue = i - 3;
            let temp = this.maskTemp[startValue];
            if (this.maskTemp[i - 3] != null) {
              this.studentData.idCard += input[i];
            }
            this.maskTemp[i - 3] = input[i];
          } else {
            if (!value.includes("****") && value.length >= 8) {
              this.maskIdCard = "";
              this.studentData.idCard = "";
              break;
            } else {
              this.studentData.idCard += this.maskTemp[i - 3];
            }
            this.maskIdCard += "*";
          }
        } else {
          if (input[i] !== "*") {
            this.maskIdCard += input[i];
            this.studentData.idCard += input[i];
          } else {
            if (i < 3) {
              this.studentData.idCard += this.maskTemp[i - 2];
              this.maskIdCard += this.maskTemp[i - 2];
              this.maskTemp.shift();
            }

            if (i > 6) {
              this.studentData.idCard += input[i];
            }
          }
        }
      }

      if (
        !/^[A-Za-z][1-2]\d{8}$/.test(this.studentData.idCard) &&
        !/^[A-Za-z][8-9]\d{8}$/.test(this.studentData.idCard)
      ) {
        return "身分證或居留證 統一編碼格式不對";
      }

      return true;
    },

    async getInstructionFile(type) {
      const data = {};

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getInstructionFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response)
          const link = document.createElement("a");
          const blob = new Blob([response.data], { type: "application/pdf" });
          if (type === "review") {
            window.open(URL.createObjectURL(blob));
          } else {
            let year = new Date().getFullYear() - 1911;
            link.style.display = "none";
            link.href = URL.createObjectURL(blob);
            link.setAttribute(
              "download",
              year + "學年度高級中等學校科學班報名網教學手冊.pdf",
            );
            document.body.appendChild(link);
            link.click();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async ready(event) {
      let player = {};
      this.editorProcess = true;
      player = event.target;

      if (Object.keys(player).length === 0) {
        this.editorProcess = true;
        this.ready(event);
      } else {
        this.editorProcess = false;
      }
    },

    parseDate(date) {
      if (!date) return null;

      const [year, month] = date.split("-");
      return `${year}/${month.padStart(2, "0")}`;
    },

    inputBirthdayValue() {
      this.studentData.birthday = this.parseDate(this.birthdyPickerValue);
      this.birthdayPicker = false;
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
          console.log(response.data);
          if (response.data.code === 200) {
            this.cityList = response.data.resultData.cityList;
            this.schoolList = response.data.resultData.schoolList;
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    timeDownStart() {
      this.reciprocal = setInterval(this.confirmTimedown, 1000);
    },

    sendOPTtimeDownStart() {
      this.reciprocalOTP = setInterval(this.sendOTPTimedown, 1000);
    },

    confirmTimedown() {
      this.confirmRead = true;
      this.confirmStatus = false;
      this.confirmTime--;

      if (this.confirmTime === 0) {
        this.confirmRead = false;
        this.chooseStatus = true;
        if (this.systemENV.MOD === "dev" || this.systemENV.MOD === "sit") {
          this.confirmTime = 2;
        } else {
          this.confirmTime = 30;
        }
        clearInterval(this.reciprocal);
      }

      this.confirmBtnlock = false;
    },

    sendOTPTimedown() {
      this.lockSend = true;
      this.sendOTPTime--;

      if (this.sendOTPTime === 0) {
        this.timeTemp = this.timeTemp * 2;
        this.sendOTPTime = this.timeTemp;

        this.lockSend = false;
        this.OTPBtnlock = false;
        clearInterval(this.reciprocalOTP);
      }
    },

    signupAlert() {
      this.cleanPupData();
      this.signupPup = true;
      this.alertTyep = this.checkSingupData();

      if (this.alertTyep === "1") {
        this.pupTitle = "確定送出報名資料?";
        this.pupTitleShow = "1";
        this.pupTitleIcon = "mdi-check";
        if (this.studentData.payStatus === "1") {
          this.pupText =
            '確定報名！<br><br>請注意：完成信用卡繳費/列印超商繳費單步驟後，請務必按下，<span style="color: red;">「返回商店」</span> 按鈕，回到報名系統確認報名完成須知，才算完成報名手續。';
        } else {
          this.pupText = "確認無誤後請點選確定";
        }
      } else if (this.alertTyep === "2") {
        this.pupTitle = "報名資料有誤！！";
        this.pupTitleShow = "2";
        this.pupTitleIcon = "mdi-alert-outline";
        this.pupText = this.alertText;
      }

      this.alertText = "";
      this.alertType = "";
    },

    checkSingupData() {
      if (this.studentData.signupSchool === "") {
        this.alertText += "學校不能為空 <br>";
      }

      if (this.studentData.name === "") {
        this.alertText += "姓名不能為空 <br>";
      } else {
        if (this.studentData.name.length > 18) {
          this.alertText += "姓名字數超過規定長度 <br>";
        }
      }

      if (this.studentData.birthday === "") {
        this.alertText += "生日不能為空 <br>";
      } else {
        let birthday = this.studentData.birthday.split("/");

        let year = new Date().getFullYear();
        if (this.systemENV.MOD === "prod") {
          year = parseInt(year - 16 - 1911);
        } else {
          year = parseInt(year - 16 - 1911 + 1);
        }

        if (
          parseInt(birthday[0]) <= year - 3 ||
          parseInt(birthday[0]) >= year + 4
        ) {
          this.alertText += "您的年齡不符合報名資料 請與報名學校確認 <br>";
        }
      }

      if (this.studentData.idCard === "") {
        this.alertText += "身分證統一編號不能為空 <br>";
      }

      if (this.studentData.idCard !== "") {
        const idcard = /^[A-Za-z][1-2]\d{8}$/.test(this.studentData.idCard);
        const idcard2 = /^[A-Za-z][8-9]\d{8}$/.test(this.studentData.idCard);

        if (!idcard && !idcard2) {
          this.alertText += "身分證統一編號格式錯誤 <br>";
        }

        if (
          !this.globalSystemTool.verificationIdCard(this.studentData.idCard)
        ) {
          this.alertText += "身分證統一編號檢核不通過 <br>";
        }
      }

      if (this.studentData.signupSchool === "JGHS") {
        if (this.studentData.idCard !== "") {
          let idCard = this.studentData.idCard;
          if (idCard.slice(1, 2) !== "1" && idCard.slice(1, 2) !== "8") {
            this.alertText += "建國高中科學班 限收男同學 <br>";
          }
        }
      }

      if (this.studentData.signupSchool === "TFGHS") {
        if (this.studentData.idCard !== "") {
          let idCard = this.studentData.idCard;
          if (idCard.slice(1, 2) !== "2" && idCard.slice(1, 2) !== "9") {
            this.alertText += "北一女中科學班 限收女同學 <br>";
          }
        }
      }

      if (this.studentData.email === "") {
        this.alertText += "電子信箱不能為空 <br>";
      }

      if (this.studentData.email !== "") {
        const email =
          /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
            this.studentData.email,
          );

        if (!email) {
          this.alertText += "電子信箱格式錯誤 <br>";
        }
      }

      if (this.studentData.parentsName === "") {
        this.alertText += "緊急聯絡人姓名不能為空 <br>";
      } else {
        if (this.studentData.parentsName.length > 18) {
          this.alertText += "緊急聯絡人姓名字數超過規定長度 <br>";
        }
      }

      if (this.studentData.parentsName !== "") {
        const parentsName = /^[\u4E00-\u9FA5]{1,18}$/.test(
          this.studentData.parentsName,
        );

        if (!parentsName) {
          this.alertText += "緊急聯絡人姓名只能為中文字 <br>";
        }
      }

      if (this.studentData.parentsPhone === "") {
        this.alertText += "緊急連絡人電話不能為空 <br>";
      } else {
        if (this.studentData.parentsPhone.length > 20) {
          this.alertText += "緊急連絡人電話字數超過規定長度 <br>";
        }
      }

      if (this.studentData.parentsPhone !== "") {
        const parentsPhone = /^[0-9\d()-/#/*]{1,20}$/.test(
          this.studentData.parentsPhone,
        );

        if (!parentsPhone) {
          this.alertText += "急連絡人電話只能數字 <br>";
        }
      }

      if (this.studentData.cityNumber === "") {
        this.alertText += "城市不能為空 <br>";
      }

      if (this.studentData.institution === "") {
        this.alertText += "公私立不能為空 <br>";
      }

      if (this.studentData.schoolNumber === "") {
        this.alertText += "學校不能為空 <br>";
      }

      if (this.studentData.studentStatus === "") {
        this.alertText += "畢業生類型不能為空 <br>";
      }

      if (this.studentData.identity === "") {
        this.alertText += "身分別不能為空 <br>";
      }

      if (this.studentData.defaultPayment === "") {
        this.alertText += "預計繳費方式不能為空 <br>";
      }

      if (this.studentData.payStatus === "") {
        this.alertText += "繳費身分不能為空 <br>";
      }

      if (this.studentData.reward === "") {
        this.alertText += "在學表現不能為空 <br>";
      }

      if (this.studentData.admission === "") {
        this.alertText += "錄取方式不能為空 <br>";
      }

      if (this.studentData.handicapped === "") {
        this.alertText +=
          "(須申請「身心障礙生或緊急重大傷病生或懷孕生甄選服務」)不能為空 <br>";
      }

      if (this.alertText === "") {
        return "1";
      } else {
        return "2";
      }
    },

    async setSignupScience() {
      this.signupPup = false;
      this.signupProcess = true;
      const data = this.globalSystemTool.equestData(this.studentData);
      data.olyId = this.olyId;
      data.num2 = this.num2;
      data.checkNum = this.checkNum;

      const dateArray = data.birthday.split("/");
      const ROCyear = parseInt(dateArray[0]) + 1911;
      const ROCmonth = dateArray[1];
      data.birthday = ROCyear + "/" + ROCmonth;

      this.checkEmail("checkEmail");

      if (this.normalPup) {
        return false;
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/setSignupScience", data)
        .then((response) => {
          // console.log(response.data)
          this.signupProcess = false;
          if (response.data.code === 200) {
            if (response.data.resultData.payStatus === "2") {
              location.href =
                "/science/signupresult/" + response.data.resultData.sstId;
            } else {
              location.href =
                this.systemENV.APISERVERURL +
                "/ecpay/payment/" +
                response.data.resultData.sstId;
            }
          } else if (response.data.code === 210) {
            alert("非正常報名時間，無法報名");
            location.reload();
          } else if (response.data.code === 212) {
            alert("此學生已經報名過該校");
            this.cleanPupData();
            this.infoStatus = true;
            this.signupPup = false;
            this.confirmStatus = true;
            this.chooseStatus = false;
            this.signupLock = false;
            this.alertText = "";
            this.alertTyep = "";
            this.num2 = "";
            this.checkNum = "";

            // this.sentEditorURLMail(
            //   this.studentData,
            //   response.data.resultData.editorUri
            // );
          } else if (response.data.code === 410) {
            alert("系統忙碌中 請稍等候再按下(確認資料)鍵");
            this.cleanPupData();
            this.signupPup = false;
            this.confirmStatus = true;
            this.chooseStatus = false;
            this.signupLock = false;
            this.alertText = "";
            this.alertTyep = "";
            this.num2 = "";
            this.checkNum = "";
          } else if (response.data.code === 411) {
            alert("由於你停留頁面過久，請再重新取得驗證碼，再次進行驗證");
            this.cleanPupData();
            this.signupPup = false;
            this.confirmStatus = true;
            this.chooseStatus = false;
            this.signupLock = false;
            this.alertText = "";
            this.alertTyep = "";
            this.num2 = "";
            this.checkNum = "";
          } else {
            this.cleanPupData();
            this.signupPup = false;
            this.confirmStatus = true;
            this.chooseStatus = false;
            this.signupLock = false;
            this.alertText = "";
            this.alertTyep = "";
            this.num2 = "";
            this.checkNum = "";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      this.cleanPupData();
      this.signupPup = false;
      this.confirmStatus = true;
      this.chooseStatus = false;
      this.signupLock = false;
      this.alertText = "";
      this.alertTyep = "";
      this.num2 = "";
      this.checkNum = "";

      clearInterval(this.reciprocal);
      clearInterval(this.reciprocalOTP);
    },

    async sentEditorURLMail(info, editorUri) {
      const data = {};
      data.AT = "777";
      data.id = this.olyId;
      data.email = info.email;
      data.signupSchool = info.signupSchool;
      data.editorUri = editorUri;
      data.name = info.name;
      data.type = "signup";

      await this.axios.post(
        this.systemENV.APISERVERURL + "/sentEditorURLMail",
        data,
      );
    },

    async checkEmail(type) {
      const data = {};
      data.email = this.studentData.email;
      data.signupSchool = this.studentData.signupSchool;
      data.olyId = this.olyId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkEmailByScience", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            if (type === "email") {
              this.sendOPTNumberMail();
              this.OTPBtnlock = false;
            } else if (type === "signup") {
              this.setSignupScience();
              this.OTPBtnlock = false;
            }
          } else if (response.data.code === 213) {
            this.normalPup = true;
            this.cleanPupData();
            this.pupTitle = "信箱已被使用！";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "此信箱已被使用，請更換新的信箱！";

            this.signupPup = false;
            this.confirmStatus = true;
            this.chooseStatus = false;
            this.signupLock = false;
            this.alertText = "";
            this.alertTyep = "";
            this.num2 = "";
            this.checkNum = "";
            this.OTPBtnlock = false;

            return false;
            // alert("此信箱已被使用，請更換新的信箱！");
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async sendOPTNumberMail() {
      this.loadView = true;
      this.verifyPass = false;
      const data = {};
      data.email = this.studentData.email;
      data.signupSchool = this.studentData.signupSchool;
      data.name = this.studentData.name;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/sendOPTNumberMail", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            this.sendOPTPup = true;
            this.loadView = false;
            this.num = response.data.resultData.num;
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async verifyOPTNumber() {
      this.loadVerify = true;
      const data = {};
      data.email = this.studentData.email;
      data.OTPNumber = this.studentData.OTPNumber;
      data.num = this.num;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/verifyOPTNumber", data)
        .then((response) => {
          this.loadVerify = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.reciprocalOTP = null;
            clearInterval(this.reciprocalOTP);
            this.lock = false;
            this.num2 = response.data.resultData.num2;
            this.checkNum = response.data.resultData.OTPNumber;
            this.num = "";
            this.verifyPass = true;
            this.OTPPass = true;
          } else if (response.data.code === 411) {
            this.OTPPass = false;
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getScienceSchedule() {
      const data = {};
      data.type = "science";
      data.olympic = this.globalSystemValue.olympic;
      data.teatName = this.testName;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getScienceSchedule", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            if (response.data.resultData.maintain === "1") {
              this.maintainTime = false;
              this.maintain = true;
            } else {
              if (this.testName === null) {
                if (Object.keys(response.data.resultData).length === 0) {
                  this.openStatus = false;
                  this.colseWord = "報名尚未開始";
                } else {
                  const date = this.globalSystemTool.getNowDataTime();

                  if (date < response.data.resultData.signupStart) {
                    this.openStatus = false;
                    this.colseWord = "報名尚未開始";
                  } else if (date > response.data.resultData.signupEnd) {
                    this.openStatus = false;
                    this.colseWord = "報名已結束";
                  } else if (
                    date >= response.data.resultData.signupStart &&
                    date <= response.data.resultData.signupEnd
                  ) {
                    this.openStatus = true;
                    this.olyId = response.data.resultData.olyId;
                    this.changeDate(response.data.resultData.signupEnd);
                  }
                }
              } else {
                this.openStatus = true;
                this.olyId = response.data.resultData.olyId;
                this.changeDate(response.data.resultData.signupEnd);
              }
            }
          } else if (response.data.code === 201) {
            this.openStatus = false;
            this.colseWord = "報名尚未開始";
          } else if (response.data.code === 203) {
            location.href = "/science/signup";
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async checkMaintain() {
      const date = this.globalSystemTool.getNowDataTime();
      const time = date.split(" ");

      if (time[1] >= "24:00") {
        this.maintain = true;
      }

      if (time[1] < "01:00") {
        this.maintain = true;
      }
    },

    changeDate(signupEnd) {
      signupEnd = signupEnd.substr(0, 10);

      const dateArray = signupEnd.split("-");
      let ROC = this.checkPostDate(dateArray[0], dateArray[1], dateArray[2]);

      let newDate = new Date(
        parseInt(ROC.year) + 1911 + "/" + ROC.month + "/" + ROC.date,
      );

      this.sendMailDate = ROC.year + "年" + ROC.month + "月" + ROC.date + "日";
      localStorage.setItem("sendMailDate", this.sendMailDate);
      this.postWord =
        "請於" +
        this.sendMailDate +
        "(" +
        this.changeDataToChar(newDate.getDay()) +
        ")以前將證明文件紙本影印本郵寄本校";

      this.handicappedWord =
        "請於" +
        this.sendMailDate +
        "(" +
        this.changeDataToChar(newDate.getDay()) +
        ")以前填妥甄選服務申請表並與相關證明文件紙本影印本郵寄本校";
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

    cleanPupData() {
      this.signupPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },
  },

  async mounted() {
    if (window.performance.navigation.type === 2) {
      window.location.reload();
    }

    if (window.innerWidth <= 500) {
      this.device = "phone";
    } else {
      this.device = "PC";
    }

    clearInterval(this.reciprocal);
    clearInterval(this.reciprocalOTP);

    await this.getSchoolAddressList();
    await this.getScienceSchedule();
    if (this.systemENV.MOD === "dev" || this.systemENV.MOD === "sit") {
      this.confirmTime = 2;
    } else {
      this.confirmTime = 30;
    }

    let year = new Date().getFullYear();
    if (this.systemENV.MOD === "prod") {
      this.birthdyPickerValue = parseInt(year - 16 - 1911) + "-01";
    } else {
      this.birthdyPickerValue = parseInt(year - 16 - 1911 + 1) + "-01";
    }

    await this.checkMaintain();
    localStorage.removeItem("sendMailDate");
  },
};
</script>
