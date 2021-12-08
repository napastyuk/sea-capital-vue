<template>
  <div>
    <div class="my-col-width my-col-vcenter">
      <h2 class="title">Выберите помещение на {{ selectedFloor }} этаже {{ getSelectedBuildingName }}</h2>

      <div class="desktop-only">
        <p class="prompt" v-if="selectedArea">выбрано помещение площадью {{ selectedArea }} м<sup>2</sup></p>
        <p class="prompt" v-else>нажмите на помещение для выбора</p>
      </div>

      <b-select v-model="selectedArea" class="my-area-select mobile-only" expanded>
        <option v-for="option in availableAreaList" :value="option" :key="option">
          {{ option }}
        </option>
      </b-select>
    </div>

    <component
      :is="getCurrentFloorSheme"
      ref="floorSheme"
      class="floorSheme"
      @click="updateCurrentArea($event)"
      @mouseover="addStrokeOnHover($event)"
      @mouseout="removeStrokeOnHover" />
  </div>
</template>

<script>
export default {
  name: "selectArea",
  data() {
    return {
      selectedColor: "#447BE0",
    };
  },
  methods: {
    updateCurrentArea: function (e) {
      if (e.target.closest(".areaItem-wrapper") && "id" in e.target.closest(".areaItem-wrapper").dataset) {
        let squareUnderClick = parseInt(e.target.closest(".areaItem-wrapper").dataset.id);
        //прежде чем заносить в стор провалидируем что у нас есть данные про такое помещение
        if (this.$store.getters.checkIfAreaExistInCurrentFloor(squareUnderClick)) this.selectedArea = squareUnderClick;
        else console.error(`В загруженном json нету данныx про помещение c площадью ${squareUnderClick} на ${this.selectedFloor} этаже ${this.getSelectedBuildingName}`);
      }
    },
    addStrokeOnHover(e) {
      if ("id" in e.target.parentElement.dataset) {
        let targetAreaEl = e.target.closest(".areaItem-wrapper").querySelector(".areaItem__fill");
        let targetAreaLabelEl = e.target.closest(".areaItem-wrapper").querySelector(".areaItem__title");
        // this.$refs.floorSheme.getElementsByClassName("areaItem__fill").forEach((el) => el.setAttribute("stroke", "transparent"));
        targetAreaEl.setAttribute("stroke-width", "10");
        targetAreaEl.setAttribute("stroke", this.selectedColor);
        targetAreaLabelEl.setAttribute("fill", "#000000");
      }
    },
    removeStrokeOnHover() {
      if (this.$refs.floorSheme.querySelector(".selectedArea") != null) {
        this.$refs.floorSheme.querySelectorAll(".areaItem-wrapper:not(.selectedArea) .areaItem").forEach((el) => {
          el.setAttribute("stroke", "transparent");
          el.setAttribute("fill", "#76B16D");
        });
      } else {
        this.$refs.floorSheme.querySelectorAll(".areaItem").forEach((el) => {
          el.setAttribute("stroke", "transparent");
          el.setAttribute("fill", "#76B16D");
        });
      }
    },
    selectAreaBySquare() {
      let currentSquare = this.$store.state.selectedZone.areaSquare;
      const newAreaWrapperSVGEl = this.$refs.floorSheme.querySelector(`.areaItem-wrapper[data-id='${currentSquare}']`);
      newAreaWrapperSVGEl.classList.add("selectedArea");
      newAreaWrapperSVGEl.querySelector(".areaItem__fill").setAttribute("stroke", this.selectedColor);
      newAreaWrapperSVGEl.querySelector(".areaItem__title").setAttribute("fill", "#000000");
    },
  },
  computed: {
    selectedBuilding() {
      return this.$store.state.selectedZone.building;
    },
    selectedFloor() {
      return this.$store.getters.currentFloor;
    },
    availableAreaList() {
      if (this.$store.getters.currentFloor != null) return this.$store.state.availableArealist[this.$store.getters.currentFloor];
    },
    selectedArea: {
      get() {
        return this.$store.state.selectedZone.areaSquare ? this.$store.state.selectedZone.areaSquare : "";
      },
      set(value) {
        this.$store.commit("updateSelectedArea", value);
      },
    },
    getCurrentFloorSheme: function () {
      let building = this.selectedBuilding === null ? 1 : this.selectedBuilding;
      let floor = this.selectedFloor === undefined ? 1 : this.selectedFloor;
      return () => import(`../../assets/wizard/areas/building-${building}-floor-${floor}.svg`);
    },
    getSelectedBuildingName() {
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
    selectedArea(newVal, oldVal) {
      if (oldVal != "" && this.$refs.floorSheme.querySelector(`.areaItem-wrapper[data-id='${oldVal}']`)) {
        const oldAreaWrapperSVGEl = this.$refs.floorSheme.querySelector(`.areaItem-wrapper[data-id='${oldVal}']`);
        oldAreaWrapperSVGEl.classList.remove("selectedArea");
        oldAreaWrapperSVGEl.querySelector(".areaItem__fill").setAttribute("stroke", "transparent");
        oldAreaWrapperSVGEl.querySelector(".areaItem__title").setAttribute("fill", "#76B16D");
      }

      if (newVal != "" && newVal && this.$refs.floorSheme.querySelector(`.areaItem-wrapper[data-id='${newVal}']`)) {
        const newAreaWrapperSVGEl = this.$refs.floorSheme.querySelector(`.areaItem-wrapper[data-id='${newVal}']`);
        newAreaWrapperSVGEl.classList.add("selectedArea");
        newAreaWrapperSVGEl.querySelector(".areaItem__fill").setAttribute("stroke", this.selectedColor);
        newAreaWrapperSVGEl.querySelector(".areaItem__title").setAttribute("fill", "#000000");
      }
    },
  },
};
</script>

<style scoped>
.floorSheme {
  height: calc(100vh - 24rem);
  max-width: 100vw;
  margin: 1rem auto;
  display: block;
  border:1px solid black;
}

.control-panel {
  margin-top: 2vh;
  display: flex;
  justify-content: space-between;
}

.my-area-select,
.my-area-select .select.is-fullwidth,
.my-area-select .select.is-fullwidth select {
  width: 80vw;
}

.title {
  margin-bottom: 0!important;
}
</style>
