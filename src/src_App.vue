<template>
  <div id="app">
    <b-navbar shadow class="fixed-navbar" ref="navbar">
      <template #brand>
        <b-navbar-item href="/">
          <img src="img/logo-with-text.svg" />
        </b-navbar-item>
      </template>
      <template #end>
        <b-navbar-item
          v-for="item in menuItemsList"
          :key="item.href"
          :href="item.href"
          :class="{ 'is-active': item.isActive }"
          @click="updateNavigationOnClick($event)"
        >
          {{ item.label }}
        </b-navbar-item>
        <b-navbar-item href="tel:+78002505305">8-800-250-53-05</b-navbar-item>
      </template>
    </b-navbar>

    <div id="container" class="container" ref="container">
      <first-screen-section />
      <show-room-section />
      <!-- <wizard-section /> -->
      <stepsSection />
      <video-section />
      <contact-section />
    </div>

    <sticky-cta v-show="!menuItemsList[2].isActive" />
  </div>
</template>

<script>
import Pageable from "pageable"; //библиотека для полноэкранного скрола https://github.com/Mobius1/Pageable;
import stickyCta from "./components/stickyCta.vue";
import firstScreenSection from "./components/firstScreenSection.vue";
import showRoomSection from "./components/showRoomSection.vue";
// import wizardSection from "./components/wizardSection.vue"
import stepsSection from "./components/stepsSection.vue";
import videoSection from "./components/videoSection.vue";
import contactSection from "./components/contactSection.vue";

export default {
  name: "App",
  components: {
    stickyCta,
    firstScreenSection,
    showRoomSection,
    videoSection,
    contactSection,
    // wizardSection,
    stepsSection,
  },
  data: function () {
    return {
      pagesLib: null,
      menuItemsList: [
        {
          pageIndex: 0,
          label: "Главная",
          href: "#main",
          isActive: false,
        },
        {
          pageIndex: 1,
          label: "Шоу-рум",
          href: "#show-room",
          isActive: false,
        },
        {
          pageIndex: 2,
          label: "Собери свой офис",
          href: "#assemble-your-office",
          isActive: false,
        },
        {
          pageIndex: 3,
          label: "Видео",
          href: "#video",
          isActive: false,
        },
        {
          pageIndex: 4,
          label: "Контакты",
          href: "#contacts",
          isActive: false,
        },
      ],
    };
  },
  computed: {
    isOverlayModeOn() {
      return this.$store.state.isOverlayModeOn;
    },
  },
  created() {
    if (location.hash == "") {
      //если начинаем с первого экрана все настройки по дефолту
      //стор менять не надо , там уже дефолт на нулевой экран
      //Pageable выставит первый экран по умолчанию тоже
      //сделать активным первый пункт меню тоже не надо , на хуке onFinish уже стоит нужная функция
      //только выставим hash в URL для корректной записи истории
      location.hash = this.menuItemsList[0].href;
    } else {
      //если ссылка уже содержит hash на определённый экран
      //на нужный экран переедем сами по html якорю, Pageable можно не дёргать
      //закинем информацию в стор о том какой экран активен
      this.$store.commit("updateCurrentMenuItemIndex", this.getPageIndexByHash(location.hash));
      //и пункт меню надо сделать активным вручную потому что хуки Pageable не были зайдействованы
      this.updateActiveMenuItem(this.getPageIndexByHash(location.hash));
    }
  },
  mounted() {
    //console.log(process.env)
    if (window.matchMedia("(min-width: 1200px)").matches) {
      // console.log('инициализируем слайдер');
      let linkToVueComp = this;
      this.$root.$options.pagesLib = new Pageable(this.$refs.container, {
        pips: false,
        animation: 500,
        events: {
          wheel: true, // enable / disable mousewheel scrolling
          mouse: false, // enable / disable mouse drag scrolling
          touch: true, // enable / disable touch / swipe scrolling
          keydown: false, // enable / disable keyboard navigation
        },
        onInit: function () {
          //если методы Pageable не будут прокидыватся наружу,
          //можно сохранить экземпляр Pageable в переменную;
          //pagesLib = this;
        },
        onUpdate: function (data) {
          //console.log("onUpdate", data);
          if (linkToVueComp.$store.state.currentMenuItemIndex != data.index) {
            linkToVueComp.$store.commit("updateCurrentMenuItemIndex", data.index);
          }

          //выделяем активный пункт меню
          linkToVueComp.updateActiveMenuItem(data.index);
        },
        onBeforeStart: function (data) {
          //console.log("onBeforeStart", data);
        },
        onStart: function (data) {
          //console.log("onStart", data);
        },
        onScroll: function (data) {
          //console.log("onScroll", data);
        },
        onFinish: function (data) {
          //console.log("onFinish", data.index);

          //закинем информацию в стор о том какой экран активен
          if (linkToVueComp.$store.state.currentMenuItemIndex != data.index) {
            linkToVueComp.$store.commit("updateCurrentMenuItemIndex", data.index);
          }

          //выделяем активный пункт меню
          //функцию updateActiveMenuItem надо дергать и на onUpdate и на onFinish
          //потому что при первой загрузке хуки Pageable не включаются с нужным data.index
          linkToVueComp.updateActiveMenuItem(data.index);
        },
      });
    } else {
      console.log('сладер отключен на мобильных устройствах')
    }

    //после перемещения по истории браузером принудительно запускаем перемотку Pageable до нужного слайда
    //P.S. в хроме все равно не работает, он игнорирует изменения истории, поэтому переписать на vue роутер
    window.addEventListener("popstate", function (e) {
      //console.log('popstate',location.hash,e);
      //console.log('pagesLib',pagesLib);
      //console.log('history.state',history.state);
      //pagesLib.scrollToAnchor(location.hash);
    });

    window.addEventListener("hashchange", function (e) {
      // let newURL = new URL(e.newURL);
      // pagesLib.scrollToAnchor(newURL.hash);
      // pagesLib.scrollToPage(linkToVueComp.getPageIndexByHash(newURL.hash));
      // console.log('scrollToAnchor',newURL.hash);
    });
  },
  methods: {
    updateNavigationOnClick: function (e) {
      //в компонетах b-navbar-item нет методов для хранения/изменения состояний
      //поэтому активный пункт меню храним в data и добавляем классом is-active
      this.menuItemsList.forEach((el) => {
        if (el.isActive) el.isActive = false;
        if (el.href == e.target.getAttribute("href")) el.isActive = true;
      });
    },
    updateActiveMenuItem: function (newItemIndex) {
      //переставим в menuItemsList флаг isActive на нужный пункт меню
      this.menuItemsList.forEach((el) => {
        if (el.isActive) el.isActive = false;
        if (el.pageIndex == newItemIndex) {
          el.isActive = true;
        }
      });
    },
    getPageIndexByHash: function (hash) {
      return this.menuItemsList.findIndex((el) => el.href == hash);
    },
  },
};
</script>

<style scoped>
/* не через  buefy потому что его классы конфликтуют с стилями Pageable */
.fixed-navbar {
  position: absolute;
  width: 100%;
}

@media (max-width: 1200px) {
  .container {
    max-width: 100vw;
  }
}
</style>
