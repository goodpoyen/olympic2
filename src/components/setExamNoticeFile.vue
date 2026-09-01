<template>
  <!-- 加上 mx-auto（水平置中）與 style="width: 80%"（寬度80%） -->
  <v-card
    variant="outlined"
    class="pa-0 editor-container mx-auto"
    style="width: 90%; margin-top: 30px"
  >
    <!-- 修正點 1：將工具列直接抽出移至編輯器元件上方，改用標準外層樣式控制 -->
    <div
      class="custom-injected-toolbar d-flex align-center pa-2 border-b bg-grey-lighten-5"
    >
      <!-- 變數下拉選單 -->
      <div style="width: 130px" class="mr-2">
        <v-select
          v-model="selectedVariable"
          :items="variables"
          label="插入變數"
          density="compact"
          hide-details
          variant="solo"
          flat
          bg-color="grey-lighten-3"
          class="custom-toolbar-select"
          return-object
          @update:model-value="insertVariable"
        ></v-select>
      </div>

      <!-- 彈性空白元件 -->
      <v-spacer></v-spacer>

      <!-- 儲存按鈕 -->
      <v-btn
        color="success"
        size="small"
        variant="flat"
        prepend-icon="mdi-content-save"
        class="custom-toolbar-btn"
        @click="saveContent"
      >
        儲存
      </v-btn>
    </div>

    <!-- 編輯器主體（這裡移除了原有的 #bottom / #top 插槽標籤） -->
    <vuetify-tiptap
      ref="myEditor"
      v-model="content"
      :extensions="customExtensions"
      class="custom-tiptap-editor"
    >
    </vuetify-tiptap>
  </v-card>
</template>

<script>
import {
  VuetifyTiptap,
  BaseKit,
  Bold,
  Color,
  Highlight,
  Table,
  Heading,
  FontSize,
  TextAlign,
} from "vuetify-pro-tiptap";
import "vuetify-pro-tiptap/style.css";
import { Node } from "@tiptap/core";

// 自訂防呆 Chip 節點
const VariableChip = Node.create({
  name: "variableChip",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,

  addAttributes() {
    return {
      id: { default: null },
      label: { default: null },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="variable-chip"]',
      },
    ];
  },

  renderHTML({ node }) {
    return [
      "span",
      {
        "data-type": "variable-chip",
        "data-id": node.attrs.id,
        "data-label": node.attrs.label,
      },
      node.attrs.label,
    ];
  },
});

export default {
  name: "VuetifyProEditor",
  components: { VuetifyTiptap },
  data() {
    return {
      content: "",
      selectedVariable: null,
      customExtensions: [
        BaseKit.configure({ placeholder: { placeholder: "請輸入內容..." } }),
        Heading.configure({ levels: [1, 2, 3] }),
        FontSize,
        Bold,
        Color,
        Highlight,
        Table,
        VariableChip,
        TextAlign.configure({
          types: ["heading", "paragraph"], // 允許對齊的標籤
          alignments: ["left", "center", "right"], // 啟用的對齊方向
          defaultAlignment: "left", // 預設靠左
        }),
      ],
      variables: [
        { title: "客戶名稱", label: "{{customer_name}}", id: "customer_name" },
        { title: "訂單編號", label: "{{order_id}}", id: "order_id" },
        { title: "到期日期", label: "{{due_date}}", id: "due_date" },
      ],
    };
  },
  methods: {
    insertVariable(item) {
      if (!item) return;
      const editorInstance = this.$refs.myEditor?.editor;

      if (editorInstance) {
        editorInstance
          .chain()
          .focus()
          .insertContent([
            {
              type: "variableChip",
              attrs: {
                id: item.id,
                label: item.label,
              },
            },
            {
              type: "text",
              text: " ",
            },
          ])
          .run();
      }
      this.$nextTick(() => {
        this.selectedVariable = null;
      });
    },
    saveContent() {
      console.log("儲存的 HTML 內容：", this.content);
    },
  },
};
</script>

<style src="../assets/editor-custom-style.css"></style>
