<template>
  <div
    style="
      background-color: white;
      width: 280px;
      box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.5);
    "
  >
    <v-select
      v-if="targetHeader.type === 'select'"
      v-model="targetHeader[targetHeader.filterName + '_M']"
      :items="targetHeader.selectItem"
      label="請選擇"
      style="margin-left: 13px; width: 249px"
      variant="underlined"
      @update:model-value="filteredDesserts"
    ></v-select>

    <v-text-field
      v-if="targetHeader.type === 'text'"
      v-model="targetHeader[targetHeader.filterName + '_M']"
      @compositionstart="isTyping = true"
      @compositionend="
        isTyping = false;
        filteredDesserts();
      "
      @input="if (!isTyping) filteredDesserts();"
      clearable
      class="pa-4"
      type="text"
      label="輸入搜尋"
      :autofocus="true"
      variant="underlined"
      @click:clear="cleanDesserts"
    ></v-text-field>

    <v-btn
      v-if="targetHeader.type === 'select'"
      color="blue darken-1"
      variant="text"
      style="font-size: 15px; margin-left: 74%"
      @click="cleanDesserts"
      >清除</v-btn
    >
  </div>
</template>

<script>
export default {
  data: () => ({
    isTyping: false,
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
    header: {
      type: Object,
      default: () => ({}),
    },
    headers: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    // 確保能正確取得包含 filterName 的欄位物件
    targetHeader() {
      return this.header.filterName
        ? this.header
        : this.header.raw || this.header;
    },
  },

  methods: {
    // 取得單一欄位的真實設定物件
    getColObj(col) {
      return col.filterName ? col : col.raw || col;
    },

    // 當某欄位輸入或選擇條件時
    filteredDesserts() {
      const h = this.targetHeader;
      const field = h.filterName;
      const value = h[field + "_M"];
      const colorName = field + "_C";

      if (
        value === null ||
        value === undefined ||
        value.toString().trim() === ""
      ) {
        this.cleanDesserts();
        return;
      }

      // 讓漏斗圖示變藍色 (同時寫入 header 與 targetHeader 確保畫面響應)
      h[colorName] = "rgb(25, 118, 210)";
      this.header[colorName] = "rgb(25, 118, 210)";

      this.applyRemainingFilters();
    },

    cleanDesserts() {
      const h = this.targetHeader;
      const field = h.filterName;

      h[field + "_M"] = "";
      h[field + "_C"] = "";
      this.header[field + "_C"] = "";

      this.applyRemainingFilters();
    },

    applyRemainingFilters() {
      // 找出所有欄位中，目前還有輸入過濾條件的欄位
      const activeColumns = this.headers
        .map((col) => this.getColObj(col))
        .filter((col) => {
          if (!col || !col.filterName) return false;
          const val = col[col.filterName + "_M"];
          return (
            val !== null && val !== undefined && val.toString().trim() !== ""
          );
        });

      // 若所有條件都已清空，還原完整原始資料
      if (activeColumns.length === 0) {
        this.$emit("updateTable", [...this.dessertsTemp]);
        return;
      }

      // 否則只針對「還剩下的條件」進行 AND 交集過濾
      const result = this.dessertsTemp.filter((item) => {
        return activeColumns.every((col) => {
          const key = col.filterName;
          const filterVal = col[key + "_M"].toString().toLowerCase();
          const itemVal = item[key];

          if (itemVal === undefined || itemVal === null) return false;

          const itemStr = itemVal.toString().toLowerCase();

          // 保留「未繳費」特殊判斷邏輯
          if (filterVal === "未繳費") {
            return !itemStr.includes("免繳費") && !itemStr.includes("已繳費");
          }

          return itemStr.includes(filterVal);
        });
      });

      this.$emit("updateTable", result);
    },
  },
};
</script>
