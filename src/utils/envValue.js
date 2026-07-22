import { onMounted, ref } from "vue";

export function envValue() {
  const systemENV = {};

  if (process.env.VUE_APP_MODEENV === "dev") {
    systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  } else if (process.env.VUE_APP_MODEENV === "sit") {
    if (location.hostname === process.env.VUE_APP_SCIDOMAIN) {
      systemENV.APISERVERURL = process.env.VUE_APP_SCILOCALURL + "/olyapi";
    } else if (location.hostname === process.env.VUE_APP_OLYDOMAIN) {
      systemENV.APISERVERURL = process.env.VUE_APP_OLYLOCALURL + "/olyapi";
    } else {
      systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
    }
  } else {
    // if (location.hostname === process.env.VUE_APP_SCIDOMAIN) {
    //   systemENV.APISERVERURL = process.env.VUE_APP_SCILOCALURL + "/olyapi";
    // } else if (location.hostname === process.env.VUE_APP_OLYDOMAIN) {
    //   systemENV.APISERVERURL = process.env.VUE_APP_OLYLOCALURL + "/olyapi";
    // } else if (location.hostname === process.env.VUE_APP_APLDOMAIN) {
    //   systemENV.APISERVERURL = process.env.VUE_APP_APLLOCALURL + "/olyapi";
    // } else {
    //   systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
    // }

    systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  }

  // systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  systemENV.VUE_APP_OLYLOCALURL = process.env.VUE_APP_OLYLOCALURL;
  systemENV.VUE_APP_SCILOCALURL = process.env.VUE_APP_SCILOCALURL;
  systemENV.VUE_APP_APLLOCALURL = process.env.VUE_APP_APLLOCALURL;
  systemENV.MOD = process.env.VUE_APP_MODEENV;
  systemENV.BARCODEDATE = process.env.VUE_APP_BARCODEDATE;

  systemENV.OLYDOMAIN = process.env.VUE_APP_OLYDOMAIN;
  systemENV.SCIDOMAIN = process.env.VUE_APP_SCIDOMAIN;
  systemENV.APLDOMAIN = process.env.VUE_APP_APLDOMAIN;

  return { systemENV };
}
