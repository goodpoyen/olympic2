<template>
  <v-card
    variant="outlined"
    class="pa-0 editor-container mx-auto"
    style="width: 90%; margin-top: 30px"
  >
    <!-- 工具列 -->
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

    <!-- 編輯器主體 -->
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

// 自訂防呆 Chip 節點 (維持您原本的設定，確保編輯器內呈現底色)
const VariableChip = Node.create({
  name: "variableChip",
  group: "inline",
  inline: true,
  selectable: true,
  atom: true,
  allowMarks: true,

  addAttributes() {
    return {
      customId: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-my-custom-id"),
        renderHTML: (attributes) => {
          return { "data-my-custom-id": attributes.customId };
        },
      },
      customLabel: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-my-custom-label"),
        renderHTML: (attributes) => {
          return { "data-my-custom-label": attributes.customLabel };
        },
      },
    };
  },

  parseHTML() {
    return [{ tag: "custom-variable-tag" }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      "custom-variable-tag",
      {
        ...HTMLAttributes,
        style:
          "background-color: rgb(232, 245, 233); color: rgb(46, 125, 50); padding: 2px 6px; border-radius: 4px; display: inline-block; margin: 0px 2px; font-weight: 500;",
      },
      node.attrs.customLabel,
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
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
          defaultAlignment: "left",
        }),
      ],
      variables: [
        {
          title: "客戶名稱",
          label: "{{自動帶入-客戶名稱}}",
          id: "customer_name",
        },
        { title: "訂單編號", label: "{{自動帶入-訂單編號}}", id: "order_id" },
        { title: "到期日期", label: "{{自動帶入-到期日期}}", id: "due_date" },
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
                customId: item.id,
                customLabel: item.label,
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

    // 🔥 儲存並進行字串轉換方法
    saveContent() {
      // 1. 取得目前編輯器內的原始 HTML
      const rawHtml = this.content;

      // 2. 使用正則表達式，精準匹配整個 <custom-variable-tag> 標籤並擷取 data-my-custom-id 的值
      // 這裡使用了 ([^"]+) 來捕獲 id，並透過 $1 代表捕獲到的內容
      const convertedHtml = rawHtml.replace(
        /<custom-variable-tag[^>]*data-my-custom-id="([^"]+)"[^>]*>[\s\S]*?<\/custom-variable-tag>/g,
        "$1", // 👈 這裡直接用抓到的 id (例如 order_id) 替換掉整段標籤
      );

      // 3. 列印轉換結果
      console.log("【轉換前】原本 HTML：", rawHtml);
      console.log("【轉換後】自訂字串：", convertedHtml);

      // 4. 將轉換後的 convertedHtml 送至 API 儲存至資料庫
      // this.api.save(convertedHtml);
    },
  },
};
</script>

<style src="../assets/editor-custom-style.css"></style>
