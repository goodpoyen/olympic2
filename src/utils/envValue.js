import { onMounted, ref } from "vue";

export function envValue() {
  const systemENV = {};

  systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  systemENV.VUE_APP_LOCALURL = process.env.VUE_APP_LOCALURL;
  systemENV.MOD = process.env.VUE_APP_MODEENV;
  systemENV.BARCODEDATE = process.env.VUE_APP_BARCODEDATE;

  return { systemENV };
}
