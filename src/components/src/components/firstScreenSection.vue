<template>
  <section class="hero is-fullheight my-custom-bg" data-anchor="main" id="main">
    <div class="hero-body">
      <div class="columns my-col-width">
        <div class="column is-6-desktop">
          <h1>
            <strong class="my-title">Мы создаём и воплощаем в реальность</strong>
            <strong class="my-subTitle">Комфортная среда обитания и ощущение успешной жизни для каждого сотрудника Вашей компании</strong>
          </h1>
          <a href="#assemble-your-office" class="my-ctaLink mt-5" @click="$store.commit('updateCurrentStep',1)">Собери офис</a>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: "firstScreenSection",
};
</script>

<style scoped>
.my-custom-bg {
  background-image: url(../assets/landing-img/firstScreenSlider.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: top 80px center;
}

.my-title {
  font-family: "Oswald", system-ui, sans-serif;
  font-weight: 400;
  font-size: 76px;
  line-height: 86px;
  display: inline-block;
  letter-spacing: initial;
  text-transform: uppercase;
  color: #000;
}

@media (max-width: 1220px) {
  .my-title {
    font-size: 48px;
    line-height: 54px;
  }
}

@media (max-width: 800px) {
  .my-title {
    font-size: 30px;
    line-height: 34px;
  }
}

.my-subTitle {
  font-family: "Montserrat", system-ui, sans-serif;;
  font-size: 22px;
  line-height: 27px;
  font-weight: normal;
  color: #000;
}

@media (max-width: 1220px) {
  .my-subTitle {
    font-size: 18px;
    line-height: 27px;
  }
}

@media (max-width: 800px) {
  .my-subTitle {
    font-size: 18px;
    line-height: 27px;
  }
}

.my-subTitle::before {
  content: "";
  display: block;
  width: 70px;
  height: 4px;
  background-color: rgb(68, 123, 224);
  margin: 2.5rem 0 1rem 0;
}
</style>