import html2Canvas from "html2canvas";
import JsPDF from "jspdf";

export default {
  install(Vue, options) {
    Vue.prototype.getPdf = async function () {
      let PDF = new JsPDF("", "pt", "a4");
      var title = this.htmlTitle;
      await html2Canvas(document.querySelector("#pdfDom"), {
        allowTaint: true,
        useCORS: true,
      }).then(async function (canvas) {
        let contentWidth = canvas.width;
        let contentHeight = canvas.height;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = await canvas.toDataURL("image/jpeg", 1.0);
        if (leftHeight < pageHeight) {
          await PDF.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
          // PDF.addPage();
        } else {
          while (leftHeight > 0) {
            await PDF.addImage(
              pageData,
              "JPEG",
              0,
              position,
              imgWidth,
              imgHeight
            );

            // leftHeight -= pageHeight;
            // position -= 841.89;
            // if (leftHeight > 0) {
            //   PDF.addPage();
            // }
          }
        }
      });

      // console.log(PDF.output().length);

      if (PDF.output().length < 3300) {
        return false;
      } else {
        PDF.save(title + ".pdf");

        return true;
      }
      // return false;
    };
  },
};
