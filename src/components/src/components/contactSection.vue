<template>
  <section class="hero is-fullheight my-custom-bg" data-anchor="contacts" id="contacts">
    <div class="my-col-width">
      <h2 class="my-sectionHeader">Контакты</h2>
      <div class="columns">
        <div class="column">
          <div class="my-contact-text">
            <p class="my-regular-text">
              <span class="has-text-weight-bold">Адрес:</span> Невский район, ул. Зольная, участок 2 метро Ладожская, Новочеркасская
            </p>
            <p class="my-regular-text"><span class="has-text-weight-bold">Телефон:</span> +7<span class="my-primary-color">(812)</span>337-55-89</p>
            <p class="my-regular-text">
              <span class="has-text-weight-bold">E-mail:</span> <span class="my-primary-color is-underlined">info@morskayastolica.ru</span>
            </p>
          </div>
        </div>
        <div class="column">
          <form>
            <b-field class="my-field">
              <b-input class="my-input" placeholder="Ваше имя" type="text" required v-model="contactForm_name" ref="contactForm_nameEl"></b-input>
            </b-field>
            <b-field class="my-field">
              <b-input class="my-input" placeholder="Ваш телефон" type="text" required v-model="contactForm_phone" ref="contactForm_phoneEl"></b-input>
            </b-field>
            <p style="font-size: 10px; color: gray">
              This site is protected by reCAPTCHA and the Google <a href="https://policies.google.com/privacy">Privacy Policy</a>and
              <a href="https://policies.google.com/terms">Terms of Service</a> apply.
            </p>
            <b-field class="my-checkbox-with-btn">
              <!-- <b-checkbox required class="mt-1 my-politics-agreement is-align-items-flex-start"
                >Согласие на обработку персональных данных в соответствии с политикой конфиденциальности.</b-checkbox
              > -->
              <button @click.prevent="contactForm_submit" class="my-ctaButton mr-5" :class="{ button: isRequestLoading, 'is-loading': isRequestLoading }">
                Заказать звонок
              </button>
            </b-field>
          </form>
        </div>
      </div>
    </div>
    <div>
      <img src="../assets/landing-img/map.png" />
    </div>
  </section>
</template>

<script>
export default {
  name: "contactSection",
  data() {
    return {
      contactForm_name: null,
      contactForm_phone: null,
      isRequestLoading: false,
    };
  },
  methods: {
    contactForm_submit() {
      //валидация
      if (!this.$refs.contactForm_nameEl.checkHtml5Validity() || !this.$refs.contactForm_phoneEl.checkHtml5Validity()) return;

      //начинаем отправку
      this.isRequestLoading = true;
      let contactForm_formData = new FormData();
      let _this = this;
      contactForm_formData.append("name", this.contactForm_name);
      contactForm_formData.append("phone", this.contactForm_phone);

      grecaptcha.ready(() => {
        // по готовности скриптов recaptcha
        //console.log(this);
        grecaptcha
          .execute("6LeN7TYdAAAAAG5Yyk38rwBW7B0PTtlm0ZbsrjRL", {
            action: "contactForm", // этот параметр не имеет значения
          })
          .then((token) => {
            contactForm_formData.append("recaptcha_response", token);
            this.contactForm_name = "";
            this.contactForm_phone = "";
            fetch("php/contact-mailer.php", {
              method: "POST",
              body: contactForm_formData,
            })
              .then((response) => {
                if (response.ok) {
                  return response.json();
                }
                return Promise.reject(response);
              })
              .then((data) => {
                if (data.result == "success") {
                  //сообщение об успешной отправке
                  this.isRequestLoading = false;
                  this.showSnackbar(`${data.status} В ближайшее время наш менеджер перезвонит вам.`);
                } else {
                  this.isRequestLoading = false;
                  //сообщение об ошибке отправки с сервера
                  this.showSnackbar(`${data.status} Но вы можете написать на нашу почту info@morskayastolica.ru напрямую или позвонить по телефону +7(812)337-55-89`);
                }
              })
              .catch((error) => {
                this.isRequestLoading = false;
                //сообщение об ошибке отправки на сервер
                this.showSnackbar(`Проблемы с интернет-соединением, отправка сообщения не удалась, но можете позвонить нам по телефону +7(812)337-55-89`);
                console.warn(error);
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
.my-col-width {
  margin-top: auto;
  margin-bottom: auto;
}

.my-contact-text > p {
  margin: 1rem 0;
}

.my-custom-bg {
  background-image: url(../assets/landing-img/contacts_bg.png);
  background-size: 150% auto;
  background-position: top center;
  background-repeat: repeat;
}

.my-checkbox-with-btn >>> .field.has-addons {
  flex-wrap: wrap;
}

.my-field {
  margin-bottom: 0 !important;
  min-height: 4.35rem;
}

.my-checkbox-with-btn {
  margin-top: 0.5rem;
}
</style>