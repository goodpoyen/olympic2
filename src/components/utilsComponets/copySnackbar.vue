<template>
  <v-snackbar
    :timeout="snackbarTimeout"
    @update:modelValue="
      (val) => {
        if (!val) copyClick = false;
      }
    "
  >
    <span v-if="snackType === 'all'" class="text-truncate d-inline-block">
      {{ copyName }}：{{ copyValue }}
      <v-icon v-show="copyClick" x-small color="green"> mdi-check-all </v-icon>
    </span>

    <span v-else class="text-truncate d-inline-block">
      聯絡信箱：{{ copyMail }}
      <v-icon v-show="copyClick" x-small color="green"> mdi-check-all </v-icon>
    </span>

    <template #actions>
      <div class="d-flex flex-nowrap">
        <v-btn
          color="red"
          variant="text"
          @click="
            copyText(copyValue);
            setCopyClick();
          "
        >
          複製
        </v-btn>
        <v-btn
          color="blue"
          variant="text"
          @click="
            closeSnackbar(false);
            setCopyClick();
          "
        >
          關閉
        </v-btn>
      </div>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  data: () => ({
    snackbarTimeout: 10000,
  }),

  props: {
    copyValue: {
      type: String,
      default: "",
    },
    copyName: {
      type: String,
      default: "",
    },
    snackType: {
      type: String,
      default: "all",
    },
    copyMail: {
      type: String,
      default: "",
    },
    copyClick: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    closeSnackbar(value) {
      this.$emit("closeSnackbar", value);
    },

    copyText(text) {
      navigator.clipboard.writeText(text).then(() => {});
    },

    setCopyClick() {
      this.$emit("setCopyClick", true);
    },
  },
};
</script>
