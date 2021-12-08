<template>
  <div class="my-col-width my-col-vcenter">
    <h2 class="title">Выберите один из вариантов планировки</h2>

    <section class="my-verticalFilelds" v-if="windowWidth > 1024">
      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="4" v-if="getAvaiableLayout[4]">без перегородки с кухней</b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="5" v-if="getAvaiableLayout[5]">без перегородки</b-radio-button>
      </b-field>
      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="0" v-if="getAvaiableLayout[0]"> 1 перегородка с кухней </b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="1" v-if="getAvaiableLayout[1]">1 перегородка</b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="2" v-if="getAvaiableLayout[2]">2 перегородки с кухней</b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="3" v-if="getAvaiableLayout[3]">2 перегородки</b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="6" v-if="getAvaiableLayout[6]">кабинетная с кухней</b-radio-button>
      </b-field>

      <b-field>
        <b-radio-button v-model="selectedPartitions" :native-value="7" v-if="getAvaiableLayout[7]">кабинетная</b-radio-button>
      </b-field>
    </section>

    <b-select v-if="windowWidth < 1024" v-model="selectedPartitions" class="layout-selector">
      <option value="0" v-if="getAvaiableLayout[0]">1 перегородка с кухней</option>
      <option value="1" v-if="getAvaiableLayout[1]">1 перегородка</option>
      <option value="2" v-if="getAvaiableLayout[2]">2 перегородки с кухней</option>
      <option value="3" v-if="getAvaiableLayout[3]">2 перегородки</option>
      <option value="4" v-if="getAvaiableLayout[4]">без перегородки с кухней</option>
      <option value="5" v-if="getAvaiableLayout[5]">без перегородки</option>
      <option value="6" v-if="getAvaiableLayout[6]">кабинетная с кухней</option>
      <option value="7" v-if="getAvaiableLayout[7]">кабинетная</option>
    </b-select>

    <img v-if="getSelectedFloor && getSelectedArea" :src="this.layoutImgPath" class="my-roomLayoutCanvas" ref="layoutImg" />
  </div>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "selectRoomLayout",
  data() {
    return {
      windowWidth: window.innerWidth,
    };
  },
  computed: {
    layoutImgPath() {
      return require(`@/assets/wizard/roomsLayouts/building-${this.getSelectedBuilding}-floor-${this.getSelectedFloor}-area-${this.getSelectedArea}-option-${this.selectedPartitions}.png`);
    },
    getSelectedBuilding() {
      if (this.$store.state.selectedZone.building) {
        return parseInt(this.$store.state.selectedZone.building);
      } else {
        return false;
      }
    },
    getSelectedFloor() {
      if (this.$store.getters.currentFloor) {
        return this.$store.getters.currentFloor;
      } else {
        return false;
      }
    },
    getSelectedArea() {
      if (this.$store.state.selectedZone.areaSquare) {
        return this.$store.state.selectedZone.areaSquare;
      } else {
        return false;
      }
    },
    getAvaiableLayout() {
      if (this.$store.state.selectedZone.availableRoomLayout != null) {
        return this.$store.state.selectedZone.availableRoomLayout;
      } else {
        return false;
      }
    },
    selectedPartitions: {
      get() {
        return this.$store.state.selectedZone.selectedRoomlayout;
      },
      set(value) {
        this.$store.commit("updateSelectedRoomLayoutIndex", value);
      },
    },
  },
  methods: {
    sendSelectedPartitionsInStore() {
      html2canvas(this.$refs.layoutImg).then((canvas) => {
        this.$store.commit("updateSelectedRoomLayoutImg", canvas.toDataURL("image/jpeg", 1.0));
      });
    },
  },
  mounted() {
    window.onresize = () => {
      this.windowWidth = window.innerWidth;
    };
  },
};
</script>

<style>
@media (max-width: 1024px) {
  .my-col-vcenter {
    text-align: center;
  }
}

.my-roomLayoutCanvas {
  max-height: calc(100vh - 19rem);
  display: inline-block;
  border: 1px solid black;
  vertical-align: top;
  margin-left: 2vw;
}

@media (max-width: 1024px) {
  .my-roomLayoutCanvas {
    margin-left: auto;
    margin-right: auto;
    margin-top: 2vh;
  }

  .control.layout-selector {
    text-align: center;
  }
}

.my-verticalFilelds {
  display: inline-block;
}

.my-verticalFilelds .b-radio {
  justify-content: flex-start;
}
</style>