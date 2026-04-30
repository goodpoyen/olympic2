<template>
  <div>
    <div style="margin: 20px; font-size: 14px; font-weight: bold">
      <div style="display: inline">
        寄件狀況:
        <v-icon
          :title="'寄送' + titleExam"
          medium
          style="margin-left: 20px; color: #2bcd2b"
        >
          mdi-card-account-details-outline
        </v-icon>
        <span
          v-if="globalSystemValue.system === 'olympic'"
          style="margin-left: 10px"
          >{{ examSend }} / {{ desserts.length }}</span
        >
        <span v-else style="margin-left: 10px"
          >{{ examSend }} / {{ desserts.length - admissionCount }}</span
        >
        <v-icon
          :title="'寄送' + titleScore"
          medium
          style="margin-left: 20px; color: #2bcd2b"
        >
          mdi-license
        </v-icon>
        <span
          v-if="globalSystemValue.system === 'olympic'"
          style="margin-left: 10px"
          >{{ scoreSend }} / {{ desserts.length }}</span
        >
        <span v-else style="margin-left: 10px"
          >{{ scoreSend }} / {{ desserts.length - admissionCount }}</span
        >
      </div>
    </div>
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="desserts"
      :items-per-page="50"
      :footer-props="{ 'items-per-page-options': [50, 100, 150, 200, 250, -1] }"
      show-select
      return-object
      :item-value="itemKey"
      :loading="loadList"
      loading-text="資料處理中...."
      class="elevation-1"
    >
      <template v-slot:headers="{ columns, isSorted, getSortIcon, toggleSort }">
        <tr>
          <template v-for="column in columns" :key="column.key">
            <th>
              <span
                class="me-2 cursor-pointer"
                @click="toggleSort(column)"
                v-text="column.title"
              ></span>
              <v-icon
                v-if="isSorted(column)"
                :icon="getSortIcon(column)"
                color="medium-emphasis"
              ></v-icon>
              <div class="d-flex align-center">
                <span>
                  <v-menu offset-y :close-on-content-click="false">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="column.title === '功能' || column.title === ''"
                        size="x-small"
                        icon="mdi-filter"
                        variant="text"
                        v-bind="props"
                        style="visibility: hidden"
                      ></v-btn>
                      <v-btn
                        v-else
                        size="x-small"
                        icon="mdi-filter"
                        variant="text"
                        v-bind="props"
                      ></v-btn>
                    </template>
                    <table-filter
                      :desserts="desserts"
                      :dessertsTemp="dessertsTemp"
                      :header="column"
                      @updateTable="updateTable"
                    >
                    </table-filter>
                  </v-menu>
                </span>
              </div>
            </th>
          </template>
        </tr>
      </template>
      <template v-slot:top>
        <v-toolbar flat style="background-color: white">
          <div v-if="selected.length > 0">
            <v-btn
              icon="mdi-card-account-details-outline"
              size="small"
              variant="outlined"
              @click="checkAlert('multi', 'exam', {})"
              style="margin-top: -20px; margin-left: 10px"
              :title="
                '寄送' +
                titleExam +
                ' (注意：只發送有打勾的資料，非全部資料寄送)'
              "
            ></v-btn>
            <v-divider
              class="mx-5"
              vertical
              color="primary"
              style="
                min-height: 30px;
                margin-top: 18px;
                border-color: rgb(20 19 19 / 95%);
              "
            ></v-divider>
            <v-btn
              icon="mdi-email-check-outline"
              size="small"
              @click="
                confirmTestmailStatus = confirmScoreTest !== '' ? true : false;
                setEmailpup = true;
              "
              style="margin-top: -20px"
              variant="outlined"
              title="成績證明寄送前抽測"
            ></v-btn>
            <v-btn
              v-if="globalSystemValue.system === 'olympic'"
              :disabled="confirmScoreTest === ''"
              icon="mdi-license"
              size="small"
              @click="checkAlert('multi', 'score', {})"
              style="margin-top: -20px; margin-left: 10px"
              variant="outlined"
              :title="
                '寄送' +
                titleScore +
                ' (注意：只發送有打勾的資料，非全部資料寄送)'
              "
            ></v-btn>
            <v-btn
              v-else
              icon="mdi-license"
              size="small"
              @click="checkAlert('multi', 'score', {})"
              style="margin-top: -20px; margin-left: 10px"
              variant="outlined"
              :title="
                '寄送' +
                titleScore +
                ' (注意：只發送有打勾的資料，非全部資料寄送)'
              "
            ></v-btn>
            <v-divider
              class="mx-4"
              vertical
              style="
                min-height: 30px;
                margin-top: 18px;
                border-color: rgb(20 19 19 / 95%);
              "
            ></v-divider>
            <v-btn
              v-if="scheduleType !== 6"
              icon="mdi-account-multiple-check-outline"
              size="small"
              @click="upgradeShow"
              style="margin-top: -20px"
              variant="outlined"
              title="晉級"
            ></v-btn>
          </div>
          <v-btn
            v-if="
              globalSystemValue.system === 'science' && selected.length === 0
            "
            class="ma-2"
            small
            color="#635BFF"
            variant="flat"
            style="font-weight: bold"
            @click="goToLink('/manage/defaultscore/' + id)"
          >
            <v-icon small left> mdi mdi-link-edit </v-icon>
            <p style="font-size: 13px">修改成績科目</p>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
            class="ma-2"
            small
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="desserts.length == 0"
            @click="importPup = true"
          >
            <v-icon small left> mdi-file-upload-outline </v-icon>
            <p style="margin-left: 2px; font-size: 13px">匯入</p>
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
            color="#635BFF"
            variant="outlined"
            style="font-weight: bold"
            :disabled="desserts.length == 0"
            @click="downloadPup = true"
          >
            <v-icon small left> mdi-tray-arrow-down </v-icon>
            <p style="margin-left: 2px; font-size: 13px">匯出</p>
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
              style="margin-top: 6px; font-size: 14px; cursor: pointer"
              @click="controllerSnedTypePup('sendall', null)"
              >寄送通知給所有{{ role }}</u
            >
          </span>
          <span
            style="
              display: flex;
              justify-content: right;
              color: red;
              margin-top: 1px;
            "
            ><u
              v-if="
                (scheduleType === 1 ||
                  scheduleType === 5 ||
                  scheduleType === 6) &&
                !sendExamNotice &&
                !sendExamScoreNoice &&
                systemENV.MOD == 'prod'
              "
              style="margin-top: -20px; font-size: 14px; cursor: pointer"
              @click="deletepup = true"
              >刪除所有{{ contestntsName }}</u
            >
            <u
              v-if="
                (scheduleType === 1 ||
                  scheduleType === 5 ||
                  scheduleType === 6) &&
                systemENV.MOD !== 'prod'
              "
              style="margin-top: -20px; font-size: 14px; cursor: pointer"
              @click="deletepup = true"
              >刪除所有{{ contestntsName }}</u
            >
          </span>
        </div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon
          v-if="globalSystemValue.system === 'olympic'"
          title="檢視檔案"
          class="mr-4"
          @click="controllerSnedTypePup('review', item)"
        >
          mdi-file-eye-outline
        </v-icon>
        <v-icon
          v-if="globalSystemValue.system === 'science'"
          :disabled="
            globalSystemValue.system === 'science' && item.admission === '2'
          "
          title="檢視檔案"
          class="mr-4"
          @click="controllerSnedTypePup('review', item)"
        >
          mdi-file-eye-outline
        </v-icon>
        <v-icon
          :title="'寄送' + titleExam"
          class="mr-4"
          :disabled="item.admission === '2'"
          :style="item.sendExamNotice ? { color: 'green' } : { color: '' }"
          @click="checkAlert('one', 'exam', item)"
        >
          mdi-card-account-details-outline
        </v-icon>
        <v-icon
          v-if="globalSystemValue.system === 'olympic'"
          :title="'寄送' + titleScore"
          :disabled="confirmScoreTest === ''"
          class="mr-4"
          :style="item.sendExamScoreNoice ? { color: 'green' } : { color: '' }"
          @click="checkAlert('one', 'score', item)"
        >
          mdi-license
        </v-icon>
        <v-icon
          v-else
          :title="'寄送' + titleScore"
          :disabled="item.admission === '2' || item.scoreStatus === 0"
          class="mr-4"
          :style="item.sendExamScoreNoice ? { color: 'green' } : { color: '' }"
          @click="checkAlert('one', 'score', item)"
        >
          mdi-license
        </v-icon>
        <v-icon
          v-if="globalSystemValue.system === 'science'"
          :style="item.scoreStatus === 1 ? { color: 'green' } : { color: '' }"
          :disabled="item.admission === '2'"
          title="成績編輯"
          class="mr-4"
          @click="editorScore(item)"
        >
          mdi-notebook-edit-outline
        </v-icon>
      </template>
      <template v-slot:item.score="{ item }">
        <v-text-field
          dense
          v-model="item.score"
          style="width: 90px; padding: 9px"
          variant="outlined"
          @keyup="scoreInput(item)"
        >
        </v-text-field>
      </template>
      <template v-slot:item.pr="{ item }">
        <v-text-field
          dense
          v-model="item.pr"
          style="width: 90px; padding: 9px"
          variant="outlined"
          @keyup="PRInput(item)"
        >
        </v-text-field>
      </template>
      <template v-slot:item.pass="{ item }">
        <div
          v-if="item.pass === '晉級' || item.pass === '錄取'"
          style="color: #2bcd2b"
        >
          {{ item.pass }}
        </div>
        <div v-else-if="item.pass === '缺考'" style="color: rosybrown">
          {{ item.pass }}
        </div>
        <div v-else>{{ item.pass }}</div>
      </template>
    </v-data-table>
    <v-dialog v-model="alertPup" max-width="500px">
      <importcontestants-Dialog
        :pupTitle="pupTitle"
        :pupTitleShow="pupTitleShow"
        :pupTitleIcon="pupTitleIcon"
        :pupText="pupText"
        :importCheck="importCheck"
        :selectImportTyep="selectImportTyep"
        @closeImportContestants="closeImportContestants"
        @importContestantsFile="importContestantsFile"
        @importExamTranscrip="importExamTranscrip"
      ></importcontestants-Dialog>
    </v-dialog>
    <v-dialog v-model="importDataErrorPup" max-width="500px">
      <importexamtranscrip-dialog
        :pupTitle="pupTitle"
        :pupTitleShow="pupTitleShow"
        :pupTitleIcon="pupTitleIcon"
        :pupText="pupText"
        :subjectConfig="subjectConfig"
        :errorData="errorData"
        @closeImporEexamTranscrip="closeImporEexamTranscrip"
      ></importexamtranscrip-dialog>
    </v-dialog>
    <v-dialog v-model="sendMailpup" max-width="500px">
      <sendmail-dialog
        :id="id"
        :sendMailpup="sendMailpup"
        :scheduleType="scheduleType"
        :sendMailtype="sendMailtype"
        :pupTitleShow="pupTitleShow"
        :pupTitleIcon="pupTitleIcon"
        :pupTitle="pupTitle"
        :pupText="pupText"
        :tempItem="tempItem"
        :target="target"
        :sendType="sendType"
        :selected="selected"
        :multiSelect="multiSelect"
        @closeSendMailpup="closeSendMailpup"
        @setDesserts="setDesserts"
        @chagneSendMailContent="chagneSendMailContent"
        @closeSendMultiMail="closeSendMultiMail"
      >
      </sendmail-dialog>
    </v-dialog>
    <v-dialog v-model="upgradePup" max-width="500px">
      <upgrade-dialog
        :id="id"
        :campData="campData"
        :selected="selected"
        :upgradePup="upgradePup"
        :upgradeRaceList="upgradeRaceList"
        @closeUpgradepup="closeUpgradepup"
        @updateSelectd="updateSelectd"
      >
      </upgrade-dialog>
    </v-dialog>
    <v-dialog v-model="snedTypePup" width="39%">
      <snedtype-dialog
        :id="id"
        :reviewMod="reviewMod"
        :confirmTestmailStatus="confirmTestmailStatus"
        :mailTypeHeader="mailTypeHeader"
        :sendMailtype="sendMailtype"
        :sendMailSelected="sendMailSelected"
        :scheduleType="scheduleType"
        :tempReviewItem="tempReviewItem"
        :selected="selected"
        :target="target"
        :sendType="sendType"
        @closeSendTypepup="closeSendTypepup"
        @updateReview="updateReview"
        @chagneSendTypeContent="chagneSendTypeContent"
        @updateSendAllMail="updateSendAllMail"
        @sendTestMail="sendTestMail"
        @confirmTestMail="confirmTestMail"
      >
      </snedtype-dialog>
    </v-dialog>
    <v-dialog v-model="setEmailpup" width="37%">
      <setemail-dialog
        :confirmTestmailStatus="confirmTestmailStatus"
        @closeSetMailpup="closeSetMailpup"
        @sendTestMail="sendTestMail"
        @confirmTestMail="confirmTestMail"
      ></setemail-dialog>
    </v-dialog>
    <v-dialog v-model="deletepup" width="24%">
      <delete-dialog
        :id="id"
        :scheduleType="scheduleType"
        @updateDesserts="updateDesserts"
        @closeDeletepup="closeDeletepup"
      >
      </delete-dialog>
    </v-dialog>
    <v-dialog v-model="editorScorePup" width="35%">
      <v-card>
        <v-card-title
          dark
          class="text-h5 grey lighten-2 white--text"
          style="background-color: #2d5bff !important"
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
            mdi-seal-variant
          </v-icon>
          <div style="font-size: 18px; font-weight: bold">成績管理編輯</div>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col
              cols="3"
              sm="3"
              md="3"
              style="margin-top: 15px; font-size: 16px; font-weight: bold"
              >學生代碼：
            </v-col>
            <v-col
              class="d-flex justify-center"
              cols="3"
              sm="3"
              md="3"
              style="
                margin-top: 16px;
                font-weight: bold;
                border-bottom: 1px solid;
                height: 40px;
              "
            >
              {{ editedItem.examOnly }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="3"
              sm="3"
              md="3"
              style="font-size: 16px; font-weight: bold"
              >甄選證號碼：
            </v-col>
            <v-col
              class="d-flex justify-center"
              cols="3"
              sm="3"
              md="3"
              style="font-weight: bold; border-bottom: 1px solid; height: 40px"
            >
              {{ editedItem.examCode }}
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="3"
              sm="3"
              md="3"
              style="font-size: 16px; font-weight: bold"
              >甄選生姓名：
            </v-col>
            <v-col
              class="d-flex justify-center"
              cols="3"
              sm="3"
              md="3"
              style="
                font-size: 16px;
                font-weight: bold;
                border-bottom: 1px solid;
                height: 40px;
              "
            >
              {{ editedItem.chineseName }}
            </v-col>
          </v-row>
          <v-row>
            <v-btn
              class="ma-2"
              outlined
              :color="editedItem.pass === '缺考' ? 'red' : 'indigo'"
              style="font-weight: bold; width: 95%"
              @click="
                absentPup = true;
                absentTypeTemp = absentType;
                passTemp = editedItem.pass;
              "
            >
              <v-icon dense left> mdi-account-remove </v-icon>
              <p style="font-size: 16px; margin-top: 16px">缺考</p>
            </v-btn>
          </v-row>
          <v-form ref="form" v-model="scoreStatus">
            <v-card v-if="scheduleType === 5" style="margin-top: 30px">
              <v-card-title style="background-color: #e0eafb; height: 40px">
                <div
                  style="margin-top: -10px; font-size: 16px; font-weight: bold"
                >
                  語文能力成績
                </div>
              </v-card-title>
              <v-card-text>
                <div v-for="subject in subjectConfig" :key="subject.slId">
                  <v-row v-if="subject.subjectGroup === 'language'">
                    <v-col cols="12" sm="6" md="6" style="padding: 5px">
                      <div
                        style="
                          margin-top: 22px;
                          margin-left: 10px;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        <div v-if="subject.editorSubjectName !== ''">
                          {{ subject.editorSubjectName }}
                        </div>
                        <div v-else>{{ subject.subjectName }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="5" md="5" style="padding: 5px">
                      <div v-if="subject.dataType !== 'boolean'">
                        <v-text-field
                          v-if="userScore[subject.slId] === '9999'"
                          value="缺考"
                          :disabled="true"
                          class="centered-input"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-else
                          v-model="userScore[subject.slId]"
                          class="centered-input"
                          @click="getsubjetData(subject)"
                          :maxlength="subject.valueLength"
                          :rules="[checkScoreValue]"
                          required
                        ></v-text-field>
                      </div>
                      <div v-else>
                        <v-switch
                          v-model="subject.scoreValue"
                          @click="getsubjetBooleanData(subject, 'boolean')"
                          hide-details
                          :true-value="subject.defaultValue.t"
                          :false-value="subject.defaultValue.f"
                          :label="`${subject.scoreValue}`"
                        ></v-switch>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-card style="margin-top: 20px">
              <v-card-title style="background-color: #e0eafb; height: 40px">
                <div
                  style="margin-top: -10px; font-size: 16px; font-weight: bold"
                >
                  自然科學能力成績
                </div>
              </v-card-title>
              <v-card-text>
                <div v-for="subject in subjectConfig" :key="subject.slId">
                  <v-row v-if="subject.subjectGroup === 'scienceExam'">
                    <v-col cols="12" sm="6" md="6" style="padding: 5px">
                      <div
                        style="
                          margin-top: 22px;
                          margin-left: 10px;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        <div v-if="subject.editorSubjectName !== ''">
                          {{ subject.editorSubjectName }}
                        </div>
                        <div v-else>{{ subject.subjectName }}</div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="5" md="5" style="padding: 5px">
                      <div v-if="subject.dataType !== 'boolean'">
                        <v-text-field
                          v-if="userScore[subject.slId] === '9999'"
                          value="缺考"
                          :disabled="true"
                          class="centered-input"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-else
                          v-model="userScore[subject.slId]"
                          class="centered-input"
                          @click="getsubjetData(subject)"
                          :maxlength="subject.valueLength"
                          :rules="[checkScoreValue]"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div v-else>
                        <v-switch
                          v-model="subject.scoreValue"
                          @click="getsubjetBooleanData(subject, 'boolean')"
                          hide-details
                          :true-value="subject.defaultValue.t"
                          :false-value="subject.defaultValue.f"
                          :label="`${subject.scoreValue}`"
                        ></v-switch>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>
            <v-card style="margin-top: 20px">
              <v-card-title style="background-color: #e0eafb; height: 40px">
                <div
                  style="margin-top: -10px; font-size: 16px; font-weight: bold"
                >
                  <div v-if="scheduleType === 5">科學能力檢定成績</div>
                  <div v-else>實驗實作檢定成績</div>
                </div>
              </v-card-title>

              <v-card-text>
                <div v-for="subject in subjectConfig" :key="subject.slId">
                  <v-row
                    v-if="
                      (subject.subjectGroup === 'totalScore' ||
                        subject.subjectGroup === 'result') &&
                      subject.subjectName !== '【備註】'
                    "
                  >
                    <v-col cols="12" sm="6" md="6" style="padding: 5px">
                      <div
                        style="
                          margin-top: 22px;
                          margin-left: 10px;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        <div v-if="subject.editorSubjectName !== ''">
                          {{ subject.editorSubjectName }}
                        </div>
                        <div v-else>
                          {{ subject.subjectName }}
                        </div>
                      </div>
                    </v-col>
                    <v-col cols="12" sm="5" md="5" style="padding: 5px">
                      <div v-if="subject.dataType !== 'boolean'">
                        <v-text-field
                          v-if="
                            subject.pattern !== 'textArea' &&
                            userScore[subject.slId] !== '9999'
                          "
                          v-model="userScore[subject.slId]"
                          class="centered-input"
                          @click="getsubjetData(subject)"
                          :maxlength="subject.valueLength"
                          :rules="[checkScoreValue]"
                          required
                        ></v-text-field>
                        <v-text-field
                          v-if="
                            subject.pattern !== 'textArea' &&
                            userScore[subject.slId] === '9999'
                          "
                          class="centered-input"
                          value="缺考"
                          :disabled="true"
                          required
                        ></v-text-field>
                        <v-textarea
                          v-if="
                            subject.pattern === 'textArea' &&
                            userScore[subject.slId] !== '缺考'
                          "
                          v-model="userScore[subject.slId]"
                          class="mx-2"
                          rows="1"
                          :rules="textRules"
                        ></v-textarea>
                        <v-text-field
                          v-if="
                            subject.pattern === 'textArea' &&
                            userScore[subject.slId] === '缺考'
                          "
                          class="centered-input"
                          value="缺考"
                          :disabled="true"
                        ></v-text-field>
                      </div>
                      <div v-else>
                        <v-switch
                          v-model="subject.scoreValue"
                          @click="getsubjetBooleanData(subject, 'pass')"
                          hide-details
                          :true-value="subject.defaultValue.t"
                          :false-value="subject.defaultValue.f"
                          :label="`${subject.scoreValue}`"
                        ></v-switch>
                      </div>
                    </v-col>
                  </v-row>
                </div>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <div
                      style="
                        margin-top: 22px;
                        font-size: 16px;
                        font-weight: bold;
                      "
                    >
                      甄選生備註：
                      <v-textarea outlined v-model="scoreRemark"></v-textarea>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-form>
        </v-card-text>

        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="black darken-1"
            style="font-weight: bold; font-size: 17px"
            @click="
              editorScorePup = false;
              userScore = {};
              scoreRule = {};
            "
          >
            取消
          </v-btn>
          <v-btn
            text
            color="darken-1"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            :disabled="!scoreStatus"
            @click="saveExamScore('editorSave')"
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
    <v-dialog v-model="absentPup" width="40%">
      <v-card>
        <v-card-title
          class="white--text"
          style="background-color: rgb(87 76 76) !important"
        >
          <v-icon class="white--text"> mdi-account-remove-outline </v-icon>
          <div style="margin-left: 5px">
            {{ editedItem.chineseName }} - 缺考
          </div>
        </v-card-title>

        <v-card-text style="font-size: 12px; font-weight: bold; color: #2d5bff">
          <v-radio-group v-model="absentType" column>
            <v-radio
              label="全部科目缺考"
              value="20"
              @click="changeAbsentScore(editedItem, '9999')"
            ></v-radio>
            <v-radio
              label="部分科目缺考"
              value="10"
              @click="changeAbsentScore(editedItem, '10')"
            ></v-radio>
            <div v-if="absentType === '10'" style="margin-left: 10px">
              <v-row>
                <v-col cols="12" sm="6" md="6" style="padding: 5px">
                  <v-card style="margin-top: 10px; margin-bottom: 10px">
                    <v-card-title
                      style="background-color: #ededf3; height: 40px"
                    >
                      <div
                        style="
                          margin-top: -10px;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        語文能力科目
                      </div>
                    </v-card-title>

                    <v-card-text>
                      <div v-for="subject in subjectConfig" :key="subject.slId">
                        <div
                          v-if="
                            subject.subjectGroup === 'language' &&
                            subject.subjectName !== '【備註】'
                          "
                          style="
                            margin-left: 10px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          <div v-if="subject.editorSubjectName !== ''">
                            <v-checkbox
                              v-model="absnetItem"
                              :label="subject.editorSubjectName"
                              :value="subject.slId"
                              style="margin-bottom: -20px"
                              @click="setSomeAbsent(subject.slId)"
                            ></v-checkbox>
                          </div>
                          <div v-else>
                            <v-checkbox
                              v-model="absnetItem"
                              :label="subject.subjectName"
                              :value="subject.slId"
                              style="margin-bottom: -20px"
                              @click="setSomeAbsent(subject.slId)"
                            ></v-checkbox>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="6" style="padding: 5px">
                  <v-card style="margin-top: 10px; margin-bottom: 10px">
                    <v-card-title
                      style="background-color: #ededf3; height: 40px"
                    >
                      <div
                        style="
                          margin-top: -10px;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        自然科學能力科目
                      </div>
                    </v-card-title>

                    <v-card-text>
                      <div v-for="subject in subjectConfig" :key="subject.slId">
                        <div
                          v-if="
                            subject.subjectGroup === 'scienceExam' &&
                            subject.subjectName !== '【備註】'
                          "
                          style="
                            margin-left: 10px;
                            font-size: 16px;
                            font-weight: bold;
                          "
                        >
                          <div v-if="subject.editorSubjectName !== ''">
                            <v-checkbox
                              v-model="absnetItem"
                              :label="subject.editorSubjectName"
                              :value="subject.slId"
                              style="margin-bottom: -20px"
                              @click="setSomeAbsent(subject.slId)"
                            ></v-checkbox>
                          </div>
                          <div v-else>
                            <v-checkbox
                              v-model="absnetItem"
                              :label="subject.subjectName"
                              :value="subject.slId"
                              style="margin-bottom: -20px"
                              @click="setSomeAbsent(subject.slId)"
                            ></v-checkbox>
                          </div>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>
            <v-radio
              label="無缺考"
              value="0"
              @click="changeAbsentScore(editedItem, '0')"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions style="margin-top: 3px">
          <v-spacer></v-spacer>
          <v-btn
            text
            color="black darken-1"
            style="font-weight: bold; font-size: 17px"
            @click="absentCancel(editedItem)"
          >
            取消
          </v-btn>
          <v-btn
            v-if="absentTypeTemp !== '10'"
            text
            color="darken-1"
            :disabled="
              absentType === absentTypeTemp ||
              (absentType !== absentTypeTemp &&
                absentType === '10' &&
                Object.keys(someAbsent).length === 0)
            "
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="
              saveExamScore('editorAbsent');
              absentPup = false;
            "
          >
            確定
          </v-btn>
          <v-btn
            v-if="absentTypeTemp === '10'"
            text
            color="darken-1"
            :disabled="Object.keys(someAbsent).length === 0"
            style="color: #2d5bff; font-weight: bold; font-size: 17px"
            @click="
              saveExamScore('editorAbsent');
              absentPup = false;
            "
          >
            確定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="downloadPup" width="24%">
      <downloadfile-Dialog
        :id="id"
        :scheduleType="scheduleType"
        @closeDownlodpup="closeDownlodpup"
      >
      </downloadfile-Dialog>
    </v-dialog>
    <v-dialog v-model="importPup" width="35%">
      <importfile-dialog
        @uploadFile="uploadFile"
        @closeImportpup="closeImportpup"
      >
      </importfile-dialog>
    </v-dialog>
    <v-overlay v-model="loadShow" class="align-center justify-center">
      <v-progress-circular indeterminate color="primary" :size="60">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>
<style scoped>
.centered-input >>> input {
  text-align: center;
}
</style>
<script>
import TableFilter from "./utilsComponets/tableFilter.vue";
import DeleteDialog from "./contestantsComponts/deleteDialog.vue";
import UpgradeDialog from "./contestantsComponts/upgradeDialog.vue";
import SendmailDialog from "./contestantsComponts/sendmailDialog.vue";
import SnedtypeDialog from "./contestantsComponts/snedtypeDialog.vue";
import SetemailDialog from "./contestantsComponts/setemailDialog.vue";
import DownloadfileDialog from "./contestantsComponts/downloadfileDialog.vue";
import ImportfileDialog from "./contestantsComponts/importfileDialog.vue";
import ImportcontestantsDialog from "./contestantsComponts/importcontestantsDialog.vue";
import ImportexamtranscripDialog from "./contestantsComponts/importexamtranscripDialog.vue";

export default {
  data: () => ({
    itemKey: "",
    loadShow: false,
    alertPup: false,
    absentPup: false,
    deletepup: false,
    editorScorePup: false,
    downloadPup: false,
    snedTypePup: false,
    importDataErrorPup: false,
    scoreStatus: true,
    importPup: false,
    confirmTestmailStatus: false,
    selectImportTyep: "",
    absentType: "0",
    absentTypeTemp: "0",
    passTemp: "",
    someAbsent: {},
    pupTitle: "",
    pupTitleShow: "",
    pupTitleIcon: "",
    pupText: "",
    target: "",
    sendType: "",
    titleExam: "",
    titleScore: "",
    role: "",
    contestntsName: "",
    scoreSubject: "",
    selected: [],
    sendMailSelected: "student",
    reviewMod: false,
    tempItem: {},
    tempReviewItem: {},
    levelStatus: true,
    dialog: false,
    selectedFile: null,
    upgradePup: false,
    upgradeRaceList: [],
    sendMailpup: false,
    setEmailpup: false,
    sendMailtype: "",
    scheduleType: "",
    randomScoreTest: 0,
    confirmScoreTest: "",
    testMail: "",
    absnetItem: [],
    campData: false,
    importCheck: false,
    headers: [],
    editedIndex: -1,
    multiSelect: [],
    userScore: {},
    scoreRule: {},
    errorData: [],
    scoreRemark: "",
    subjectConfig: [],
    mailTypeHeader: [],
    textRules: [(v) => !!v || "不能為空"],
    editedItem: {
      contestantsId: "",
      stId: "",
      olyId: "",
      olympic: "",
      schoolName: "",
      olympicSelect: "",
      name: "",
      email: "",
      tel: "",
    },
    defaultItem: {
      contestantsId: "",
      stId: "",
      olyId: "",
      olympic: "",
      schoolName: "",
      olympicSelect: "",
      name: "",
      email: "",
      tel: "",
    },
  }),

  props: {
    desserts: {
      type: Array,
      default: () => [],
    },
    dessertsTemp: {
      type: Array,
      default: () => [],
    },
    loadList: true,
    examSend: 0,
    scoreSend: 0,
    admissionCount: 0,
    handicappedCount: 0,
    sendExamNotice: false,
    sendExamScoreNoice: false,
  },

  components: {
    TableFilter,
    DeleteDialog,
    UpgradeDialog,
    SendmailDialog,
    SnedtypeDialog,
    SetemailDialog,
    DownloadfileDialog,
    ImportfileDialog,
    ImportcontestantsDialog,
    ImportexamtranscripDialog,
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "新增承辦人" : "更改承辦人資訊";
    },
    id() {
      return this.$route.params.id;
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    snedTypePup(val) {
      val || this.close();
    },
    selected(data) {
      this.multiSelect = data;
    },
  },

  methods: {
    close() {
      this.target = "";
      this.sendType = "";
      this.downloadPup = false;
      this.selectImportTyep = "";
      this.importPup = false;
      this.reviewMod = false;
      this.setEmailpup = false;
      this.reviewMod = false;
      this.sendMailtype = "";
      this.sendMailSelected = "";
      this.userScore = {};
      this.scoreRule = {};
      this.snedTypePup = false;
      this.tempReviewItem = {};
      this.reviewMod = false;
      this.errorData = [];
      this.scoreSubject = "";
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    checkScoreValue(value) {
      if (
        value !== undefined &&
        value.length === 0 &&
        this.scoreRule.dataType !== "string"
      ) {
        return "不能為空值";
      }

      if (this.scoreRule.dataType === "num") {
        if (
          !/^[0-9/d]*$/.test(value) &&
          !/^[0-9/d]{1,4}\.[0-9]{1,4}$/.test(value)
        ) {
          return "只能為數字";
        }
      }

      return true;
    },

    async upgradeShow() {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.systemName = this.globalSystemValue.system;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getScheduleByUpgrade", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.upgradeRaceList = response.data.resultData;
            if (this.upgradeRaceList.length === 0) {
              this.campData = true;
            }
            this.upgradePup = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async onFileChanged(e) {
      this.importPup = false;
      this.loadShow = true;
      this.selectedFile = e.target.files[0];

      const formData = new FormData();

      const header = { "Content-type": "multipart/form-data" };

      formData.append("file", this.selectedFile);
      formData.append("AT", await this.tokenService.getFastAT());
      formData.append("id", this.id);
      formData.append("olympic", this.globalSystemValue.olympic);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkDataTotle", formData, {
          headers: header,
        })
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;
          e.target.value = "";
          if (response.data.code === 200) {
            if (this.selectImportTyep === "scoreList") {
              this.importExamTranscrip();
            } else {
              this.importContestantsFile();
            }
          } else {
            this.importErrorShow("fileChanged", response);
          }
          this.selectedFile = null;
        })
        .catch(function (error) {
          this.selectedFile = null;
          // console.log(error);
        });
    },

    async importContestantsFile() {
      this.alertPup = false;
      this.loadShow = true;
      this.importCheck = false;
      const formData = new FormData();

      const header = { "Content-type": "multipart/form-data" };

      formData.append("file", this.selectedFile);
      formData.append("AT", await this.tokenService.getFastAT());
      formData.append("id", this.id);
      formData.append("olympic", this.globalSystemValue.olympic);

      await this.axios
        .post(
          this.systemENV.APISERVERURL + "/importContestantsFile",
          formData,
          {
            headers: header,
          },
        )
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "上傳成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您匯入的檔案已完成";
            this.getContestantsInfo();
          } else if (response.data.code !== "") {
            this.importErrorShow("ContestantsFile", response);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
          this.selectedFile = null;
        })
        .catch(function (error) {
          this.selectedFile = null;
          // console.log(error);
        });
    },

    async importExamTranscrip() {
      this.alertPup = false;
      this.loadShow = true;
      this.importCheck = false;

      let level = this.scheduleType === 5 ? 1 : 2;
      const formData = new FormData();

      const header = { "Content-type": "multipart/form-data" };

      formData.append("file", this.selectedFile);
      formData.append("AT", await this.tokenService.getFastAT());
      formData.append("id", this.id);
      formData.append("olympic", this.globalSystemValue.olympic);
      formData.append("level", level);

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;
      data.stId = 0;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getExamScore", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.subjectConfig = response.data.subjectConfig;
          }
        })
        .catch(function (error) {
          // console.log(error);
        });

      await this.axios
        .post(this.systemENV.APISERVERURL + "/importExamTranscrip", formData, {
          headers: header,
        })
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;
          if (response.data.code === 200) {
            this.cleanPupData();
            this.alertPup = true;
            this.pupTitle = "上傳成功";
            this.pupTitleShow = "1";
            this.pupTitleIcon = "mdi-check";
            this.pupText = "您匯入的檔案已完成";
            this.errorData = response.data.resultData;
            this.getContestantsInfo();
          } else if (response.data.code !== "") {
            this.importErrorShow("examTranscrip", response);
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
          this.selectedFile = null;
        })
        .catch(function (error) {
          this.selectedFile = null;
          // console.log(error);
        });
    },

    importErrorShow(type, response) {
      if (response.data.code === 214) {
        this.cleanPupData();
        this.importCheck = true;
        this.alertPup = true;
        this.pupTitle = "匯入資料總數與實際不符合";
        this.pupTitleShow = "1";
        this.pupTitleIcon = "mdi-check";
        this.pupText = "請確認是否繼續匯入資料？";
      } else if (response.data.code === 204) {
        this.cleanPupData();
        if (type === "examTranscrip") {
          this.importDataErrorPup = true;
        } else {
          this.alertPup = true;
        }
        this.pupTitle = "匯入失敗，請確認資料格式";
        this.pupTitleShow = "2";
        this.pupTitleIcon = "mdi-alert-outline";
        this.pupText = response.data.resultData;
        this.errorData = response.data.resultData;
        this.getContestantsInfo();
      } else if (response.data.code === 205) {
        this.cleanPupData();
        if (type === "examTranscrip") {
          this.importDataErrorPup = true;
        } else {
          this.alertPup = true;
        }
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
      }
    },

    async scoreInput(item) {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = item.olyId;
      data.contestantsId = item.contestantsId;
      data.score = item.score;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios.post(this.systemENV.APISERVERURL + "/updateScore", data);
    },

    async PRInput(item) {
      await this.tokenService.renewLT();
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = item.olyId;
      data.contestantsId = item.contestantsId;
      data.pr = item.pr;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios.post(this.systemENV.APISERVERURL + "/updatePR", data);
    },

    async editorScore(item) {
      this.absentType = "0";

      this.scoreEditedItem(item);

      if (this.editedItem.pass === "缺考") {
        this.absentType = "20";
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = item.olyId;
      data.stId = item.stId;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getExamScore", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.subjectConfig = response.data.subjectConfig;

            const that = this;

            this.subjectConfig.forEach(function (data) {
              if (that.globalSystemValue.olympic === "TCFSH") {
                data.subjectName = data.subjectName.replace("T(S)", "S");
              } else {
                data.subjectName = data.subjectName.replace("T(S)", "T");
              }
            });

            if (Object.keys(response.data.resultData).length === 0) {
              for (let i = 0; i < this.subjectConfig.length; i++) {
                this.subjectConfig[i].scoreValue = "";
                if (this.subjectConfig[i].dataType === "num") {
                  this.subjectConfig[i].scoreValue == 0;
                  this.userScore[this.subjectConfig[i].slId] = 0;
                } else if (this.subjectConfig[i].dataType === "string") {
                  this.subjectConfig[i].scoreValue = "無";
                  this.userScore[this.subjectConfig[i].slId] = "無";
                } else if (this.subjectConfig[i].dataType === "boolean") {
                  this.subjectConfig[i].scoreValue =
                    this.subjectConfig[i].defaultValue.f;
                  this.userScore[this.subjectConfig[i].slId] =
                    this.subjectConfig[i].defaultValue.f;
                }
              }
            } else {
              let info = JSON.parse(response.data.resultData.scoreInfo);

              for (let i = 0; i < this.subjectConfig.length; i++) {
                this.subjectConfig[i].scoreValue = "";
                if (this.subjectConfig[i].dataType === "boolean") {
                  if (this.subjectConfig[i].defaultValue !== "") {
                    if (info[this.subjectConfig[i].slId] === "是") {
                      this.subjectConfig[i].scoreValue =
                        this.subjectConfig[i].defaultValue.t;
                    } else if (info[this.subjectConfig[i].slId] === "否") {
                      this.subjectConfig[i].scoreValue =
                        this.subjectConfig[i].defaultValue.f;
                    }
                  } else {
                    this.subjectConfig[i].scoreValue =
                      info[this.subjectConfig[i].slId];
                  }
                } else {
                  this.subjectConfig[i].scoreValue =
                    info[this.subjectConfig[i].slId];
                }

                if (
                  (this.absentType === "0" || this.absentType === "10") &&
                  this.subjectConfig[i].scoreValue === "9999"
                ) {
                  this.absentType = "10";

                  this.absnetItem.push(this.subjectConfig[i].slId);
                }
              }
              this.scoreRemark = response.data.resultData.remark;
              Object.assign(this.userScore, info);
            }

            this.editorScorePup = true;
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async absentCancel(item) {
      this.absentPup = false;
      item.pass = this.passTemp;
    },

    async setSomeAbsent(slId) {
      this.userScore[slId] = this.userScore[slId] === "9999" ? "0" : "9999";

      if (this.userScore[slId] === "9999") {
        this.someAbsent[slId] = "9999";
      } else {
        delete this.someAbsent[slId];
      }
    },

    async changeAbsentScore(item, value) {
      if (this.absentType === this.absentTypeTemp) {
        return false;
      }

      this.labsentTypeTemp = value;

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = item.olyId;
      data.stId = item.stId;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getExamScore", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            let info = JSON.parse(response.data.resultData.scoreInfo);
            for (let i = 0; i < this.subjectConfig.length; i++) {
              this.subjectConfig[i].scoreValue = "";
              if (this.subjectConfig[i].dataType === "boolean") {
                this.subjectConfig[i].scoreValue = "否";
                info[this.subjectConfig[i].slId] = "否";
              } else if (this.subjectConfig[i].dataType === "string") {
                if (value === "9999") {
                  this.subjectConfig[i].scoreValue = "缺考";
                  info[this.subjectConfig[i].slId] = "缺考";
                } else {
                  this.subjectConfig[i].scoreValue = "無";
                  info[this.subjectConfig[i].slId] = "無";
                }
              } else {
                if (this.scheduleType === 5) {
                  this.subjectConfig[i].scoreValue = value;
                  info[this.subjectConfig[i].slId] = value;
                } else if (this.scheduleType === 6) {
                  if (!this.subjectConfig[i].upgrade) {
                    this.subjectConfig[i].scoreValue = value;
                    info[this.subjectConfig[i].slId] = value;
                  }
                }
              }
            }
            Object.assign(this.userScore, {});
            Object.assign(this.userScore, info);

            if (value === "9999") {
              this.absentType = "20";
              this.editedItem.pass = "缺考";
            } else if (value === "10") {
              this.absentType = "10";
            } else {
              this.absentType = "0";
              this.editedItem.pass = "未晉級";
            }
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async saveExamScore(type) {
      this.loadShow = true;
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olympic = this.globalSystemValue.olympic;
      data.olyId = this.editedItem.olyId;
      data.stId = this.editedItem.stId;
      data.scheduleType = this.scheduleType;
      data.remark = this.scoreRemark;
      data.absentType = this.absentType;
      data.userScore = JSON.stringify(this.userScore);

      await this.axios
        .post(this.systemENV.APISERVERURL + "/saveExamScore", data)
        .then((response) => {
          // console.log(response.data);
          this.loadShow = false;

          if (response.data.code === 200) {
            if (type === "editorSave" || type === "editorAbsent") {
              if (type !== "editorAbsent") {
                this.editorScorePup = false;
              }

              this.editedItem.scoreStatus = 1;

              if (response.data.pass === 10) {
                this.editedItem.pass =
                  this.scheduleType === 5 ? "晉級" : "錄取";
              } else if (response.data.pass === 30) {
                this.editedItem.pass =
                  this.scheduleType === 5 ? "未晉級" : "未錄取";
              } else if (response.data.pass === 20) {
                this.editedItem.pass = "缺考";
              } else {
                this.editedItem.pass = "";
              }
            }
          } else {
            this.globalSystemTool.removeLocalStorage();
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
      this.absentTypeTemp = "0";
    },

    async controllerSnedTypePup(type, item) {
      this.sendMailtype = "";
      this.setWording();

      if (type === "review") {
        this.snedTypePup = true;
        this.reviewMod = true;
        this.tempReviewItem = item;
        this.mailTypeHeader = [
          {
            key: 1,
            value: "reviewExam",
            level: "考試通知",
            show: true,
            disabled: false,
            targetGroup: false,
            testMail: false,
            testMailConfirm: false,
            subTitle: false,
          },
          {
            key: 2,
            value: "reviewScore",
            level: "成績證明",
            show: true,
            disabled: false,
            targetGroup: false,
            testMail: false,
            testMailConfirm: false,
            subTitle: false,
          },
        ];
      } else {
        this.snedTypePup = true;
        this.mailTypeHeader = [
          {
            key: 3,
            value: "exam",
            level: "考試通知",
            show: true,
            disabled: false,
            targetGroup: true,
            testMail: false,
            testMailConfirm: false,
            subTitle: false,
          },
          {
            key: 4,
            value: "score",
            level: "成績證明",
            show: true,
            disabled: false,
            targetGroup: false,
            testMail: false,
            testMailConfirm: false,
            subTitle: false,
          },
          {
            key: 5,
            value: "testScore",
            level: "成績證明寄送前抽測",
            show: false,
            disabled: false,
            targetGroup: false,
            testMail: false,
            testMailConfirm: false,
            subTitle: false,
          },
        ];

        if (this.globalSystemValue.system === "olympic") {
          if (this.randomScoreTest === 0) {
            this.mailTypeHeader[1].show = false;
            this.mailTypeHeader[2].testMail = true;
          } else {
            if (this.confirmScoreTest === "") {
              this.confirmTestmailStatus = false;
            } else {
              this.confirmTestmailStatus = true;
            }

            if (this.confirmTestmailStatus) {
              this.mailTypeHeader[2].testMailConfirm = true;
            } else {
              this.mailTypeHeader[1].show = false;
              this.mailTypeHeader[2].testMail = true;
            }
          }
        } else {
          this.mailTypeHeader[1].subTitle = true;
          this.mailTypeHeader[2].show = false;
        }
      }
    },

    checkAlert(mode, type, item) {
      this.cleanPupData();
      this.setWording();
      this.sendMailpup = true;

      if (mode === "multi") {
        item.sendExamNotice = false;
        item.sendExamScoreNoice = false;
        item.stopSend = false;

        if (type === "exam") {
          this.sendMailtype = "multiExam";
        } else {
          this.sendMailtype = "multiScore";
        }

        this.selected.forEach((exam) => {
          if (type === "exam" && exam.sendExamNotice) {
            item.sendExamNotice = true;
          }

          if (type === "score" && exam.sendExamScoreNoice) {
            item.sendExamScoreNoice = true;
          }

          if (
            exam.scoreStatus === 0 &&
            exam.admission === "1" &&
            type === "score"
          ) {
            item.stopSend = true;
          }

          if (item.sendExamScoreNoice || item.sendExamNotice || item.stopSend) {
            return false;
          }
        });
      } else {
        if (type === "exam") {
          this.sendMailtype = "exam";
        } else {
          this.sendMailtype = "score";
        }

        this.tempItem = item;
      }

      if (item.stopSend) {
        alert("有甄選生尚未輸入成績！");
        this.sendMailpup = false;

        return false;
      }

      if (type === "exam" && item.sendExamNotice) {
        this.pupText =
          this.target + "已發送過" + this.sendType + "，確定要再次寄送？";
      } else if (type === "score" && item.sendExamScoreNoice) {
        this.pupText =
          this.target + "已發送過" + this.sendType + "，確定要再次寄送？";
      } else {
        this.pupText = "確認要發送信件";
      }

      this.pupTitleShow = "1";
      this.pupTitleIcon = "mdi-check";
      this.pupTitle = "您確定要發送信件？";
    },

    async sendTestMail(testmail) {
      await this.tokenService.renewLT();

      if (testmail === "") {
        alert("請輸入測試信箱");
        return false;
      }

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;
      data.olympic = this.globalSystemValue.olympic;
      data.email = testmail;

      this.sendMailtype = "";

      this.axios.post(this.systemENV.APISERVERURL + "/randomTest", data);

      return testmail;
    },

    async confirmTestMail(value) {
      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.olyId = this.id;

      this.axios.post(this.systemENV.APISERVERURL + "/confirmScoreTest", data);

      const todayUTC = new Date().toISOString().split("T")[0];
      this.confirmScoreTest = todayUTC;

      this.randomScoreTest = 1;

      if (value === "setmail") {
        return (this.confirmTestmailStatus = true);
      } else {
        this.confirmTestmailStatus = true;
        this.controllerSnedTypePup("sendall", null);
      }
    },

    setWording() {
      if (this.globalSystemValue.system === "olympic") {
        this.target = "參賽者";
        if (this.sendMailtype.indexOf("exam") === 0) {
          this.sendType = "【考試通知】";
        } else {
          this.sendType = "【成績證明】";
        }
      } else {
        this.target = "甄選生";
        if (this.sendMailtype.indexOf("exam") === 0) {
          this.sendType = "【甄選證及甄選須知】";
        } else {
          this.sendType = "【成績單】";
        }
      }
    },

    updateTable(filterData) {
      // this.desserts = filterData;
      this.$emit("updateFilter", filterData);
    },

    updateDesserts(value) {
      this.$emit("updateDesserts", value);
    },

    updateSelectd(value) {
      this.selected = value;
    },

    closeDeletepup(value) {
      this.deletepup = value;
    },

    closeUpgradepup(value) {
      this.upgradePup = value;
    },

    closeSendMailpup(value) {
      this.sendMailpup = value;
      this.close;
      this.cleanPupData();
    },

    setDesserts(value) {
      Object.assign(this.desserts[this.desserts.indexOf(value)], value);

      // this.sendExamNotice = value.sendExamNotice;
      // this.sendExamScoreNoice = value.sendExamScoreNoice;

      this.sendMailSelected = "";
      this.tempItem = {};
    },

    chagneSendMailContent(value) {
      this.puptitle = value.title;
      this.pupText = value.text;
      this.sendMailtype = value.type;
    },

    closeSendMultiMail(value) {
      this.selected = [];
      this.multiSelect = [];
      this.sendMailSelected = "";

      // if (value === "exam") {
      //   this.sendExamNotice = true;
      // } else if (value === "score") {
      //   this.sendExamScoreNoice = true;
      // }
    },

    closeSendTypepup(value) {
      this.snedTypePup = value;
      this.close;
    },

    updateReview() {
      this.snedTypePup = false;
      this.reviewMod = false;
      this.sendMailtype = "";
      this.tempReviewItem = {};
    },

    chagneSendTypeContent(value) {
      this.snedTypePup = false;
      this.sendMailpup = true;

      this.pupTitleShow = value.show;
      this.pupTitleIcon = value.icon;
      this.pupTitle = value.title;
      this.pupText = value.text;
      this.sendMailtype = value.type;
    },

    updateSendAllMail(value) {
      this.selected = [];
      this.multiSelect = [];
      this.sendMailSelected = "";
      this.sendMailtype = "";
      this.tempReviewItem = {};
      this.tempItem = {};

      // if (value === "exam") {
      //   this.sendExamNotice = true;
      // } else if (value === "score") {
      //   this.sendExamScoreNoice = true;
      // }
    },

    closeSetMailpup(value) {
      this.setEmailpup = value;
    },

    closeDownlodpup(value) {
      this.downloadPup = value;
    },

    uploadFile(value) {
      this.cleanPupData;
      this.$refs.uploader.click();
      this.selectImportTyep = value;
    },

    closeImportpup(value) {
      this.importPup = value;
    },

    closeImportContestants(value) {
      this.cleanPupData;
      this.alertPup = value;

      this.importCheck = false;
      this.selectImportTyep = "";
      this.selectedFile = null;
    },

    closeImporEexamTranscrip(value) {
      this.cleanPupData;
      this.importDataErrorPup = value;
      this.selectImportTyep = "";
      selectedFile = null;
      errorData = [];
    },

    cleanPupData() {
      this.alertPup = false;
      this.pupTitleShow = "";
      this.pupTitle = "";
      this.pupTitleIcon = "";
      this.pupText = "";
      this.target = "";
      this.sendType = "";
    },

    reloadTitle() {
      this.titleName = this.$store.dispatch("title", "選拔管理");
      return this.$store.state.title;
    },

    scoreEditedItem(item) {
      this.editedItem = item;
    },

    getsubjetData(subject) {
      Object.assign(this.scoreRule, subject);
    },

    getsubjetBooleanData(subject, type) {
      if (type === "pass") {
        if (
          subject.scoreValue === "晉級" ||
          subject.scoreValue === "錄取" ||
          subject.scoreValue === "是"
        ) {
          this.userScore[subject.slId] = "是";
        } else {
          this.userScore[subject.slId] = "否";
        }
      } else {
        this.userScore[subject.slId] = subject.scoreValue;
      }
    },

    goToLink(url) {
      location.href = url;
    },

    async getContestantsInfo() {
      await this.tokenService.renewLT();

      const data = {};
      data.AT = await this.tokenService.getFastAT();
      data.id = this.id;
      data.olympic = this.globalSystemValue.olympic;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getContestants", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.desserts = response.data.resultData;

            const that = this;
            this.desserts.forEach(function (data) {
              if (data.pass === 30) {
                data.pass = that.scheduleType === 5 ? "未晉級" : "未錄取";
              } else if (data.pass === 10) {
                data.pass = that.scheduleType === 5 ? "晉級" : "錄取";
              } else if (data.pass === 20) {
                data.pass = "缺考";
              } else {
                data.pass = "";
              }
            });
            this.dessertsTemp = response.data.resultData;
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

    const data = {};
    data.AT = await this.tokenService.getFastAT();
    data.id = this.id;
    data.olympic = this.globalSystemValue.olympic;

    await this.axios
      .post(this.systemENV.APISERVERURL + "/getSchedule", data)
      .then((response) => {
        // console.log(response.data);
        this.scheduleType = response.data.resultData.type;
        this.randomScoreTest = response.data.resultData.randomScoreTest;
        this.confirmScoreTest = response.data.resultData.confirmScoreTest;
      })
      .catch(function (error) {
        // console.log(error);
      });

    if (this.globalSystemValue.system === "olympic") {
      this.titleExam = "考試通知";
      this.titleScore = "成績證明";
      this.role = "參賽者";
      this.contestntsName = "應試資料";
    } else {
      this.titleExam = "甄選證及甄選須知";
      this.titleScore = "成績單";
      this.role = "甄選生";
      this.contestntsName = "甄選資料";
    }

    if (this.scheduleType === 2) {
      this.itemKey = "stId";
      this.headers = [
        {
          title: "選訓編號",
          value: "stId",
          filterName: "stId",
          type: "text",
          stId_M: "",
          stId_C: "",
        },
        {
          title: "中文姓名",
          value: "chineseName",
          filterName: "chineseName",
          type: "text",
          chineseName_M: "",
          chineseName_C: "",
        },
        {
          title: "成績",
          value: "score",
          filterName: "score",
          type: "text",
          score_M: "",
          score_C: "",
        },
        {
          title: "PR值",
          value: "pr",
          filterName: "pr",
          type: "text",
          pr_M: "",
          pr_C: "",
        },
        { title: "功能", value: "actions", width: "15%" },
      ];
    } else if (this.scheduleType === 5 || this.scheduleType === 6) {
      this.itemKey = "stId";
      this.headers = [
        {
          title: "學生代碼",
          value: "examOnly",
          filterName: "examOnly",
          type: "text",
          examOnly_M: "",
          examOnly_C: "",
          width: "7%",
        },
        {
          title: "甄選號碼",
          value: "examCode",
          filterName: "examCode",
          type: "text",
          examCode_M: "",
          examCode_C: "",
          width: "8%",
        },
        {
          title: "姓名",
          value: "chineseName",
          filterName: "chineseName",
          type: "text",
          chineseName_M: "",
          chineseName_C: "",
          width: "8%",
        },
        {
          title: "畢業學校",
          value: "schoolNameAll",
          filterName: "schoolNameAll",
          type: "text",
          chineseName_M: "",
          chineseName_C: "",
          width: "14%",
        },
        {
          title: "考區名稱",
          value: "areaName",
          filterName: "areaName",
          type: "text",
          areaName_M: "",
          areaName_C: "",
        },
        {
          title: "考場",
          value: "roomName",
          filterName: "roomName",
          type: "text",
          roomName_M: "",
          roomName_C: "",
        },
        {
          title: "座號",
          value: "seatNumber",
          filterName: "seatNumber",
          type: "text",
          seatNumber_M: "",
          seatNumber_C: "",
          width: "7%",
        },
      ];
      if (this.scheduleType === 5) {
        let temp = {
          title: "晉級結果",
          value: "pass",
          filterName: "pass",
          type: "text",
          pass_M: "",
          pass_C: "",
          width: "8%",
        };
        this.headers.push(temp);
        this.headers.push({ title: "功能", value: "actions", width: "17%" });
      } else {
        let temp = {
          title: "甄選結果",
          value: "pass",
          filterName: "pass",
          type: "text",
          pass_M: "",
          pass_C: "",
          width: "8%",
        };
        this.headers.push(temp);
        this.headers.push({ title: "功能", value: "actions", width: "17%" });
      }
    } else {
      this.itemKey = "examCode";
      this.headers = [
        {
          title: "應試號碼",
          value: "examCode",
          filterName: "examCode",
          type: "text",
          examCode_M: "",
          examCode_C: "",
        },
        {
          title: "中文姓名",
          value: "chineseName",
          filterName: "chineseName",
          type: "text",
          chineseName_M: "",
          chineseName_C: "",
          width: "10%",
        },
        {
          title: "學校",
          value: "schoolNameAll",
          filterName: "schoolNameAll",
          type: "text",
          schoolNameAll_M: "",
          schoolNameAll_C: "",
          width: "15%",
        },
        {
          title: "考區名稱",
          value: "areaName",
          filterName: "areaName",
          type: "text",
          areaName_M: "",
          areaName_C: "",
        },
        {
          title: "考場",
          value: "roomName",
          filterName: "roomName",
          type: "text",
          roomName_M: "",
          roomName_C: "",
        },
        {
          title: "座號",
          value: "seatNumber",
          filterName: "seatNumber",
          type: "text",
          seatNumber_M: "",
          seatNumber_C: "",
          width: "7%",
        },
        {
          title: "成績",
          value: "score",
          filterName: "score",
          type: "text",
          score_M: "",
          score_C: "",
        },
        {
          title: "PR值",
          value: "pr",
          filterName: "pr",
          type: "text",
          pr_M: "",
          pr_C: "",
        },
        { title: "功能", value: "actions", width: "15%" },
      ];
    }

    await this.tokenService.renewLT();
  },
};
</script>
