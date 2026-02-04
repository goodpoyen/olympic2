import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";
import router from "./router";
import { envValue } from "./utils/envValue.js";
import { globalValue } from "./utils/globalValue.js";
import { globalTool } from "./utils/tool.js";
import { recordService } from "./utils/record.js";
import { tokenService } from "./utils/token.js";

loadFonts();

const app = createApp(App);

const { systemENV } = envValue();

app.config.globalProperties.systemENV = systemENV;

const { globalSystemValue } = globalValue();

app.config.globalProperties.globalSystemValue = globalSystemValue;

const globalSystemTool = globalTool();

app.config.globalProperties.globalSystemTool = globalSystemTool;

const token = tokenService();

app.config.globalProperties.tokenService = token;

const record = recordService();

app.config.globalProperties.recordService = record;

app.use(router).use(vuetify).mount("#app");
