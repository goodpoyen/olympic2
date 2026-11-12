<template>
  <v-container max-width="800">
    <v-card>
      <!-- 頂部標題列 -->
      <v-card-title class="d-flex align-center bg-primary text-white py-3">
        <v-icon icon="mdi-email-outline" class="mr-2"></v-icon>
        <span>撰寫電子郵件</span>
      </v-card-title>

      <!-- 主體：Vuetify 3 Stepper -->
      <v-stepper v-model="step" flat>
        <!-- 步驟標題列 -->
        <v-stepper-header>
          <v-stepper-item
            title="撰寫郵件"
            :value="1"
            :complete="step > 1"
          ></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item
            title="信件預覽"
            :value="2"
            :complete="step > 2"
          ></v-stepper-item>
          <v-divider></v-divider>
          <v-stepper-item title="確認寄出" :value="3"></v-stepper-item>
        </v-stepper-header>

        <!-- 步驟內容區 -->
        <v-stepper-window>
          <!-- 第一步：郵件主旨與信件內文（皆為必填） -->
          <v-stepper-window-item :value="1">
            <v-form ref="step1Form" @submit.prevent>
              <div class="text-subtitle-1 font-weight-bold mb-1">
                郵件主旨 <span class="text-error">*</span>
              </div>
              <v-text-field
                v-model="formData.subject"
                placeholder="請輸入信件主旨..."
                variant="outlined"
                density="comfortable"
                :rules="subjectRules"
              ></v-text-field>

              <div class="text-subtitle-1 font-weight-bold mt-3 mb-1">
                信件內容 <span class="text-error">*</span>
              </div>
              <v-input :model-value="formData.content" :rules="contentRules">
                <div class="w-100">
                  <RichTextEditor v-model="formData.content" />
                </div>
              </v-input>
            </v-form>
          </v-stepper-window-item>

          <!-- 第二步：預覽郵件主旨與信件內文 -->
          <v-stepper-window-item :value="2">
            <v-alert type="info" variant="tonal" density="compact" class="mb-4">
              寄出前請再次確認信件主旨與排版內容是否正確。
            </v-alert>

            <v-card variant="outlined" class="pa-4">
              <div class="text-caption text-grey">郵件主旨</div>
              <h2 class="text-h5 font-weight-bold mb-3">
                {{ formData.subject }}
              </h2>

              <v-divider class="mb-3"></v-divider>

              <div class="text-caption text-grey mb-2">信件內容預覽</div>
              <!-- 樣式直接寫在行內 style 屬性中 -->
              <div
                style="
                  min-height: 120px;
                  line-height: 1.6;
                  white-space: pre-wrap;
                "
                v-html="formData.content"
              ></div>
            </v-card>
          </v-stepper-window-item>

          <!-- 第三步：確認寄出與完成畫面 -->
          <v-stepper-window-item :value="3">
            <div class="text-center py-8">
              <template v-if="!isSubmitted">
                <v-icon
                  icon="mdi-email-fast-outline"
                  size="64"
                  color="primary"
                  class="mb-3"
                ></v-icon>
                <h3 class="text-h6 mb-2">準備好寄出這封郵件了嗎？</h3>
                <p class="text-body-2 text-grey-darken-1">
                  點擊下方「確認寄出」按鈕，系統將立即發送此封電子郵件。
                </p>
              </template>

              <template v-else>
                <v-icon
                  icon="mdi-email-check"
                  size="64"
                  color="success"
                  class="mb-3"
                ></v-icon>
                <h3 class="text-h6 text-success mb-2">郵件已成功寄出！</h3>
                <p class="text-body-2 text-grey-darken-1 mb-4">
                  信件主旨：{{ formData.subject }}
                </p>
              </template>
            </div>
          </v-stepper-window-item>
        </v-stepper-window>
      </v-stepper>

      <!-- 底部固定操作列（未寄出前顯示） -->
      <template v-if="!isSubmitted">
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <!-- <v-spacer></v-spacer> -->

          <v-btn
            variant="outlined"
            class="mr-2"
            :disabled="step === 1 || isSubmitting"
            @click="step--"
          >
            上一步
          </v-btn>

          <v-btn
            v-if="step < 3"
            color="primary"
            variant="flat"
            :disabled="isNextDisabled"
            @click="handleNext"
          >
            下一步
          </v-btn>

          <v-btn
            v-else
            color="success"
            variant="flat"
            :loading="isSubmitting"
            prepend-icon="mdi-send"
            @click="submitData"
          >
            確認寄出
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-container>
</template>

<script>
import RichTextEditor from "./RichTextEditor.vue";

export default {
  name: "EmailStepper",
  components: {
    RichTextEditor,
  },
  emits: ["sent"],
  data() {
    return {
      step: 1,
      isSubmitting: false,
      isSubmitted: false,
      formData: {
        subject: "",
        content: "",
      },
      subjectRules: [(v) => !!v?.trim() || "請輸入郵件主旨"],
      contentRules: [(v) => !this.isContentEmpty(v) || "請輸入信件內容"],
    };
  },
  computed: {
    isNextDisabled() {
      if (this.step === 1) {
        const hasSubject = !!this.formData.subject?.trim();
        const hasContent = !this.isContentEmpty(this.formData.content);
        return !(hasSubject && hasContent);
      }
      return false;
    },
  },
  methods: {
    isContentEmpty(htmlString) {
      if (!htmlString) return true;
      const plainText = htmlString.replace(/<[^>]*>/g, "").trim();
      return plainText.length === 0;
    },
    async handleNext() {
      if (this.step === 1) {
        const { valid } = await this.$refs.step1Form.validate();
        if (!valid) return;
      }
      this.step++;
    },
    async submitData() {
      this.isSubmitting = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const emailPayload = {
          subject: this.formData.subject,
          content: this.formData.content,
        };
        console.log("寄出郵件資料：", emailPayload);

        this.$emit("sent", emailPayload);
        this.isSubmitted = true;
      } catch (error) {
        console.error("郵件寄出失敗：", error);
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>
