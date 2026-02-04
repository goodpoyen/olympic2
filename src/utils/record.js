import axios from "axios";
import { globalTool } from "./tool.js";
import { envValue } from "./envValue.js";
import { tokenService } from "./token.js";

export function recordService() {
  var from = "";

  const { systemENV } = envValue();

  const globalSystemTool = globalTool();

  const token = tokenService();

  async function getRecord(olyId, sstId, signupSchool) {
    let result = {};
    const data = {};
    data.AT = await token.getFastAT();
    data.olyId = olyId;
    data.sstId = sstId;
    data.signupSchool = signupSchool;

    await axios
      .post(systemENV.APISERVERURL + "/getRecord", data)
      .then((response) => {
        // console.log(response.data);
        if (response.data.code === 200) {
          result = response.data.resultData;
          result.forEach(function (data) {
            setTypeWording(data);
            data.contact = data.contact.replaceAll(";", "<br>");
          });
        } else {
          globalSystemTool.removeLocalStorage();
        }
      })
      .catch(function (error) {
        // console.log(error)
      });

    return result;
  }

  async function getPaymentRecord(olyId, sstId, signupSchool) {
    let result = {};
    const data = {};
    data.AT = await token.getFastAT();
    data.olyId = olyId;
    data.sstId = sstId;
    data.signupSchool = signupSchool;

    await axios
      .post(systemENV.APISERVERURL + "/getPaymentRecord", data)
      .then((response) => {
        // console.log(response.data);
        if (response.data.code === 200) {
          result = response.data.resultData;
          result.forEach(function (data) {
            changeData(data);

            data.createTime = data.createTime.replaceAll("-", "/");
            data.createTime = data.createTime.replaceAll(".0", "");
          });
        } else {
          globalSystemTool.removeLocalStorage();
        }
      })
      .catch(function (error) {
        // console.log(error)
      });

    return result;
  }

  function setTypeWording(data) {
    if (data.type === "review") {
      data.type = "審查";
      from = "manage";
    }
    if (data.type === "editor") {
      data.type = "個人資料";
      from = "manage";
    }
    if (data.type === "mail") {
      data.type = "信件";
      from = "manage";
    }
    if (data.type === "remark") {
      data.type = "備註";
      from = "manage";
    }

    if (data.type === "signupReview") {
      data.type = "審查";
      from = "signup";
    }
    if (data.type === "signupEditor") {
      data.type = "個人資料";
      from = "signup";
    }

    return from;
  }

  async function setRecord(olyId, oldInfo, newInfo, signupSchool, type) {
    const data = {};
    const logInfo = {};
    data.olyId = olyId;
    data.sstId = newInfo.sstId;
    data.signupSchool = signupSchool;

    const wording = {};
    wording.type = type;
    setTypeWording(wording);

    if (type === "signupReview") {
      type = "review";
      data.AT = "123";
    } else if (type === "signupEditor") {
      type = "editor";
      data.AT = "123";
    } else {
      data.AT = await token.getFastAT();
    }

    data.from = from;

    if (type !== "mail") {
      logInfo.time = globalSystemTool.getNowDataTime("all");
      logInfo.type = type;
      logInfo.contact = processEditorRecord(oldInfo, newInfo);
      data.infoData = JSON.stringify(logInfo);
      console.log(data.infoData);
    } else {
      logInfo.time = globalSystemTool.getNowDataTime("all");
      logInfo.type = "mail";
      logInfo.contact = newInfo.emailContent;
      data.infoData = JSON.stringify(logInfo);
    }

    if (logInfo.contact !== "") {
      axios.post(systemENV.APISERVERURL + "/setRecord", data);
    }

    return "";
  }

  function processEditorRecord(oldInfo, newInfo) {
    let info = "";

    for (const key in newInfo) {
      if (newInfo[key] !== oldInfo[key] && key !== "schoolNumber") {
        info += setEditorInfo(key, newInfo[key]) + ";";
      }
    }

    return info;
  }

  function setEditorInfo(key, info) {
    let editorData = "";

    if (key === "name") {
      editorData += "修改姓名為：" + info;
    }
    if (key === "birthday") {
      editorData += "修改生日為：" + info;
    }
    if (key === "idCard") {
      editorData += "修改身分證統一編號為：" + info;
    }
    if (key === "email") {
      editorData += "修改信箱為：" + info;
    }
    if (key === "schoolNameAll") {
      editorData += "修改學校為：" + info;
    }
    if (key === "studentStatus") {
      if (info === "1") {
        editorData += "修改為：國三應屆畢業生";
      } else {
        editorData += "修改為：特殊教育學生調整入學年齡及修業年限之國中學生";
      }
    }
    if (key === "identity") {
      if (info === "1") {
        editorData += "修改身分別為：一般生";
      } else {
        editorData += "修改身分別為：特殊身分";
      }
    }
    if (key === "payStatus") {
      if (info === "1") {
        editorData += "修改繳費身分為：一般生";
      } else {
        editorData += "修改繳費身分為：免繳費";
      }
    }
    if (key === "reward") {
      if (info === "1") {
        editorData += "修改就學期間之表現為：依各校自行訂定之排名規則依序推薦";
      } else if (info === "2") {
        editorData +=
          "修改就學期間之表現為：經各該主管教育行政機關鑑定為數理資賦優異者。";
      } else if (info === "3") {
        editorData +=
          "修改就學期間之表現為：通過「國際國中科學奧林匹亞競賽」或「國際數理學科奧林匹亞競賽」初選，或具備「亞太數學奧林匹亞競賽國家代表隊決選研習營」報名資";
      } else {
        editorData +=
          "修改就學期間之表現為：曾獲教育部或國教署主辦有關數理科目之全國競賽";
      }
    }
    if (key === "admission") {
      if (info === "1") {
        editorData += "修改錄取方式為：甄選錄取";
      } else {
        editorData += "修改錄取方式為：直接錄取";
      }
    }
    if (key === "handicapped") {
      if (info === "1") {
        editorData += "修改甄選服務為：是";
      } else {
        editorData += "修改甄選服務為：否";
      }
    }
    if (key === "remark") {
      editorData += "修改備註為：" + info;
    }
    if (key === "checkType") {
      if (info === "1") {
        editorData += "修改審查結果為：待審核";
      } else if (info === "2") {
        editorData += "修改審查結果為：已通過";
      } else if (info === "3") {
        editorData += "修改審查結果為：未通過";
      } else {
        editorData += "修改審查結果為：作廢";
      }
    }
    if (key === "studentStatusPass") {
      if (info === "1") {
        editorData += "修改甄選審查(特殊教育國中生)為：符合";
      } else {
        editorData += "修改甄選審查(特殊教育國中生)為：不符合";
      }
    }
    if (key === "identityPass") {
      if (info === "1") {
        editorData += "修改甄選審查(特殊身分)為：符合";
      } else {
        editorData += "修改甄選審查(特殊身分)為：不符合";
      }
    }
    if (key === "payStatusPass") {
      if (info === "1") {
        editorData += "修改甄選審查(免繳費)為：符合";
      } else {
        editorData += "修改甄選審查(免繳費)為：不符合";
      }
    }
    if (key === "rewardPass") {
      if (info === "1") {
        editorData += "修改甄選審查(就學期間之表現)為：符合";
      } else {
        editorData += "修改甄選審查(就學期間之表現)為：不符合";
      }
    }
    if (key === "admissionPass") {
      if (info === "1") {
        editorData += "修改甄選審查(錄取方式)為：符合";
      } else {
        editorData += "修改甄選審查(錄取方式)為：不符合";
      }
    }
    if (key === "handicappedPass") {
      if (info === "1") {
        editorData += "修改甄選審查(甄選服務)為：符合";
      } else {
        editorData += "修改甄選審查(甄選服務)為：不符合";
      }
    }

    return editorData;
  }

  function changeData(data) {
    if (data.paymentStatus === "0") {
      data.paymentNumber = "綠界尚無資料";
    }

    if (data.paymentStatus === "0") {
      data.paymentStatusName = "未選擇繳費方式";
    }
    if (data.paymentStatus === "1") {
      data.paymentStatusName = "已繳費";
    }
    if (data.paymentStatus === "2") {
      data.paymentStatusName = "未繳費";
    }
    if (data.paymentStatus === "3") {
      data.paymentStatusName = "免繳費";
    }
    if (data.paymentStatus === "4") {
      data.paymentStatusName = "交易驗證失敗";
    }
    if (data.paymentStatus === "5") {
      data.paymentStatusName = "交易失敗";
    }
    if (data.paymentStatus === "6") {
      data.paymentStatusName = "待補費";
    }
    if (data.paymentStatus === "7") {
      data.paymentStatusName = "已退款";
    }
    if (data.paymentStatus === "8") {
      data.paymentStatusName = "未退款";
    }
    if (data.paymentStatus === "9") {
      data.paymentStatusName = "無須繳費";
    }
    if (data.paymentStatus === "10") {
      data.paymentStatusName = "逾期未繳";
    }
    if (data.paymentStatus === "11") {
      data.paymentStatusName = "綠界金流沒有此繳費序號資訊";
    }
    if (data.paymentStatus === "12") {
      data.paymentStatusName = "帳款確認中";
    }
    if (data.paymentStatus === "13") {
      data.paymentStatusName = "學校自行收款";
    }

    return data;
  }

  return {
    getRecord,
    getPaymentRecord,
    setTypeWording,
    setRecord,
    processEditorRecord,
    setEditorInfo,
  };
}
