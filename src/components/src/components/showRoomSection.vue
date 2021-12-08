<template>
  <section class="hero is-fullheight" data-anchor="show-room" id="show-room">
    <div class="my-col-width">
      <h2 class="my-sectionHeader">Шоу-рум</h2>
    </div>
    <div class="my-col-fullwidth">
      <div class="my-carousel-wrapper">
        <div class="my-side-header-block">
          <h3 class="my-side-header-block_text">Шоу-рум</h3>
        </div>
        <b-carousel-list
          v-model="activeSliderIndex"
          :data="items"
          :arrow="false"
          :arrow-hover="false"
          :items-to-show="slideToShowCount"
          :items-to-list="1"
          :repeat="false"
          :has-drag="true"
        >
          <template #item="list">
            <div class="my-carousel-img-wapper" @click="openImageInModal(list.index)">
              <img class="my-carousel-img" :src="list.image" />
              <caption class="my-carousel-img_caption">
                {{
                  list.title
                }}
              </caption>
              <button class="my-carousel-img_modal-link"></button>
            </div>
          </template>
        </b-carousel-list>

        <div class="my-carousel-arrow my-carousel-arrow_back" :class="{ active: activeSliderIndex > 0 }" @click="decrementImageIndex('activeSlider')">
          Назад
        </div>

        <div
          class="my-carousel-arrow my-carousel-arrow_forvard"
          :class="{ active: activeSliderIndex < items.length - 3 }"
          @click="incrementImageIndex('activeSlider')"
        >
          Вперёд
        </div>
      </div>
      <!-- items-to-list на сколько сладов перематывать стрелками -->
      <!-- arrow Отображать действие "следующий" или "предыдущий", когда первый или последний элемент -->
      <!--  v-model="values" //если надо перематываать на определённый по номеру слайд -->
      <!-- has-drag  перетаскивать мышью если не обнаружен тач -->
      <!-- has-grayscale затемнять неактивные слайды -->
      <!-- has-opacity делать прозрачными неактивные слайды-->
    </div>
    <b-modal v-model="isImageModalActive" @close="closeImageModal">
      <p class="image is-4by3">
        <img :src="`${systemPath}img/show-room-carousel/${inModalImageIndex}.jpg`" />
      </p>

      <div class="my-modal-arrow my-modal-arrow_back" :class="{ active: inModalImageIndex > 0 }" @click="decrementImageIndex('modalSlider')"></div>
      <div
        class="my-modal-arrow my-modal-arrow_forward"
        :class="{ active: inModalImageIndex < items.length - 1 }"
        @click="incrementImageIndex('modalSlider')"
      ></div>
    </b-modal>
  </section>
</template>

<script>
export default {
  name: "showRoomSection",
  data() {
    return {
      isImageModalActive: false,
      activeSliderIndex: 0,
      inModalImageIndex: 0,
      systemPath: process.env.BASE_URL,
      items: [
        {
          title: "Смелое архитектурное решение",
          image: "img/show-room-carousel/0.jpg",
        },
        {
          title: "Дизайнерский интерьер",
          image: "img/show-room-carousel/1.jpg",
        },
        {
          title: "Ландшафт украшает пространство вокруг здания",
          image: "img/show-room-carousel/2.jpg",
        },
        {
          title: "Cтеклянные лифты создадут атмосферу роскоши",
          image: "img/show-room-carousel/3.jpg",
        },
        {
          title: "Место, куда захочется возвращаться каждый день",
          image: "img/show-room-carousel/4.jpg",
        },
        {
          title: "Собственный дизайн-проект",
          image: "img/show-room-carousel/5.jpg",
        },
        {
          title: "Функциональные планировки",
          image: "img/show-room-carousel/6.jpg",
        },
        {
          title: "Панорамные окна позволяют чувствовать себя не в четырёх стенах",
          image: "img/show-room-carousel/7.jpg",
        },
      ],
    };
  },
  computed: {
    slideToShowCount: function () {
      if (window.matchMedia("(min-width: 800px)").matches) {
        /* the viewport is at least 400 pixels wide */
        return 3;
      } else {
        /* the viewport is less than 400 pixels wide */
        return 1;
      }
    },
  },
  methods: {
    openImageInModal: function (index) {
      this.inModalImageIndex = index;
      this.isImageModalActive = true;
      this.$root.$options.pagesLib.scrolling = true;
    },
    closeImageModal: function () {
      this.$root.$options.pagesLib.scrolling = false;
    },
    incrementImageIndex(sliderName) {
      if (sliderName == "activeSlider" && this.activeSliderIndex < this.items.length) {
        this.activeSliderIndex++;
      } else if (sliderName == "modalSlider" && this.inModalImageIndex < this.items.length - 1) this.inModalImageIndex++;
    },
    decrementImageIndex(sliderName) {
      if (sliderName == "activeSlider" && this.activeSliderIndex > 0) {
        this.activeSliderIndex--;
      } else if (sliderName == "modalSlider" && this.inModalImageIndex > 0) this.inModalImageIndex--;
    },
  },
};
</script>

