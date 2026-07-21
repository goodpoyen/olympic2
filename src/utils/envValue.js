import { onMounted, ref } from "vue";

export function envValue() {
  const systemENV = {};

  // if (process.env.VUE_APP_MODEENV === "dev") {
  //   systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  // } else if (process.env.VUE_APP_MODEENV === "sit") {
  //   if (location.hostname === "scibeta.csie.ntnu.edu.tw") {
  //     systemENV.APISERVERURL = "http://scibeta.csie.ntnu.edu.tw/olyapi";
  //   } else if (location.hostname === "olybeta.csie.ntnu.edu.tw") {
  //     systemENV.APISERVERURL = "http://olybeta.csie.ntnu.edu.tw/olyapi";
  //   } else {
  //     systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  //   }
  // } else {
  //   if (location.hostname === "sciprograms.tpmso.org") {
  //     systemENV.APISERVERURL = "http://sciprograms.tpmso.org/olyapi";
  //   } else if (location.hostname === "reg.tpmso.org") {
  //     systemENV.APISERVERURL = "http://reg.tpmso.org/olyapi";
  //   } else if (location.hostname === "apply.tpmso.org") {
  //     systemENV.APISERVERURL = "http://apply.tpmso.org/olyapi";
  //   } else {
  //     systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  //   }
  // }

  systemENV.APISERVERURL = process.env.VUE_APP_APISERVERURL;
  systemENV.VUE_APP_LOCALURL = process.env.VUE_APP_LOCALURL;
  systemENV.MOD = process.env.VUE_APP_MODEENV;
  systemENV.BARCODEDATE = process.env.VUE_APP_BARCODEDATE;

  return { systemENV };
}
