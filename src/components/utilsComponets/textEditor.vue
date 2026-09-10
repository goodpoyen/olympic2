<template>
  <v-card
    variant="outlined"
    class="pa-0 editor-container mx-auto"
    style="width: 90%; margin-top: 30px"
  >
    <div
      class="custom-injected-toolbar d-flex align-center pa-2 border-b bg-grey-lighten-5"
    >
      <v-btn
        v-if="enableReviewFile"
        color="info"
        size="default"
        variant="flat"
        prepend-icon="mdi-eye"
        class="custom-toolbar-btn px-4 font-weight-bold"
      >
        預覽檔案
      </v-btn>

      <v-spacer></v-spacer>

      <v-btn
        color="blue-grey-darken-1"
        size="default"
        variant="flat"
        prepend-icon="mdi-undo"
        class="custom-toolbar-btn px-4 font-weight-bold mr-2"
      >
        還原
      </v-btn>

      <v-btn
        color="success"
        size="default"
        variant="flat"
        prepend-icon="mdi-content-save"
        class="custom-toolbar-btn"
        @click="saveContent"
      >
        儲存
      </v-btn>
    </div>

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
import { defineComponent, h } from "vue";
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
import { Node, Extension } from "@tiptap/core";
import {
  VMenu,
  VBtn,
  VList,
  VListItem,
  VListItemTitle,
} from "vuetify/components";

// ✨ 自訂變數節點 (Node) 保持外置（因為不依賴 prop，只負責 HTML 解析與渲染規則）
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
        renderHTML: (attributes) => ({
          "data-my-custom-id": attributes.customId,
        }),
      },
      customLabel: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-my-custom-label"),
        renderHTML: (attributes) => ({
          "data-my-custom-label": attributes.customLabel,
        }),
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
        class: "custom-variable-text",
      },
      node.attrs.customLabel,
    ];
  },
});

export default {
  name: "VuetifyProEditor",
  components: { VuetifyTiptap },
  props: {
    enableVariableFeatures: { type: Boolean, default: false },
    variables: {
      type: Array,
      default: () => [],
    },
    enableReviewFile: { type: Boolean, default: false },
  },

  data() {
    return {
      content: "",
    };
  },

  computed: {
    // ✨ 關鍵修改：將 Toolbar 擴充套件移入 computed，使其能動態讀取 this.variables
    variableToolbarExtension() {
      const currentVariables = this.variables; // 閉包引用最新的 prop 變數

      return Extension.create({
        name: "variableToolbarExtension",
        addOptions() {
          return {
            button: ({ editor }) => ({
              component: defineComponent({
                name: "VariableDropdown",
                setup() {
                  const insertVariable = (item) => {
                    editor
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
                  };

                  return () =>
                    h(
                      VMenu,
                      { offset: [0, 4] },
                      {
                        activator: ({ props: menuProps }) =>
                          h(
                            VBtn,
                            {
                              ...menuProps,
                              variant: "text",
                              size: "small",
                              color: "primary",
                              class: "mx-1 text-none",
                              appendIcon: "mdi-chevron-down",
                            },
                            { default: () => "插入變數" },
                          ),
                        default: () =>
                          h(
                            VList,
                            { density: "compact" },
                            {
                              default: () =>
                                currentVariables.map((item) =>
                                  h(
                                    VListItem,
                                    {
                                      key: item.id,
                                      onClick: () => insertVariable(item),
                                    },
                                    {
                                      default: () =>
                                        h(VListItemTitle, null, {
                                          default: () => item.title,
                                        }),
                                    },
                                  ),
                                ),
                            },
                          ),
                      },
                    );
                },
              }),
            }),
          };
        },
      });
    },

    // ✨ 動態加載 Extensions
    customExtensions() {
      const extensions = [
        BaseKit.configure({
          placeholder: { placeholder: "請輸入內容..." },
          paragraph: {
            HTMLAttributes: {
              style: "font-size: 16px;",
            },
          },
        }),
        Heading.configure({ levels: [1, 2, 3] }),
        FontSize,
        Bold,
        Color,
        Highlight,
        Table.configure({ resizable: true }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "center", "right"],
          defaultAlignment: "left",
        }),
      ];

      if (this.enableVariableFeatures) {
        extensions.push(VariableChip);
        // 💡 這裡改為推入由 computed 動態產生的擴充套件
        extensions.push(this.variableToolbarExtension);
      }

      return extensions;
    },
  },

  created() {
    this.convertIdToVariableChip();
  },

  methods: {
    convertIdToVariableChip() {
      if (!this.content) return;

      let updatedContent = this.content;

      this.variables.forEach((variable) => {
        const regex = new RegExp(`\\b${variable.id}\\b`, "g");

        updatedContent = updatedContent.replace(regex, () => {
          return `<custom-variable-tag class="custom-variable-text" data-my-custom-id="${variable.id}" data-my-custom-label="${variable.label}">${variable.label}</custom-variable-tag> `;
        });
      });

      this.content = updatedContent;
    },

    saveContent() {
      const rawHtml = this.content;

      const convertedHtml = rawHtml.replace(
        /<custom-variable-tag[^>]*data-my-custom-id="([^"]+)"[^>]*>[\s\S]*?<\/custom-variable-tag>/g,
        "$1",
      );

      this.$emit("saveEditorContent", convertedHtml);
    },
  },
};
</script>

<style src="../../assets/editor-custom-style.css"></style>
