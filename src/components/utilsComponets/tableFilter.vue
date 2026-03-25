<template>
  <div style="background-color: white; width: 280px">
    <v-select
      v-if="header.type === 'select'"
      v-model="header[header.filterName + '_M']"
      :items="header.selectItem"
      label="請選擇"
      style="margin-left: 13px; width: 249px"
      @change="filteredDesserts('', header)"
    ></v-select>
    <v-text-field
      v-if="header.type === 'text'"
      v-model="header[header.filterName + '_M']"
      @compositionstart="isTyping = true"
      @compositionend="
        (event) => {
          isTyping = false;
          filteredDesserts(event, header);
        }
      "
      @input="
        (event) => {
          if (!isTyping) filteredDesserts(event, header);
        }
      "
      clearable
      class="pa-4"
      type="text"
      label="輸入搜尋"
      :autofocus="true"
      @click:clear="cleanDesserts(header)"
    ></v-text-field>
    <v-btn
      v-if="header.type === 'select'"
      color="blue darken-1"
      text
      style="font-size: 15px; margin-left: 74%"
      @click="cleanDesserts(header)"
      >清除</v-btn
    >
  </div>
</template>

<script>
export default {
  data: () => ({
    filterList: [],
  }),

  props: {
    desserts: [],
    dessertsTemp: [],
    header: [],
  },

  methods: {
    filteredDesserts(event, headerData) {
      if (headerData.type === "text") {
        this.cleanDesserts(headerData);
      }
      let modelName = headerData.filterName + "_M";
      let colorName = headerData.filterName + "_C";

      const value = headerData[modelName];
      if (value === null || value === "") {
        headerData[colorName] = "";
      } else {
        headerData[colorName] = "rgb(25 118 210)";
      }

      if (value.length !== 0) {
        const that = this;
        this.filterList.forEach(function (data, index, object) {
          let search = data.split("_");
          if (search[1] === headerData.filterName) {
            object.splice(index, 1);
          }
        });

        this.filterList.push(value + "_" + headerData.filterName);

        if (headerData.type === "select") {
          this.desserts = this.dessertsTemp.filter((dessert) => {
            return dessert[headerData.filterName];
          });
        }

        this.desserts = this.desserts.filter((dessert) => {
          if (dessert[headerData.filterName] !== undefined) {
            if (value === "未繳費") {
              if (
                !dessert[headerData.filterName]
                  .toString()
                  .toLowerCase()
                  .includes("免繳費") &&
                !dessert[headerData.filterName]
                  .toString()
                  .toLowerCase()
                  .includes("已繳費")
              ) {
                return dessert[headerData.filterName];
              }
            } else {
              return dessert[headerData.filterName]
                .toString()
                .toLowerCase()
                .includes(value.toString().toLowerCase());
            }
          } else {
            return dessert[headerData.filterName];
          }
        });
      } else {
        this.cleanDesserts(headerData);
      }

      this.$emit("updateTable", this.desserts);
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

      this.$emit("updateTable", this.desserts);
    },
  },
  async mounted() {},
};
</script>
