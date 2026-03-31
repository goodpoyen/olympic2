<template>
  <div>
    <v-card class="mx-auto" max-width="100%">
      <div style="font-weight: bolder; font-size: 20px; text-align: center">
        便利商店繳費電子帳單
      </div>
      <div
        style="
          font-weight: bolder;
          font-size: 20px;
          text-align: center;
          color: brown;
        "
      >
        訂單日期 : {{ printData.tradeDate }}
      </div>
      <div
        style="
          font-weight: bolder;
          font-size: 20px;
          text-align: center;
          color: green;
        "
      >
        單位 Unit：新台幣 NTD
      </div>
      <v-card-text>
        <table style="width: 100%">
          <thead>
            <tr>
              <th
                colspan="3"
                style="font-size: 18px; color: black; font-weight: bold"
              >
                第一聯 客戶收執聯
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>學校名稱</th>
              <th>繳費序號</th>
              <th>代收店鋪收章</th>
            </tr>
            <tr>
              <td>{{ printData.unitNameAll }}</td>
              <td>{{ printData.paymentNumber }}</td>
            </tr>
            <tr>
              <th>繳費期限</th>
              <th>實際繳費金額</th>
            </tr>
            <tr>
              <td style="color: rgb(190, 20, 20); font-weight: bold">
                {{ printData.ExpireDate }}
              </td>
              <td>600</td>
            </tr>
          </tbody>
        </table>
        <div
          style="
            margin-top: 10px;
            width: 100%;
            text-align: center;
            font-size: 12px;
          "
        >
          此聯請客戶保存
        </div>
        <table style="width: 100%; margin-top: 30px">
          <thead>
            <tr>
              <th
                colspan="3"
                style="font-size: 18px; color: black; font-weight: bold"
              >
                第二聯 店鋪收執聯
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>學校名稱</th>
              <th>繳費序號</th>
              <th>代收店鋪收章</th>
            </tr>
            <tr>
              <td>{{ printData.unitNameAll }}</td>
              <td>{{ printData.paymentNumber }}</td>
            </tr>
            <tr>
              <th>繳費期限</th>
              <th>實際繳費金額</th>
            </tr>
            <tr>
              <td style="color: rgb(190, 20, 20); font-weight: bold">
                {{ printData.ExpireDate }}
              </td>
              <td>600</td>
            </tr>
          </tbody>
        </table>
        <div
          style="
            margin-top: 10px;
            width: 100%;
            text-align: center;
            font-size: 12px;
          "
        >
          此聯請店鋪保存
        </div>
        <table style="width: 100%; margin-top: 10px">
          <thead>
            <tr>
              <th
                colspan="3"
                style="font-size: 18px; color: black; font-weight: bold"
              >
                繳費條碼
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th colspan="3">
                <canvas id="barcode1"></canvas>
                <br />
                <canvas id="barcode2"></canvas>
                <br />
                <canvas id="barcode3"></canvas>
              </th>
            </tr>
          </tbody>
        </table>
        <div>
          <div
            style="
              color: rgb(143, 131, 131);
              font-weight: bolder;
              font-size: 15px;
              margin-top: 10px;
            "
          >
            注意事項
          </div>
          <ol style="margin-top: 10px; font-size: 15px">
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              本繳費單請以雷射印表機列印。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              條碼的入帳時間為3-5個工作日，若超過時間仍未收到通知，請與綠界客服中心聯繫。連絡電話(02)2655-1775
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              超商條碼的繳費期限為{{
                systemENV.BARCODEDATE
              }}天，請務必於期限內進行繳款。
            </li>
            <li style="color: rgb(143, 131, 131); font-weight: bolder">
              提醒您！超商店員不會在結帳時另收手續費。
            </li>
          </ol>
        </div>
      </v-card-text>
    </v-card>
    <v-overlay :value="load">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
      <div>資料載入中.....</div>
    </v-overlay>
  </div>
</template>

<script>
import Jsbarcode from "jsbarcode";

export default {
  data: () => ({
    printData: {},
    load: true,
    barcode(id, num) {
      Jsbarcode(id, num, {
        background: "white",
        displayValue: true,
        width: 1,
        height: 40,
        margin: 5,
      });
    },
  }),

  watch: {},

  computed: {
    code() {
      return this.$route.params.signupKey;
    },

    paymentNumber() {
      return this.$route.params.paymentNumber;
    },
  },

  methods: {
    async getBarcodeprint() {
      this.load = true;
      const data = {};
      data.code = this.code;
      data.paymentNumber = this.paymentNumber;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/getBarcodeprint", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            this.printData = response.data.resultData;
            this.load = false;
          } else {
            alert("尚未取得繳費條碼");
          }
        })
        .catch(function (error) {
          // console.log(error);
        });
    },

    async pdfPrint() {
      window.print();
    },
  },

  async mounted() {
    this.tokenService.renewET();
    await this.getBarcodeprint();
    this.barcode("#barcode1", this.printData.Barcode1);
    this.barcode("#barcode2", this.printData.Barcode2);
    this.barcode("#barcode3", this.printData.Barcode3);
    if (!this.load) {
      await this.pdfPrint();
    }
  },
};
</script>
<style scoped>
table {
  border-collapse: collapse;
  border-spacing: 0px;
}
table,
th {
  font-size: 18px;
  color: black;
  font-weight: bold;
  padding: 5px;
  border: 1px solid black;
}

td {
  font-size: 16px;
  color: rgb(87, 86, 86);
  font-weight: bold;
  height: 40px;
  padding: 5px;
  border: 1px solid black;
}

tr {
  text-align: center;
  height: 20px;
}
</style>
