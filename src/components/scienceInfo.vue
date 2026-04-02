<template>
  <div>
    <div style="margin: 20px; font-size: 14px; font-weight: bold">
      甄選模組:
      <v-btn
        v-if="menuType === 5"
        small
        rounded
        color="#E9F8FF"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-notebook-edit-outline </v-icon>
        <p style="font-size: 14px">甄選考試</p>
      </v-btn>
      <v-btn
        v-if="menuType === 6"
        small
        rounded
        color="#f3ebff"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-rotate-orbit </v-icon>
        <p style="font-size: 14px">實驗實作</p>
      </v-btn>
      <div style="display: inline; margin: 52px">
        甄選名稱:
        <div class="single-line" style="display: inline; margin: 13px">
          {{ signupName }}
        </div>
      </div>
      <div style="margin-top: 20px">
        報名統計:
        <v-icon title="已通過" large style="margin-left: 7px; color: #2bcd2b">
          mdi-circle-small
        </v-icon>
        {{ passCount }}人
        <v-icon title="待審核" large style="margin-left: 7px; color: #ff3c01">
          mdi-circle-small
        </v-icon>
        {{ nopassCount }}人
        <v-icon title="未通過" large style="margin-left: 7px; color: #6b6b6b">
          mdi-circle-small
        </v-icon>
        {{ failCount }}人
        <v-icon title="作廢" large style="margin-left: 7px; color: black">
          mdi-circle-small
        </v-icon>
        {{ cancelCount }}人
        <div v-if="menuType === 5" style="display: inline; margin-left: 50px">
          審查結果通知信狀態:
          <v-icon
            title="審查結果通知信"
            medium
            style="margin-left: 7px; color: #2bcd2b"
          >
            mdi-email-check-outline
          </v-icon>
          <span style="margin-left: 10px"
            >{{ reviewCount }} / {{ desserts.length - cancelCount }}</span
          >
        </div>
        <div v-if="menuType === 6" style="display: inline; margin-left: 50px">
          科學能力通知信狀態:
          <v-icon
            title="科學能力通知信"
            medium
            style="margin-left: 7px; color: #2bcd2b"
          >
            mdi-email-check-outline
          </v-icon>
          <span style="margin-left: 10px"
            >{{ upgradeCount }} / {{ desserts.length - cancelCount }}</span
          >
        </div>
      </div>
    </div>

    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :items-per-page="50"
      :loading="loadList"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
      return-object
      item-key="sstId"
      class="elevation-1"
      show-select
      @toggle-select-all="selectAllToggle"
    >
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
      <template v-slot:item.schoolNumber="{ item }">
        {{ item.schoolNameAll }}
      </template>
      <template v-slot:item.checkType="{ item }">
        <v-chip
          v-if="item.checkTypeName == '待審查'"
          style="background-color: #ffe8e1 !important"
          color="#EB7C7A"
          outlined
        >
          <span style="margin-left: 7px; color: #ff3c01">待審查</span>
          <v-icon small style="margin-left: 7px; color: #ff3c01">
            mdi-stamper
          </v-icon>
        </v-chip>
        <v-chip
          v-if="item.checkTypeName == '已通過'"
          style="background-color: #e3ffe5 !important"
          color="#8CE38E"
          outlined
        >
          <span style="margin-left: 7px; color: #2bcd2b">已通過</span>
          <v-icon small style="margin-left: 7px; color: #2bcd2b">
            mdi-check
          </v-icon>
        </v-chip>
        <v-chip
          v-if="item.checkTypeName == '未通過'"
          style="background-color: #ebebeb !important"
          color="#B2B5B7"
          outlined
        >
          <span style="margin-left: 7px; color: #6b6b6b">未通過</span>
          <v-icon small style="margin-left: 7px; color: #6b6b6b">
            mdi-bell-alert
          </v-icon>
        </v-chip>
        <v-chip
          v-if="item.checkTypeName == '作廢'"
          style="background-color: black !important"
          color="black"
          outlined
        >
          <span style="margin-left: 7px; color: white">作廢</span>
          <v-icon small style="margin-left: 7px; color: white">
            mdi-alert-circle-outline
          </v-icon>
        </v-chip>
      </template>
      <template v-slot:item.paymentNumber="{ item }">
        <div
          v-if="
            item.paymentStatus === '0' &&
            item.payStatus != '2' &&
            scheduleData.paymentType !== 1
          "
        >
          <div style="color: #ff3c01">
            {{ item.paymentStatusName }}
          </div>
        </div>
        <div v-else>
          {{ item.paymentNumber }}
        </div>
      </template>
      <template v-slot:item.paymentStatus="{ item }">
        <v-icon
          v-if="
            (item.paymentStatusName == '已繳費' ||
              item.paymentStatusName == '未退款') &&
            item.payStatus !== '2'
          "
          style="margin-left: 7px; color: #2bcd2b"
        >
          mdi-check-circle-outline
        </v-icon>
        <v-icon
          v-if="
            (item.paymentStatusName == '無須繳費' ||
              item.paymentStatusName == '免繳費' ||
              item.payStatus === '2') &&
            item.payStatusPass == '1' &&
            menuType !== 6
          "
          style="margin-left: 7px; color: #2bcd2b"
        >
          mdi-stamper
        </v-icon>
        <v-icon
          v-if="
            (item.paymentStatusName == '無須繳費' ||
              item.paymentStatusName == '免繳費' ||
              item.payStatus === '2') &&
            item.payStatusPass == '0' &&
            menuType !== 6
          "
          style="margin-left: 7px; color: #ff3c01"
        >
          mdi-stamper
        </v-icon>
      </template>
      <template v-slot:item.idCard="{ item }">
        <v-icon
          medium
          :title="item.idCard"
          @click="
            snackMail = snackMail && item.sstId === copySstId ? false : true;
            copyName = '身分證編號 ';
            copyValue = item.idCard;
            copySstId = item.stId;
          "
          color="black"
        >
          mdi-id-card
        </v-icon>
      </template>
      <template v-slot:item.email="{ item }">
        <v-icon
          v-if="menuType === 6 && item.leveltwoNotice === 1"
          style="color: #9d3d9f; font-weight: bold"
          medium
          :title="item.email"
          @click="
            snackMail = snackMail && item.sstId === copySstId ? false : true;
            copyName = '信箱';
            copyValue = item.email;
            copySstId = item.sstId;
          "
        >
          mdi-email-outline
        </v-icon>

        <v-icon
          v-else-if="menuType === 5 && item.leveloneNotice === 1"
          style="color: #9d3d9f; font-weight: bold"
          medium
          :title="item.email"
          @click="
            snackMail = snackMail && item.sstId === copySstId ? false : true;
            copyName = '信箱';
            copyValue = item.email;
            copySstId = item.sstId;
          "
        >
          mdi-email-outline
        </v-icon>

        <v-icon
          v-else
          medium
          :title="item.email"
          @click="
            snackMail = snackMail && item.sstId === copySstId ? false : true;
            copyName = '信箱';
            copyValue = item.email;
            copySstId = item.sstId;
          "
          color="black"
        >
          mdi-email-outline
        </v-icon>
      </template>
      <template v-slot:item.birthday="{ item }">
        <span v-if="item.agePass === 0" style="color: red">
          {{ item.birthday }}
        </span>
        <span v-else> {{ item.birthday }} </span>
      </template>
      <template v-slot:item.admission="{ item }">
        <v-icon
          v-if="item.admissionName == '直接錄取' && item.admissionPass == '1'"
          style="margin-left: 7px; color: #2bcd2b"
        >
          mdi-account-check
        </v-icon>
        <v-icon
          v-if="item.admissionName == '直接錄取' && item.admissionPass == '0'"
          style="margin-left: 7px; color: #ff3c01"
        >
          mdi-account-check
        </v-icon>
      </template>
      <template v-slot:top>
        <v-toolbar flat style="background-color: white">
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            @click="dowloadPup = true"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px">匯出</p>
          </v-btn>
          <v-divider class="mx-1" inset vertical></v-divider>
          <v-btn
            v-if="menuType === 5"
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="selected.length === 0"
            @click="sendResultMailEditor()"
          >
            <v-icon small left> mdi-email-arrow-right-outline </v-icon>
            <p style="font-size: 13px">審查結果通知信</p>
          </v-btn>
          <v-btn
            v-if="menuType === 6"
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="selected.length === 0"
            @click="sendResultMailEditor()"
          >
            <v-icon small left> mdi-email-arrow-right-outline </v-icon>
            <p style="font-size: 13px">通過科學能力檢定通知信</p>
          </v-btn>
          <v-btn
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="
              contestantShow && systemENV.MOD === 'prod' && actionTest === ''
            "
            @click="createExamCodeAlert()"
          >
            <v-icon small left> mdi-card-account-details-outline </v-icon>
            <p style="font-size: 13px">產生甄選資料</p>
          </v-btn>
        </v-toolbar>
        <div
          v-if="selected.length > 0"
          style="background-color: #f5f5f5; height: 36px"
        >
          <span
            style="
              display: flex;
              justify-content: center;
              color: blue;
              margin-top: 1px;
            "
            ><u
              v-if="menuType === 5"
              style="margin-top: 6px; font-size: 14px; cursor: pointer"
              @click="sendResultMailEditor()"
              >寄送全部 - 審查結果通知信</u
            >
            <u
              v-if="menuType === 6"
              style="margin-top: 6px; font-size: 14px; cursor: pointer"
              @click="sendResultMailEditor()"
              >寄送全部 - 通過科學能力檢定通知信</u
            >
          </span>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          title="審核甄選生"
          class="mr-2"
          @click="reviewStudent(item, 'review')"
          >mdi-script-text-outline
        </v-icon>
        <v-icon title="編輯甄選生" class="mr-2" @click="editItem(item)"
          >mdi-text-box-edit-outline
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog v-model="reviewPup" max-width="640px">
      <v-card>
        <v-card-title style="background-color: #434447; height: 46px">
          <v-icon
            large
            style="font-size: 23px; font-weight: bold; color: white"
          >
            mdi-account-box-multiple
          </v-icon>
          <span
            class=""
            style="
              font-size: 18px !important;
              font-weight: bold;
              color: white;
              margin-left: 5px;
            "
          >
            甄選審查 - {{ editedItem.name }}</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-card v-if="editedItem.agePass === 0 || editedItem.agePass === 3">
            <v-card-title style="background-color: #ededf3; height: 46px">
              <span
                style="
                  font-size: 17px !important;
                  font-weight: 900;
                  margin-top: -11px;
                "
                >確認是否為國三應屆畢業生</span
              >
            </v-card-title>
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <v-checkbox
                v-model="editedItem.agePassStatus"
                :label="'已確認 (生日： ' + editedItem.birthday + ')'"
                @click="
                  editedItem.agePass = editedItem.agePassStatus === true ? 3 : 0
                "
                style="font-size: 18px; font-weight: bold; color: black"
              ></v-checkbox>
            </v-card-text>
          </v-card>
          <v-card>
            <v-card-title style="background-color: #ededf3; height: 46px">
              <v-btn
                :disabled="menuType === 6"
                x-small
                style="
                  margin: 2px -4px 7px !important;
                  height: 30px;
                  color: black !important;
                  background-color: #ededf3;
                "
                @click="chagneIdentity = true"
              >
                <v-icon dark> mdi-reload-alert </v-icon>
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
                v-if="editedItem.studentStatus === '1'"
                style="font-size: 15px; font-weight: bold"
              >
                國三應屆畢業生
              </div>
              <div
                v-if="editedItem.studentStatus === '2'"
                style="font-size: 15px; font-weight: bold"
              >
                特殊教育國中生
                <v-btn
                  :disabled="menuType === 6"
                  small
                  :style="{
                    backgroundColor:
                      editedItem.studentStatusPass == '1'
                        ? '#e3ffe5'
                        : '#ededf3',
                    marginLeft: '320px',
                  }"
                  @click="
                    editedItem.studentStatusPass =
                      editedItem.studentStatusPass === '1' ? '0' : '1'
                  "
                >
                  <v-icon
                    v-if="editedItem.studentStatusPass == '0'"
                    small
                    dark
                    style="color: gray"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="editedItem.studentStatusPass == '1'"
                    small
                    dark
                    style="color: #2bcd2b"
                  >
                    mdi-check
                  </v-icon>
                  <span
                    v-if="editedItem.studentStatusPass == '0'"
                    style="margin-left: 7px; color: gray"
                    >符合</span
                  >
                  <span
                    v-if="editedItem.studentStatusPass == '1'"
                    style="margin-left: 7px; color: #2bcd2b"
                    >符合</span
                  >
                </v-btn>
              </div>
              <div
                v-if="editedItem.identity === '1'"
                style="font-size: 15px; font-weight: bold"
              >
                一般生
              </div>
              <div
                v-if="editedItem.identity === '2'"
                style="font-size: 15px; font-weight: bold; margin-top: 10px"
              >
                特殊身分
                <v-btn
                  :disabled="menuType === 6"
                  small
                  :style="{
                    backgroundColor:
                      editedItem.identityPass == '1' ? '#e3ffe5' : '#ededf3',
                    marginLeft: '366px',
                  }"
                  @click="
                    editedItem.identityPass =
                      editedItem.identityPass === '1' ? '0' : '1'
                  "
                >
                  <v-icon
                    v-if="editedItem.identityPass == '0'"
                    small
                    dark
                    style="color: gray"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="editedItem.identityPass == '1'"
                    small
                    dark
                    style="color: #2bcd2b"
                  >
                    mdi-check
                  </v-icon>
                  <span
                    v-if="editedItem.identityPass == '0'"
                    style="margin-left: 7px; color: gray"
                    >符合</span
                  >
                  <span
                    v-if="editedItem.identityPass == '1'"
                    style="margin-left: 7px; color: #2bcd2b"
                    >符合</span
                  >
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-card-title style="background-color: #ededf3; height: 46px">
              <v-btn
                :disabled="menuType === 6"
                x-small
                outlined
                class="ma-2 white--text"
                style="
                  margin: 2px -4px 7px !important;
                  height: 30px;
                  color: black !important;
                  background-color: #ededf3;
                "
                @click="
                  editedItem.payStatus =
                    editedItem.payStatus === '1' ? '2' : '1';
                  editedItem.payStatusPass = '0';
                  chagnePaymentStatus();
                "
              >
                <v-icon dark> mdi-reload-alert </v-icon>
              </v-btn>
              <span
                style="
                  font-size: 17px !important;
                  font-weight: 900;
                  margin-left: 17px;
                "
                >繳費身分</span
              >
            </v-card-title>
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <div
                v-if="editedItem.payStatus === '1'"
                style="font-size: 15px; font-weight: bold"
              >
                一般生
                <v-divider class="my-2"></v-divider>
                <div
                  v-if="editedItem.paymentStatus === '13'"
                  style="font-size: 15px; font-weight: bold"
                >
                  {{ editedItem.paymentType }}
                </div>
                <div v-else-if="editedItem.paymentStatus === '0'">
                  <div>繳款人：{{ editedItem.name }}</div>
                  <div>繳費序號：無</div>
                  <div>付款金額：{{ price }} 元</div>
                  <div>付款方式：{{ editedItem.paymentType }}</div>
                  <div>付款狀態：{{ editedItem.paymentStatusName }}</div>
                </div>
                <div v-else-if="editedItem.paymentStatus !== '13'">
                  <div>繳款人：{{ editedItem.name }}</div>
                  <div>繳費序號：{{ editedItem.paymentNumber }}</div>
                  <div>付款金額：{{ price }} 元</div>
                  <div>付款方式：{{ editedItem.paymentType }}</div>
                  <div>付款狀態：{{ editedItem.paymentStatusName }}</div>
                </div>
                <v-btn
                  @click="
                    paymentPup = true;
                    getPaymentList();
                  "
                  style="
                    background-color: white;
                    margin-top: 16px;
                    width: 100%;
                    font-weight: bold;
                  "
                >
                  <v-icon> mdi-list-box-outline </v-icon>
                  <span>繳費歷程</span>
                </v-btn>
              </div>
              <div
                v-if="editedItem.payStatus === '2'"
                style="font-size: 15px; font-weight: bold"
              >
                免繳費
                <v-btn
                  :disabled="menuType === 6"
                  small
                  :style="{
                    backgroundColor:
                      editedItem.payStatusPass == '1' ? '#e3ffe5' : '#ededf3',
                    marginLeft: '382px',
                  }"
                  @click="
                    editedItem.payStatusPass =
                      editedItem.payStatusPass === '1' ? '0' : '1'
                  "
                >
                  <v-icon
                    v-if="editedItem.payStatusPass == '0'"
                    small
                    dark
                    style="color: gray"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="editedItem.payStatusPass == '1'"
                    small
                    dark
                    style="color: #2bcd2b"
                  >
                    mdi-check
                  </v-icon>
                  <span
                    v-if="editedItem.payStatusPass == '0'"
                    style="margin-left: 7px; color: gray"
                    >符合</span
                  >
                  <span
                    v-if="editedItem.payStatusPass == '1'"
                    style="margin-left: 7px; color: #2bcd2b"
                    >符合</span
                  >
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-card-title style="background-color: #ededf3; height: 46px">
              <v-btn
                :disabled="menuType === 6"
                x-small
                outlined
                class="ma-2 white--text"
                style="
                  margin: 2px -4px 7px !important;
                  height: 30px;
                  color: black !important;
                  background-color: #ededf3;
                "
                @click="
                  chagneReward = true;
                  editedItem.rewardPass = '0';
                "
              >
                <v-icon dark> mdi-reload-alert </v-icon>
              </v-btn>
              <span
                style="
                  font-size: 17px !important;
                  font-weight: 900;
                  margin-left: 17px;
                "
                >於國民中學就學期間之表現，符合下列規定之一：</span
              >
            </v-card-title>
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <div
                v-if="editedItem.reward === '1'"
                style="font-size: 15px; font-weight: bold; display: inline"
              >
                依各校自行訂定之評量規定，依序推薦。
              </div>
              <div
                v-if="editedItem.reward === '2'"
                style="font-size: 15px; font-weight: bold; display: inline"
              >
                經各該教育主管機關鑑定為數理資賦優異者。
              </div>
              <div
                v-if="editedItem.reward === '3'"
                style="font-size: 15px; font-weight: bold; display: inline"
              >
                通過「國際國中科學奧林匹亞競賽」或「國際......
              </div>
              <div
                v-if="editedItem.reward === '4'"
                style="font-size: 15px; font-weight: bold; display: inline"
              >
                曾獲教育部或國教署主辦有關數理科目之全國......
              </div>
              <div style="display: inline">
                <v-btn
                  :disabled="menuType === 6"
                  v-if="editedItem.reward === '3' || editedItem.reward === '4'"
                  small
                  :style="{
                    backgroundColor:
                      editedItem.rewardPass == '1' ? '#e3ffe5' : '#ededf3',
                    marginLeft: '91px',
                  }"
                  @click="
                    editedItem.rewardPass =
                      editedItem.rewardPass === '1' ? '0' : '1'
                  "
                >
                  <v-icon
                    v-if="editedItem.rewardPass == '0'"
                    small
                    dark
                    style="color: gray"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="editedItem.rewardPass == '1'"
                    small
                    dark
                    style="color: #2bcd2b"
                  >
                    mdi-check
                  </v-icon>
                  <span
                    v-if="editedItem.rewardPass == '0'"
                    style="margin-left: 7px; color: gray"
                    >符合</span
                  >
                  <span
                    v-if="editedItem.rewardPass == '1'"
                    style="margin-left: 7px; color: #2bcd2b"
                    >符合</span
                  >
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-card-title style="background-color: #ededf3; height: 46px">
              <v-btn
                :disabled="menuType === 6"
                x-small
                outlined
                class="ma-2 white--text"
                style="
                  margin: 2px -4px 7px !important;
                  height: 30px;
                  color: black !important;
                  background-color: #ededf3;
                "
                @click="
                  editedItem.admission =
                    editedItem.admission === '1' ? '2' : '1';
                  editedItem.admissionPass = '0';
                "
              >
                <v-icon dark> mdi-reload-alert </v-icon>
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
                  v-if="editedItem.admission === '1'"
                  style="font-size: 15px; font-weight: bold"
                >
                  甄選錄取
                </div>
                <div
                  v-if="editedItem.admission === '2'"
                  style="font-size: 15px; font-weight: bold"
                >
                  直接錄取
                  <v-btn
                    :disabled="menuType === 6"
                    small
                    :style="{
                      backgroundColor:
                        editedItem.admissionPass == '1' ? '#e3ffe5' : '#ededf3',
                      marginLeft: '367px',
                    }"
                    @click="
                      editedItem.admissionPass =
                        editedItem.admissionPass === '1' ? '0' : '1'
                    "
                  >
                    <v-icon
                      v-if="editedItem.admissionPass == '0'"
                      small
                      dark
                      style="color: gray"
                    >
                      mdi-check
                    </v-icon>
                    <v-icon
                      v-if="editedItem.admissionPass == '1'"
                      small
                      dark
                      style="color: #2bcd2b"
                    >
                      mdi-check
                    </v-icon>
                    <span
                      v-if="editedItem.admissionPass == '0'"
                      style="margin-left: 7px; color: gray"
                      >符合</span
                    >
                    <span
                      v-if="editedItem.admissionPass == '1'"
                      style="margin-left: 7px; color: #2bcd2b"
                      >符合</span
                    >
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-card-title style="background-color: #ededf3; height: 46px">
              <v-btn
                :disabled="menuType === 6"
                x-small
                outlined
                class="ma-2 white--text"
                style="
                  margin: 2px -4px 7px !important;
                  height: 30px;
                  color: black !important;
                  background-color: #ededf3;
                "
                @click="
                  editedItem.handicapped =
                    editedItem.handicapped === '1' ? '2' : '1';
                  editedItem.handicappedPass = '0';
                "
              >
                <v-icon dark> mdi-reload-alert </v-icon>
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
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <div
                v-if="editedItem.handicapped === '1'"
                style="font-size: 15px; font-weight: bold"
              >
                是
                <v-btn
                  :disabled="menuType === 6"
                  small
                  :style="{
                    backgroundColor:
                      editedItem.handicappedPass == '1' ? '#e3ffe5' : '#ededf3',
                    marginLeft: '411px',
                  }"
                  @click="
                    editedItem.handicappedPass =
                      editedItem.handicappedPass === '1' ? '0' : '1'
                  "
                >
                  <v-icon
                    v-if="editedItem.handicappedPass == '0'"
                    small
                    dark
                    style="color: gray"
                  >
                    mdi-check
                  </v-icon>
                  <v-icon
                    v-if="editedItem.handicappedPass == '1'"
                    small
                    dark
                    style="color: #2bcd2b"
                  >
                    mdi-check
                  </v-icon>
                  <span
                    v-if="editedItem.handicappedPass == '0'"
                    style="margin-left: 7px; color: gray"
                    >符合</span
                  >
                  <span
                    v-if="editedItem.handicappedPass == '1'"
                    style="margin-left: 7px; color: #2bcd2b"
                    >符合</span
                  >
                </v-btn>
              </div>
              <div
                v-if="editedItem.handicapped === '2'"
                style="font-size: 15px; font-weight: bold"
              >
                否
              </div>
            </v-card-text>
          </v-card>
          <v-btn
            @click="
              recordPup = true;
              getRcordList();
            "
            style="
              background-color: white;
              margin-top: 16px;
              width: 100%;
              font-weight: bold;
            "
          >
            <v-icon> mdi-list-box-outline </v-icon>
            <span>歷程記錄</span>
          </v-btn>
          <v-card style="margin-top: 20px">
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <span style="font-size: 15px; font-weight: bold"
                >聯繫通知信：</span
              >
              <v-textarea
                v-model="editedItem.emailContent"
                outlined
                name="input-7-4"
                label="請輸入信件內容"
                :counter="500"
                style="margin-top: 5px"
              ></v-textarea>
              <div style="margin-top: -23px; margin-bottom: 9px">
                <span style="font-size: 13px; font-weight: bold"
                  >甄試生修改報名網址：</span
                >
                <br />
                <span style="font-size: 13px; font-weight: bold">{{
                  systemENV.VUE_APP_LOCALURL +
                  "/science/verifyOPT/" +
                  editedItem.editorUri
                }}</span>
              </div>
              <v-btn
                small
                color="#434447"
                dark
                @click="sendMailCheckAlert(editedItem, 'review')"
              >
                <v-icon small left> mdi-email-arrow-right-outline </v-icon>
                <p style="font-size: 13px">寄送</p>
              </v-btn>
              <v-overlay :value="sendLoad">
                <v-progress-circular
                  :size="50"
                  color="primary"
                  indeterminate
                ></v-progress-circular>
                <div>寄信中....</div>
              </v-overlay>
            </v-card-text>
          </v-card>
          <v-card style="margin-top: 20px">
            <v-card-text
              style="font-size: 20px; margin-top: 19px; font-weight: bold"
            >
              <v-radio-group
                :disabled="menuType === 6"
                v-model="editedItem.checkType"
                inline
                required
              >
                <v-radio
                  :value="'2'"
                  style="width: 29%"
                  @change="checkReviewPass()"
                >
                  <template v-slot:label>
                    <v-chip
                      style="background-color: #e3ffe5 !important; width: 90%"
                      color="#8CE38E"
                      outlined
                    >
                      <span style="margin-left: 7px; color: #2bcd2b"
                        >已通過</span
                      >
                      <v-icon small style="margin-left: 7px; color: #2bcd2b">
                        mdi-check
                      </v-icon>
                    </v-chip>
                  </template>
                </v-radio>
                <v-radio :value="'3'" style="width: 35%">
                  <template v-slot:label>
                    <v-chip
                      style="background-color: #ebebeb !important"
                      color="#B2B5B7"
                      outlined
                    >
                      <span style="margin-left: 7px; color: #6b6b6b"
                        >未通過</span
                      >
                      <v-icon small style="margin-left: 7px; color: #6b6b6b">
                        mdi-bell-alert
                      </v-icon>
                    </v-chip>
                  </template>
                </v-radio>
                <v-radio :value="'1'" style="width: 35%">
                  <template v-slot:label>
                    <v-chip
                      style="background-color: #ffe8e1 !important"
                      color="#EB7C7A"
                      outlined
                    >
                      <span style="margin-left: 7px; color: #ff3c01"
                        >待審查</span
                      >
                      <v-icon small style="margin-left: 7px; color: #ff3c01">
                        mdi-stamper
                      </v-icon>
                    </v-chip>
                  </template>
                </v-radio>
                <v-radio :value="'4'" style="width: 35%; margin-top: 20px">
                  <template v-slot:label>
                    <v-chip
                      style="background-color: black !important"
                      color="black"
                      outlined
                    >
                      <span style="margin-left: 7px; color: white">作廢</span>
                      <v-icon small style="margin-left: 7px; color: white">
                        mdi-alert-circle-outline
                      </v-icon>
                    </v-chip>
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color=" darken-1"
            text
            @click="reviewClose"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="checkSave('review')"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="chagneIdentity" max-width="500px">
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
            v-model="editedItem.studentStatus"
            @change="studenIdentity('studentStatus')"
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
          </v-radio-group>
          <v-divider class="my-2"></v-divider>
          <v-radio-group
            v-model="editedItem.identity"
            @change="studenIdentity('identity')"
            inline
          >
            <v-radio :value="'1'" label="一般生" style="width: 35%"></v-radio>
            <v-radio :value="'2'" label="特殊身分" style="width: 35%"></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="chagneIdentity = false"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="chagneReward" max-width="500px">
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
            >於國民中學就學期間之表現，符合下列規定之一：</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-radio-group v-model="editedItem.reward">
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
            <v-radio
              :value="'4'"
              label="曾參加教育部或教育部國民及學前教育署辦理有關數理科目之全國競賽，獲得獎項。"
              style="width: 85%"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="chagneReward = false"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="alertPup" max-width="500px">
      <v-card>
        <v-card-title
          v-if="pupTitleShow === '1'"
          style="background-color: #2d5bff; height: 48px"
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
        <v-card-text style="font-size: 20px; font-weight: bold">
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="!sendURLmail"
            left
            color="blue darken-1"
            text
            @click="cleanPupData"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
          <v-btn
            v-if="sendURLmail"
            left
            color="darken-1"
            text
            @click="
              cleanPupData;
              alertPup = false;
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            v-if="sendURLmail"
            left
            color="blue darken-1"
            text
            @click="sentEditorURLMail()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="recordPup" max-width="70%">
      <v-card style="weight: auto">
        <v-card-title style="background-color: #434447">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-list-box-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >歷程記錄</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-data-table
            v-model="recordTable"
            :headers="recordHeader"
            :items="recordList"
            :hide-default-footer="true"
            :items-per-page="200"
          >
            <template v-slot:item.contact="{ item }">
              <span v-html="item.contact"></span>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="
              recordPup = false;
              recordList = [];
            "
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="paymentPup" max-width="70%">
      <v-card style="weight: auto">
        <v-card-title style="background-color: #434447">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-list-box-outline
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >繳費記錄</span
          >
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <v-data-table
            v-model="paymentTable"
            :headers="paymentHeader"
            :items="paymentList"
            :hide-default-footer="true"
            :items-per-page="200"
          >
            <template v-slot:item.price="{ item }">
              <span>{{ price }} 元</span>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="
              paymentPup = false;
              paymentList = [];
            "
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="remarkPup" max-width="500px">
      <v-card>
        <v-card-title style="background-color: #2d5bff; height: 48px">
          <v-icon
            large
            style="font-size: 23px; font-weight: bold; margin-right: 7px"
          >
            {{ pupTitleIcon }}
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >請註記作廢原因</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          <v-textarea
            v-model="editedItem.remark"
            outlined
            name="input-7-4"
            label="請輸入作廢原因"
            :counter="100"
            :rules="[(v) => v.length <= 100 || '超過規定字數']"
            style="margin-top: 5px"
          ></v-textarea>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color=" darken-1"
            text
            @click="remarkPup = false"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="setRemark"
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
          style="background-color: #2d5bff; height: 48px"
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
            v-if="alertType === 'review' || alertType === 'result'"
            left
            color="darken-1"
            text
            @click="
              sendMailpup = false;
              alertType = '';
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >

          <v-btn
            v-if="alertType !== 'review' && alertType !== 'result'"
            left
            color="darken-1"
            text
            @click="
              sendMailpup = false;
              alertType = '';
            "
            style="font-weight: bold; font-size: 17px"
            >關閉</v-btn
          >

          <v-btn
            v-if="alertType === 'review'"
            left
            color="blue darken-1"
            text
            @click="sentReviewMail"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
          <v-btn
            v-if="alertType === 'result'"
            left
            color="blue darken-1"
            text
            @click="sendResultMail"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="sendResultMailpup" width="600px">
      <v-card>
        <v-card-title
          v-if="pupTitleShow === '1'"
          style="background-color: black; height: 48px"
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
          <div v-if="menuType === 5 && !sendpass && !sendnopass">
            無法寄送結果信
          </div>
          <div v-if="menuType === 6 && admissionShow && !noadmissionShow">
            直接錄取生無須發送通知信
          </div>
          <v-card v-if="sendpass">
            <v-chip
              v-if="menuType === 5"
              style="
                background-color: #e3ffe5 !important;
                margin-left: 7px;
                margin-top: 7px;
              "
              color="#8CE38E"
              outlined
            >
              <span style="margin-left: 7px; color: #2bcd2b">已通過</span>
              <v-icon small style="margin-left: 7px; color: #2bcd2b">
                mdi-check
              </v-icon>
            </v-chip>
            <div
              v-if="noadmissionShow"
              style="
                margin-left: 7px;
                margin-top: 7px;
                margin-bottom: 13px;
                font-size: 15px;
              "
            >
              <span v-if="menuType === 5" style="color: blue">甄選錄取</span>
              <span v-if="menuType === 6" style="color: blue">晉級</span>

              <span v-if="menuType === 5">-審查通過信件內容：</span>
              <span v-if="menuType === 6">-晉級通知信件內容：</span>
            </div>
            <v-textarea
              v-if="noadmissionShow"
              v-model="passMsg"
              outlined
              name="input-7-4"
              label="請輸入信件內容"
              style="margin-top: 5px; margin-left: 7px; width: 95%"
            ></v-textarea>
            <div
              v-if="admissionShow && menuType === 5"
              style="
                margin-left: 7px;
                margin-top: 7px;
                margin-bottom: 13px;
                font-size: 15px;
              "
            >
              <span style="color: blue">直接錄取</span>-審查通過信件內容：
            </div>
            <v-textarea
              v-if="admissionShow && menuType === 5"
              v-model="admissionMsg"
              outlined
              name="input-7-4"
              label="請輸入信件內容"
              style="margin-top: 5px; margin-left: 7px; width: 95%"
            ></v-textarea>
          </v-card>
          <v-card v-if="sendnopass && menuType === 5" style="margin-top: 20px">
            <v-chip
              style="
                background-color: #ebebeb !important;
                margin-left: 7px;
                margin-top: 7px;
              "
              color="#B2B5B7"
              outlined
            >
              <span style="margin-left: 7px; color: #6b6b6b">未通過</span>
              <v-icon small style="margin-left: 7px; color: #6b6b6b">
                mdi-bell-alert
              </v-icon>
            </v-chip>
            <div style="margin-left: 7px; margin-top: 7px; font-size: 15px">
              未通過信件內容：
            </div>
            <v-textarea
              v-model="nopassMsg"
              outlined
              name="input-7-4"
              label="請輸入信件內容"
              style="margin-top: 5px; margin-left: 7px; width: 95%"
            ></v-textarea>
          </v-card>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="menuType === 6 && admissionShow && !noadmissionShow"
            left
            color="darken-1"
            text
            @click="
              sendResultMailpup = false;
              sendpass = false;
              sendnopass = false;
              admissionShow = false;
            "
            style="font-weight: bold; font-size: 17px"
            >關閉</v-btn
          >
          <v-btn
            v-else
            left
            color="darken-1"
            text
            @click="
              sendResultMailpup = false;
              sendpass = false;
              sendnopass = false;
              admissionShow = false;
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >

          <v-btn
            v-if="
              menuType === 6 &&
              selected.length === 1 &&
              !admissionShow &&
              noadmissionShow
            "
            left
            color="blue darken-1"
            text
            @click="sendMailCheckAlert(editedItem, 'result')"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            :disabled="!sendpass && !sendnopass"
            >確定</v-btn
          >

          <v-btn
            v-if="menuType === 6 && selected.length > 1"
            left
            color="blue darken-1"
            text
            @click="sendMailCheckAlert(editedItem, 'result')"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            :disabled="!sendpass && !sendnopass"
            >確定</v-btn
          >

          <v-btn
            v-if="menuType === 5"
            left
            color="blue darken-1"
            text
            @click="sendMailCheckAlert(editedItem, 'result')"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            :disabled="!sendpass && !sendnopass"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="createExamCodePup" max-width="500px">
      <v-card>
        <v-card-title style="background-color: #900d16; height: 48px">
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
            @click="createExamCodePup = false"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="createExamCode"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dowloadPup" width="24%">
      <v-card>
        <v-card-title
          style="background-color: #0046fe !important; color: white"
        >
          <v-icon
            large
            class="mr-2 white--text"
            style="font-size: 24px; color: white"
          >
            mdi-tray-arrow-down
          </v-icon>
          <span style="font-size: 18px; font-weight: bold">下載選擇</span>
        </v-card-title>

        <v-card-text style="font-size: 18px; font-weight: bold; color: #2d5bff">
          <v-checkbox
            v-model="selectDowloadTyep"
            label="報名資料"
            value="signupData"
            style="font-size: 18px; font-weight: bold; color: black"
          ></v-checkbox>
          <v-checkbox
            v-model="selectDowloadTyep"
            label="對帳報表"
            value="accountData"
            style="font-size: 18px; font-weight: bold; color: black"
          ></v-checkbox>
        </v-card-text>
        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            color="black darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="close"
          >
            取消
          </v-btn>
          <v-btn
            v-if="selectDowloadTyep === ''"
            :disabled="true"
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
          >
            確定</v-btn
          >
          <v-btn
            v-if="selectDowloadTyep === 'signupData'"
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="downloadStudentlFile"
          >
            確定</v-btn
          >
          <v-btn
            v-if="selectDowloadTyep === 'accountData'"
            color="darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="downloadStudentlFile"
          >
            確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="checkReviewPup" max-width="500px">
      <v-card style="weight: auto">
        <v-card-title style="background-color: #900d16">
          <v-icon
            large
            style="
              font-size: 23px;
              font-weight: bold;
              color: white;
              margin-right: 7px;
            "
          >
            mdi-account-alert
          </v-icon>
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >未審核資料</span
          >
        </v-card-title>
        <v-card-text style="font-size: 20px; font-weight: bold">
          尚有資料未審核！無法通過此甄選生資格！
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="checkReviewPup = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog" width="600px">
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
                <v-col cols="12" sm="6" md="6" style="margin-top: -19px">
                  <v-text-field
                    v-model="editedItem.name"
                    label="學生姓名"
                    :counter="18"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '學生姓名不能為空',
                      (v) => v.length <= 18 || '超過規定字數',
                    ]"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="2" md="6" style="margin-top: -19px">
                  <!-- <v-dialog
                    ref="dialog"
                    v-model="modal"
                    :return-value.sync="editedItem.birthday"
                    persistent
                    width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.birthday"
                        label="出生年月"
                        prepend-icon="mdi-calendar"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @blur="date = parseDate(editedItem.birthday)"
                        :rules="[(v) => !!v || '出生年月不能為空']"
                        required
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="editedItem.birthday"
                      type="month"
                      scrollable
                      locale="zh-cn"
                    >
                      <v-spacer></v-spacer>
                      <v-btn text color="primary" @click="modal = false">
                        取消
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        @click="$refs.dialog.save(editedItem.birthday)"
                      >
                        確認
                      </v-btn>
                    </v-date-picker>
                  </v-dialog> -->
                </v-col>
                <v-col
                  v-if="editedIndex === -1"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.idCard"
                    label="身分證統一編號"
                    variant="underlined"
                    :rules="idCartRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="editedIndex !== -1"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.idCard"
                    label="身分證統一編號"
                    variant="underlined"
                    :rules="idCartRules2"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="6" style="margin-top: -31px">
                  <v-text-field
                    v-model="editedItem.email"
                    label="信箱"
                    variant="underlined"
                    :rules="emailRules"
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                  <div>就讀國中：</div>
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-select
                    v-model="editedItem.cityNumber"
                    :items="cityList"
                    item-title="city_name"
                    item-value="city_number"
                    label="城市"
                    variant="underlined"
                    :rules="[(v) => !!v || '城市不能為空']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-select
                    v-model="editedItem.institution"
                    :items="institution"
                    item-title="state"
                    item-value="value"
                    label="公/私立"
                    variant="underlined"
                    :rules="[(v) => !!v || '公/私立不能為空']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="4" style="margin-top: -31px">
                  <v-select
                    v-model="editedItem.schoolNumber"
                    :items="
                      dialog
                        ? schoolList[editedItem.cityNumber][
                            editedItem.institution
                          ]
                        : []
                    "
                    item-title="school_name"
                    item-value="school_number"
                    label="校名"
                    variant="underlined"
                    :rules="[(v) => !!v || '校名不能為空']"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                  <distribution-seat
                    :id="id"
                    :examCodeExist="examCodeExist"
                    :studentExamCode="studentExamCode"
                    :editedItem="editedItem"
                    :editedIndex="editedIndex"
                    :desserts="desserts"
                    @updateTable="updateTable"
                    @updateEditedItem="updateEditedItem"
                    @updateStudentExamCode="updateStudentExamCode"
                  >
                  </distribution-seat>
                </v-col>
              </v-row>
              <v-btn
                v-if="editedItem.paymentStatus !== '13'"
                @click="alertURLMailPop()"
                style="
                  background-color: white;
                  margin-top: 16px;
                  width: 100%;
                  font-weight: bold;
                "
              >
                <v-icon> mdi-email-arrow-right-outline </v-icon>
                <span>補寄送修改報名資料連結</span>
              </v-btn>
            </v-container>
          </v-card-text>
          <v-card-actions style="margin-top: -27px">
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
              @click="saveStudentInfo('student')"
              :disabled="!valid || editedItem.signupStatus === ''"
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
import DistributionSeat from "./utilsComponets/distributionSeat.vue";

