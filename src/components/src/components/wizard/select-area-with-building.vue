<template>
  <section class="my-col-width select-building-section">
    <h2 class="title">Выберите желаемую площадь офиса</h2>
    <!-- <p class="prompt">на картинке подсвечены доступные для выбора корпуса</p> -->
    <div class="columns is-desktop is-vcentered mt-5">
      <div class="column">
        <!-- tooltip-always -->
        <!-- indicator -->
        <div class="my-slider-wrapper">
          <b-slider
            v-model="areaLimits"
            @change="updateAreaLimits"
            :custom-formatter="(val) => `${val} m2`"
            :min="smallestArea"
            :max="biggestArea"
            :tooltip-always="isShowTooltip"
            class="my-slider"
            lazy>
            <template v-for="val in listOfAllPossibleAreas">
              <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
            </template>
          </b-slider>
          <b-checkbox v-model="thirdBuildingLimits" class="my-area-checkbox">2044</b-checkbox>
          <!-- <div class="help-tooltip" @hover="helpisActive = !helpisActive">?</div>
          <b-notification v-model="helpisActive" class="my-help-tooltip">
          </b-notification> -->
        </div>
      </div>
      <div class="column">
        <b-field class="my-controls">
          <b-radio-button native-value="0" v-model="selectedBuilding" :disabled="!availableBuildindList[0]">
            <span>павильон</span>
          </b-radio-button>

          <b-radio-button native-value="1" v-model="selectedBuilding" :disabled="!availableBuildindList[1]">
            <span>1-я башня</span>
          </b-radio-button>

          <b-radio-button native-value="2" v-model="selectedBuilding" :disabled="!availableBuildindList[2]">
            <span>2-я башня</span>
          </b-radio-button>

          <b-radio-button native-value="3" v-model="selectedBuilding" :disabled="!availableBuildindList[3]">
            <span>14 и 15 этаж</span>
          </b-radio-button>
        </b-field>
      </div>
    </div>
    <svgBuildingSheme ref="buildingSсheme" class="svgWrap" @mouseover="addStrokeOnHover($event)" @mouseout="removeStrokeOnHover" @click="selectBuilding" />
  </section>
</template>

<script>
import svgBuildingSheme from "../../assets/wizard/svg-select-building.svg";

