<template>
  <div class="my-col-width my-col-vcenter">
    <h2 class="title">Выберите дополнительные опции</h2>

    <div class="columns is-desktop">
      <div class="column image-column">
        <!-- TODO: добавить лоадер для картинок -->
        <div class="my-img-wrapper" ref="content">
          <!-- фон -->
          <img src="../../assets/wizard/constructor/background.jpg" class="my-img-item" />

          <!-- ковролин, по умолчанию светлый -->
          <img src="../../assets/wizard/constructor/floor__dark.png" class="my-img-item" v-show="selectingFloor === 'dark'" />

          <!-- потолок -->
          <img src="../../assets/wizard/constructor/сeiling__black.png" class="my-img-item" v-show="selectingCeiling === 'black'" />
          <img src="../../assets/wizard/constructor/ceiling__white.png" class="my-img-item" v-show="selectingCeiling === 'white'" />

          <!-- дополнительные опции устройство электроснабжения -->
          <img src="../../assets/wizard/constructor/additionalOption_powerSupply.png" class="my-img-item" v-show="additionalOption_powerSupply == true" />

          <!-- стены -->
          <img src="../../assets/wizard/constructor/walls__paint.png" class="my-img-item" v-show="selectingWalls === 'paint'" />
          <img src="../../assets/wizard/constructor/walls__plaster.png" class="my-img-item" v-show="selectingWalls === 'plaster'" />

          <!-- лампы задний план -->
          <img src="../../assets/wizard/constructor/lamps__grey--back.png" class="my-img-item" v-show="selectingLamps === 'grey'" />
          <img
            src="../../assets/wizard/constructor/lamps__grey--back--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'grey' && isSelectingExtraLight" />

          <img src="../../assets/wizard/constructor/lamps__white--back.png" class="my-img-item" v-show="selectingLamps === 'white'" />
          <img
            src="../../assets/wizard/constructor/lamps__white--back--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'white' && isSelectingExtraLight" />

          <img src="../../assets/wizard/constructor/lamps__black--back.png" class="my-img-item" v-show="selectingLamps === 'black'" />
          <img
            src="../../assets/wizard/constructor/lamps__black--back--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'black' && isSelectingExtraLight" />

          <!-- армстронг back -->
          <img src="../../assets/wizard/constructor/isArmstrong--back.png" class="my-img-item" v-show="isSelectingArmstrong === true" />

          <!-- перегородки -->
          <img src="../../assets/wizard/constructor/partitionsMaterial__combined.png" class="my-img-item" v-show="partitionsMaterial === 'combined'" />
          <img src="../../assets/wizard/constructor/partitionsMaterial__glass.png" class="my-img-item" v-show="partitionsMaterial === 'glass'" />
          <img src="../../assets/wizard/constructor/partitionsMaterial__drywall.png" class="my-img-item" v-show="partitionsMaterial === 'drywall'" />
          <img
            src="../../assets/wizard/constructor/partitionsMaterial__drywall--plaster.png"
            class="my-img-item"
            v-show="partitionsMaterial === 'drywall' && selectingWalls === 'plaster'" />

          <!-- лампы передний план -->
          <img src="../../assets/wizard/constructor/lamps__grey--front.png" class="my-img-item" v-show="selectingLamps === 'grey'" />
          <img
            src="../../assets/wizard/constructor/lamps__grey--front--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'grey' && isSelectingExtraLight" />

          <img src="../../assets/wizard/constructor/lamps__white--front.png" class="my-img-item" v-show="selectingLamps === 'white'" />
          <img
            src="../../assets/wizard/constructor/lamps__white--front--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'white' && isSelectingExtraLight" />

          <img src="../../assets/wizard/constructor/lamps__black--front.png" class="my-img-item" v-show="selectingLamps === 'black'" />
          <img
            src="../../assets/wizard/constructor/lamps__black--front--extra.png"
            class="my-img-item"
            v-show="selectingLamps === 'black' && isSelectingExtraLight" />

          <!-- армстронг front -->
          <img src="../../assets/wizard/constructor/isArmstrong--front.png" class="my-img-item" v-show="isSelectingArmstrong === true" />

          <!-- двери -->
          <img src="../../assets/wizard/constructor/door__veneer.png" class="my-img-item" v-show="selectingDoors === 'veneer'" />
          <img
            src="../../assets/wizard/constructor/door__veneer--partition.png"
            class="my-img-item"
            v-show="selectingDoors === 'veneer' && partitionsMaterial != 'no'" />
          <img src="../../assets/wizard/constructor/door__glass.png" class="my-img-item" v-show="selectingDoors === 'glass'" />
          <img
            src="../../assets/wizard/constructor/door__glass--partition.png"
            class="my-img-item"
            v-show="selectingDoors === 'glass' && partitionsMaterial != 'no'" />
          <img src="../../assets/wizard/constructor/door__plastic.png" class="my-img-item" v-show="selectingDoors === 'plastic'" />
          <img
            src="../../assets/wizard/constructor/door__plastic--partition.png"
            class="my-img-item"
            v-show="selectingDoors === 'plastic' && partitionsMaterial != 'no'" />

          <!-- дополнительные опции интернет -->
          <img src="../../assets/wizard/constructor/additionalOption_internet.png" class="my-img-item" v-show="additionalOption_internet == true" />

          <!-- дополнительные опции телефоны -->
          <img src="../../assets/wizard/constructor/additionalOption_phone--front.png" class="my-img-item" v-show="additionalOption_phone == true" />
          <img
            src="../../assets/wizard/constructor/additionalOption_phone--back.png"
            class="my-img-item"
            v-show="additionalOption_phone == true && partitionsMaterial === 'no'" />

          <!-- дополнительные опции дополнительное локальное освещение -->
          <img
            src="../../assets/wizard/constructor/additionalOption_additionalLocalLighting--front.png"
            class="my-img-item"
            v-show="additionalOption_additionalLocalLighting == true" />
          <img
            src="../../assets/wizard/constructor/additionalOption_additionalLocalLighting--back.png"
            class="my-img-item"
            v-show="additionalOption_additionalLocalLighting == true && partitionsMaterial === 'no'" />

          <!-- дополнительные опции видеонаблюдение -->
          <img src="../../assets/wizard/constructor/additionalOption_CCTV.png" class="my-img-item" v-show="additionalOption_CCTV == true" />

          <!-- дополнительные опции люстра -->
          <!-- <img src="../../assets/wizard/constructor/chandelier.png" class="my-img-item" v-show="additionalOption_chandelier === true" /> -->

          <!-- <div class="ping dot1"></div> -->
        </div>
      </div>
      <div class="column controls-column">
        <div class="tooltop-wrapper">
          <!-- <b-button v-if="$store.getters.currentFloor <= 12" label="?" class="help-icon" @mouseover="isTooltipActive = true" @mouseleave="isTooltipActive = false" /> -->
          <!-- <b-notification class="help-tooltip" :closable="false" v-model="isTooltipActive">
            Базовая отделка включает в себя ковролин,<br />
            отделку стен и окрашивание потолка.
          </b-notification> -->

          <p class="prompt" v-if="floorHaveBaseLayout() && checkIfDesktop()">В этом помещении уже есть базовая отделка</p>
          <b-tooltip
            v-if="floorHaveBaseLayout() && checkIfDesktop()"
            label="Базовая отделка включает в себя ковролин, отделку стен и окрашивание потолка."
            position="is-bottom"
            :animated="false">            
            <b-button v-if="floorHaveBaseLayout() && checkIfDesktop()" label="?" class="help-icon" />
          </b-tooltip>
        </div>
        <b-collapse class="card" animation="slide" :open="openedPanelIndex == 0" @open="openedPanelIndex = 0">
          <template #trigger="props">
            <div class="card-header" role="button">
              <p class="card-header-title">1. Отделка</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
              </a>
            </div>
          </template>
          <div class="card-content">
            <div class="content">
              <b-field label="Ковролин" class="my-hor-layout">
                <b-select v-model="selectingFloor">
                  <option value="light">Светлый</option>
                  <option value="dark">Темный</option>
                </b-select>
              </b-field>

              <b-field label="Стены" class="my-hor-layout">
                <b-select v-model="selectingWalls">
                  <option value="paint">Краска</option>
                  <option value="plaster">Штукатурка</option>
                </b-select>
              </b-field>

              <b-field label="Потолок" class="my-hor-layout">
                <b-select v-model="selectingCeiling">
                  <option value="grey">Серый</option>
                  <option value="black">Черный</option>
                  <option value="white">Белый</option>
                </b-select>
              </b-field>

              <b-field label="Армстронг" class="my-hor-layout">
                <b-checkbox v-model="isSelectingArmstrong"></b-checkbox>
              </b-field>

              <b-field label="Лампы" class="my-hor-layout">
                <b-select v-model="selectingLamps">
                  <!-- <option value="grey">Серые</option> -->
                  <!-- TODO: для серых ламп не достаточно слоев -->
                  <option value="black">Черные</option>
                  <option value="white">Белые</option>
                </b-select>
              </b-field>

              <b-field label="Дополнительное освещение" class="my-hor-layout">
                <b-checkbox v-model="isSelectingExtraLight"></b-checkbox>
              </b-field>

              <b-field label="Перегородки" class="my-hor-layout">
                <b-select v-model="partitionsMaterial">
                  <option value="no">не нужны</option>
                  <option value="combined" v-if="selectingWalls === 'paint'">Комбинированная</option>
                  <option value="glass">Стеклянная</option>
                  <option value="drywall">Гипсокартон</option>
                </b-select>
              </b-field>

              <b-field label="Двери" class="my-hor-layout">
                <b-select v-model="selectingDoors">
                  <option value="no">не нужны</option>
                  <option value="veneer">Шпон</option>
                  <option value="glass">Стекло</option>
                  <option value="plastic">Пластик</option>
                </b-select>
              </b-field>
            </div>
          </div>
        </b-collapse>
        <b-collapse class="card" animation="slide" :open="openedPanelIndex == 1" @open="openedPanelIndex = 1">
          <template #trigger="props">
            <div class="card-header" role="button">
              <p class="card-header-title">2. Дополнительные опции</p>
              <a class="card-header-icon">
                <b-icon :icon="props.open ? 'menu-down' : 'menu-up'"> </b-icon>
              </a>
            </div>
          </template>
          <div class="card-content">
            <div class="content">
              <b-field>
                <b-checkbox v-model="additionalOption_internet">Интернет</b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_phone">Телефония</b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_additionalLocalLighting">Дополнительное локальное освещение</b-checkbox>
              </b-field>
              <!-- <b-field>
                <b-checkbox v-model="additionalOption_chandelier">Люстра</b-checkbox>
              </b-field> -->
              <b-field>
                <b-checkbox v-model="additionalOption_PACS">СКУД</b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_CCTV">Система видеонаблюдения</b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_kitchen">Кухня</b-checkbox>
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_designProject"
                  >Разработка дизайн-проекта офисного помещения по запросам и пожеланиям арендаторов</b-checkbox
                >
              </b-field>
              <b-field>
                <b-checkbox v-model="additionalOption_powerSupply">Устройство электроснабжения согласно плану рассадки</b-checkbox>
              </b-field>
              <!-- <b-field>
                <b-checkbox v-model="additionalOption_lightingConversion">Переустройство освещения согласно плану рассадки</b-checkbox>
              </b-field> -->
            </div>
          </div>
        </b-collapse>
      </div>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "selectOptions",
  data() {
    return {
      windowWidth: window.innerWidth,
      activeMobileTab: 0,
      openedPanelIndex: 0,
      selectingFloor: "light",
      selectingWalls: "paint",
      selectingCeiling: "grey",
      isSelectingArmstrong: false,
      selectingLamps: "white",
      isSelectingExtraLight: false,
      partitionsMaterial: "no",
      selectingDoors: "no",
      additionalOption_internet: false,
      additionalOption_phone: false,
      additionalOption_additionalLocalLighting: false,
      additionalOption_PACS: false,
      additionalOption_CCTV: false,
      additionalOption_kitchen: false,
      additionalOption_designProject: false,
      additionalOption_powerSupply: false,
      additionalOption_lightingConversion: false,
      additionalOption_chandelier: false,
      isTooltipActive: false,
    };
  },
  computed: {
    selectedRoomLayout() {
      if (this.$store.state.selectedZone.selectedRoomlayout) return this.$store.state.selectedZone.selectedRoomlayout;
      else return 5;
    },
  },
  watch: {
    //если выбрали штукатурку и комбинирвоанную перегородку, то перегородка становится гипсокартоновой
    selectingWalls(newValue) {
      if (newValue === "plaster" && this.partitionsMaterial === "combined") {
        this.partitionsMaterial = "drywall";
      }
    },
    // partitionsMaterial(newValue) {
    //   if (newValue === "combined" && selectingWalls === "plaster") {
    //     selectingWalls = "paint";
    //   }
    // },
  },
  methods: {
    selectPartitionsMaterialFromPrevStep(ifSelectPartition) {
      this.partitionsMaterial = ifSelectPartition ? "glass" : "no";
    },
    sendSelectedOptionsToStore() {
      this.$store.commit("updateSelectedOptions", {
        selectingFloor: this.selectingFloor,
        selectingWalls: this.selectingWalls,
        selectingCeiling: this.selectingCeiling,
        isSelectingArmstrong: this.isSelectingArmstrong,
        selectingLamps: this.selectingLamps,
        isSelectingExtraLight: this.isSelectingExtraLight,
        partitionsMaterial: this.partitionsMaterial,
        selectingDoors: this.selectingDoors,
        additionalOption_internet: this.additionalOption_internet,
        additionalOption_phone: this.additionalOption_phone,
        additionalOption_additionalLocalLighting: this.additionalOption_additionalLocalLighting,
        additionalOption_PACS: this.additionalOption_PACS,
        additionalOption_CCTV: this.additionalOption_CCTV,
        additionalOption_kitchen: this.additionalOption_kitchen,
        additionalOption_designProject: this.additionalOption_designProject,
        additionalOption_powerSupply: this.additionalOption_powerSupply,
        additionalOption_lightingConversion: this.additionalOption_lightingConversion,
        additionalOption_chandelier: this.additionalOption_chandelier,
      });
      html2canvas(this.$refs.content).then((canvas) => {
        this.$store.commit("updateOptionImage", canvas.toDataURL("image/jpeg", 1.0));
      });
    },
    floorHaveBaseLayout() {
      //проверка что в помещении уже есть базовая отделка
      let currentBuilding = this.$store.state.selectedZone.building;
      let currentFloor = this.$store.getters.currentFloor;
      return currentFloor <= 12 && (currentBuilding == 1 || currentBuilding == 2);
    },
    checkIfDesktop() {
      return window.innerWidth > 1024 ? true : false;
    }
  },
};
</script>

