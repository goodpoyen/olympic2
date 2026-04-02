// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { zhHans, zhHant } from "vuetify/locale";

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  locale: {
    locale: "zhHant", // 設定預設為繁體中文
    messages: { zhHant, zhHans },
  },
});
// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
