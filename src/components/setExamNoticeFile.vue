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

// ✨ 修正後的自訂 Chip 節點，使其支援外部 CSS 與動態變數更改
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
        // 💡 重點：移除 style 屬性，改賦予 class 名稱，讓外部 CSS 可以影響它
        class: "custom-variable-chip",
      },
      node.attrs.customLabel, // 這裡會動態放入帶入的變數中文標籤（如：{{自動帶入-客戶名稱}}）
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
      // 📝 變數清單
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

    // 儲存並進行字串轉換方法
    saveContent() {
      const rawHtml = this.content;

      // 正則表達式匹配更新（加入了 class 的匹配相容性）
      const convertedHtml = rawHtml.replace(
        /<custom-variable-tag[^>]*data-my-custom-id="([^"]+)"[^>]*>[\s\S]*?<\/custom-variable-tag>/g,
        "$1",
      );

      console.log("【轉換前】原本 HTML：", rawHtml);
      console.log("【轉換後】自訂字串：", convertedHtml);
    },
  },
};
</script>

custom-variable-tag.custom-variable-chip { background-color: #f5f5f5 !important;
/* 淺灰色底色 */ color: #424242 !important; /* 深灰色文字，確保清晰易讀 */
border: 1px solid #e0e0e0 !important; /* 微調：加一層淡淡的邊框讓 Chip 更明顯 */
padding: 2px 6px !important; border-radius: 4px !important; display:
inline-block !important; margin: 0px 2px !important; font-weight: 500
!important; user-select: none; /* 防止使用者誤選取或破壞標籤文字 */ } /*
額外加分：當滑鼠游標移過去時，稍微加深灰色，提升互動感 */
custom-variable-tag.custom-variable-chip:hover { background-color: #eeeeee
!important; border-color: #bdbdbd !important; cursor: pointer; }

<style src="../assets/editor-custom-style.css"></style>