<style scoped>
.my-col-width .title {
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .my-col-width .title {
    margin-bottom: 0rem!important;
  }
}

.help-icon {
  margin: 0 0 0 0.5rem;
  padding: 0.5rem;
  line-height: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  width: 1.5rem;
}

.tooltop-wrapper {
  position: relative;
}

.help-tooltip {
  position: absolute;
  right: 0;
  top: 2rem;
  z-index: 5;
  padding: 0.5rem 1rem;
}

.prompt {
  margin-bottom: 1rem;
  line-height: 24px;
}

@media (max-width: 1024px) {
  .column.image-column {
    position: absolute;
    top: 17rem;
  }

  .column.controls-column {
    position: absolute;
    top: 6rem;
    width: 93vw;
  }
}

.my-img-wrapper {
  position: relative;
  height: 63vh;
  width: 44vw;
}

@media (max-width: 1024px) {
  .my-img-wrapper {
    height: 68vw;
    width: 90vw;
    margin: auto;
    text-align: center;
    max-height: 65vh;
  }
}

.my-img-item {
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.my-hor-layout {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.my-hor-layout >>> label {
  margin-right: 1rem;
}

.mobile-tabs >>> .tabs ul {
  border-bottom-color: #dbdbdb;
  border-bottom-style: solid;
  border-bottom-width: 1px;
}

.card-content .content {
  text-align: left;
}

.dot1 {
  position: absolute;
  top: 10px;
  left: 10px;
}

/*TODO доделать выделение объектов при добавлении нового слоя на картинку*/
/* .ping {
  -webkit-animation: ping 0.8s ease-in-out both;
  animation: ping 0.8s ease-in-out both;
  background: #3e3e3e;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
} */

/* ----------------------------------------------
 * Generated by Animista on 2021-10-22 17:18:57
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info. 
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation ping
 * ----------------------------------------
 */
/* @-webkit-keyframes ping {
  0% {
    -webkit-transform: scale(0.2);
    transform: scale(0.2);
    opacity: 0.8;
  }
  80% {
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(2.2);
    transform: scale(2.2);
    opacity: 0;
  }
}
@keyframes ping {
  0% {
    -webkit-transform: scale(0.2);
    transform: scale(0.2);
    opacity: 0.8;
  }
  80% {
    -webkit-transform: scale(1.2);
    transform: scale(1.2);
    opacity: 0;
  }
  100% {
    -webkit-transform: scale(2.2);
    transform: scale(2.2);
    opacity: 0;
  }
} */
</style>