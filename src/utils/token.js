import axios from "axios";
import { envValue } from "./envValue.js";

export function tokenService() {
  const { systemENV } = envValue();

  var fastAT = {};

  function store(key, value, expire) {
    const obj = {
      time: new Date().getTime(),
      value: value,
      expire: expire,
    };

    const objStr = JSON.stringify(obj);
    localStorage.setItem(key, objStr);
  }

  function renewLT() {
    const item = localStorage.getItem("ret");
    const item2 = localStorage.getItem("act");

    if (item && item2) {
      const itemObj = JSON.parse(item);

      if (new Date().getTime() - itemObj.time >= itemObj.expire) {
        localStorage.clear();
        if (
          location.hostname === "reg.tpmso.org" ||
          location.hostname === "olybeta.csie.ntnu.edu.tw"
        ) {
          location.href = "/login";
        } else {
          if (systemENV.MOD === "dev") {
            location.href = "/science/scilogin";
            // location.href = '/login'
          } else if (
            location.hostname === "sciprograms.tpmso.org" ||
            location.hostname === "scibeta.csie.ntnu.edu.tw"
          ) {
            location.href = "/science/scilogin";
          }
        }
        // location.href = '/login'
      } else {
        store("ret", itemObj.value, "1800000");
        return true;
      }
    } else {
      localStorage.removeItem("ret");
      localStorage.removeItem("act");
      return false;
    }
  }

  async function checkLogin() {
    const item = localStorage.getItem("ret");
    const item2 = localStorage.getItem("act");

    if (item && item2) {
      const itemObj = JSON.parse(item);

      if (new Date().getTime() - itemObj.time >= itemObj.expire) {
        localStorage.clear();
        return false;
      } else {
        store("ret", itemObj.value, "1800000");
        const status = await checkRT(itemObj.value);
        if (!status) {
          localStorage.clear();
          return false;
        }

        return true;
      }
    } else {
      return false;
    }
  }

  async function checkRT(T) {
    const checkData = {};
    checkData.T = T;
    let status = false;

    await axios
      .post(systemENV.APISERVERURL + "/checkRT", checkData)
      .then((response) => {
        if (response.data.code === 200) {
          status = true;
        } else if (response.data.code === 400) {
          status = false;
        } else if (response.data.code === 401) {
          store("ret", response.data.resultData.ret, "1800000");
          store("level", response.data.resultData.level, "1800000");
          store("olympic", response.data.resultData.olympic, "1800000");
          store("system", response.data.resultData.system, "1800000");
          store("act", response.data.resultData.act, "1800000");

          status = true;
        }
      })
      .catch((err) => {
        return err;
      });

    return status;
  }

  async function setET(T) {
    store("ett", T, "1800000");
  }

  function renewET() {
    const item = localStorage.getItem("ett");

    if (item) {
      const itemObj = JSON.parse(item);

      if (new Date().getTime() - itemObj.time >= itemObj.expire) {
        localStorage.removeItem("ett");
        location.href = "/science/signup/";
      } else {
        store("ett", itemObj.value, "1800000");
        return true;
      }
    } else {
      localStorage.removeItem("ett");
      location.href = "/science/signup/";
    }
  }

  async function getFastAT() {
    const checkData = {};
    const item = localStorage.getItem("ret");
    const itemObj = JSON.parse(item);
    checkData.T = itemObj.value;

    await axios
      .post(systemENV.APISERVERURL + "/getAT", checkData)
      .then((response) => {
        if (response.data.code === 200) {
          fastAT = response.data.resultData.act;
        } else {
          localStorage.clear();
          if (
            location.hostname === "reg.tpmso.org" ||
            location.hostname === "olybeta.csie.ntnu.edu.tw"
          ) {
            location.href = "/login";
          } else {
            if (systemENV.MOD === "dev") {
              location.href = "/science/scilogin";
              // location.href = '/login'
            } else if (
              location.hostname === "sciprograms.tpmso.org" ||
              location.hostname === "scibeta.csie.ntnu.edu.tw"
            ) {
              location.href = "/science/scilogin";
            }
          }
        }
      })
      .catch((err) => {
        return err;
      });

    return fastAT;
  }

  return { store, renewLT, checkLogin, checkRT, setET, renewET, getFastAT };
}