export default {
  data: () => ({
    date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
      .toISOString()
      .substr(0, 10),
    sendMailpup: false,
    snackbarTimeout: 10000,
    loadList: false,
    dowloadPup: false,
    alertPup: false,
    remarkPup: false,
    reviewPup: false,
    recordPup: false,
    paymentPup: false,
    checkReviewPup: false,
    createExamCodePup: false,
    chagneIdentity: false,
    chagneReward: false,
    sendResultMailpup: false,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    selectDowloadTyep: "",
    cityList: [],
    schoolList: [],
    selected: [],
    recordTable: [],
    paymentTable: [],
    menu: false,
    menuType: 0,
    modal: false,
    statusName: "",
    signupName: "",
    valid: true,
    levelStatus: true,
    dialog: false,
    loadShow: false,
    loadFile: false,
    sendLoad: false,
    sendpass: false,
    sendnopass: false,
    noadmissionShow: false,
    contestantShow: false,
    admissionShow: false,
    sendURLmail: false,
    examCodeExist: false,
    passMsg: "",
    nopassMsg:
      "經本校審查委員會審議，很抱歉，您不符合本校審查資格，謝謝您的參與。\n\n若有問題請致電本校確認，謝謝\n\n",
    admissionMsg:
      "經本校審查委員會審議，您符合本校科學班資格。\n\n若有問題請致電本校確認，謝謝\n\n",
    headers: [],
    recordHeader: [],
    paymentHeader: [],
    institution: [
      { state: "公立", value: "公立" },
      { state: "私立", value: "私立" },
      { state: "國際", value: "國際" },
    ],
    idCartRules: [
      (v) => !!v || "身分證統一編號不能為空",
      (v) =>
        /^[A-Za-z][1-2]\d{8}$/.test(v) ||
        /^[A-Za-z][8-9]\d{8}$/.test(v) ||
        "身分證或居留證 統一編碼格式不對",
    ],
    idCartRules2: [
      (v) => !!v || "身分證統一編號不能為空",
      (v) =>
        /^[A-Za-z][1-2]\d{8}$/.test(v) ||
        /^[A-Za-z][8-9]\d{8}$/.test(v) ||
        /^[A-Za-z][1-2]*\*\*\*\*\*\d{3}$/.test(v) ||
        /^[A-Za-z][8-9]*\*\*\*\*\*\d{3}$/.test(v) ||
        "身分證或居留證 統一編碼格式不對",
    ],
    emailRules: [
      (v) => !!v || "電子信箱不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v,
        ) || "電子信箱格式不對",
    ],
    defaultStatus: "2",
    desserts: [],
    dessertsTemp: [],
    editedIndex: -1,
    editedItem: {},
    editedItemTemp: {},
    defaultItem: {},
    tempItem: {},
    studentExamCode: {},
    recordList: [],
    paymentList: [],
    payStatusTemp: "",
    checktypeTemp: "",
    alertType: "",
    price: "600",
    updateInfo: [],
    passCount: 0,
    nopassCount: 0,
    failCount: 0,
    cancelCount: 0,
    reviewCount: 0,
    upgradeCount: 0,
    paymentCount: 0,
    nopaymentCount: 0,
    freepayCount: 0,
    copyValue: "",
    copyName: "",
    copySstId: 0,
    snackMail: false,
    onlinePay: false,
    scheduleData: [],
    actionTest: "",
  }),

  components: {
    TableFilter,
    DistributionSeat,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增甄選生" : "編輯甄選生";
    },

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },

    reviewPup(val) {
      val || this.reviewClose();
    },

    selected(data) {},
  },

  methods: {
    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {});
    },

    selectAllToggle(props) {
      if (props.items.length > 0 && props.value) {
        const self = this;
        props.items.forEach((item) => {
          self.selected.push(item);
        });
      }

      if (!props.value) {
        this.selected = [];
      }
    },

    checkReviewPass() {
      if (
        this.editedItem.studentStatus === "2" &&
        this.editedItem.studentStatusPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (
        this.editedItem.identity === "2" &&
        this.editedItem.identityPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (
        this.editedItem.payStatus === "2" &&
        this.editedItem.payStatusPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (
        this.editedItem.reward !== "1" &&
        this.editedItem.reward !== "2" &&
        this.editedItem.rewardPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (
        this.editedItem.admission === "2" &&
        this.editedItem.admissionPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (
        this.editedItem.handicapped === "1" &&
        this.editedItem.handicappedPass != "1"
      ) {
        this.checkReviewPup = true;
      }

      if (this.checkReviewPup) {
        this.reviewStudent(this.editedItemTemp, "");
      }

      if (this.editedItem.agePass === 0) {
        this.checkReviewPup = true;
      }
    },

    sendResultMailEditor() {
      this.cleanPupData();
      this.sendResultMailpup = true;
      const data = {};
      data.sendStatus = false;
      this.sendpass = false;
      this.noadmissionShow = false;
      this.sendnopass = false;
      this.admissionShow = false;

      const self = this;
      this.selected.forEach((item) => {
        if (item.checkType === "2" && item.admission === "1") {
          self.sendpass = true;
          self.noadmissionShow = true;
        }
        if (item.checkType === "3") {
          self.sendnopass = true;
        }
        if (item.checkType === "2" && item.admission === "2") {
          self.sendpass = true;
          self.admissionShow = true;
        }
      });

      this.selected.forEach((exam) => {
        if (exam.sendExamNotice) {
          data.sendStatus = true;
          return false;
        }
      });
      if (data.sendStatus) {
        if (this.menuType === 5) {
          this.pupTitle = "有參賽者已發送過審查通知信，確定要再次發送？";
        } else {
          this.pupTitle = "有參賽者已發送實驗實作晉級通知信，確定要再次發送？";
        }
      } else {
        if (this.menuType === 5) {
          this.pupTitle = "審查結果通知信";
        } else {
          this.pupTitle = "實驗實作晉級通知信";
        }
      }

      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-email-arrow-right-outline";
      this.pupText = "您確定要發送信件？";
    },

    async createExamCodeAlert() {
      this.createExamCodePup = true;
      this.cleanPupData();
      this.pupTitle = "確定產生甄選資料";
      this.pupTitleIcon = "mdi-alert-outline";
      this.pupText = "您真的要產生甄選資料？";
    },

    async createExamCode() {
      this.cleanPupData();
      this.createExamCodePup = false;
      this.loadFile = true;
      await this.tokenService.renewLT();

      let passCreate = true;
      const that = this;
      this.desserts.forEach(function (data) {
        if (data.checkType === "1") {
          that.cleanPupData();
          that.alertPup = true;
          that.pupTitle = "資料審核確認？";
          that.pupTitleShow = "2";
          that.pupTitleIcon = "mdi-alert-outline";
          that.pupText =
            "您尚有待審核資料存在，請審核完畢後方可進行產生甄選資料！";
          that.loadFile = false;
          passCreate = false;
        }
      });

      if (!passCreate) {
        return false;
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/createExamCode", data)
        .then((response) => {
          this.loadFile = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "產生成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "甄選資料已成功產生";
            this.examCodeExist = true;
          } else if (response.data.code === 503) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "產生失敗";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = response.data.resultData;
          } else if (response.data.code === 208) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "甄選資料已存在";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您已經產生過甄選資料";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async sendResultMail() {
      await this.tokenService.renewLT();

      const data = {};
      const resultTemp = [];
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.selected[0].olyId;
      data.passMsg = this.passMsg;
      data.nopassMsg = this.nopassMsg;
      data.admissionMsg = this.admissionMsg;

      this.selected.forEach((item) => {
        if (item.checkType === "2" || item.checkType === "3") {
          resultTemp.push(item);
        }
      });
      data.scienceReslut = JSON.stringify(resultTemp);
      data.olympic = this.globalSystemValue.olympic;

      this.cleanPupData();
      this.sendResultMailpup = false;
      this.sendMailpup = false;
      this.alertType = "";

      this.sendMailpup = true;
      this.pupTitle = "信件發送成功";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-alert-outline";
      this.pupText = "審查結果通知單信已發送";
      this.selected = [];
      this.sendpass = false;
      this.noadmissionShow = false;
      this.sendnopass = false;
      this.admissionShow = false;
      await this.axios.post(
        this.systemENV.APISERVERURL + "/sendResultMail",
        data,
      );
    },

    chagnePaymentStatus() {
      if (this.editedItem.payStatus === "2") {
        // 一般生 轉 免繳生
        if (this.editedItem.paymentStatus === "1") {
          this.editedItem.paymentStatus = "8";
          this.editedItem.paymentStatusName = "未退款";
        } else if (this.editedItem.paymentStatus === "2") {
          this.editedItem.paymentStatus = "9";
          this.editedItem.paymentStatusName = "無須繳費";
        } else {
          this.editedItem.paymentStatus = "3";
          this.editedItem.paymentStatusName = "";
        }
        if (this.checktypeTemp !== "") {
          this.editedItem.checkType = this.checktypeTemp;
        }
        this.checkTypeTemp = "";
        this.payStatusTemp = "";
      } else {
        // 免繳生 轉 一般生
        if (this.editedItem.paymentStatus === "8") {
          this.editedItem.paymentStatus = "1";
          this.editedItem.paymentStatusName = "已繳費";
        } else if (this.editedItem.paymentStatus === "9") {
          this.editedItem.paymentStatusName = "未繳費";
          this.editedItem.paymentStatus = "2";
        } else if (this.editedItem.paymentStatus === "2") {
          this.editedItem.paymentStatusName = "";
          this.editedItem.paymentStatus = "2";
        }
      }
    },

    parseDate(date) {
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

    async reviewStudent(item, type) {
      if (type === "review") {
        this.editedIndex = this.desserts.indexOf(item);
      }

      await this.getStudentInfo(item);

      Object.assign(this.desserts[this.editedIndex], this.updateInfo);

      this.editedItem = Object.assign({}, this.updateInfo);
      this.editedItemTemp = Object.assign({}, this.updateInfo);
      this.reviewPup = true;
      this.updateInfo = [];
    },

    async getRcordList() {
      this.recordList = await this.recordService.getRecord(
        this.id,
        this.editedItem.sstId,
        this.globalSystemValue.olympic,
      );
      this.recordHeader = [
        { title: "時間", value: "time" },
        { title: "異動人", value: "user" },
        { title: "類型", value: "type" },
        { title: "內容", value: "contact" },
      ];
    },

    async getPaymentList() {
      this.paymentList = await this.recordService.getPaymentRecord(
        this.id,
        this.editedItem.sstId,
        this.globalSystemValue.olympic,
      );
      this.paymentHeader = [
        { title: "繳費序號", value: "paymentNumber" },
        { title: "付款金額", value: "price" },
        { title: "付款方式", value: "paymentType" },
        { title: "付款狀態", value: "paymentStatusName" },
        { title: "建立時間", value: "createTime" },
      ];
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
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async downloadStudentlFile() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;
      data.selectDowloadTyep = this.selectDowloadTyep;
      data.olympic = this.globalSystemValue.olympic;

      if (this.selectDowloadTyep === "signupData") {
        data.fileName =
          this.globalSystemValue.olympic +
          "_" +
          this.signupName +
          this.globalSystemTool.getNowDataTimeByString();
      } else {
        data.fileName =
          this.globalSystemValue.olympic +
          "_對帳報表_" +
          "_" +
          this.signupName +
          this.globalSystemTool.getNowDataTimeByString();
      }

      this.dowloadPup = false;
      this.loadFile = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/loadScienceStudntFile", data, {
          responseType: "blob",
        })
        .then((response) => {
          // console.log(response)
          this.loadFile = false;
          const link = document.createElement("a");
          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          });
          link.style.display = "none";
          link.href = URL.createObjectURL(blob);
          link.setAttribute("download", data.fileName + ".xlsx");
          document.body.appendChild(link);
          link.click();
        })
        .catch(function (error) {
          // console.log(error);
        });
      this.selectDowloadTyep = "";
    },

    updateTable(filterData) {
      this.desserts = filterData;
    },

    updateEditedItem(item) {
      this.editedItem = item;
    },

    updateStudentExamCode(item) {
      this.studentExamCode = item;
    },

    cleanDesserts(headerData) {
      if (headerData.type === "select") {
        let modelName = headerData.filterName + "_M";
        let colorName = headerData.filterName + "_C";
        headerData[modelName] = "";
        headerData[colorName] = "";
      }

      if (this.filterList.length > 0) {
        this.filterList.forEach(function (data, index, object) {
          let search = data.split("_");
          if (search[1] === headerData.filterName) {
            object.splice(index, 1);
          }
        });
      }

      if (this.filterList.length > 0) {
        const that = this;
        this.filterList.forEach(function (data) {
          let search = data.split("_");
          that.desserts = that.dessertsTemp.filter((item) => {
            if (item[search[1]] !== undefined) {
              return item[search[1]]
                .toString()
                .toLowerCase()
                .includes(search[0].toString().toLowerCase());
            } else {
              return item[headerData.filterName];
            }
          });
        });
      } else {
        this.desserts = this.dessertsTemp.filter((dessert) => {
          return dessert[headerData.filterName];
        });
      }

      return this.desserts;
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "甄選管理");
      return this.$store.state.title;
    },

    async editItem(item) {
      await this.getSchoolAddressList();
      await this.getExamCode(item);

      this.editedIndex = this.desserts.indexOf(item);

      if (this.editedIndex === -1) {
        this.valid = false;
        item.idCard = "";
        item.birthday = "";
      } else {
        await this.getStudentInfo(item);

        this.updateInfo.birthday = item.birthday.replace("/", "-");

        Object.assign(this.desserts[this.editedIndex], this.updateInfo);
      }
      this.editedItem = Object.assign({}, this.updateInfo);
      this.editedItemTemp = Object.assign({}, this.updateInfo);
      this.dialog = true;
      this.updateInfo = [];
    },

    async getExamCode(item) {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.stId = item.sstId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getExamCode", data)
        .then((response) => {
          // console.log(response.data);
          this.examCodeShow = true;
          if (response.data.code === 200) {
            if (response.data.resultData !== "") {
              this.studentExamCode = response.data.resultData;
            }
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getStudentInfo(item) {
      const data = {};
      data.sstId = item.sstId;
      data.olyId = item.olyId;
      data.type = "editor";

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getStudentInfo", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.updateInfo = this.changeData(response.data.resultData);
          } else {
            this.updateInfo = item;
          }
        })
        .catch(function (error) {
          this.updateInfo = item;
          // console.log(error);
        });
    },

    close() {
      this.dialog = false;
      this.dowloadPup = false;
      this.valid = true;
      this.recordPup = false;
      this.recordList = [];
      this.selectDowloadTyep = "";
      this.studentExamCode = {};
      this.desserts[this.editedIndex].birthday = this.desserts[
        this.editedIndex
      ].birthday.replace("-", "/");
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
      this.editedItemTemp = {};
    },

    reviewClose() {
      this.reviewPup = false;

      this.desserts[this.editedIndex].birthday = this.desserts[
        this.editedIndex
      ].birthday.replace("-", "/");

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });

      this.editedItemTemp = {};
    },

    studenIdentity(type) {
      if (type === "studentStatus") {
        this.editedItem.studentStatusPass = "0";
      } else if (type === "identity") {
        this.editedItem.identityPass = "0";
      }
    },

    sendMailCheckAlert(item, type) {
      this.alertType = type;

      if (type === "review") {
        if (this.editedItem.emailContent.length > 500) {
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

    async sentReviewMail() {
      this.sendMailpup = false;
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.email = this.tempItem.email;
      data.name = this.tempItem.name;
      data.olympic = this.globalSystemValue.olympic;
      data.text = this.tempItem.emailContent;

      this.recordService.setRecord(
        this.id,
        "",
        this.tempItem,
        this.globalSystemValue.olympic,
        "mail",
      );
      this.sendLoad = true;

      this.axios.post(this.systemENV.APISERVERURL + "/sentReviewMail", data);

      this.cleanPupData();
      this.alertPup = true;
      this.pupTitle = "寄送成功";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您的信件已寄送完成！";
      this.tempItem.emailContent = "";
      Object.assign(this.desserts[this.editedIndex], this.tempItem);

      this.sendLoad = false;
      this.tempItem = {};
    },

    async alertURLMailPop() {
      this.cleanPupData();
      this.alertPup = true;
      this.pupTitle = "確定寄送修改資料連結信件？";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "請確定是否寄出！";
      this.sendURLmail = true;
    },

    async sentEditorURLMail() {
      await this.tokenService.renewLT();

      this.alertPup = false;
      this.loadShow = true;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.email = this.editedItem.email2;
      data.signupSchool = this.globalSystemValue.olympic;
      data.editorUri = this.editedItem.editorUri;
      data.name = this.editedItem.name;
      data.type = "manage";

      this.axios.post(this.systemENV.APISERVERURL + "/sentEditorURLMail", data);

      this.loadShow = false;
      this.cleanPupData();
      this.alertPup = true;
      this.pupTitle = "寄送成功";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您的信件已寄送完成！";

      this.sendURLmail = false;
      this.tempItem = {};
    },

    async checkSave(type) {
      if (this.editedItem.checkType === "4") {
        this.remarkPup = true;
        return false;
      } else {
        this.saveStudentInfo("review");
      }
    },

    async setRemark() {
      if (this.editedItem.remark.length > 100) {
        alert("您輸入的字數超過100個字");
      } else {
        this.remarkPup = false;
        this.saveStudentInfo("remark");
      }
    },

    async saveStudentInfo(type) {
      this.loadShow = true;
      await this.tokenService.renewLT();

      if (this.payStatusTemp !== "") {
        this.editedItem.payStatus = this.payStatusTemp;
      }

      const data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      data.signupSchool = this.globalSystemValue.olympic;
      data.olyId = this.id;
      if (data.email !== this.editedItemTemp.email) {
        data.email2 = "";
      }

      if (
        this.parseDate(data.birthday) !==
        this.parseDate(this.editedItemTemp.birthday)
      ) {
        data.birthday = this.parseDate(data.birthday);
        data.birthday2 = "";
      } else {
        data.birthday = this.parseDate(data.birthday);
      }

      if (data.idCard !== this.editedItemTemp.idCard) {
        data.idCard2 = "";
      }

      if (typeof data.schoolNumber === "object") {
        data.schoolName = data.schoolNumber.school_name;
        data.schoolNumber = data.schoolNumber.school_number;
      }

      if (type === "review") {
        this.recordService.setRecord(
          this.id,
          this.desserts[this.editedIndex],
          this.editedItem,
          this.globalSystemValue.olympic,
          "review",
        );
      } else if (type === "student") {
        this.recordService.setRecord(
          this.id,
          this.desserts[this.editedIndex],
          this.editedItem,
          this.globalSystemValue.olympic,
          "editor",
        );
      } else {
        this.recordService.setRecord(
          this.id,
          this.desserts[this.editedIndex],
          this.editedItem,
          this.globalSystemValue.olympic,
          "remark",
        );
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveScinceInfo", data)
        .then((response) => {
          this.loadShow = false;
          if (response.data.code === 200) {
            if (data.idCard !== "") {
              data.idCard =
                data.idCard.slice(0, 2) + "*****" + data.idCard.slice(7, 10);
            }

            data.email2 = response.data.resultData.email;

            const dateArray = data.birthday.split("/");
            const ROCyear = parseInt(dateArray[0]) - 1911;
            const ROCmonth = dateArray[1];
            data.birthday = ROCyear + "/" + ROCmonth;

            data.agePass = response.data.resultData.agePass;

            if (data.schoolName !== undefined) {
              data.schoolNameAll = data.schoolName;
            }

            if (this.editedIndex > -1) {
              Object.assign(
                this.desserts[this.editedIndex],
                this.changeData(data),
              );
            } else {
              this.desserts.push(this.changeData(data));
            }

            const that = this;
            this.passCount = 0;
            this.nopassCount = 0;
            this.failCount = 0;
            this.cancelCount = 0;
            this.reviewCount = 0;
            this.upgradeCount = 0;
            this.paymentCount = 0;
            this.nopaymentCount = 0;
            this.freepayCount = 0;

            this.desserts.forEach(function (data) {
              data = that.changeData(data);

              if (data.checkType === "2") {
                that.passCount++;
              }

              if (data.checkType === "1") {
                that.nopassCount++;
              }

              if (data.checkType === "3") {
                that.failCount++;
              }

              if (data.checkType === "4") {
                that.cancelCount++;
              }

              if (data.leveloneNotice === 1) {
                that.reviewCount++;
              }

              if (data.leveltwoNotice === 1) {
                that.upgradeCount++;
              }

              if (data.checkType !== "4" && data.paymentStatus === "1") {
                that.paymentCount++;
              }

              if (data.checkType !== "4" && data.paymentStatus !== "1") {
                that.nopaymentCount++;
              }
            });

            if (type === "student") {
              this.close();
            } else {
              this.reviewClose();
            }
          } else if (response.data.code === 405) {
            this.cleanPupData();
            this.sendURLmail = false;
            this.alertPup = true;
            this.pupTitle = "信箱已被使用";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "請換一組新的信箱";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      this.editedItemTemp = {};
      this.payStatusTemp = "";
      this.checktypeTemp = "";
    },

    changeData(data) {
      if (data.checkType === "1") {
        data.checkTypeName = "待審查";
      }
      if (data.checkType === "2") {
        data.checkTypeName = "已通過";
      }
      if (data.checkType === "3") {
        data.checkTypeName = "未通過";
      }
      if (data.checkType === "4") {
        data.checkTypeName = "作廢";
      }

      if (data.agePass === 3) {
        data.agePassStatus = true;
      }
      if (data.agePass === 0) {
        data.agePassStatus = false;
      }

      if (this.scheduleData.paymentType === 1) {
        data.paymentNumber = "學校自行收費";
      } else {
        if (data.paymentStatus === "3" || data.payStatus === "2") {
          data.paymentNumber = "無須繳費";
        }
      }

      if (data.paymentStatus === "0") {
        data.paymentStatusName = "未選擇繳費方式";

        if (data.payStatus === "2") {
          data.paymentStatusName = "免繳費";
        } else {
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
        data.paymentStatusName = "逾期未繳";
      }
      if (data.paymentStatus === "11") {
        data.paymentStatusName = "綠界金流沒有此繳費序號資訊";
      }
      if (data.paymentStatus === "12") {
        data.paymentStatusName = "帳款確認中";
      }
      if (data.paymentStatus === "13") {
        data.paymentStatusName = "學校自行收款";
      }

      if (data.admission === "1") {
        data.admissionName = "甄選錄取";
      }
      if (data.admission === "2") {
        data.admissionName = "直接錄取";
      }

      return data;
    },

    async getScienceSchedule() {
      const data = {};
      data.id = this.id;
      data.type = "info";
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getScienceSchedule", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            const date = this.globalSystemTool.getNowDataTime();
            this.scheduleData = response.data.resultData;

            if (
              response.data.resultData.paymentType === 2 &&
              this.menuType === 6
            ) {
              this.onlinePay = true;
            }

            if (response.data.resultData.price !== "") {
              this.price = response.data.resultData.price;
            }
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getScienceInfo() {
      await this.tokenService.renewLT();
      this.loadList = true;

      const data = {};
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getScienceInfo", data)
        .then((response) => {
          this.loadList = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            this.headers = response.data.headers;
            this.desserts = response.data.resultData;
            this.dessertsTemp = response.data.resultData;
            this.signupName = response.data.signupName;
            this.menuType = response.data.menuType;
            this.examCodeExist = response.data.examCodeExist;
            this.actionTest = response.data.testTime;

            const that = this;
            this.headers.forEach(function (data, index, object) {
              if (data.filterName !== undefined) {
                if (data.value === "name") {
                  data.width = "9%";
                }
                if (data.value === "birthday") {
                  data.width = "7%";
                }
                if (data.value === "email") {
                  data.width = "7%";
                }
                if (data.value === "idCard") {
                  data.width = "8%";
                }
                if (data.value === "checkType") {
                  data.filterName = "checkTypeName";
                  data.width = "8%";
                }
                if (data.value === "schoolNumber") {
                  data.filterName = "schoolNameAll";
                  data.width = "16%";
                }
                if (data.value === "paymentStatus") {
                  data.filterName = "paymentStatusName";
                  data.width = "7%";
                }
                if (data.value === "paymentNumber") {
                  data.filterName = "paymentNumber";
                  data.width = "8%";
                }
                if (data.value === "admission") {
                  data.filterName = "admissionName";
                  data.width = "7%";
                }
                if (data.value === "actions") {
                  data.width = "10%";
                }

                that.editedItem[data.filterName] = "";
                that.defaultItem[data.filterName] = "";
              }
            });

            this.editedItem.signupStatus = "";
            this.defaultItem.signupStatus = "";
            this.editedItem.institution = "";
            this.defaultItem.institution = "";

            this.passCount = 0;
            this.nopassCount = 0;
            this.failCount = 0;
            this.cancelCount = 0;
            this.reviewCount = 0;
            this.upgradeCount = 0;
            this.paymentCount = 0;
            this.nopaymentCount = 0;
            this.freepayCount = 0;

            this.desserts.forEach(function (data) {
              data = that.changeData(data);

              if (data.checkType === "2") {
                that.passCount++;
              }

              if (data.checkType === "1") {
                that.nopassCount++;
              }

              if (data.checkType === "3") {
                that.failCount++;
              }

              if (data.checkType === "4") {
                that.cancelCount++;
              }

              if (data.leveloneNotice === 1) {
                that.reviewCount++;
              }

              if (data.leveltwoNotice === 1) {
                that.upgradeCount++;
              }

              if (data.checkType !== "4" && data.paymentStatus === "1") {
                that.paymentCount++;
              }

              if (data.checkType !== "4" && data.paymentStatus !== "1") {
                that.nopaymentCount++;
              }

              if (data.checkType !== "4" && data.paymentStatus === "3") {
                that.freepayCount++;
              }
            });
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
      this.levelStatus = false;
    }

    await this.tokenService.renewLT();
    await this.getScienceSchedule();
    await this.getScienceInfo();

    if (this.menuType === 5) {
      this.passMsg =
        "經本校審查委員會審議，您符合本校審查資格，請於3/15參加本校科學能力檢定，相關資訊請參閱官網\n\n若有問題請致電本校確認，謝謝\n\n";
    } else if (this.menuType === 6) {
      this.passMsg =
        "經本校審查委員會審議，您符合本校實驗實作考試資格，請於3/12參加本校實驗實作考試。\n\n若有問題請致電本校確認，謝謝\n\n";
    }

    if (
      this.$store.state.signupStartTime !== "" &&
      this.$store.state.signupEndTime !== ""
    ) {
      if (
        new Date(this.$store.state.signupStartTime) <=
          new Date(this.globalSystemTool.getNowDataTime()) &&
        new Date(this.globalSystemTool.getNowDataTime()) <=
          new Date(this.$store.state.signupEndTime)
      ) {
        this.contestantShow = true;
      } else if (
        new Date(this.$store.state.signupStartTime) >
        new Date(this.globalSystemTool.getNowDataTime())
      ) {
        this.contestantShow = true;
      }
    } else {
      if (
        localStorage.getItem(this.globalSystemValue.olympic + this.id + "T") !=
          null ||
        localStorage.getItem(this.globalSystemValue.olympic + this.id + "E") !=
          null
      ) {
        const signupStartTime = JSON.parse(
          localStorage.getItem(this.globalSystemValue.olympic + this.id + "T"),
        );
        const signupEndTime = JSON.parse(
          localStorage.getItem(this.globalSystemValue.olympic + this.id + "E"),
        );

        if (
          new Date(signupStartTime.value) <=
            new Date(this.globalSystemTool.getNowDataTime()) &&
          new Date(this.globalSystemTool.getNowDataTime()) <=
            new Date(signupEndTime.value)
        ) {
          this.contestantShow = true;
        } else if (
          new Date(signupStartTime.value) >
          new Date(this.globalSystemTool.getNowDataTime())
        ) {
          this.contestantShow = true;
        }
      } else {
        location.href = "/manage/optionMenu";
      }
    }
  },
};
</script>
