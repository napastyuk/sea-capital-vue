<template>
  <div class="my-col-width my-col-vcenter select-floor-section">
    <h2 class="title">Выберите этаж {{ getSelectedBuildingName }}</h2>
    <!-- <p class="prompt">на картинке подсвечены доступные для выбора этажи</p> -->
    <div class="content-wrapper">
      <b-field class="my-input-wrapper">
        <p class="control pr-3">
          <b-button label="<" class="my-controls" @click="updateFloorValue('decrement')" :disabled="currentFloorIndex == 0" />
        </p>
        <b-select v-model="currentFloorIndex">
          <option v-for="(option, index) in availableFloorlist" :value="index" :key="option">
            {{ option }}
          </option>
        </b-select>
        <p class="control pl-3">
          <b-button label=">" class="my-controls" @click="updateFloorValue('increment')" :disabled="currentFloorIndex == availableFloorlist.length - 1" />
        </p>
      </b-field>

      <floorSchemeSVG class="floorSсheme" ref="floorSсheme" @mouseover="addStrokeOnHover($event)" @mouseout="removeStrokeOnHover" @click="selectFloorOnSVG" />
    </div>
  </div>
</template>

<script>
import floorSchemeSVG from "../../assets/wizard/svg-select-floor.svg";

export default {
  name: "selectFloor",
  components: {
    floorSchemeSVG,
  },
  data() {
    return {
      // доступные для выбора этажи в итоге решили не перекрашивать , поэтому availableForSelectColor и availableFloorOpacity - прозрачные
      availableForSelectColor: "transparent",
      selectedColor: "#447BE0",
      availableFloorOpacity: "0",
      selectedFloorOpacity: "0.5",
      svgFloorAllEls: {}, //svg узлы со всеми этажами на картинке
      isHintHidden: true,
      //currentFloorNumber: 0, //текстовое значение для вывода в input
      minPossibleFloor: 0,
      maxPossibleFloor: 21,
    };
  },
  computed: {
    selectedBuilding() {
      return this.$store.state.selectedZone.building;
    },
    availableFloorlist() {
      /*возращает массив возможных значений этажа*/
      return this.$store.state.availableFloorlist;
    },
    currentFloorIndex: {
      get() {
        return this.$store.state.selectedZone.floorIndex;
      },
      set(value) {
        this.$store.commit("updatecurrentFloorIndex", value);
      },
    },
    getCurrentfloorNumber() {
      //более коротки метод для получения текущего этажа. аналог
      return this.$store.getters.currentFloor;
    },
    getSelectedBuildingName() {
      //текущий выбранный корпус со склоненим для заголовка
      switch (this.selectedBuilding) {
        case "0":
          return "в павильоне";
          break;
        case "1":
          return "в 1-й башне";
          break;
        case "2":
          return "в 2-й башне";
          break;
        case "3":
          return "из 14 и 15 этажа";
          break;
        default:
          return "";
      }
    },
  },
  watch: {
    currentFloorIndex() {
      if (this.selectedBuilding != null && this.selectedBuilding != "") {
        this.updateSVGfromCurrentValue();
      }
    },
    selectedBuilding() {
      if (this.selectedBuilding != null && this.selectedBuilding != "") {
        this.updateSVGfromCurrentValue();
      }
    },
    availableFloorlist() {
      this.svgFloorAllEls.forEach((el) => {
        if (el.dataset.buildingNumber == this.selectedBuilding && this.availableFloorlist.includes(parseInt(el.dataset.floorNumber))) {
          if (el.dataset.floorNumber == this.getCurrentfloorNumber) {
            el.setAttribute("fill", this.selectedColor);
            el.setAttribute("fill-opacity", this.selectedFloorOpacity);
          } else {
            el.setAttribute("fill", this.availableForSelectColor);
            el.setAttribute("fill-opacity", this.availableFloorOpacity);
          }
        }
      });
    },
  },
  methods: {
    updateSVGfromCurrentValue() {
      this.svgFloorAllEls.forEach((el) => {
        if (el) {
          if (el.dataset.buildingNumber === this.selectedBuilding && this.availableFloorlist.includes(parseInt(el.dataset.floorNumber))) {
            if (el.dataset.floorNumber == this.getCurrentfloorNumber) {
              el.setAttribute("fill", this.selectedColor);
              el.setAttribute("fill-opacity", this.selectedFloorOpacity);
            } else {
              el.setAttribute("fill", this.availableForSelectColor);
              el.setAttribute("fill-opacity", this.availableFloorOpacity);
            }
          } else {
            el.setAttribute("fill", "transparent");
          }
        } else console.error("ошибка el не может быть ", el);
      });
    },
    getFloorElByNumber(number) {
      let result;
      let selectedBuilding = this.selectedBuilding;
      this.svgFloorAllEls.forEach(function (el) {
        if (el.dataset.floorNumber == number && el.dataset.buildingNumber == selectedBuilding) result = el;
      });
      return result;
    },
    addStrokeOnHover(e) {
      //если hover был по выбранному корпусу и доступным для выбора этажа то добавляем обводку этажа под hover
      if (e.target.classList.contains("floor") && e.target.dataset.buildingNumber == this.selectedBuilding) {
        this.svgFloorAllEls = this.$refs.floorSсheme.getElementsByClassName("floor");
        this.svgFloorAllEls.forEach((el) => el.setAttribute("stroke", "transparent"));
        e.target.setAttribute("stroke", this.selectedColor);
      }
    },
    removeStrokeOnHover() {
      this.svgFloorAllEls.forEach((el) => el.setAttribute("stroke", "transparent"));
    },
    updateFloorValue(param) {
      //обработка нажатий кнопок увеличения/уменьшения этажа
      if (param === "increment" && this.currentFloorIndex < this.availableFloorlist.length - 1) this.currentFloorIndex += 1;
      if (param === "decrement" && this.currentFloorIndex > 0) this.currentFloorIndex -= 1;
    },
    selectFloorOnSVG(e) {
      //если клик был по выбранному корпусу и доступным для выбора этажам, то изменяем выбранный этаж
      if (e.target.dataset.buildingNumber == this.selectedBuilding && this.availableFloorlist.includes(parseInt(e.target.dataset.floorNumber))) {
        this.currentFloorIndex = this.availableFloorlist.indexOf(parseInt(e.target.dataset.floorNumber));
        //отправка значения в стор уже настроенна через currentFloorIndex getter
      } else if ("buildingNumber" in e.target.dataset && this.isHintHidden) {
        this.isHintHidden = false;
        this.$buefy.snackbar.open({
          indefinite: true,
          message: `Выберете этаж в ${this.getSelectedBuildingName} или выберете другое здание на предыдущем шаге`,
          onAction: () => {
            this.isHintHidden = true;
          },
        });
      }
    },
  },
  mounted() {
    this.svgFloorAllEls = this.$refs.floorSсheme.getElementsByClassName("floor");
  },
};
</script>

<style scoped>
.select-floor-section .title {
  margin-bottom: 0rem;
}

.content-wrapper {
  display: flex;
  margin-top: 1rem;
}

@media (max-width: 1024px) {
  .content-wrapper {
    flex-direction: column;
  }
}

.floorSсheme {
  max-height: calc(100vh - 23rem);
}

.my-input {
  width: 10rem;
}

.my-controls {
  background-color: #447be0;
  color: white;
}

.my-input >>> input[type="number"]::-webkit-inner-spin-button,
.my-input >>> input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.my-input-wrapper {
  margin-right: 2rem;
}


</style>