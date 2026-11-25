<template>
  <v-card variant="outlined" class="pa-0 editor-container w-100">
    <vuetify-tiptap
      ref="myEditor"
      v-model="internalContent"
      :extensions="customExtensions"
      hide-bottom
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
    modelValue: {
      type: String,
      default: "",
    },
    enableVariableFeatures: { type: Boolean, default: false },
    variables: {
      type: Array,
      default: () => [],
    },
    enableReviewFile: { type: Boolean, default: false },
  },

  emits: ["update:modelValue", "saveEditorContent"],

  computed: {
    internalContent: {
      get() {
        return this.modelValue;
      },
      set(val) {
        this.$emit("update:modelValue", val);
      },
    },

    variableToolbarExtension() {
      const currentVariables = this.variables;

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

    customExtensions() {
      const extensions = [
        BaseKit.configure({
          placeholder: { placeholder: "請輸入內容..." },
          characterCount: false,
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
        extensions.push(this.variableToolbarExtension);
      }

      return extensions;
    },
  },

  watch: {
    modelValue: {
      immediate: true,
      handler(newVal) {
        if (
          newVal &&
          this.enableVariableFeatures &&
          this.variables.length > 0
        ) {
          this.convertIdToVariableChip(newVal);
        }
      },
    },
  },

  methods: {
    convertIdToVariableChip(rawHtml) {
      let updatedContent = rawHtml;

      this.variables.forEach((variable) => {
        const regex = new RegExp(`\\b${variable.id}\\b`, "g");

        updatedContent = updatedContent.replace(regex, () => {
          return `<custom-variable-tag class="custom-variable-text" data-my-custom-id="${variable.id}" data-my-custom-label="${variable.label}">${variable.label}</custom-variable-tag> `;
        });
      });

      if (updatedContent !== rawHtml) {
        this.$emit("update:modelValue", updatedContent);
      }
    },

    saveContent() {
      const rawHtml = this.internalContent;

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
