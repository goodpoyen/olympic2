<template>
  <div>
    <div style="margin-top: 2%; margin-left: 10%; margin-bottom: 1%">
      <v-row>
        <v-col cols="12" sm="3" md="3">
          <v-btn small color="#635BFF" dark class="mb-2">
            <v-icon small left> mdi-plus </v-icon>
            <p
              v-if="system !== 'science'"
              style="font-size: 13px"
              @click="editItem(editedItem)"
            >
              新增選拔賽
            </p>
            <p
              v-if="system === 'science'"
              style="font-size: 13px"
              @click="editItem(editedItem)"
            >
              新增甄選考試
            </p>
          </v-btn>
        </v-col>
        <v-col cols="12" sm="9" md="9">
          <v-select
            v-if="level === '1' && system === 'olympic'"
            style="max-width: 25%; margin-top: -10px; margin-left: 58%"
            v-model="selectOlympic"
            label="更換奧林匹亞"
            :items="olympicItem"
            item-title="olympic"
            item-value="value"
            variant="underlined"
            @update:modelValue="changeOlympic"
          ></v-select>
          <v-select
            v-if="level === '1' && system === 'science'"
            style="max-width: 25%; margin-top: -10px; margin-left: 58%"
            v-model="selectOlympic"
            label="更換學校"
            :items="scienceItem"
            item-title="olympic"
            item-value="value"
            variant="underlined"
            @update:modelValue="changeOlympic"
          ></v-select>
        </v-col>
      </v-row>
    </div>
    <div v-for="item in desserts" :key="item.oly_id">
      <v-card
        class="mx-auto"
        max-width="80%"
        height="100%"
        style="margin-bottom: 2%"
      >
        <v-card-title
          @click="
            setSignupTime(item);
            checkExamCodeExist(item.olyId);
            checkExamTime(item);
          "
        >
          <v-row>
            <v-col cols="12" sm="9" md="9">
              <router-link
                v-if="item.type === 1"
                :to="'/manage/optionExam/' + item.olyId"
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-btn
                      v-if="item.type === 1"
                      icon="mdi-notebook-edit-outline"
                      color="#e9f8ff"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-card-text style="font-weight: bold; font-size: 18px">
                      <span>{{ item.signupName }}</span>
                    </v-card-text>
                    <v-card-text
                      style="margin-top: -23px; font-size: 13px; color: #7a7d88"
                    >
                      <span>
                        <v-icon small> mdi-calendar-month-outline </v-icon>
                        {{ item.signupStart }} ~ {{ item.signupEnd }}
                        &nbsp;&nbsp; | &nbsp;&nbsp;
                        <v-icon small> mdi-calendar-check-outline </v-icon>
                        {{ item.examStart }} ~ {{ item.examEnd }}
                      </span>
                    </v-card-text>
                  </v-col>
                </v-row>
              </router-link>
              <router-link
                v-if="item.type === 2"
                :to="'/manage/optionCamp/' + item.olyId"
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-btn
                      v-if="item.type === 2"
                      icon="mdi-town-hall"
                      color="#f3ebff"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-card-text style="font-weight: bold; font-size: 18px">
                      <span>{{ item.signupName }}</span>
                    </v-card-text>
                    <v-card-text
                      style="margin-top: -23px; font-size: 13px; color: #7a7d88"
                    >
                      <span>
                        <v-icon small> mdi-calendar-month-outline </v-icon>
                        {{ item.examStart }} ~ {{ item.examEnd }}
                      </span>
                    </v-card-text>
                  </v-col>
                </v-row>
              </router-link>
              <router-link
                v-if="item.type === 3 || item.type === 4 || item.type === 7"
                :to="'/manage/optionOnlineExam/' + item.olyId"
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-btn
                      v-if="item.type === 3"
                      icon="mdi-cast-education"
                      color="#e4ffe5"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                    <v-btn
                      v-if="item.type === 4"
                      icon="mdi-party-popper"
                      color="#fad2a0"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                    <v-btn
                      v-if="item.type === 7"
                      icon="mdi-account-group"
                      color="#ff525278"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-card-text style="font-weight: bold; font-size: 18px">
                      <span>{{ item.signupName }}</span>
                    </v-card-text>
                    <v-card-text
                      style="margin-top: -23px; font-size: 13px; color: #7a7d88"
                    >
                      <span>
                        <v-icon small> mdi-calendar-month-outline </v-icon>
                        {{ item.signupStart }} ~ {{ item.signupEnd }}
                      </span>
                    </v-card-text>
                  </v-col>
                </v-row>
              </router-link>
              <router-link
                v-if="item.type === 5"
                :to="
                  item.examStart !== '' &&
                  item.examEnd !== '' &&
                  '/manage/optionScienceExam/' + item.olyId
                "
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-btn
                      v-if="item.type === 5"
                      icon="mdi-notebook-edit-outline"
                      color="#e9f8ff"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-card-text style="font-weight: bold; font-size: 18px">
                      <span>{{ item.signupName }}</span>
                    </v-card-text>
                    <v-card-text
                      style="margin-top: -23px; font-size: 13px; color: #7a7d88"
                    >
                      <span>
                        <v-icon small> mdi-calendar-month-outline </v-icon>
                        {{ item.signupStart }} ~ {{ item.signupEnd }}
                        &nbsp;&nbsp; | &nbsp;&nbsp;
                        <span
                          v-if="
                            item.type === 5 &&
                            (item.examStart === '' || item.examEnd === '')
                          "
                          style="color: red"
                        >
                          <v-icon small> mdi-calendar-check-outline </v-icon>
                          &nbsp;<甄選考試時間未填寫！>
                        </span>
                        <span v-else>
                          <v-icon small> mdi-calendar-check-outline </v-icon>
                          {{ item.examStart }} ~ {{ item.examEnd }}
                        </span>
                      </span>
                    </v-card-text>
                  </v-col>
                </v-row>
              </router-link>
              <router-link
                v-if="item.type === 6"
                :to="'/manage/optionScienceExam/' + item.olyId"
                style="
                  font-size: 13px;
                  font-weight: bold;
                  text-decoration: none;
                  color: black;
                "
              >
                <v-row>
                  <v-col cols="12" sm="2" md="2">
                    <v-btn
                      v-if="item.type === 6"
                      icon="mdi-rotate-orbit"
                      color="#f3ebff"
                      size="x-large"
                      style="margin-left: 20px; margin-top: 7px"
                    ></v-btn>
                  </v-col>
                  <v-col cols="12" sm="10" md="10">
                    <v-card-text style="font-weight: bold; font-size: 18px">
                      <span>{{ item.signupName }}</span>
                    </v-card-text>
                    <v-card-text
                      style="margin-top: -23px; font-size: 13px; color: #7a7d88"
                    >
                      <span>
                        <v-icon small> mdi-calendar-month-outline </v-icon>
                        {{ item.signupStart }} ~ {{ item.signupEnd }}
                        &nbsp;&nbsp; | &nbsp;&nbsp;
                        <v-icon small> mdi-calendar-check-outline </v-icon>
                        {{ item.examStart }} ~ {{ item.examEnd }}
                      </span>
                    </v-card-text>
                  </v-col>
                </v-row>
              </router-link>
            </v-col>
            <v-col cols="12" sm="3" md="3">
              <div style="margin-left: 50%; margin-top: 20px">
                <v-row>
                  <v-col cols="12" sm="3" md="3">
                    <div style="margin-left: -10px; margin-top: -3px">
                      <v-icon
                        v-if="
                          item.type === 5 && (level === '3' || level === '1')
                        "
                        :disabled="
                          item.signupStart >=
                          globalSystemTool
                            .getDataTimeFormat(new Date())
                            .replaceAll('/', '-')
                            ? false
                            : item.signupStart <
                              globalSystemTool
                                .getDataTimeFormat(new Date())
                                .replaceAll('/', '-')
                        "
                        title="正式報名前測試啟動"
                        large
                        icon
                        :color="item.testTime === '' ? 'gray' : 'red'"
                        @click="testAction(item)"
                      >
                        mdi-bug-play-outline
                      </v-icon>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-icon
                      v-if="system !== 'science'"
                      large
                      title="編輯選拔賽"
                      style="font-size: 26px"
                      @click="editItem(item)"
                    >
                      mdi-text-box-edit-outline
                    </v-icon>
                    <v-icon
                      v-if="item.type === 5"
                      large
                      title="編輯甄選考試"
                      style="font-size: 26px"
                      @click="editItem(item)"
                    >
                      mdi-text-box-edit-outline
                    </v-icon>
                    <v-icon
                      v-if="item.type === 6 && system === 'science'"
                      large
                      title="編輯實驗實作考試"
                      style="font-size: 26px"
                      @click="editItem(item)"
                    >
                      mdi-text-box-edit-outline
                    </v-icon>
                  </v-col>
                  <v-col cols="12" sm="3" md="3">
                    <v-icon
                      v-if="system !== 'science'"
                      title="刪除選拔賽"
                      large
                      style="font-size: 26px"
                      @click="deleteItem(item)"
                    >
                      mdi-trash-can-outline
                    </v-icon>
                    <v-icon
                      v-if="item.type === 5 && (level === '3' || level === '1')"
                      title="刪除甄選考試"
                      large
                      style="font-size: 26px"
                      @click="deleteItem(item)"
                    >
                      mdi-trash-can-outline
                    </v-icon>
                    <v-icon
                      v-if="item.type === 6 && system === 'science'"
                      title="刪除實驗實作考試"
                      large
                      style="font-size: 26px"
                      @click="deleteItem(item)"
                    >
                      mdi-trash-can-outline
                    </v-icon>
                  </v-col>
                </v-row>
              </div>
            </v-col>
          </v-row>
        </v-card-title>
      </v-card>
    </div>
    <v-dialog v-model="dialog" max-width="600px">
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
                <v-col cols="12" sm="6" md="6">
                  <span
                    v-if="system !== 'science'"
                    style="color: black; font-weight: bold"
                  >
                    選拔模組：
                  </span>
                  <span
                    v-if="system === 'science'"
                    style="color: black; font-weight: bold"
                  >
                    甄選模組：
                  </span>
                </v-col>
                <v-col cols="12" sm="12" md="12" style="margin-top: -31px">
                  <v-radio-group
                    :disabled="editedItem.type === 5 && level === '4'"
                    v-model="editedItem.type"
                    inline
                    :rules="[(v) => !!v || '選拔代碼不能為空']"
                    required
                  >
                    <v-radio
                      v-if="olympic != 'TOIREG' && system != 'science'"
                      :value="1"
                      @click="timeWording = '報名'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#E9F8FF"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left>
                            mdi-notebook-edit-outline
                          </v-icon>
                          <p style="font-size: 14px">測驗</p>
                        </v-btn>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="system === 'science'"
                      :value="5"
                      @click="timeWording = '報名'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#E9F8FF"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left>
                            mdi-notebook-edit-outline
                          </v-icon>
                          <p style="font-size: 14px">甄選考試</p>
                        </v-btn>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="system === 'science'"
                      :value="6"
                      @click="timeWording = '繳費'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#f3ebff"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-rotate-orbit </v-icon>
                          <p style="font-size: 14px">實驗實作</p>
                        </v-btn>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="olympic != 'TOIREG' && system != 'science'"
                      :value="2"
                      @click="timeWording2 = '培訓'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#F3EBFF"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-town-hall </v-icon>
                          <p style="font-size: 14px">選訓營</p>
                        </v-btn>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="olympic === 'TOIREG'"
                      :value="3"
                      @click="timeWording = '報名'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#e4ffe5"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-cast-education </v-icon>
                          <p style="font-size: 14px">線上賽</p>
                        </v-btn>
                      </template>
                    </v-radio>
                    <v-radio
                      v-if="olympic === 'TOIREG'"
                      :value="7"
                      @click="timeWording = '報名'"
                    >
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#ff525278"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-account-group </v-icon>
                          <p style="font-size: 14px">資訊營</p>
                        </v-btn>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="editedItem.type == 1 || editedItem.type == 2"
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-if="system === 'olympic'"
                    :disabled="fixCodeName && editedIndex !== -1"
                    v-model="editedItem.codeName"
                    label="選拔代碼"
                    :counter="10"
                    :rules="[
                      (v) => !!v || '選拔代碼不能為空',
                      (v) => v.length <= 10 || '超過規定字數',
                    ]"
                    variant="underlined"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-if="system === 'science'"
                    v-model="editedItem.codeName"
                    label="甄選代碼"
                    :counter="10"
                    :rules="[
                      (v) => !!v || '甄選代碼不能為空',
                      (v) => v.length <= 10 || '超過規定字數',
                    ]"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="
                    editedItem.type === 1 ||
                    editedItem.type === 2 ||
                    editedItem.type === 5 ||
                    editedItem.type === 6
                  "
                  cols="12"
                  sm="6"
                  md="6"
                  style="margin-top: -31px"
                >
                  <v-select
                    :disabled="editedItem.type === 5 && level === '4'"
                    v-if="system === 'olympic'"
                    :key="editedItem.olyId"
                    v-model="editedItem.year"
                    :items="yearList"
                    label="參賽年份"
                    :rules="[(v) => !!v || '參賽年份不能為空']"
                    variant="underlined"
                    required
                  ></v-select>
                  <v-select
                    :disabled="editedItem.type === 5 && level === '4'"
                    v-if="system === 'science'"
                    :key="editedItem.olyId"
                    v-model="editedItem.year"
                    :items="yearList"
                    label="甄選年份"
                    :rules="[(v) => !!v || '甄選年份不能為空']"
                    variant="underlined"
                    required
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="6" md="12" style="margin-top: -31px">
                  <v-text-field
                    :disabled="editedItem.type === 5 && level === '4'"
                    v-model="editedItem.signupName"
                    label="選拔名稱"
                    :counter="30"
                    :rules="[
                      (v) => !!v || '選拔名稱不能為空',
                      (v) => v.length <= 30 || '超過規定字數',
                    ]"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col v-if="editedItem.type == 7" cols="12" sm="6" md="6">
                  <span style="color: black; font-weight: bold">
                    參加者身理性別：
                  </span>
                </v-col>
                <v-col
                  v-if="editedItem.type == 7"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-radio-group
                    v-model="editedItem.partnerGender"
                    inline
                    :rules="[(v) => !!v || '參加者身理性別不能為空']"
                    required
                  >
                    <v-radio :value="'99'">
                      <template v-slot:label>
                        <div>
                          <v-btn
                            small
                            rounded
                            color="#F7FFF0"
                            style="margin-left: 11px; margin-top: -2px"
                          >
                            <v-icon small left> mdi-human-male-female </v-icon>
                            <p style="font-size: 14px; margin-top: 13px">
                              開放全部
                            </p>
                          </v-btn>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio :value="'1'">
                      <template v-slot:label>
                        <div>
                          <v-btn
                            small
                            rounded
                            color="#d5e5ff"
                            style="margin-left: 11px; margin-top: -2px"
                          >
                            <v-icon small left> mdi-human-male </v-icon>
                            <p style="font-size: 14px; margin-top: 13px">
                              身理男
                            </p>
                          </v-btn>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio :value="'2'">
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#fdd8d8"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-human-female </v-icon>
                          <p style="font-size: 14px; margin-top: 13px">
                            身理女
                          </p>
                        </v-btn>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col v-if="editedItem.type == 7" cols="12" sm="6" md="6">
                  <span style="color: black; font-weight: bold">
                    參加者學制：
                  </span>
                </v-col>
                <v-col
                  v-if="editedItem.type == 7"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-container fluid>
                    <v-row>
                      <v-checkbox
                        v-model="checkAll"
                        label="開放全部"
                        @click="setSchoolType('99')"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="checkS"
                        label="高級中等學校"
                        style="margin-left: 8px"
                        :disabled="schoolType"
                        @click="setSchoolType('1')"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="checkJ"
                        label="國民中學"
                        style="margin-left: 8px"
                        :disabled="schoolType"
                        @click="setSchoolType('2')"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="checkE"
                        label="國民小學"
                        style="margin-left: 8px"
                        :disabled="schoolType"
                        @click="setSchoolType('3')"
                      ></v-checkbox>
                    </v-row>
                  </v-container>
                </v-col>
                <v-col
                  v-if="editedItem.type == 6"
                  cols="12"
                  sm="6"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-model="editedItem.web"
                    label="公告網址"
                    :rules="[(v) => !!v || '公告網址不能為空']"
                    variant="underlined"
                    required
                  ></v-text-field>
                </v-col>
                <v-col v-if="editedItem.type == 6" cols="12" sm="6" md="6">
                  <span style="color: black; font-weight: bold">
                    繳費方式：
                  </span>
                </v-col>
                <v-col
                  v-if="editedItem.type == 6"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-radio-group
                    v-model="editedItem.paymentType"
                    inline
                    :rules="[(v) => !!v || '繳費方式不能為空']"
                    required
                  >
                    <v-radio :value="1">
                      <template v-slot:label>
                        <div>
                          <v-btn
                            small
                            rounded
                            color="#FFEEEE"
                            style="margin-left: 11px; margin-top: -2px"
                          >
                            <v-icon small left> mdi-cash-multiple </v-icon>
                            <p style="font-size: 14px">學校自行收費</p>
                          </v-btn>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio :value="2">
                      <template v-slot:label>
                        <v-btn
                          small
                          rounded
                          color="#F7FFF0"
                          style="margin-left: 11px; margin-top: -2px"
                        >
                          <v-icon small left> mdi-cast-connected </v-icon>
                          <p style="font-size: 14px">系統線上繳費</p>
                        </v-btn>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-if="editedItem.type == 6"
                  cols="12"
                  sm="12"
                  md="12"
                  style="margin-top: -31px"
                >
                  <v-text-field
                    v-if="editedItem.paymentType === 2"
                    v-model="editedItem.price"
                    label="報名費用"
                    :rules="[(v) => !!v || '報名費用不能為空']"
                    variant="underlined"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-show="editedItem.type !== 2"
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <v-datetime-picker
                    :disabled="editedItem.type === 5 && level === '4'"
                    :key="editedItem.olyId"
                    v-model="editedItem.signupStart"
                    :text-field-props="textFieldProps"
                    datetime="editedItem.signupStart"
                    :label="timeWording + '開始時間'"
                    style="width: 191px"
                    locale="zh-cn"
                  ></v-datetime-picker> -->
                </v-col>
                <v-col
                  v-show="editedItem.type !== 2"
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <v-datetime-picker
                    :disabled="editedItem.type === 5 && level === '4'"
                    :key="editedItem.olyId"
                    v-model="editedItem.signupEnd"
                    :text-field-props="textFieldProps"
                    :label="timeWording + '結束時間'"
                    style="width: 191px"
                  ></v-datetime-picker> -->
                </v-col>
                <v-col
                  v-show="
                    editedItem.type === 1 ||
                    editedItem.type === 2 ||
                    editedItem.type === 5 ||
                    editedItem.type === 6
                  "
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <template>
                    <v-datetime-picker
                      :key="editedItem.olyId"
                      v-model="editedItem.examStart"
                      :text-field-props="textFieldProps"
                      :label="timeWording2 + '開始時間'"
                      style="width: 191px"
                    ></v-datetime-picker>
                  </template> -->
                </v-col>
                <v-col
                  v-show="
                    editedItem.type === 1 ||
                    editedItem.type === 2 ||
                    editedItem.type === 5 ||
                    editedItem.type === 6
                  "
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <v-datetime-picker
                    :key="editedItem.olyId"
                    v-model="editedItem.examEnd"
                    :text-field-props="textFieldProps"
                    :label="timeWording2 + '結束時間'"
                    style="width: 191px"
                  ></v-datetime-picker> -->
                </v-col>
                <v-col
                  v-show="editedItem.type === 1"
                  cols="12"
                  sm="3"
                  md="3"
                  style="margin-top: -31px; font-size: 16px"
                >
                  開放成績查詢
                </v-col>
                <v-col
                  v-show="editedItem.type === 1"
                  cols="12"
                  sm="3"
                  md="4"
                  style="margin-top: -39px"
                >
                  <v-radio-group v-model="editedItem.queryScore" inline>
                    <v-radio label="否" value="0"></v-radio>
                    <v-radio label="是" value="1"></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col
                  v-show="editedItem.queryScore === '1'"
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <template>
                    <v-datetime-picker
                      :key="editedItem.olyId"
                      v-model="editedItem.queryStart"
                      :text-field-props="textFieldProps"
                      label="成績查詢開始時間"
                      style="width: 191px"
                    ></v-datetime-picker>
                  </template> -->
                </v-col>
                <v-col
                  v-show="editedItem.queryScore === '1'"
                  cols="12"
                  sm="2"
                  md="6"
                  style="margin-top: -31px"
                >
                  <!-- <v-datetime-picker
                    :key="editedItem.olyId"
                    v-model="editedItem.queryEnd"
                    :text-field-props="textFieldProps"
                    label="成績查詢結束時間"
                    style="width: 191px"
                  ></v-datetime-picker> -->
                </v-col>
                <v-col
                  v-show="editedItem.type === 1"
                  cols="12"
                  sm="12"
                  md="16"
                  style="margin-top: -20px"
                >
                  <v-btn
                    outlined
                    color="#0046fe"
                    @click="editorSignupColumn(editedItem)"
                    >設定報名欄位</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color=" darken-1"
              text
              @click="close"
              style="font-weight: bold; font-size: 17px"
              >取消</v-btn
            >
            <v-btn
              v-if="!valid"
              color="blue darken-1"
              text
              :disabled="true"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                (editedItem.type === 1 ||
                  editedItem.type === 5 ||
                  editedItem.type === 6) &&
                (editedItem.signupStart.length === 0 ||
                  editedItem.signupEnd.length === 0 ||
                  editedItem.examStart.length === 0 ||
                  editedItem.examEnd.length === 0)
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              :disabled="true"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                editedItem.type === 2 &&
                (editedItem.examStart.length === 0 ||
                  editedItem.examEnd.length === 0)
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              :disabled="true"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                (editedItem.type === 3 ||
                  editedItem.type === 4 ||
                  editedItem.type === 7) &&
                (editedItem.signupStart.length === 0 ||
                  editedItem.signupEnd.length === 0)
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              :disabled="true"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                valid &&
                (editedItem.type === 1 ||
                  editedItem.type === 5 ||
                  editedItem.type === 6) &&
                editedItem.signupStart.length !== 0 &&
                editedItem.signupEnd.length !== 0 &&
                editedItem.examStart.length !== 0 &&
                editedItem.examEnd.length !== 0
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              @click="saveMenu('save')"
              :disabled="false"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                valid &&
                editedItem.type === 2 &&
                editedItem.examStart.length !== 0 &&
                editedItem.examEnd.length !== 0
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              @click="saveMenu('save')"
              :disabled="false"
              style="color: #2d5bff; font-weight: bold; font-size: 17px"
              >儲存</v-btn
            >
            <v-btn
              v-else-if="
                valid &&
                (editedItem.type === 3 ||
                  editedItem.type === 4 ||
                  editedItem.type === 7) &&
                editedItem.signupStart.length !== 0 &&
                editedItem.signupEnd.length !== 0
                  ? true
                  : false
              "
              color="blue darken-1"
              text
              @click="saveMenu('save')"
              :disabled="false"
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
            style="font-size: 18px !important; font-weight: bold; color: white"
            >確定刪除此選拔賽資訊？</span
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
            @click="removeMenu"
            :disabled="!valid"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >刪除</v-btn
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
    <v-dialog v-model="setColumnPop" max-width="1000px">
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
            mdi-cog
          </v-icon>
          <span
            class="text-h5"
            style="font-size: 18px !important; font-weight: bold; color: white"
            >設定報名欄位</span
          >
        </v-card-title>
        <v-card-text
          ><v-data-table
            :headers="rulesHeaders"
            :items="rulesList"
            loading-text="資料處理中...."
            class="elevation-1"
          >
            <template
              v-for="(header, index) in headers"
              v-slot:[`header.${header.value}`]="{ header }"
            >
              <thead>
                <span>{{ header.text }} </span>
              </thead>
            </template>
            <template v-slot:items="props">
              <td>{{ props.item.name }}</td>
            </template>
            <template v-slot:item.required="{ item }">
              <v-switch
                :disabled="item.sysRequired === true"
                v-model="item.required"
                :color="item.sysRequired === true ? 'green' : 'blue'"
                hide-details
                true-value="使用"
                false-value="不使用"
                :label="`${item.required}`"
                style="margin-top: -5px"
                @click="setSignupColumn(item, 'required')"
              ></v-switch>
            </template>
            <template v-slot:item.isNull="{ item }">
              <v-switch
                :disabled="
                  item.required === '不使用' || item.sysRequired === true
                "
                v-model="item.isNull"
                :color="item.sysRequired === true ? 'green' : 'blue'"
                hide-details
                true-value="必填"
                false-value="非必填"
                :label="`${item.isNull}`"
                style="margin-top: -5px"
                @click="setSignupColumn(item, 'isNull')"
              ></v-switch>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color=" darken-1"
            text
            @click="
              setColumnPop = false;
              tempRules = [];
              rulesList = [];
            "
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            color="blue darken-1"
            text
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="saveSignupColumn()"
            >儲存</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
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
          <div v-html="pupText"></div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-if="pupType === 'testAction'"
            left
            color=" darken-1"
            text
            @click="cleanPupData()"
            style="font-weight: bold; font-size: 17px"
            >取消</v-btn
          >
          <v-btn
            v-if="pupType === 'testAction'"
            left
            color="blue darken-1"
            text
            @click="setTestAction()"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
          >
          <v-btn
            v-if="pupType === 'create'"
            left
            color="blue darken-1"
            text
            @click="cleanPupData"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            >確定</v-btn
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
    <v-dialog v-model="warning" max-width="500px">
      <v-card>
        <v-card-title style="background-color: #900d16; height: 57px">
          <span
            class=""
            style="font-size: 18px !important; font-weight: bold; color: white"
            >甄選考試起訖時間未填寫</span
          >
        </v-card-title>
        <v-card-text
          style="font-size: 20px; margin-top: 19px; font-weight: bold"
        >
          <div>甄選考試起訖時間需填寫，才能操作功能！</div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            left
            color=" darken-1"
            text
            style="font-weight: bold; font-size: 17px"
            @click="warning = false"
            >關閉</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import DatetimePicker from "../components/DatetimePicker";

