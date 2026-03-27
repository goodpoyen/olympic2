<template>
  <div>
    <div style="margin: 20px; font-size: 14px; font-weight: bold">
      選拔模組:
      <v-btn
        v-if="menuType === 1"
        small
        rounded
        color="#E9F8FF"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-notebook-edit-outline </v-icon>
        <p style="font-size: 14px; margin-top: -4px">測驗</p>
      </v-btn>
      <v-btn
        v-if="menuType === 2"
        small
        rounded
        color="#f3ebff"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-town-hall </v-icon>
        <p style="font-size: 14px; margin-top: -4px">選拔營</p>
      </v-btn>
      <v-btn
        v-if="menuType === 3"
        small
        rounded
        color="#e4ffe5"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-cast-education </v-icon>
        <p style="font-size: 14px; margin-top: -4px">線上賽</p>
      </v-btn>
      <v-btn
        v-if="menuType === 4"
        small
        rounded
        color="#fad2a0"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-party-popper </v-icon>
        <p style="font-size: 14px; margin-top: -4px">新手同樂會</p>
      </v-btn>
      <v-btn
        v-if="menuType === 7"
        small
        rounded
        color="#ff525278"
        style="margin-left: 11px; margin-top: -2px"
      >
        <v-icon small left> mdi-account-group </v-icon>
        <p style="font-size: 14px; margin-top: -4px">資訊營</p>
      </v-btn>
      <div style="display: inline; margin: 52px">
        選拔名稱:
        <div class="single-line" style="display: inline; margin: 13px">
          {{ signupName }}
        </div>
      </div>
      <div style="display: inline">
        報名統計:
        <v-icon title="已通過" large style="margin-left: 7px; color: #2bcd2b">
          mdi-circle-small
        </v-icon>
        {{ passCount }}人
        <v-icon title="待審核" large style="margin-left: 7px; color: #ff3c01">
          mdi-circle-small
        </v-icon>
        {{ nopassCount }}人
        <v-icon title="不通過" large style="margin-left: 7px; color: #6b6b6b">
          mdi-circle-small
        </v-icon>
        {{ failCount }}人
        <hr
          role="separator"
          aria-orientation="vertical"
          class="v-divider v-divider--inset v-divider--vertical"
          style="min-height: 18px; margin-left: 12px"
        />
        <v-icon title="總人數" large style="color: #635bff">
          mdi-circle-small
        </v-icon>
        {{ desserts.length }}人
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="desserts"
      :items-per-page="50"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
      :loading="loadList"
      loading-text="資料處理中...."
      Dense
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat style="background-color: white">
          <v-btn
            small
            color="#635BFF"
            variant="flat"
            dark
            class="mb-2"
            @click="editItem(editedItem)"
          >
            <v-icon small left> mdi-account-plus-outline </v-icon>
            <p style="font-size: 13px">新增報名</p>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            v-if="menuType === 1"
            class="ma-3"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            :disabled="contestantShow"
            @click="createExamCodeAlert"
          >
            <v-icon small left> mdi-card-account-details-outline </v-icon>
            <p style="font-size: 13px">產生應試資料</p>
          </v-btn>
          <v-btn
            v-if="menuType === 2"
            class="ma-3"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            @click="createCampCode"
          >
            <v-icon small left> mdi-card-account-details-outline </v-icon>
            <p style="font-size: 13px">產生選訓資料</p>
          </v-btn>
          <v-btn
            v-if="menuType === 3"
            class="ma-3"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            @click="setCMS"
          >
            <v-icon small left> mdi-card-account-details-outline </v-icon>
            <p style="font-size: 13px">產生CMS資料</p>
          </v-btn>
          <v-divider class="mx-1" inset vertical></v-divider>
          <v-btn
            v-if="menuType === 1 || menuType === 2"
            class="ma-2"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            depressed
            :loading="isSelecting"
            @click="onButtonClick"
          >
            <v-icon small left> mdi-file-upload-outline </v-icon>
            <p style="font-size: 13px">匯入</p>
          </v-btn>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            @change="onFileChanged"
          />
          <v-btn
            v-if="menuType === 3 || menuType === 4"
            class="ma-2"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            depressed
            :loading="isSelecting"
            :disabled="true"
            @click="onButtonClick"
          >
            <v-icon small left> mdi-file-upload-outline </v-icon>
            <p style="font-size: 13px">匯入</p>
          </v-btn>
          <input
            ref="uploader"
            class="d-none"
            type="file"
            @change="onFileChanged"
          />
          <v-btn
            class="ma-2"
            small
            outlined
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            @click="downloadPersonnelFile"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="font-size: 13px">匯出</p>
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.statusName="{ item }">
        <v-icon
          v-if="item.statusName == '待審核'"
          large
          style="margin-left: 7px; color: #ff3c01"
        >
          mdi-circle-small
        </v-icon>
        <v-icon
          v-if="item.statusName == '已通過'"
          large
          style="margin-left: 7px; color: #2bcd2b"
        >
          mdi-circle-small
        </v-icon>
        <v-icon
          v-if="item.statusName == '不通過'"
          large
          style="margin-left: 7px; color: #6b6b6b"
        >
          mdi-circle-small
        </v-icon>
      </template>
      <template v-slot:item.idCard="{ item }">
        <v-icon
          medium
          :title="item.idCard"
          @click="
            snackMail = snackMail && item.stId === copyStId ? false : true;
            copyName = '識別碼';
            copyValue = item.idCard;
            copyStId = item.stId;
          "
          color="black"
        >
          mdi-id-card
        </v-icon>
      </template>
      <template v-slot:item.email="{ item }">
        <v-icon
          medium
          :title="item.email"
          @click="
            snackMail = snackMail && item.stId === copyStId ? false : true;
            copyName = '信箱';
            copyValue = item.email;
            copyStId = item.stId;
          "
          color="black"
        >
          mdi-email-outline
        </v-icon>
      </template>
      <template v-slot:item.englishName="{ item }">
        <v-icon
          medium
          :title="item.englishName"
          @click="
            snackMail = snackMail && item.stId === copyStId ? false : true;
            copyName = '英文姓名';
            copyValue = item.englishName;
            copyStId = item.stId;
          "
          color="black"
          style="margin-left: 8px"
        >
          mdi-order-alphabetical-ascending
        </v-icon>
      </template>
      <template v-slot:item.teacher="{ item }">
        <v-icon
          medium
          :title="item.teacher"
          @click="
            snackMail = snackMail && item.stId === copyStId ? false : true;
            copyName = '指導老師';
            copyValue = item.teacher;
            copyStId = item.stId;
          "
          color="black"
          style="margin-left: 8px"
        >
          mdi-school-outline
        </v-icon>
      </template>
      <template v-slot:item.schoolType="{ item }">
        <div v-if="item.schoolType === 'e'">國小</div>
        <div v-if="item.schoolType === 'j'">國中</div>
        <div v-if="item.schoolType === 's'">高中</div>
        <div v-if="item.schoolType === 'I'">國際</div>
      </template>

      <template v-slot:item.actions="{ item }">
        <v-icon title="編輯報名人" class="mr-2" @click="editItem(item)"
          >mdi-text-box-edit-outline
        </v-icon>
      </template>
      <template v-slot:item.birthday="{ item }">
        <div :style="!item.age ? { color: 'red' } : { color: '' }">
          {{ item.birthday }}
        </div>
      </template>
      <template v-slot:item.grade="{ item }">
        <div :style="!item.gradeStatus ? { color: 'red' } : { color: '' }">
          {{ item.grade }}
        </div>
      </template>
    </v-data-table>
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
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color="blue darken-1"
            text
            @click="cleanPupData()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="importPup" max-width="500px">
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
            @click="
              cleanPupData;
              importPup = false;
              isSelecting = false;
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            left
            color="blue darken-1"
            text
            @click="
              cleanPupData;
              importPup = false;
              $refs.uploader.click();
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
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
            @click="
              cleanPupData;
              createExamCodePup = false;
            "
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
    <v-dialog v-model="dialog" width="518px">
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
                  v-if="defaultItemShow.chineseName"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.chineseName"
                    label="姓名(中)"
                    :counter="18"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '姓名(中)不能為空',
                      (v) => v.length <= 18 || '超過規定字數',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.schoolType"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-select
                    :items="schoolTypeList"
                    v-model="editedItem.schoolType"
                    item-title="name"
                    item-value="value"
                    label="學籍"
                    variant="underlined"
                    :rules="[(v) => !!v || '學籍不能為空']"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="defaultItemShow.englishName"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-if="menuType !== 2"
                    v-model="editedItem.englishName"
                    label="姓名(英)"
                    :counter="36"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        (v.length >= 0 && !!defaultItemIsNull.englishName) ||
                        (!!v && !defaultItemIsNull.englishName) ||
                        '姓名(英)不能為空',
                      (v) => v.length <= 36 || '超過規定字數',
                    ]"
                  ></v-text-field>
                  <v-text-field
                    v-if="menuType === 2"
                    v-model="editedItem.englishName"
                    label="姓名(英)"
                    :counter="36"
                    :rules="[(v) => v.length <= 36 || '超過規定字數']"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.teacher"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-if="menuType !== 2"
                    v-model="editedItem.teacher"
                    label="指導老師"
                    :counter="36"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        (v.length >= 0 && !!defaultItemIsNull.teacher) ||
                        (!!v && !defaultItemIsNull.teacher) ||
                        '指導老師不能為空',
                      (v) => v.length <= 36 || '超過規定字數',
                    ]"
                  ></v-text-field>
                  <v-text-field
                    v-if="menuType === 2"
                    v-model="editedItem.teacher"
                    label="指導老師"
                    :counter="18"
                    variant="underlined"
                    :rules="[(v) => v.length <= 18 || '超過規定字數']"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.idCard"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.idCard"
                    label="識別碼"
                    variant="underlined"
                    :rules="[
                      (v) =>
                        (v.length >= 0 && !!defaultItemIsNull.idCard) ||
                        (!!v && !defaultItemIsNull.idCard) ||
                        '識別碼不能為空',
                      (v) =>
                        (v.length === 5 && !!defaultItemIsNull.idCard) ||
                        (v.length === 5 && !defaultItemIsNull.idCard) ||
                        (v.length <= 0 && defaultItemIsNull.idCard) ||
                        '識別碼只能5碼',
                      (v) =>
                        (/^[A-Za-z][1-2]\d{3}$/.test(v) &&
                          !!defaultItemIsNull.idCard) ||
                        (/^[A-Za-z][1-2]\d{3}$/.test(v) &&
                          !defaultItemIsNull.idCard) ||
                        (v.length <= 0 && defaultItemIsNull.idCard) ||
                        '識別碼格式不對',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.area"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-select
                    :items="examAreaList"
                    v-model="editedItem.codeName"
                    item-title="areaName"
                    item-value="codeName"
                    return-object
                    label="考區"
                    variant="underlined"
                    :rules="[(v) => !!v || '考區不能為空']"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="defaultItemShow.schoolName"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -22px"
                >
                  <div>學校：</div>
                </v-col>
                <v-col
                  v-if="defaultItemShow.schoolName"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-select
                    v-model="editedItem.cityNumber"
                    :items="cityList"
                    item-title="city_name"
                    item-value="city_number"
                    label="城市"
                    variant="underlined"
                    :rules="[(v) => !!v || '城市不能為空']"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="defaultItemShow.schoolName"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-select
                    v-model="editedItem.areaNumber"
                    :items="areaList[editedItem.cityNumber]"
                    item-title="area_name"
                    item-value="area_number"
                    label="鄉鎮區"
                    variant="underlined"
                    :rules="[(v) => !!v || '鄉鎮區不能為空']"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="defaultItemShow.schoolName"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-select
                    v-model="editedItem.schoolNumber"
                    :items="schoolList[editedItem.areaNumber]"
                    item-title="school_name"
                    item-value="school_number"
                    label="校名"
                    variant="underlined"
                    :rules="[(v) => !!v || '校名不能為空']"
                    @change="checkSchoolType()"
                  ></v-select>
                </v-col>
                <v-col
                  v-if="defaultItemShow.grade"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.grade"
                    label="年級"
                    variant="underlined"
                    :rules="[checkGrade]"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.birthday"
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
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
                  v-if="defaultItemShow.APCS"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.APCS"
                    label="APCS級分"
                    :counter="2"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || 'APCS級分不能為空',
                      (v) => v.length <= 2 || '超過規定字數',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.email"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.email"
                    label="信箱"
                    variant="underlined"
                    :rules="emailRules"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="defaultItemShow.raceType"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.raceType"
                    label="組別"
                    :counter="20"
                    variant="underlined"
                    :rules="[
                      (v) => !!v || '組別不能為空',
                      (v) => v.length <= 20 || '超過規定字數',
                    ]"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="globalSystemValue.olympic !== 'TOIREG'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="
                    margin-top: -22px;
                    font-weight: bold;
                    margin-bottom: 10px;
                  "
                >
                  <div>
                    建立者：{{ editedItem.createRole }} -
                    {{ editedItem.adminName }}
                  </div>
                  <div>建立時間：{{ editedItem.createTime }}</div>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -22px">
                  <div>帳號狀態：</div>
                </v-col>
                <v-col cols="12" sm="2" md="12" style="margin-top: -31px">
                  <v-radio-group
                    v-model="editedItem.signupStatus"
                    inline
                    required
                  >
                    <v-radio
                      :value="'3'"
                      style="width: 26%"
                      @click="sendMail.signupStatus = '3'"
                    >
                      <template v-slot:label>
                        <v-icon large style="margin-left: 7px; color: #2bcd2b">
                          mdi-circle-small
                        </v-icon>
                        <span style="font-weight: bold; color: #2bcd2b"
                          >通過</span
                        >
                      </template>
                    </v-radio>
                    <v-radio
                      :value="'2'"
                      style="width: 29%"
                      @click="sendMail.signupStatus = '2'"
                    >
                      <template v-slot:label>
                        <v-icon large style="margin-left: 7px; color: #6b6b6b">
                          mdi-circle-small
                        </v-icon>
                        <span style="font-weight: bold; color: #6b6b6b"
                          >不通過</span
                        >
                      </template>
                    </v-radio>
                    <v-radio
                      :value="'1'"
                      style="width: 29%"
                      @click="sendMail.signupStatus = '1'"
                    >
                      <template v-slot:label>
                        <v-icon large style="margin-left: 7px; color: #ff3c01">
                          mdi-circle-small
                        </v-icon>
                        <span style="font-weight: bold; color: #ff3c01"
                          >待審核</span
                        >
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-show="examCodeExist && editedIndex != -1 && menuType === 1"
                  cols="12"
                  sm="2"
                  md="12"
                  style="margin-top: -31px"
                >
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
                <v-col
                  v-if="
                    editedItem.signupStatus === '2' ||
                    sendMail.signupStatus === '2'
                  "
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -10px"
                >
                  <div>是否寄送通知信：</div>
                </v-col>
                <v-col
                  v-if="
                    editedItem.signupStatus === '2' ||
                    sendMail.signupStatus === '2'
                  "
                  cols="12"
                  sm="2"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-radio-group
                    :key="editedItem.stId"
                    v-model="sendMail.status"
                    inline
                  >
                    <v-radio label="是" :value="'1'"></v-radio>
                    <v-radio label="否" :value="'2'"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="sendMail.status === '1'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <div>不通過通知信件內容：</div>
                </v-col>
                <v-col
                  v-if="sendMail.status === '1'"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -17px"
                >
                  <v-textarea
                    v-model="sendMail.emailContent"
                    outlined
                    name="input-7-4"
                    label="請輸入信件內容"
                    :counter="500"
                    :rules="[(v) => v.length <= 500 || '超過規定字數']"
                  ></v-textarea>
                </v-col>
                <v-col
                  v-if="sendMail.status === '1'"
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
                    @click="sentSignupFail(editedItem)"
                  >
                    <v-icon small left> mdi-email-arrow-right-outline </v-icon>
                    <p style="font-size: 13px; margin-top: 16px">寄送信件</p>
                  </v-btn>
                </v-col>
                <v-col
                  v-if="defaultItemShow.remark"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -10px"
                >
                  <div>備註：</div>
                </v-col>
                <v-col
                  v-if="defaultItemShow.remark"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -17px"
                >
                  <v-textarea
                    v-model="editedItem.remark"
                    outlined
                    name="input-7-4"
                    label="請輸入備註內容"
                    :counter="100"
                    :rules="[(v) => v.length <= 100 || '超過規定字數']"
                  ></v-textarea>
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
              @click="savePersonnel"
              :disabled="!valid || editedItem.signupStatus === ''"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
          </v-card-actions>
        </v-form>
        <v-overlay v-model="loadShow" class="align-center justify-center">
          <v-progress-circular indeterminate color="primary" :size="60">
          </v-progress-circular>
        </v-overlay>
      </v-card>
    </v-dialog>
    <v-overlay v-model="loadFile" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
    <!-- <v-overlay :value="loadFile">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div>處理中....</div>
    </v-overlay> -->
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
    selectedFile: null,
    autofocusStatus: true,
    isSelecting: false,
    loadFile: false,
    alertPup: false,
    importPup: false,
    createExamCodePup: false,
    snackMail: false,
    snackbarTimeout: 10000,
    copyValue: "",
    copyName: "",
    copyStId: 0,
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    examAreaList: [],
    cityList: [],
    areaList: [],
    schoolList: [],
    schoolTypeList: [
      {
        name: "國小",
        value: "e",
      },
      {
        name: "國中",
        value: "j",
      },
      {
        name: "高中",
        value: "s",
      },
      {
        name: "國際",
        value: "I",
      },
    ],
    menu: false,
    modal: false,
    statusName: "",
    valid: true,
    levelStatus: true,
    dialog: false,
    loadShow: false,
    contestantShow: false,
    emailRules: [
      (v) => !!v || "信箱不能為空",
      (v) =>
        /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(
          v,
        ) || "信箱格式不對",
    ],
    // idCartRules: [
    //   (v) => !!v || "識別碼不能為空",
    //   (v) => v.length === 5 || "識別碼只能5碼",
    //   (v) => /^[A-Za-z][1-2]\d{3}$/.test(v) || "識別碼格式不對",
    // ],
    defaultStatus: "2",
    editedIndex: -1,
    studentExamCode: {},
    sendMail: {
      status: "2",
      signupStatus: "",
      emailContent: "",
    },
    defaultSendMail: {
      status: "2",
      signupStatus: "",
      emailContent: "",
    },
    editedItem: {},
    defaultItem: {},
    defaultItemShow: {},
    defaultItemIsNull: {},
  }),

  props: {
    signupName: "",
    menuType: 0,
    examCodeExist: false,
    loadList: true,
    desserts: {
      type: Array,
      default: () => [],
    },
    dessertsTemp: {
      type: Array,
      default: () => [],
    },
    headers: {
      type: Array,
      default: () => [],
    },
    passCount: 0,
    nopassCount: 0,
    failCount: 0,
  },

  components: {
    TableFilter,
    DistributionSeat,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增報名" : "更改報名";
    },

    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
  },

  methods: {
    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {});
    },

    checkSchoolType() {
      if (this.editedItem.schoolNumber.school_number.includes("s")) {
        this.editedItem.type = "s";
        this.checkGrade("");
      } else if (this.editedItem.schoolNumber.school_number.includes("j")) {
        this.editedItem.type = "j";
        this.checkGrade("");
      } else {
        this.editedItem.type = "e";
        this.checkGrade("");
      }

      this.editedItem.grade = "";
    },

    checkGrade(value) {
      if (this.defaultItemIsNull.grade) {
        return true;
      }

      if (value.length <= 0) {
        return "年級不能為空值";
      }

      if (value.length > 2) {
        return "年級最多2碼";
      }

      if (value.length === 1 && !/^[1-9]$/.test(value)) {
        return "年級只能為數字";
      }

      if (value.length === 2 && !/^[1-9][0-9]$/.test(value)) {
        return "年級只能為數字";
      }

      if (this.editedItem.type === "e") {
        if (value > 6) {
          if (this.autofocusStatus) {
            this.editedItem.grade = "";
            this.autofocusStatus = false;
          }
          return "年級必須在1~6之間";
        }
      } else if (this.editedItem.type === "j") {
        console.log(456);
        if (value <= 6 || value > 9) {
          if (this.autofocusStatus) {
            this.editedItem.grade = "";
            this.autofocusStatus = false;
          }
          return "年級必須在7~9之間";
        }
      } else if (this.editedItem.type === "s") {
        if (value <= 9 || value > 12) {
          if (this.autofocusStatus) {
            this.editedItem.grade = "";
            this.autofocusStatus = false;
          }
          return "年級必須在11~12之間";
        }
      }

      if (this.editedItem.age && this.editedItem.signupStatus === "3") {
        this.editedItem.signupStatus = "3";
      }

      this.editedItem.gradeStatus = true;

      this.autofocusStatus = false;

      return true;
    },

    parseDate(date) {
      if (!date) return null;

      const [year, month] = date.split("-");
      return `${year}/${month.padStart(2, "0")}`;
    },

    onButtonClick() {
      this.isSelecting = true;
      window.addEventListener(
        "focus",
        () => {
          this.isSelecting = false;
        },
        { once: true },
      );

      this.ouloadCheckAlert();
    },

    ouloadCheckAlert() {
      this.cleanPupData();
      this.importPup = true;
      this.pupTitle = "匯入檔案請注意";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText =
        "請確認你的檔案內的欄位需與報名欄位需相同(包含：類別欄位) 沒有 (資格、縣市、性別、學校全稱、考區名稱、建立時間)等欄位！如有上述欄位請刪除後再進行匯入";
    },

    async onFileChanged(e) {
      this.loadFile = true;
      this.selectedFile = e.target.files[0];

      const formData = new FormData();

      const header = { "Content-type": "multipart/form-data" };

      formData.append("file", this.selectedFile);
      formData.append("AT", await this.tokenService.getFastAT());
      formData.append("id", this.id);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/importPersonnelFile", formData, {
          headers: header,
        })
        .then((response) => {
          // console.log(response.data);
          this.loadFile = false;
          const that = this;
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "上傳成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您匯入的檔案已完成";
            response.data.resultData.forEach(function (data) {
              data.idCard =
                data.idCard.slice(0, 2) + "*****" + data.idCard.slice(2, 5);

              data.gradeStatus = true;

              if (data.birthday !== "") {
                data.birthday = data.birthday.replace("-", "/");
              }

              const born = new Date(data.birthday);
              const now = new Date();

              if (that.globalSystemValue.olympic !== "IJSO") {
                const difference = Math.abs(now - born);
                const days = difference / (1000 * 3600 * 24 * 365);

                if (days > 0 && days < 21) {
                  data.age = true;
                } else {
                  data.age = false;
                }
              } else {
                if (
                  now.getFullYear() - born.getFullYear() > 0 &&
                  now.getFullYear() - born.getFullYear() < 16
                ) {
                  data.age = true;
                  data.signupStatus = "3";
                } else {
                  data.age = false;
                  data.signupStatus = "2";
                }
              }

              that.desserts.unshift(data);
            });
          } else if (response.data.code === 204) {
            this.cleanPupData();

            this.alertPup = true;
            this.pupTitle = "匯入資料有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = response.data.resultData;
          } else if (response.data.code === 205) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入欄位有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = response.data.resultData;
          } else if (response.data.code === 401) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入檔案太大";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "請勿上傳超過六萬筆資料";
          } else if (response.data.code === 402) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "匯入檔案有問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您匯入的檔案無法讀取請重整頁面再試一次";
          } else if (response.data.code === 406) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "非法字元";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您匯入的檔案資料中含有特殊符號或英文詞彙請修正";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSelectAreaList() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSelectAreaList", data)
        .then((response) => {
          if (response.data.code === 200) {
            this.examAreaList = response.data.resultData;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async getSchoolAddressList() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getSchoolAddressList", data)
        .then((response) => {
          // console.log(response.data);
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

    async getExamCode(item) {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.stId = item.stId;

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

    async downloadPersonnelFile() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.fileName =
        this.globalSystemValue.olympic +
        "_" +
        this.signupName +
        this.globalSystemTool.getNowDataTimeByString();
      data.olympic = this.globalSystemValue.olympic;

      this.loadFile = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/loadPersonnelFile", data, {
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

    async createExamCodeAlert() {
      this.createExamCodePup = true;
      this.cleanPupData();
      this.alertPup = true;
      this.pupTitle = "確定產生應試資料";
      this.pupTitleIcon = "mdi-alert-outline";
      this.pupText = "您真的要產生應試資料？";
    },

    cleanPupData() {
      this.alertPup = false;
      this.loadShow = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "選拔管理");
      return this.$store.state.title;
    },

    async editItem(item) {
      await this.getSchoolAddressList();
      await this.getSelectAreaList();
      await this.getExamCode(item);

      if (item.schoolNumber === undefined) {
        item.schoolNumber = "";
      } else if (item.type === "e") {
        item.schoolNumber = item.schoolNumber + "_e";
      } else if (item.type === "j") {
        item.schoolNumber = item.schoolNumber + "_j";
      } else {
        item.schoolNumber = item.schoolNumber + "_s";
      }

      const that = this;
      this.headers.forEach(function (data) {
        if (data.filterName !== undefined) {
          that.editedItem[data.filterName] = "";
          that.defaultItem[data.filterName] = "";
          that.defaultItemShow[data.filterName] = true;
          that.defaultItemIsNull[data.filterName] = data.isNull;
        }
      });

      this.editedItem.signupStatus = "";
      this.defaultItem.signupStatus = "";
      this.editedItem.emailContent = "";
      this.defaultItem.emailContent = "";
      this.editedItem.sendMail = "2";
      this.defaultItem.sendMail = "2";
      this.defaultItemShow.signupStatus = true;
      this.defaultItemIsNull.signupStatus = false;
      this.defaultItemIsNull.statusName = false;

      this.editedIndex = this.desserts.indexOf(item);
      if (this.editedIndex === -1) {
        this.valid = false;
        item.idCard = "";
        item.birthday = "";
      } else {
        if (item.idCard !== "") {
          item.idCard = item.idCard.replaceAll("*", "");
        }
        item.idCard = item.idCard.substr(0, 5);
        item.birthday = item.birthday.replace("/", "-");

        this.editedItem = Object.assign({}, item);
      }
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.valid = true;
      this.studentExamCode = {};
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
        if (!this.desserts[this.editedIndex].idCard.includes("*****")) {
          this.desserts[this.editedIndex].idCard =
            this.desserts[this.editedIndex].idCard.slice(0, 2) +
            "*****" +
            this.desserts[this.editedIndex].idCard.slice(2, 5);
        }
      }
      this.sendMail = Object.assign({}, this.defaultSendMail);
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async sentSignupFail(item) {
      this.loadShow = true;
      await this.tokenService.renewLT();

      if (this.sendMail.emailContent.length > 500) {
        this.loadShow = false;
        alert("您輸入的字數超過500個字");

        return false;
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.email = item.email;
      data.chineseName = item.chineseName;
      data.olympic = this.globalSystemValue.olympic;
      data.text = this.sendMail.emailContent;

      this.alertPup = true;
      this.pupTitle = "寄送成功";
      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupText = "您的信件已寄送完成！";

      await this.axios.post(
        this.systemENV.APISERVERURL + "/sentSignupFail",
        data,
      );
      this.cleanPupData();
    },

    async savePersonnel() {
      this.loadShow = true;
      this.studentExamCode = {};
      await this.tokenService.renewLT();

      const data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.birthday = data.birthday === "" ? "" : this.parseDate(data.birthday);
      data.olyId = this.id;

      if (typeof data.codeName === "object") {
        data.area = data.codeName.areaName;
        data.codeName = data.codeName.codeName;
      }

      if (typeof data.schoolNumber === "object") {
        data.schoolName = data.schoolNumber.school_name;
        data.schoolNumber = data.schoolNumber.school_number;
      }

      data.schoolNumber = data.schoolNumber
        .replace("_e", "")
        .replace("_j", "")
        .replace("_s", "")
        .replace("_c", "")
        .replace("_jc", "")
        .replace("_I", "");

      const born = new Date(data.birthday);
      const now = new Date();

      if (this.globalSystemValue.olympic !== "IJSO") {
        const difference = Math.abs(now - born);
        const days = difference / (1000 * 3600 * 24 * 365);

        if (days > 0 && days < 21) {
          data.age = true;
        } else {
          data.age = false;
        }
      } else {
        if (
          now.getFullYear() - born.getFullYear() > 0 &&
          now.getFullYear() - born.getFullYear() < 16
        ) {
          data.age = true;
          if (this.dessertsTemp[this.editedIndex] == data.signupStatus) {
            data.signupStatus = "3";
          }
        } else {
          data.age = false;
          if (this.dessertsTemp[this.editedIndex] == data.signupStatus) {
            data.signupStatus = "2";
          }
        }
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/savePersonnel", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            data.stId = response.data.resultData;

            if (data.idCard !== "") {
              data.idCard =
                data.idCard.slice(0, 2) + "*****" + data.idCard.slice(2, 5);
            }

            if (data.birthday !== "") {
              data.birthday = data.birthday.replace("-", "/");
            }

            this.changeData(data);

            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              this.desserts.unshift(this.changeData(data));
            }

            this.countSignupStatus();
            this.close();
          } else if (response.data.code === 405) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "信箱已被使用";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "請換一組新的信箱";
          } else if (response.data.code === 407) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "此報名人已存在";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "請再次確認";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    changeData(data) {
      if (data.signupStatus === "1") {
        data.statusName = "待審核";
      }
      if (data.signupStatus === "3") {
        data.statusName = "已通過";
      }
      if (data.signupStatus === "2") {
        data.statusName = "不通過";
      }
      if (data.signupStatus === "1") {
        data.statusName = "待審核";
      }

      if (data.createRole === "S") {
        data.createRole = "學校老師報名";
      }

      if (data.createRole === "A") {
        data.createRole = "專任助理新增";
      }

      if (data.createRole === "T") {
        data.createRole = "專任助理新增 (帳號已移除)";
      }

      if (data.schoolType === "e") {
        data.schoolTypeName = "國小";
      }
      if (data.schoolType === "j") {
        data.schoolTypeName = "國中";
      }
      if (data.schoolType === "s") {
        data.schoolTypeName = "高中";
      }
      if (data.schoolType === "I") {
        data.schoolTypeName = "國際";
      }

      return data;
    },

    async createExamCode() {
      this.cleanPupData();
      this.createExamCodePup = false;
      this.loadFile = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/createExamCode", data)
        .then((response) => {
          this.loadFile = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "產生成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "應試資料產生完成！";
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
            this.pupTitle = "應試資料已存在";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您已經產生過應試資料";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async createCampCode() {
      this.loadFile = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/createCampCode", data)
        .then((response) => {
          this.loadFile = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "產生成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "本次的選訓編號已成功產生";
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
            this.pupTitle = "應試資料已存在";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "您已經產生過應試資料";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async setCMS() {
      this.loadFile = true;
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/setCMS", data)
        .then((response) => {
          this.loadFile = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "產生成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "本次CMS產生成功";
          } else if (response.data.code === 208) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "CMS資料已存在";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "本次CMS已經產生過了";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async checkExamCodeExist() {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkExamCodeExist", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 208) {
            this.$store.dispatch("examCodeStatus", true);
          } else if (response.data.code === 200) {
            this.$store.dispatch("examCodeStatus", false);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async countSignupStatus() {
      this.passCount = 0;
      this.nopassCount = 0;
      this.failCount = 0;
      const that = this;
      this.desserts.forEach(function (data) {
        if (data.signupStatus === "3") {
          that.passCount++;
        }

        if (data.signupStatus === "1") {
          that.nopassCount++;
        }

        if (data.signupStatus === "2") {
          that.failCount++;
        }
      });
    },
  },

  async mounted() {
    this.reloadTitle();
    if (this.globalSystemValue.level === "1") {
      this.levelStatus = false;
    }

    await this.tokenService.renewLT();
    await this.checkExamCodeExist();

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
