<template>
  <div></div>
</template>

<script>
export default {
  data: () => ({}),

  watch: {},

  computed: {
    num() {
      return this.$route.params.num;
    },
  },

  methods: {
    async checkBackByEcpay() {
      const data = {};
      data.num = this.num;

      await this.axios
        .post(this.systemENV.APISERVERURL + "/checkBackByEcpay", data)
        .then((response) => {
          // console.log(response.data);
          if (response.data.code === 200) {
            location.href =
              "/science/editor/" +
              response.data.resultData.code1 +
              "/" +
              response.data.resultData.code2;
          } else {
            location.href = "/science/signup/";
          }
        })
        .catch(function (error) {
          location.href = "/science/signup/";
        });
    },
  },

  async mounted() {
    if (
      this.systemENV.MOD === "dev" &&
      window.location.host !== "localhost:8080"
    ) {
      location.href = "http://localhost:8080" + window.location.pathname;
    }
    this.tokenService.renewET();

    await this.checkBackByEcpay();
  },
};
</script>
