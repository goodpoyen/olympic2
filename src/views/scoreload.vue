<template>
  <div style="width: 2000px">
    <v-card id="pdfDom" outlined v-show="loadStaus">
      <v-card-title
        dark
        class="text-h3 white--text"
        style="
          background-color: #2d5bff !important;
          width: 60%;
          margin: 20px auto;
        "
      >
        <div style="margin-bottom: 10px">
          {{ userInfo.schoolName }}
        </div>
        <div>
          <p v-if="userInfo.scheduleType === 5" class="text-h3">
            {{ userInfo.year }}學年度科學班甄選入學科學能力檢定成績通知單
          </p>
          <p v-else class="text-h3">
            {{ userInfo.year }}學年度科學班甄選入學實驗實作成績通知單
          </p>
        </div>
      </v-card-title>

      <v-card-text style="width: 60%; margin: 0px auto">
        <v-row>
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="
              margin-left: 11px;
              margin-top: 16px;
              font-size: 34px;
              font-weight: bold;
            "
            >學生代碼：
          </v-col>
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="
              margin-top: 16px;
              font-weight: bold;
              border-bottom: 1px solid;
              height: 40px;
              font-size: 34px;
            "
          >
            {{ userInfo.examOnly }}
          </v-col>
        </v-row>
        <v-row style="margin-top: 26px">
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="margin-left: 11px; font-size: 34px; font-weight: bold"
            >甄選號碼：
          </v-col>
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="
              font-weight: bold;
              border-bottom: 1px solid;
              height: 40px;
              font-size: 34px;
            "
          >
            {{ userInfo.examCode }}
          </v-col>
        </v-row>
        <v-row style="margin-top: 26px">
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="margin-left: 11px; font-size: 34px; font-weight: bold"
            >甄選生：
          </v-col>
          <v-col
            cols="3"
            sm="3"
            md="3"
            style="
              font-weight: bold;
              border-bottom: 1px solid;
              height: 40px;
              font-size: 34px;
            "
          >
            {{ userInfo.name }}
          </v-col>
        </v-row>
        <v-card
          v-if="userInfo.scheduleType === 5"
          outlined
          style="margin-top: 40px"
        >
          <v-card-title
            style="background-color: #e0eafb; height: 60px; margin-bottom: 10px"
          >
            <div style="font-size: 34px; font-weight: bold">語文能力成績</div>
          </v-card-title>

          <v-card-text>
            <div v-for="subject in subjectConfig" :key="subject.slId">
              <v-row v-if="subject.subjectGroup === 'language'">
                <v-col cols="8" sm="8" md="8">
                  <div
                    style="
                      margin-top: 10px;
                      margin-left: 10px;
                      font-size: 34px;
                      font-weight: bold;
                      line-height: 1.5;
                    "
                  >
                    <div v-if="subject.editorSubjectName !== ''">
                      {{ subject.editorSubjectName }}
                    </div>
                    <div v-else>{{ subject.subjectName }}</div>
                  </div>
                </v-col>
                <v-col cols="3" sm="3" md="3">
                  <div
                    v-if="subject.scoreValue !== '9999'"
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                    "
                  >
                    {{ subject.scoreValue }}
                  </div>
                  <div
                    v-else
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                      color: red;
                    "
                  >
                    缺考
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>

        <v-card outlined style="margin-top: 22px">
          <v-card-title
            style="background-color: #e0eafb; height: 60px; margin-bottom: 10px"
          >
            <div style="font-size: 34px; font-weight: bold">
              <div v-if="userInfo.scheduleType === 5">自然科學能力成績</div>
              <div v-else>實驗實作</div>
            </div>
          </v-card-title>

          <v-card-text>
            <div v-for="subject in subjectConfig" :key="subject.slId">
              <v-row v-if="subject.subjectGroup === 'scienceExam'">
                <v-col cols="8" sm="8" md="8">
                  <div
                    style="
                      margin-top: 10px;
                      margin-left: 10px;
                      font-size: 34px;
                      font-weight: bold;
                      line-height: 1.5;
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
                <v-col cols="3" sm="3" md="3">
                  <div
                    v-if="subject.scoreValue !== '9999'"
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                    "
                  >
                    {{ subject.scoreValue }}
                  </div>
                  <div
                    v-else
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                      color: red;
                    "
                  >
                    缺考
                  </div>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </v-card>

        <v-card outlined style="margin-top: 22px; margin-bottom: 20px">
          <v-card-title
            style="background-color: #e0eafb; height: 60px; margin-bottom: 10px"
          >
            <div style="font-size: 34px; font-weight: bold">
              <div v-if="userInfo.scheduleType === 5">科學能力檢定成績</div>
              <div v-else>總成績</div>
            </div>
          </v-card-title>

          <v-card-text>
            <div v-for="subject in subjectConfig" :key="subject.slId">
              <v-row v-if="subject.subjectGroup === 'totalScore'">
                <v-col cols="8" sm="8" md="8">
                  <div>
                    <div
                      v-if="subject.subjectName !== '【備註】'"
                      style="
                        margin-top: 10px;
                        margin-left: 10px;
                        font-size: 34px;
                        font-weight: bold;
                        line-height: 1.5;
                      "
                    >
                      <div v-if="subject.editorSubjectName !== ''">
                        {{ subject.editorSubjectName }}
                      </div>
                      <div v-else>
                        {{ subject.subjectName }}
                      </div>
                    </div>
                    <div
                      v-else
                      style="
                        margin-top: 10px;
                        margin-left: 10px;
                        font-size: 34px;
                        font-weight: bold;
                        line-height: 1.5;
                      "
                    >
                      <div v-if="subject.editorSubjectName !== ''">
                        {{ subject.editorSubjectName }}
                      </div>
                      <div v-else>
                        {{ subject.subjectName }}
                      </div>
                    </div>
                  </div>
                </v-col>
                <v-col cols="3" sm="3" md="3">
                  <div
                    v-if="
                      subject.scoreValue !== '9999' &&
                      subject.scoreValue !== '缺考'
                    "
                    style="
                      margin-top: 10px;
                      margin-left: 10px;
                      font-size: 34px;
                      font-weight: bold;
                      line-height: 1.5;
                    "
                  >
                    {{ subject.scoreValue }}
                  </div>
                  <div
                    v-else-if="subject.scoreValue === '缺考'"
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                      color: red;
                    "
                  >
                    {{ subject.scoreValue }}
                  </div>
                  <div
                    v-else
                    style="
                      margin-top: 20px;
                      margin-left: 10px;
                      font-weight: bold;
                      font-size: 34px;
                      color: red;
                    "
                  >
                    缺考
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="subject.subjectName === '【備註】'">
                <v-col cols="12" sm="12" md="12">
                  <div
                    v-html="subject.editorSubjectDescription"
                    style="
                      margin-top: 15px;
                      font-size: 26px;
                      font-weight: bold;
                      line-height: 1.5;
                    "
                  ></div>
                </v-col>
              </v-row>
            </div>
            <v-row>
              <v-col cols="8" sm="8" md="8">
                <div
                  style="
                    margin-top: 15px;
                    color: red;
                    font-size: 26px;
                    font-weight: bold;
                    line-height: 1.5;
                  "
                >
                  ＊「甄選錄取結果公告於本校官網，請至本校官網確認」
                  <br />
                  ＊ 本成績證明為網路下載，如有偽造情事將負相關法律責任
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                sm="12"
                md="12"
                style="
                  text-align: center;
                  font-size: 32px;
                  margin-top: 20px;
                  margin-bottom: 50px;
                  line-height: 1.5;
                "
              >
                <div>
                  {{ title }}
                  <br />
                  科學班入學甄選及學科資格考試委員會
                  <img
                    :src="stampURL"
                    style="
                      width: 200px;
                      height: 150px;
                      z-index: 1;
                      position: absolute;
                      bottom: 0%;
                      left: 70%;
                      width: 18%;
                      height: auto;
                    "
                    @load="imgLoad"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>
    <div v-show="!loadStaus">{{ finishWording }}....</div>
    <div v-show="!loadStaus && finishWording !== '下載連結已失效'">
      (建議您使用電腦下載成績單，避免下載失敗！)
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    subjectConfig: [],
    userScore: {},
    userInfo: {},
    stampURL: "",
    htmlTitle: "",
    loadStaus: true,
    olyId: 0,
    unitId: 0,
    sstId: 0,
    finishWording: "下載完成",
    title: "",
  }),

  watch: {},

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  methods: {
    async checkLoadURI() {
      const currentUrl = window.location.pathname;

      let code = 0;
      const data = {};
      data.stId = this.id;

      if (currentUrl.includes("/review/")) {
        try {
          data.AT = await this.tokenService.getFastAT();
        } catch (error) {}
        data.type = "R";
      } else {
        data.AT = "99";
        data.type = "L";
      }

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkLoadURI", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.olyId = response.data.resultData.olyId;
            this.unitId = response.data.resultData.unitId;
            this.sstId = response.data.resultData.sstId;
            code = response.data.code;
          } else {
            this.loadStaus = false;
            this.finishWording = "下載連結已失效";

            code = response.data.code;
          }
        })
        .catch(function (error) {
          // console.log(error);
        });

      if (code === 200) {
        return true;
      } else {
        return false;
      }
    },

    async getLoadExamScore() {
      const data = {};
      data.AT = "99";
      data.olyId = this.olyId;
      data.stId = this.sstId;
      data.unitId = this.unitId;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getLoadExamScore", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.subjectConfig = response.data.subjectConfig;
            this.userInfo = response.data.userInfo;
            let info = JSON.parse(response.data.resultData.scoreInfo);

            if (this.userInfo.scheduleType === 5) {
              this.htmlTitle =
                this.userInfo.schoolName +
                "(科學能力檢定成績單)_" +
                this.userInfo.name;
            } else {
              this.htmlTitle =
                this.userInfo.schoolName +
                "(實驗實作成績單)_" +
                this.userInfo.name;
            }

            this.stampURL = this.userInfo.stamp;

            const that = this;
            this.subjectConfig.forEach(function (data) {
              if (that.userInfo.schoolName === "臺中市立臺中第一高級中等學校") {
                data.subjectName = data.subjectName.replace("T(S)", "S");
              } else {
                data.subjectName = data.subjectName.replace("T(S)", "T");
              }
            });

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
                if (Object.hasOwn(this.subjectConfig[i], "skipType")) {
                  if (
                    this.subjectConfig[i].skipType === "identity" &&
                    this.userInfo.identity === "2"
                  ) {
                    this.subjectConfig[i].scoreValue =
                      info[this.subjectConfig[i].slId];
                  } else {
                    this.subjectConfig[i].scoreValue = "";
                  }
                } else {
                  this.subjectConfig[i].scoreValue =
                    info[this.subjectConfig[i].slId];
                }
              }
            }
          }
        })
        .catch(function (error) {
          // console.log(error);
        });

      this.getTitle(this.userInfo.unitCode);
    },

    async imgLoad() {
      setTimeout(() => {}, 1000);
      let pdf = await this.getPdf("#pdfDom");

      if (!pdf) {
        for (let i = 0; i < 2; i++) {
          this.loadStaus = false;
          this.loadStaus = true;
          pdf = await this.getPdf("#pdfDom");
          if (pdf) {
            this.loadStaus = false;
            break;
          }
        }
        if (!pdf) {
          this.finishWording = "下載成績單檔案失敗(請再重新下載)....";
        }
      }
      this.loadStaus = false;
    },

    async getTitle(unitCode) {
      if (unitCode === "JGHS") {
        this.title = "臺北市立建國高級中學/國立臺灣大學";
      }

      if (unitCode === "TFGHS") {
        this.title = "臺北市立第一女子高級中學/國立臺灣大學、國立臺灣師範大學";
      }

      if (unitCode === "HSNU") {
        this.title =
          "國立臺灣師範大學附屬高級中學/國立臺灣師範大學、國立陽明交通大學";
      }

      if (unitCode === "WLSH") {
        this.title = "桃園市立武陵高級中等學校/國立中央大學";
      }

      if (unitCode === "TCFSH") {
        this.title = "臺中市立臺中第一高級中等學校/國立陽明交通大學";
      }

      if (unitCode === "CHSH") {
        this.title = "國立彰化高級中學/國立中興大學";
      }

      if (unitCode === "TNFSH") {
        this.title = "國立臺南第一高級中學/國立成功大學";
      }

      if (unitCode === "KSHS") {
        this.title = "國立中山大學/高雄市立高雄高級中學";
      }

      if (unitCode === "CYSH") {
        this.title = "國立嘉義高級中學/國立嘉義大學、國立中正大學";
      }

      if (unitCode === "NEHS") {
        this.title = "國立新竹科學園區實驗高級中等學校/國立清華大學";
      }
    },
  },

  async mounted() {
    if (await this.checkLoadURI()) {
      await this.getLoadExamScore();
    } else {
      this.loadStaus = false;
      this.finishWording = "下載連結已失效";
    }
  },
};
</script>