export default {
  name: "selectAreaWithBuilding",
  components: {
    svgBuildingSheme,
  },
  data() {
    return {
      // доступные для выбора здания в итоге решили не перекрашивать , поэтому availableForSelectColor и availableFloorOpacity - прозрачные
      availableForSelectColor:"transparent",
      selectedColor:"#447BE0",
      availableFloorOpacity: "0",
      selectedFloorOpacity: "0.5",
      areaLimits: [this.smallestArea, this.biggestArea],
      isShowTooltip: true, //показывать ли площадь над рукоядками слайдера(скрываем если они сдвигаются слишком близко)
      svgBuildingElsArray: [], //массив узлов svg, которые соотвествуют корпусам здания
      isHintHidden: true,
      //0 - корпус "нос"
      //1 - первая башня
      //2 - втоорая башня
      //3 - 14 и 15 этаж обоих корпусов
    };
  },
  computed: {
    smallestArea() {
      return this.$store.getters.smallestArea;
    },
    biggestArea() {
      return this.$store.getters.biggestArea;
    },
    listOfAllPossibleAreas() {
      let k = window.innerWidth > 769 ? 15 : 60; //k - на сколько разрежать список возможных площадей на мобилках что бы они не налазили друг на друга в слайдере
      return this.defuseArray(this.$store.getters.listOfAllPossibleAreas, k);
    },
    availableBuildindList() {
      return this.$store.state.availableBuildindList;
    },
    thirdBuildingLimits: {
      get() {
        return this.$store.state.selectedZone.thirdBuildingLimits;
      },
      set(value) {
        this.$store.commit("updateThirdBuildingLimits", value);
        //по изменению галочки выбора площади скидываем выбор здания
        if (this.$store.state.selectedZone.areaLimits[0] != this.smallestArea || this.$store.state.selectedZone.areaLimits[1] != this.biggestArea) {
          this.$store.commit("updateSelectedBuilding", null);
        }
      },
    },
    selectedBuilding: {
      /*в сторе хранить только в строковом виде что бы срабатывал watcher для radiobutton */
      get() {
        return this.$store.state.selectedZone.building;
      },
      set(value) {
        this.$store.commit("updateSelectedBuilding", value);
      },
    },
  },
  watch: {
    selectedBuilding(newVal, oldVal) {
      //обновляем svg если значение изменилось другим контролом
      this.svgBuildingElsArray.forEach((el) => {
        if (this.availableBuildindList[el.dataset.buildingNumber]) {
          el.setAttribute("fill", this.availableForSelectColor);
          el.setAttribute("fill-opacity", this.availableFloorOpacity);
        } else {
          el.setAttribute("fill", "transparent");
        }
      });
      
      if (newVal != null) {
        this.svgBuildingElsArray[newVal].setAttribute("fill", this.selectedColor);
        this.svgBuildingElsArray[newVal].setAttribute("fill-opacity", this.selectedFloorOpacity);
      }
       
    },
    availableBuildindList() {
      //по движению бегунка скидываем выделение корпуса
      //скидывать выделение корпуса только в случае если бегунки меняли.
      //в противном случае просто сработал watcher и скиывать не нужно, идёт выстаавление дефолтных значений

      //если хотя бы один из бегунков находится не на дефолтной позиции 
      if (this.$store.state.selectedZone.areaLimits[0] != this.smallestArea || this.$store.state.selectedZone.areaLimits[1] != this.biggestArea) {
        this.$store.commit("updateSelectedBuilding", null);
      };
      this.svgBuildingElsArray.forEach((el) => {
        if (this.availableBuildindList[el.dataset.buildingNumber]) {
          el.setAttribute("fill", this.availableForSelectColor);
          el.setAttribute("fill-opacity", this.availableFloorOpacity);
        } else {
          el.setAttribute("fill", "transparent");
        }
      });
    },
    thirdBuildingLimits(newVal) {
       if (newVal) {
         this.svgBuildingElsArray[3].setAttribute("fill", this.availableForSelectColor);
         this.svgBuildingElsArray[3].setAttribute("fill-opacity", this.availableFloorOpacity);
       }
       else this.svgBuildingElsArray[3].setAttribute("fill", "transparent");
    }
  },
  methods: {
    defuseArray(array, rate) {
      return array
        .sort((a, b) => a - b)
        .map((current, index, array) => {
          if (current - array[index - 1] > rate && current != 2044) return current;
        })
        .filter(Boolean);
    },
    addStrokeOnHover(e) {
      if (e.target.dataset.buildingNumber) {
        this.svgBuildingElsArray.forEach((el) => {
          if (el) el.setAttribute("stroke", "transparent");
        });
        if (this.availableBuildindList[e.target.dataset.buildingNumber]) {
          this.svgBuildingElsArray[e.target.dataset.buildingNumber].setAttribute("stroke", "#1754c5");
        }
      }
    },
    updateAvailableBuildingSelect() {
      this.svgBuildingElsArray.forEach((el) => {
        if (this.availableBuildindList[el.dataset.buildingNumber]) {
          el.setAttribute("fill", this.availableForSelectColor);
          el.setAttribute("fill-opacity", this.availableFloorOpacity);
        }
      });
    },  
    removeStrokeOnHover() {
      this.svgBuildingElsArray.forEach((el) => {
        if (el) el.setAttribute("stroke", "transparent");
      });
    },
    selectBuilding(e) {
      //закрашиваем здание и отправляем информацию в стор
      //старые выделения можно не удлять они удяется в selectedBuilding watcher
      if ("buildingNumber" in e.target.dataset) {
        if (this.availableBuildindList[e.target.dataset.buildingNumber]) {
          this.svgBuildingElsArray[e.target.dataset.buildingNumber].setAttribute("fill", this.selectedColor);
          this.svgBuildingElsArray[e.target.dataset.buildingNumber].setAttribute("fill-opacity", this.selectedFloorOpacity);
          this.$store.commit("updateSelectedBuilding", e.target.dataset.buildingNumber);
        } else if (this.isHintHidden) {
          this.isHintHidden = false;
          this.$buefy.snackbar.open({
            indefinite: true,
            message: this.getHintMessage(),
            onAction: () => {
              this.isHintHidden = true;
            },
          });
        }
      }
    },
    getHintMessage() {
      let massage = `Текущие настройки желаемой прощади офиса от ${this.$store.state.selectedZone.areaLimits[0]} до ${this.$store.state.selectedZone.areaLimits[1]} м<sup>2</sup>.<br>
      В соответствии с этими настройками доступны для выбора:<br>`;
      let buildingListString = [];
      this.availableBuildindList.forEach((el, index) => {
        if (el && index === 0) buildingListString.push("павильон");
        if (el && index === 1) buildingListString.push("1-я башня");
        if (el && index === 2) buildingListString.push("2-я башня");
        if (el && index === 3) buildingListString.push("14 и 15 этаж");
      });
      massage += buildingListString.join(", ");
      massage += ".";
      //если не подходит ничего     
      if (this.availableBuildindList.every(val => val === false)) {
        massage = 'Под текущие настройки площади офиса не подходит ни один корпус. Попробуйте расширить возможный диапазон площади';
      }
      return massage;
    },
    updateAreaLimits(e) {
      this.isShowTooltip = Math.abs(e[0] - e[1]) < 70 ? false : true;
      this.$store.commit("updateAreaLimits", e);
    },
  },
  mounted() {
    let svgEl = this.$refs.buildingSсheme;
    svgEl.getElementsByClassName("building").forEach((el, i) => {
      this.svgBuildingElsArray[i] = svgEl.querySelector(`[data-building-number="${i}"]`);
    });
    this.updateAvailableBuildingSelect();
  },
};
</script>

<style scoped>
@media (max-width: 1024px) {
  .b-slider.my-slider {
    padding: 0 6vw;
  }
}

.select-building-section > .title {
  margin-bottom: 0;
}

.prompt {
  margin-bottom: 2rem;
}

.my-hor-list {
  display: flex;
  justify-content: space-around;
  margin-top: 0.5rem;
}

.svgWrap {
  max-height: calc(100vh - 25rem);
  display: block;
  margin: auto;
}

.my-slider >>> .b-slider-track .b-slider-tick-label {
  top: calc(1rem);
  font-size: 0.7rem;
}

.my-controls >>> .field.has-addons {
  justify-content: space-around;
}

.my-controls >>> .b-radio {
  border: none;
}

.my-slider-wrapper {
  display: flex;
}

@media (max-width: 1024px) {
  .my-controls >>> .b-radio {
    padding: 0.5em;
  }
}

.my-area-checkbox {
  margin-top: 0.6em;
  margin-left: 2em;
  justify-content: center;
  flex-direction: column;
}

.b-checkbox.checkbox.my-area-checkbox >>> .control-label {
  padding: 0.6em 0 0 0;
  font-size: 0.7em;
}

/* .help-tooltip {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  border: 1px solid grey;
  border-radius: 50%;
  display: inline-block;
  text-align: center;
} */
</style>