<style scoped>
.my-carousel-wrapper {
  --slider-height: calc(100vh - 250px);
  position: relative;
  display: flex;
}

.my-carousel-img {
  height: var(--slider-height);
  object-fit: cover;
  transition: transform 8s linear;
}

.my-carousel-arrow {
  position: absolute;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1.5rem;
  letter-spacing: 0.1rem;
  cursor: default;
  opacity: 0;
  transition: opacity 0.2s;
}

.my-carousel-arrow.active {
  cursor: pointer;
  opacity: 1;
}

.my-carousel-arrow::selection {
  background-color: transparent;
}

.my-carousel-arrow_forvard {
  top: 50%;
  right: 5rem;
}

.my-carousel-arrow::after {
  content: "";
  background-position: center;
  background-repeat: no-repeat;
  background-color: transparent;
  background-size: contain;
  display: inline-block;
  width: 2rem;
  height: 1.5rem;
  margin: 0.25rem 1rem;
}

.my-carousel-arrow_forvard::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='100%' height='100%' viewBox='0 0 82 66'%3E%3Cpath d='M4 37h62L45 58a4 4 0 1 0 6 6l31-31L51 2a4 4 0 0 0-6 6l21 21H4a4 4 0 1 0 0 8Z'/%3E%3C/svg%3E");
  float: right;
}

.my-carousel-arrow_back::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23fff' width='100%' height='100%' viewBox='0 0 82 66'%3E%3Cpath d='M78 29H16L37 8a4 4 0 1 0-6-6L0 33l31 31a4 4 0 1 0 6-6L16 37h62a4 4 0 1 0 0-8Z'/%3E%3C/svg%3E%0A");
  float: left;
}

.my-carousel-arrow_back {
  top: 50%;
  left: 15rem;
}

@media (max-width: 1220px) {
  .my-carousel-arrow {
    display: none;
  }
}


.my-carousel-img-wapper {
  position: relative;
  height: var(--slider-height);
  overflow: hidden;
}

/*затемнение для not hover картинок*/
.my-carousel-img-wapper::after {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: #111;
  opacity: 0.7;
  transition: opacity 0.5s;
}
/*снимаем затемнение при hover*/
.my-carousel-img-wapper:hover::after {
  opacity: 0;
  transition: opacity 0.5s;
}
/*зум эффект при hover*/
.my-carousel-img-wapper:hover .my-carousel-img {
  transform: scale(1.4);
}

.my-carousel-img-wapper:hover .my-carousel-img_modal-link {
  opacity: 1;
  transform: scale(1);
}

/**/
.my-carousel-img_caption {
  position: absolute;
  top: 3rem;
  left: 3rem;
  font-weight: 400;
  font-size: 1.56rem;
  line-height: 1.45;
  letter-spacing: 0.07rem;
  color: #fff;
  text-transform: uppercase;
  z-index: 1;
  text-align: left;
}

.my-side-header-block {
  display: block;
  width: 10rem;
  background-color: #f5f5f5;
  display: flex;
  align-items: flex-end;
}

@media (max-width: 1220px) {
  .my-side-header-block_text {
    width: 6rem;
  }
}

@media (max-width: 1024px) {
  .my-side-header-block {
    display: none;
  }
}

.my-side-header-block_text {
  transform: rotate(270deg);
  transform-origin: left top;
  margin: -8rem 0;
  font-size: 80px;
  text-transform: uppercase;
  display: inline-block;
  white-space: nowrap;
  z-index: 10;
  color: rgb(17 17 17 / 15%);
  line-height: 10rem;
}

@media (max-width: 1220px) {
  .my-side-header-block_text {
    font-size: 65px;
    margin: -8rem 0;
    line-height: 9rem;
  }
}

.my-carousel-img_modal-link {
  position: absolute;
  left: calc(50% - 4.5rem);
  top: calc(50% - 4.5rem);
  appearance: none;
  width: 9rem;
  height: 9rem;
  border: none;
  outline: none;
  box-shadow: none;
  z-index: 1;
  border-radius: 50%;
  background-color: #447be0;
  background-image: url(../assets/landing-img/zoom.png);
  background-size: 2.625rem;
  background-repeat: no-repeat;
  background-position: center;
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.7s;
}

.my-modal-arrow {
  width: 2rem;
  height: 2rem;
  mask-repeat: no-repeat;
  mask-position: center;
  background-color: transparent;
  position: fixed;
  top: 50vh;
  cursor: pointer;
}

.my-modal-arrow.active {
  background-color: white;
}

.my-modal-arrow_back {
  --svg-back: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 461 532'%3E%3Cpath d='M460 531 1 266 460 1v530Z'/%3E%3C/svg%3E%0A");
  -webkit-mask-image: var(--svg-back);
  mask-image: var(--svg-back);
  left: 2rem;
}

.my-modal-arrow_forward {
  --svg-forvard: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 461 532'%3E%3Cpath d='m1 1 459 265L1 531V1Z'/%3E%3C/svg%3E%0A");
  -webkit-mask-image: var(--svg-forvard);
  mask-image: var(--svg-forvard);
  right: 2rem;
}
</style>