export default {
  components: {
    "v-datetime-picker": DatetimePicker,
  },
  data: () => ({
    yearList: [],
    alertPup: false,
    warning: false,
    warningOpen: true,
    setColumnPop: false,
    headers: [],
    rulesHeaders: [],
    rulesList: [],
    rulesColumn: [
      "類別",
      "中文姓名",
      "識別碼",
      "校名代碼",
      "年級",
      "出生年/月",
      "信箱",
      "考區代碼",
      "英文姓名",
      "指導老師",
      "備註",
    ],
    tempRules: [],
    pupTitle: "",
    pupTitleShow: "",
    pupTitleHeight: "",
    pupTitleIcon: "",
    pupText: "",
    pupType: "",
    system: "",
    timeWording: "",
    timeWording2: "",
    defaultRules: [],
    textFieldProps: {
      appendIcon: "mdi-calendar-month-outline",
    },
    computedDateFormatted: null,
    dialog: false,
    dialogDelete: false,
    loadShow: false,
    fixCodeName: false,
    editedIndex: -1,
    editedItem: {
      examEnd: "",
      examStart: "",
      olyId: "",
      olympic: "",
      signupName: "",
      signupEnd: "",
      signupStart: "",
      queryScore: "0",
      queryStart: "",
      queryEnd: "",
      price: "",
      web: "",
      partnerGender: "",
      partnerGroup: "",
      paymentType: "",
      type: "",
      codeName: "",
      year: "",
      pathExam: "",
      pathExamScore: "",
      rules: "",
      testTime: "",
    },
    defaultItem: {
      examEnd: "",
      examStart: "",
      olyId: "",
      olympic: "",
      signupName: "",
      signupEnd: "",
      signupStart: "",
      queryScore: "0",
      queryStart: "",
      queryEnd: "",
      price: "",
      web: "",
      partnerGender: "",
      partnerGroup: "",
      paymentType: "",
      type: "",
      codeName: "",
      year: "",
      pathExam: "",
      pathExamScore: "",
      rules: "",
      testTime: "",
    },
    olympicItem: [
      { olympic: "資奧", value: "TOI" },
      { olympic: "數奧", value: "TMO" },
      { olympic: "物奧", value: "IPHO" },
      { olympic: "化奧", value: "TWICHO" },
      { olympic: "生奧", value: "IBO" },
      { olympic: "地奧", value: "IESO" },
      { olympic: "國中科奧", value: "IJSO" },
      { olympic: "資奧推廣", value: "TOIREG" },
      { olympic: "資安奧匹", value: "TESTREG" },
    ],
    scienceItem: [
      { olympic: "建中", value: "JGHS" },
      { olympic: "北一女", value: "TFGHS" },
      { olympic: "師大附中", value: "HSNU" },
      { olympic: "武陵", value: "WLSH" },
      { olympic: "竹科實中", value: "NEHS" },
      { olympic: "臺中一中", value: "TCFSH" },
      { olympic: "彰中", value: "CHSH" },
      { olympic: "嘉中", value: "CYSH" },
      { olympic: "臺南一中", value: "TNFSH" },
      { olympic: "雄中", value: "KSHS" },
      { olympic: "資安科學", value: "TESTNTNU" },
    ],
    valid: true,
    levelStatus: true,
    schoolType: false,
    checkAll: false,
    checkS: false,
    checkJ: false,
    checkE: false,
    desserts: [],
    system: "",
    level: "",
    olympic: "",
    selectOlympic: "",
  }),

  computed: {
    formTitle() {
      if (this.globalSystemValue.system === "science") {
        return this.editedIndex === -1 ? "新增甄選考試" : "更改甄選考試";
      } else {
        return this.editedIndex === -1 ? "新增選拔賽" : "更改選拔賽";
      }
    },

    id() {
      return this.$route.params.id;
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
    allowedYears: (date) => {
      // date is : YYYY
      return parseInt(date, 10);
    },

    checkExamTime(item) {
      if (
        this.system === "science" &&
        this.warningOpen &&
        (item.examStart === "" || item.examEnd === "")
      ) {
        this.warning = true;
      }
    },

    async checkExamCodeExist(olyId) {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = olyId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkExamCodeExist", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 208) {
            this.$store.dispatch("examCodeStatus", true);
            this.fixCodeName = true;
          } else if (response.data.code === 200) {
            this.$store.dispatch("examCodeStatus", false);
            this.fixCodeName = false;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "選拔管理");
      return this.$store.state.title;
    },

    async setSignupColumn(item, type) {
      await this.tokenService.renewLT();

      const that = this;
      this.tempRules.forEach(function (data) {
        if (data.columnName === item.columnName) {
          if (type === "required") {
            if (item.required === "使用") {
              data.required = true;
            } else {
              data.required = false;
            }
          }

          if (type === "isNull") {
            if (item.isNull === "必填") {
              data.isNull = false;
            } else {
              data.isNull = true;
            }
          }
        }
      });
    },

    async saveSignupColumn() {
      await this.tokenService.renewLT();

      this.editedItem.rules = JSON.stringify(this.tempRules);

      this.setColumnPop = false;

      if (this.editedIndex !== -1) {
        await this.saveMenu("Column");
      }

      this.tempRules = [];
      this.rulesList = [];
    },

    async editorSignupColumn(item) {
      await this.tokenService.renewLT();
      var column;

      if (item.rules !== "") {
        this.tempRules = JSON.parse(item.rules);
        column = JSON.parse(item.rules);
      } else {
        this.tempRules = JSON.parse(JSON.stringify(this.defaultRules));
        column = JSON.parse(JSON.stringify(this.defaultRules));
      }

      const that = this;
      column.forEach(function (data) {
        if (that.rulesColumn.includes(data.columnName)) {
          if (data.required) {
            data.required = "使用";
          } else {
            data.required = "不使用";
          }

          if (!data.isNull) {
            data.isNull = "必填";
          } else {
            data.isNull = "非必填";
          }

          that.rulesList.push(data);
        }
      });

      this.rulesHeaders = [
        { text: "欄位名稱", value: "columnName" },
        {
          text: "使用欄位",
          value: "required",
        },
        {
          text: "是否必填",
          value: "isNull",
        },
      ];

      this.setColumnPop = true;
    },

    async changeOlympic() {
      console.log(5555);
      await this.tokenService.renewLT();

      this.tokenService.store("olympic", this.selectOlympic, "1800000");

      location.reload();
    },

    setSignupTime(item) {
      this.$store.dispatch("signupStartTime", item.signupStart);
      this.$store.dispatch("signupEndTime", item.signupEnd);
      this.tokenService.store(
        this.globalSystemValue.olympic + item.olyId + "T",
        item.signupStart,
        "1800000",
      );
      this.tokenService.store(
        this.globalSystemValue.olympic + item.olyId + "E",
        item.signupEnd,
        "1800000",
      );
    },

    setSchoolType(type) {
      if (type === "99") {
        this.schoolType = this.schoolType ? false : true;
        this.checkS = false;
        this.checkJ = false;
        this.checkE = false;
        this.editedItem.partnerGroup = this.schoolType ? "99" : "";
      } else {
        if (
          this.editedItem.partnerGroup.includes(type) ||
          this.editedItem.partnerGroup.includes("," + type)
        ) {
          this.editedItem.partnerGroup = this.editedItem.partnerGroup.replace(
            "," + type,
            "",
          );
          this.editedItem.partnerGroup = this.editedItem.partnerGroup.replace(
            type,
            "",
          );

          if (this.editedItem.partnerGroup.substr(0, 1) === ",") {
            this.editedItem.partnerGroup = this.editedItem.partnerGroup.substr(
              1,
              this.editedItem.partnerGroup.length,
            );
          }
        } else {
          if (this.editedItem.partnerGroup.length === 0) {
            this.editedItem.partnerGroup = type;
          } else {
            this.editedItem.partnerGroup += "," + type;
          }
        }
      }
    },

    testAction(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);

      if (item.testTime === "") {
        this.pupTitle = "確定開始系統測試？";
        this.pupText = "您現在確定要啟動報名系統測試？";
      } else {
        this.pupTitle = "確定結束系統測試？";
        this.pupText = "您現在確定要結束報名系統測試？";
      }
      this.alertPup = true;
      this.pupTitleShow = "2";
      this.pupTitleIcon = "mdi-alert-outline";
      this.pupType = "testAction";
    },

    async setTestAction() {
      await this.tokenService.renewLT();

      if (this.editedItem.testTime === "") {
        this.editedItem.testTime = this.globalSystemTool
          .getDataTimeFormat(new Date())
          .replaceAll("/", "-");
      } else {
        this.editedItem.testTime = "";
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.editedItem.olyId;
      data.olympic = this.globalSystemValue.olympic;
      data.signupName = this.editedItem.signupName;
      data.type = this.editedItem.type;
      data.testTime = this.editedItem.testTime;
      this.loadShow = true;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/setTestAction", data)
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;
          if (response.data.code === 200) {
            Object.assign(this.desserts[this.editedIndex], data);
            this.cleanPupData();
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    showSchoolType(item) {
      if (item.partnerGroup === "99") {
        this.schoolType = true;
        this.checkAll = true;
        this.checkS = false;
        this.checkJ = false;
        this.checkE = false;
      }
      if (item.partnerGroup.includes("1")) {
        this.checkS = true;
      }
      if (item.partnerGroup.includes("2")) {
        this.checkJ = true;
      }
      if (item.partnerGroup.includes("3")) {
        this.checkE = true;
      }
    },

    async editItem(item) {
      this.warningOpen = false;
      if (this.editedIndex !== -1) {
        await this.checkExamCodeExist(item.olyId);
      }

      if (item.type === 7) {
        this.showSchoolType(item);
      }

      this.editedIndex = this.desserts.indexOf(item);
      if (this.editedIndex === -1) {
        this.valid = false;
      }
      this.editedItem = Object.assign({}, item);

      if (this.editedItem.type === 6) {
        this.timeWording = "繳費";
      } else {
        this.timeWording = "報名";
      }

      if (this.editedItem.type === 2) {
        this.timeWording2 = "培訓";
      } else {
        this.timeWording2 = "測驗";
      }

      this.dialog = true;
    },

    deleteItem(item) {
      this.warningOpen = false;
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    cleanPupData() {
      this.warningOpen = true;
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
      this.pupType = "";
    },

    async removeMenu() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.editedItem.olyId;
      data.type = this.editedItem.type;
      data.olympic = this.globalSystemValue.olympic;
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/removeMenu", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data)
          if (response.data.code === 200) {
            this.desserts.splice(this.editedIndex, 1);
            this.closeDelete();
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      console.log(6);
      this.warningOpen = true;
    },

    close() {
      this.warningOpen = true;
      this.dialog = false;
      this.valid = false;
      this.tempRules = [];
      this.rulesList = [];
      this.schoolType = false;
      this.checkAll = false;
      this.checkS = false;
      this.checkJ = false;
      this.checkE = false;

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeColumn() {
      this.dialog = true;
      this.tempRules = [];
      this.rulesList = [];
    },

    closeDelete() {
      this.warningOpen = true;
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    async setYearList() {
      for (let i = 2023; i <= 2032; i++) {
        this.yearList.push(i.toString());
      }
    },

    async saveMenu(type) {
      await this.tokenService.renewLT();

      this.editedItem.olympic = this.globalSystemValue.olympic;

      if (
        this.editedItem.type === 1 ||
        this.editedItem.type === 5 ||
        this.editedItem.type === 6
      ) {
        this.editedItem.examStart = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.examStart,
        );
        this.editedItem.examEnd = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.examEnd,
        );
        this.editedItem.signupEnd = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.signupEnd,
        );
        this.editedItem.signupStart = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.signupStart,
        );

        if (this.editedItem.queryScore === "1") {
          this.editedItem.queryStart = this.globalSystemTool.GMTdateTimeFormat(
            this.editedItem.queryStart,
          );
          this.editedItem.queryEnd = this.globalSystemTool.GMTdateTimeFormat(
            this.editedItem.queryEnd,
          );
        } else {
          this.editedItem.queryStart = null;
          this.editedItem.queryEnd = null;
        }
      } else if (this.editedItem.type === 2) {
        this.editedItem.examStart = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.examStart,
        );
        this.editedItem.examEnd = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.examEnd,
        );
        this.editedItem.signupEnd = null;
        this.editedItem.signupStart = null;
      } else {
        this.editedItem.examStart = null;
        this.editedItem.examEnd = null;
        this.editedItem.signupEnd = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.signupEnd,
        );
        this.editedItem.signupStart = this.globalSystemTool.GMTdateTimeFormat(
          this.editedItem.signupStart,
        );
      }

      if (
        this.editedItem.type === 7 &&
        this.editedItem.partnerGroup.length >= 5
      ) {
        this.editedItem.partnerGroup = "99";
      }

      const data = this.globalSystemTool.equestData(this.editedItem);
      data.AT = await this.tokenService.getFastAT();
      if (this.editedIndex === -1) {
        data.maintain = "0";
      }
      this.loadShow = true;
      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveMenu", data)
        .then((response) => {
          this.loadShow = false;
          // console.log(response.data);
          if (response.data.code === 200) {
            data.olyId = response.data.resultData;
            if (this.editedIndex > -1) {
              Object.assign(this.desserts[this.editedIndex], data);
            } else {
              this.desserts.unshift(data);
            }

            if (type === "Column") {
              this.closeColumn();
            } else {
              this.close();
            }
          } else if (response.data.code === 502) {
            this.closeDelete();
            this.alertPup = true;
            this.pupTitle = "選拔建立問題";
            this.pupTitleShow = "2";
            this.pupTitleIcon = "mdi-alert-outline";
            this.pupText = "選拔名稱有重複請確認名稱與參賽年分";
            this.pupType = "create";
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      this.warningOpen = true;
    },

    async getOptionMenuInfo() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getOptionMenu", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;
            this.defaultRules = response.data.defaultRules;
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

    this.selectOlympic = this.globalSystemValue.olympic;

    this.system = this.globalSystemValue.system;
    this.level = this.globalSystemValue.level;
    this.olympic = this.globalSystemValue.olympic;

    await this.tokenService.renewLT();
    await this.getOptionMenuInfo();
    await this.setYearList();
  },
};
</script>
