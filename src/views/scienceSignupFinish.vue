<template>
  <v-main>
    <div>
      <v-toolbar dark class="pa-0" style="background-color: #2f365f">
        <v-toolbar-title style="margin: 10px 40%; color: white"
          >高級中等學校科學班報名網</v-toolbar-title
        >
      </v-toolbar>

      <v-card class="mx-auto" max-width="60%" style="margin: 10px">
        <v-card-text>
          <div v-if="showPay">
            <div style="color: black; font-weight: bolder">
              <span style="color: blue">{{ student.name }}</span
              >甄選生您好
            </div>
            <div style="color: black; font-weight: bolder; margin-top: 10px">
              您已完成<span style="color: blue">{{ schoolName }}</span
              >科學班報名作業，繳費序號「<span style="color: blue">{{
                paymentNumber
              }}</span
              >」，請留意以下訊息：
            </div>
            <ol style="margin-top: 10px">
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                信用卡繳費者，完成線上繳費後，您報名所填的電子信箱會收到系統通知信「報名繳費成功」。
              </li>
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                超商條碼繳費者，繳費單時限為{{
                  systemENV.BARCODEDATE
                }}天，請於{{
                  systemENV.BARCODEDATE
                }}天內至超商完成繳費，若超過{{
                  systemENV.BARCODEDATE
                }}天未繳費，繳費單失效，於報名期間內可回到系統通知信「已收到報名資料」連結該信件內所載網址，更改繳費方式(信用卡線上繳費)或再次下載超商繳費單至超商繳費，超商繳費單收據請自行保留。
              </li>
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                不論以信用卡線上或超商條碼繳費，繳費完成者，系統發送通知信「報名繳費成功」，才視為已完成報名，不得要求退費。
              </li>
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                不論以信用卡線上或超商條碼繳費，帳款無法立即得知，毋須以電話詢問繳費結果，請務必耐心等候，報名期間若繳費未成功，本校科學班計畫辧公室會以電子信件通知。
              </li>
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                若您依本校科學班甄選入學簡章所載報名資格或報名直接錄取，需郵寄證明文件紙本影印本者，請於{{
                  postYear
                }}年{{ postMonth }}月{{ postDate }}日(星期{{
                  postDay
                }})以前以限時掛號郵寄本校(請註明科學班甄選入學資料)。
              </li>
            </ol>
          </div>
          <div v-if="showNopay">
            <div style="color: black; font-weight: bolder">
              <span style="color: blue">{{ student.name }}</span
              >甄選生您好
            </div>
            <div style="color: black; font-weight: bolder; margin-top: 10px">
              您已完成<span style="color: blue">{{ schoolName }}</span
              >科學班報名作業，請留意以下訊息：
            </div>
            <ol style="margin-top: 10px">
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                您勾選免繳費，請於{{ postYear }}年{{ postMonth }}月{{
                  postDate
                }}日(星期{{
                  postDay
                }})以前將證明文件紙本影印本郵寄本校(請註明科學班甄選入學資料)。
              </li>
              <li style="color: black; font-weight: bolder; margin-top: 10px">
                若您依本校科學班甄選入學簡章所載報名資格或報名直接錄取，需郵寄證明文件紙本影印本者，請於{{
                  postYear
                }}年{{ postMonth }}月{{ postDate }}日(星期{{
                  postDay
                }})以前以限時掛號郵寄本校(請註明科學班甄選入學資料)。
              </li>
            </ol>
          </div>
          <div style="color: black; font-weight: bolder; margin-top: 10px">
            <div>各校聯絡資訊：</div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoJGHS.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                臺北市立建國高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：acad41@gl.ck.tp.edu.tw ｜ 電話：02-23034381分機209
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoTFGHS.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                臺北市立第一女子高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：science@gapps.fg.tp.edu.tw ｜
                電話：(02)23820484分機341、342
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoHSNU.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                國立臺灣師範大學附屬高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：t-science@gs.hs.ntnu.edu.tw ｜
                電話：02-2707-5215分機803
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoWLSH.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                桃園市立武陵高級中等學校
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：wlsh202@email.wlsh.tyc.edu.tw ｜
                電話：03-3698170分機202
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoNEHS.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                國立新竹科學園區實驗高級中等學校
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：nehs346@nehs.hc.edu.tw ｜ 電話：03-5777011分機2170
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoTCFSH.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                臺中市立臺中第一高級中等學校
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：t2052@tcfsh.tc.edu.tw ｜ 電話：04-22226081分機262、270
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoCHSH.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                國立彰化高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：science@chsh.chc.edu.tw ｜ 電話：04-7222121分機31602
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoCYSH.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                國立嘉義高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：sci18@cysh.cy.edu.tw ｜ 電話：05-2762804分機204、205
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoTNFSH.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                國立臺南第一高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：sec@gm.tnfsh.tn.edu.tw ｜ 電話：06-2371206分機271
              </div>
            </div>
            <div style="margin-top: 10px">
              <v-img
                max-height="15"
                max-width="15"
                src="/images/logoKSHS.png"
                style="display: inline-flex"
              ></v-img>
              <div style="display: inline; font-size: 14px; margin-left: 10px">
                高雄市立高雄高級中學
              </div>
              <div style="font-size: 14px; margin-left: 29px">
                電子信箱：jalong@mail.kshs.kh.edu.tw ｜ 電話：07-2862550分機1182
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-title
          style="background-color: white; height: 27px; line-height: 0rem"
        >
          <div style="margin: 0px 40%; font-size: 10px; color: gray">
            @ {{ new Date().getFullYear() }} ALL Rights Reserved.
          </div>
        </v-card-title>
      </v-card>
    </div>
  </v-main>
</template>
<script>
export default {
  data: () => ({
    student: {},
    schoolName: "",
    paymentNumber: "",
    showPay: false,
    showNopay: false,
    sendMailDate: "",
    daylist: ["日", "一", "二", "三", "四", "五", "六"],
    scheduleInfo: {},
    postYear: "",
    postMonth: "",
    postDate: "",
    postDay: "",
  }),

  computed: {
    id() {
      return this.$route.params.id;
    },
  },

  beforeDestroy() {},

  methods: {
    async getStudentInfo() {
      const data = {};
      data.sstId = this.id;
      data.type = "finish";

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getStudentInfo", data)
        .then((response) => {
          // console.log(response.data)
          if (response.data.code === 200) {
            if (response.data.resultData.payStatus === "2") {
              this.showNopay = true;
            } else {
              this.showPay = true;
              this.paymentNumber = response.data.resultData.paymentNumber;
            }
            this.scheduleInfo = response.data.schedule;

            let signupEnd = new Date(this.scheduleInfo.end_time);
            signupEnd.setDate(signupEnd.getDate() + 1);
            this.postYear = signupEnd.getFullYear() - 1911;
            this.postMonth = signupEnd.getMonth() + 1;
            this.postDate = signupEnd.getDate();
            this.postDay = this.daylist[signupEnd.getDay()];

            this.student = response.data.resultData;
            this.schoolName = this.globalSystemTool.getScienceAllName(
              this.student.signupSchool,
            );
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
    this.sendMailDate = localStorage.getItem("sendMailDate");
    if (
      this.systemENV.MOD === "dev" &&
      window.location.host !== "localhost:8080"
    ) {
      location.href = "http://localhost:8080" + window.location.pathname;
    }
    this.getStudentInfo();
  },
};
</script>
