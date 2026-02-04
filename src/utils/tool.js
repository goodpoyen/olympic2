import { globalValue } from "./globalValue.js";
import { envValue } from "./envValue.js";

export function globalTool() {
  var year = "";
  var month = "";
  var getDate = "";
  var day = "";
  var hours = "";
  var minutes = "";
  var second = "";

  const { globalSystemValue } = globalValue();

  const { systemENV } = envValue();

  function getNowDataTime(type) {
    const today = new Date();

    year = today.getFullYear();

    month = today.getMonth() + 1;

    if (month < 10) {
      month = "0" + month;
    }

    getDate = today.getDate();

    if (getDate < 10) {
      getDate = "0" + getDate;
    }

    hours = today.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    minutes = today.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    second = today.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }

    if (type === "all") {
      return (
        year +
        "-" +
        month +
        "-" +
        getDate +
        " " +
        hours +
        ":" +
        minutes +
        ":" +
        second
      );
    } else {
      return year + "-" + month + "-" + getDate + " " + hours + ":" + minutes;
    }
  }

  function getNowDataTimeByString() {
    const today = new Date();

    year = today.getFullYear();

    month = today.getMonth() + 1;

    if (month < 10) {
      month = "0" + month;
    }

    getDate = today.getDate();

    if (getDate < 10) {
      getDate = "0" + getDate;
    }

    hours = today.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    minutes = today.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    second = today.getSeconds();
    if (second < 10) {
      second = "0" + second;
    }

    return year + month + getDate + hours + minutes + second;
  }

  function getDataTimeFormat(date) {
    year = date.getFullYear();

    month = date.getMonth() + 1;

    if (month < 10) {
      month = "0" + month;
    }

    getDate = date.getDate();

    if (getDate < 10) {
      getDate = "0" + getDate;
    }

    hours = date.getHours();

    if (hours < 10) {
      hours = "0" + hours;
    }

    minutes = date.getMinutes();

    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    date.getSeconds;
    second = date.getSeconds();

    if (second < 10) {
      second = "0" + second;
    }

    return (
      year +
      "/" +
      month +
      "/" +
      getDate +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      second
    );
  }

  function GMTdateTimeFormat(GMTdateTime) {
    const date = new Date(GMTdateTime);

    year = date.getFullYear();

    month = date.getMonth() + 1;

    if (month < 10) {
      month = "0" + month;
    }

    const LocaleDateString = new Date(GMTdateTime).toLocaleDateString();

    const dateArray = LocaleDateString.split("/");

    day = dateArray[2];

    if (day < 10) {
      day = "0" + day;
    }

    hours = date.getHours();

    if (hours < 10) {
      hours = "0" + hours;
    }

    minutes = date.getMinutes();

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    return year + "-" + month + "-" + day + " " + hours + ":" + minutes;
  }

  function equestData(item) {
    const data = {};

    for (const key in item) {
      data[key] = item[key];
    }

    return data;
  }

  function removeLocalStorage() {
    localStorage.clear();
    if (
      location.hostname === "reg.tpmso.org" ||
      location.hostname === "olybeta.csie.ntnu.edu.tw"
    ) {
      location.href = "/login";
    } else {
      if (systemENV.MOD === "dev") {
        if (globalSystemValue.system != null) {
          if (globalSystemValue.system === "science") {
            location.href = "/science/scilogin";
          } else {
            location.href = "/login";
          }
        }
      } else if (
        location.hostname === "sciprograms.tpmso.org" ||
        location.hostname === "scibeta.csie.ntnu.edu.tw"
      ) {
        location.href = "/science/scilogin";
      }
    }
  }

  function verificationIdCard(idcard) {
    const conver = "ABCDEFGHJKLMNPQRSTUVXYWZIO";
    const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];

    idcard =
      String(conver.indexOf(idcard[0].toUpperCase()) + 10) + idcard.slice(1);

    let checkSum = 0;
    for (let i = 0; i < idcard.length; i++) {
      const c = parseInt(idcard[i]);
      const w = weights[i];
      checkSum += c * w;
    }

    return checkSum % 10 === 0;
  }

  function changeTitleData(word) {
    if (word === "TMO") {
      return "數學奧林匹亞  (TMO)";
    }

    if (word === "IPHO") {
      return "物理奧林匹亞  (IPHO)";
    }

    if (word === "TWICHO") {
      return "化學奧林匹亞  (TWICHO)";
    }

    if (word === "IBO") {
      return "生物奧林匹亞  (IBO)";
    }

    if (word === "IESO") {
      return "地科奧林匹亞  (IESO)";
    }

    if (word === "IJSO") {
      return "國中科學奧林匹亞  (IJSO)";
    }

    if (word === "TOI") {
      return "資訊奧林匹亞  (TOI)";
    }

    if (word === "TOIREG") {
      return "資訊推廣 (TOIREG)";
    }

    if (word === "TESTREG") {
      return "資訊測試 (TESTREG)";
    }

    if (word === "JGHS") {
      return "建國中學科學班  (JGHS)";
    }

    if (word === "TFGHS") {
      return "北一女中科學班  (TFGHS)";
    }

    if (word === "HSNU") {
      return "師大附中科學班  (HSNU)";
    }

    if (word === "WLSH") {
      return "武陵高中科學班  (WLSH)";
    }

    if (word === "TCFSH") {
      return "臺中一中科學班  (TCFSH)";
    }

    if (word === "CHSH") {
      return "彰化高中科學班  (CHSH)";
    }

    if (word === "TNFSH") {
      return "臺南一中科學班  (TNFSH)";
    }

    if (word === "KSHS") {
      return "高雄中學科學班 (KSHS)";
    }

    if (word === "CYSH") {
      return "嘉義高中科學班 (CYSH)";
    }

    if (word === "NEHS") {
      return "竹科實中科學班 (NEHS)";
    }

    if (word === "TESTNTNU") {
      return "測試科學班 (TESTNTNU)";
    }
  }

  function getScienceAllName(word) {
    if (word === "JGHS") {
      return "臺北市立建國高級中學";
    }

    if (word === "TFGHS") {
      return "臺北市立第一女子高級中學";
    }

    if (word === "HSNU") {
      return "國立臺灣師範大學附屬高級中學";
    }

    if (word === "WLSH") {
      return "桃園市立武陵高級中等學校";
    }

    if (word === "TCFSH") {
      return "臺中市立臺中第一高級中等學校";
    }

    if (word === "CHSH") {
      return "國立彰化高級中學";
    }

    if (word === "TNFSH") {
      return "國立臺南第一高級中學";
    }

    if (word === "KSHS") {
      return "高雄市立高雄高級中學";
    }

    if (word === "CYSH") {
      return "國立嘉義高級中學";
    }

    if (word === "NEHS") {
      return "國立新竹科學園區實驗高級中等學校";
    }

    if (word === "TESTNTNU") {
      return "測試科學班 (TESTNTNU)";
    }
  }

  function getSysLogo(word) {
    if (word === "TMO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "IPHO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TWICHO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "IBO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "IESO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "IJSO") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TOI" || word === "TOIREG" || word === "TESTREG") {
      return "/images/logo" + "TOI.png";
    }

    if (word === "JGHS") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TFGHS") {
      return "/images/logo" + word + ".png";
    }

    if (word === "HSNU") {
      return "/images/logo" + word + ".png";
    }

    if (word === "WLSH") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TCFSH") {
      return "/images/logo" + word + ".png";
    }

    if (word === "CHSH") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TNFSH") {
      return "/images/logo" + word + ".png";
    }

    if (word === "KSHS") {
      return "/images/logo" + word + ".png";
    }

    if (word === "CYSH") {
      return "/images/logo" + word + ".png";
    }

    if (word === "NEHS") {
      return "/images/logo" + word + ".png";
    }

    if (word === "TESTNTNU") {
      return "/images/logo" + "NEHS" + ".png";
    }
  }

  function changeSubtitleMsg(level) {
    if (level === "1") {
      return "系統管理者介面";
    }

    if (level === "2") {
      return "(奧匹)專任助理管理介面";
    }

    if (level === "3") {
      return "(科學班)管理者管理介面";
    }

    if (level === "4") {
      return "(科學班)業務人員管理介面";
    }

    if (level === "99") {
      return "測試介面";
    }
  }

  return {
    getNowDataTime,
    getNowDataTimeByString,
    getDataTimeFormat,
    GMTdateTimeFormat,
    equestData,
    removeLocalStorage,
    verificationIdCard,
    changeTitleData,
    getScienceAllName,
    getSysLogo,
    changeSubtitleMsg,
  };
}
