<template>
  <div class="my-col-width my-col-vcenter">
    <h2 class="title">Заполните форму что бы получить подробную информацию по офису</h2>
    <div class="columns">
      <div class="column is-half">
        <b-field class="my-field">
          <b-input type="text" placeholder="Имя" v-model="formName" ref="formNameEl" required></b-input>
        </b-field>

        <b-field class="my-field">
          <b-input type="email" placeholder="info@mail.ru" v-model="formEmail" ref="formEmailEl" required></b-input>
        </b-field>

        <b-field class="my-field">
          <b-input type="tel" placeholder="+7-777-777-77-77" v-model="formPhone" ref="formPhoneEl" required></b-input>
        </b-field>

        <b-button :disabled="selectedOptionImage === null" @click="makePdf">Скачать заявку в pdf</b-button>

      </div>
      <div class="column is-half">
        <b-field>
          <b-input
            maxlength="1000"
            type="textarea"
            placeholder="Дополнительное сообщение"
            class="my-textarea"
            :has-counter="false"
            v-model="formMessage"
            ref="formMessageEl"></b-input>
        </b-field>
        <p style="font-size: 10px; color: gray">
          This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a>and
          <a href="https://policies.google.com/terms">Terms of Service</a> apply.
        </p>
        <b-button :disabled="selectedOptionImage === null" class="my-ctaButton" :class="{ button: isRequestLoading, 'is-loading': isRequestLoading }" @click.prevent="submit" >Отправить заявку</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  name: "sendRequest",
  data() {
    return {
      formName: "",
      formEmail: "",
      formPhone: "",
      formMessage: "",
      formData: null,
      isRequestLoading: false,
    };
  },
  computed: {
    // selectedOptions() {
    //   return this.$store.state.selectedOptions;
    // },
    selectedOptionImage() {
      return this.$store.state.optionImage;
    },
    docInfo() {
      return {
        content: [
          { text: "Заявка", style: "header" },
          { text: "Вы выбрали следующие параметры:", style: "subheader" },
          {
            table: {
              widths: ["auto", "auto"],
              margin: [0, 0, 0, 10],
              body: [
                [{ text: "Корпус", bold: true }, `${this.getSelectedBuildingName}`],
                [{ text: "Этаж", bold: true }, `${this.$store.getters.currentFloor}`],
                [
                  { text: "Желаемая площадь", bold: true },
                  `от ${this.$store.state.selectedZone.areaLimits[0]} до ${this.$store.state.selectedZone.areaLimits[1]} м²`,
                ],
                [{ text: "Площадь выбранного помещения", bold: true }, `${this.$store.state.selectedZone.areaSquare} м²`],
                [{ text: "Вариант планировки", bold: true }, `${this.getSelectedPlanningName}`],
              ],
            },
          },
          {
            image: this.$store.state.selectedZone.selectedRoomLayoutImgPath,
            fit: [500, 500],
            margin: [0, 10, 0, 20],
          },
          {
            id: "tableСontinuation",
            text: "Дополнительные параметры",
            style: "subheader",
          },
          {
            table: {
              widths: ["auto", "auto"],
              body: [
                [{ text: "Отделка", bold: true }, `${this.getSelectedOptionsFinishing}`],
                [{ text: "Дополнительные опции", bold: true }, `${this.getSelectedExrtraOptions}`],
              ],
            },
          },
          {
            image: this.selectedOptionImage,
            fit: [530, 600],
            margin: [0, 5, 0, 5],
          },
        ],
        pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
          return currentNode.id === "tableСontinuation";
        },
        styles: {
          header: {
            fontSize: 18,
            bold: true,
            margin: [0, 5, 0, 5],
          },
          subheader: {
            fontSize: 14,
            bold: true,
            margin: [0, 5, 0, 5],
          },
        },
      };
    },
    getSelectedBuildingName() {
      //текущий выбранный корпус со склонением
      switch (this.$store.state.selectedZone.building) {
        case "0":
          return "Павильон";
          break;
        case "1":
          return "1-я башня";
          break;
        case "2":
          return "2-я башня";
          break;
        case "3":
          return "14 и 15 этажа";
          break;
        default:
          return "";
      }
    },
    getSelectedPlanningName() {
      //текущий выбранный корпус со склонением
      switch (this.$store.state.selectedZone.selectedRoomlayout) {
        case 0:
          return "1 перегородка с кухней";
          break;
        case 1:
          return "1 перегородка";
          break;
        case 2:
          return "2 перегородки с кухней";
          break;
        case 3:
          return "2 перегородки";
          break;
        case 4:
          return "без перегородки с кухней";
          break;
        case 5:
          return "без перегородки";
          break;
        case 6:
          return "кабинетная с кухней";
          break;
        case 7:
          return "кабинетная";
          break;
        default:
          return "";
      }
    },
    getSelectedOptionsFinishing() {
      function getFloorName(param) {
        if (param == "light") return "cветлый";
        else if (param == "dark") return "темный";
      }
      function getWallName(param) {
        if (param == "paint") return "краска";
        else if (param == "plaster") return "штукатурка";
      }
      function getCeilingName(param) {
        if (param == "grey") return "серый";
        else if (param == "black") return "черный";
        else if (param == "white") return "белый";
      }
      function getLampName(param) {
        if (param == "black") return "черные";
        else if (param == "white") return "белые";
      }
      function getPartitionName(param) {
        if (param == "no") return "не нужны";
        else if (param == "combined") return "Комбинированная";
        else if (param == "glass") return "Стеклянная";
        else if (param == "drywall") return "Гипсокартон";
      }
      function getDoorName(param) {
        if (param == "no") return "не нужны";
        else if (param == "veneer") return "Шпон";
        else if (param == "glass") return "Стекло";
        else if (param == "plastic") return "Пластик";
      }
      let resultText = `Ковролин: ${getFloorName(this.$store.state.selectedOptions.selectingFloor)}
      Стены: ${getWallName(this.$store.state.selectedOptions.selectingWalls)}
      Потолок: ${getCeilingName(this.$store.state.selectedOptions.selectingCeiling)}
      Армстронг: ${this.$store.state.selectedOptions.isSelectingArmstrong ? "да" : "нет"}
      Лампы: ${getLampName(this.$store.state.selectedOptions.selectingLamps)}
      Дополнительное освещение: ${this.$store.state.selectedOptions.isSelectingExtraLight ? "да" : "нет"}
      Перегородки: ${getPartitionName(this.$store.state.selectedOptions.partitionsMaterial)}
      Двери: ${getDoorName(this.$store.state.selectedOptions.selectingDoors)}`;

      return resultText;
    },
    getSelectedExrtraOptions() {
      let resultText = `Интернет: ${this.$store.state.selectedOptions.additionalOption_internet ? "да" : "нет"}
      Телефония: ${this.$store.state.selectedOptions.additionalOption_phone ? "да" : "нет"}
      Дополнительное локальное освещение: ${this.$store.state.selectedOptions.additionalOption_additionalLocalLighting ? "да" : "нет"}
      СКУД: ${this.$store.state.selectedOptions.additionalOption_PACS ? "да" : "нет"}
      Система видеонаблюдения: ${this.$store.state.selectedOptions.additionalOption_CCTV ? "да" : "нет"}
      Кухня: ${this.$store.state.selectedOptions.additionalOption_kitchen ? "да" : "нет"}
      Разработка дизайн-проекта офисного помещения по запросам и пожеланиям арендаторов: ${
        this.$store.state.selectedOptions.additionalOption_designProject ? "да" : "нет"
      }
      Устройство электроснабжения согласно плану рассадки: ${this.$store.state.selectedOptions.additionalOption_powerSupply ? "да" : "нет"}`;
      return resultText;
    },
  },
  methods: {
    makePdf() {
      pdfMake.createPdf(this.docInfo).download("Офис в бц Морская столица.pdf");
    },
    submit() {
      //валидация полей
      this.$refs.formNameEl.checkHtml5Validity();
      this.$refs.formEmailEl.checkHtml5Validity()
      this.$refs.formPhoneEl.checkHtml5Validity()
      this.$refs.formMessageEl.checkHtml5Validity()
      if (!this.$refs.formNameEl.checkHtml5Validity()) return;
      //проверим что заполнено хотя бы одно поле контактов, почта или телефон
      if (this.formEmail ==="" || this.formPhone ==="") return;

      //начитаем отправку
      this.isRequestLoading = true;
      let pdfDocInfo = this.docInfo; //сохраним в переменную для передачи внутри промиса
      let _this = this;
      let formData = new FormData();
      formData.append("name", this.formName);
      formData.append("email", this.formEmail);
      formData.append("phone", this.formPhone);
      formData.append("message", this.formMessage);

      grecaptcha.ready(()=> {
        // по готовности скриптов recaptcha
        grecaptcha
          .execute("6LeN7TYdAAAAAG5Yyk38rwBW7B0PTtlm0ZbsrjRL", {
            action: "wizardForm", // этот параметр не имеет значения
          })
          .then( token => {
            formData.append("wizard_recaptcha_response", token);
            pdfMake.createPdf(pdfDocInfo).getBlob( data => {
              formData.append("pdf", data);
              this.formName = "";
              this.formEmail = "";
              this.formPhone = "";
              this.formMessage = "";
              fetch("php/wizard-mailer.php", {
                method: "POST",
                body: formData,
              })
              .then( response => {
                if (response.ok) {
                  return response.json();
                }
                return Promise.reject(response);
              })
              .then( data => {
                if (data.result == "success") {
                  this.isRequestLoading = false;
                  //сообщение об успешной отправке
                  this.showSnackbar(`${data.status}. В ближайшее время наш менеджер перезвонит вам.`);
                } else {
                  this.isRequestLoading = false;
                  //сообщение об ошибке отправки с сервера
                  this.showSnackbar(`${data.status}. Но вы можете написать на нашу почту info@morskayastolica.ru напрямую или позвонить по телефону +7(812)337-55-89`)
                }
              })
              .catch( error => {
                this.isRequestLoading = false;
                //сообщение об ошибке отправки на сервер
                this.showSnackbar(`Проблемы с интернет-соединением, отправка сообщения не удалась, но можете позвонить нам по телефону +7(812)337-55-89`)  
                console.warn(error);
              });
            });
          });
      });
    },
    showSnackbar(msg) {
      this.$buefy.snackbar.open({
        indefinite: true,
        message: msg
      });
    },
  },
};
</script>

<style scoped>
#requsetForm input {
  font-size: 22px;
}

#requsetForm input,
#requsetForm label {
  margin-bottom: 2rem;
}

.my-ctaButton {
  margin-left: auto;
  display: flex;
  height: 40px;
}

@media (max-width: 1024px) {
  .my-ctaButton {
    margin: auto;
  }
}

.my-ctaButton > span {
  margin: auto;
}

.my-textarea >>> textarea {
  height: 11.2em;
}

.my-field {
  margin-bottom: 0 !important;
  min-height: 4.35rem;
}
</style>
