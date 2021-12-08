<template>
  <section class="hero is-fullheight" data-anchor="assemble-your-office" id="assemble-your-office">
    <b-steps
      label-position="right"
      v-model="activeStep"
      class="my-step-list"
      :class="{ firstStep: activeStep == 0 }"
      mobile-mode="compact"
      @input="updateSteps">
      <b-step-item headerClass="my-step-item" label="Начало" :clickable="false">
        <show-cover />
      </b-step-item>

      <b-step-item step="1" headerClass="my-step-item" label="Корпус">
        <select-area-with-building :key="selectAreaWithBuildingKey" ref="selectAreaWithBuildingEl" />
      </b-step-item>

      <b-step-item step="2" headerClass="my-step-item" label="Этаж">
        <selectFloor :key="selectFloorKey" ref="selectFloorEl" />
      </b-step-item>

      <b-step-item step="3" headerClass="my-step-item" label="Помещение">
        <selectArea :key="selectAreaKey" ref="selectAreaEl" />
      </b-step-item>

      <b-step-item step="4" headerClass="my-step-item" label="Планировка">
        <selectRoomLayout :key="selectRoomLayoutKey" ref="selectRoomLayoutEl" />
      </b-step-item>

      <b-step-item step="5" headerClass="my-step-item" label="Опции">
        <selectOptions :key="selectOptionsKey" ref="selectOptionsEl" />
      </b-step-item>

      <b-step-item step="6" headerClass="my-step-item" label="Заявка">
        <sendRequest :key="sendRequestKey" ref="sendRequestEl" />
      </b-step-item>

      <template #navigation="{ previous, next }">
        <b-button
          class="my-nav-button my-nav-button__prev my-ctaButton"
          v-if="activeStep > 1"
          outlined
          :disabled="previous.disabled"
          @click.prevent="previous.action">
          Назад
        </b-button>
        <b-button class="my-nav-button my-nav-button__next my-ctaButton" outlined v-if="!next.disabled" @click.prevent="next.action">
          {{ activeStep == 0 ? "Собрать офис" : "Далее" }}
        </b-button>
      </template>
    </b-steps>
  </section>
</template>

<script>
import showCover from "./wizard/show-cover.vue";
import selectAreaWithBuilding from "./wizard/select-area-with-building.vue";
import selectFloor from "./wizard/select-floor.vue";
import selectArea from "./wizard/select-area.vue";
import selectRoomLayout from "./wizard/select-room-layout.vue";
import selectOptions from "./wizard/select-options.vue";
import sendRequest from "./wizard/send-request.vue";

export default {
  name: "stepsSection",
  components: {
    showCover,
    selectAreaWithBuilding,
    selectFloor,
    selectArea,
    selectRoomLayout,
    selectOptions,
    sendRequest,
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      activeStep: 0,
      previousStep: null,
      selectAreaWithBuildingKey: 0 /*ключ компонента*/,
      selectFloorKey: 0 /*ключ компонента*/,
      selectAreaKey: 0 /*ключ компонента*/,
      selectRoomLayoutKey: 0 /*ключ компонента*/,
      selectOptionsKey: 0 /*ключ компонента*/,
      sendRequestKey: 0 /*ключ компонента*/,
    };
  },
  methods: {
    updateSteps: function (newStepNumber) {
      if (newStepNumber === 2 && this.$store.state.selectedZone.areaLimits[0] === 0) {
        this.$store.commit("updateAreaLimits", [this.$store.getters.smallestArea, this.$store.getters.biggestArea]);
      } 

      if (newStepNumber === 2 && this.$store.state.selectedZone.building === null) {
        if (this.$store.state.availableBuildindList.findIndex(el=>el) != -1) {
          this.$store.commit("updateSelectedBuilding", this.$store.state.availableBuildindList.findIndex(el=>el).toString());
        } else {
          this.$store.commit("updateSelectedBuilding", "2");
        }
        //если не выбыбрали ни один корпус, то выбираем второй корпус
        
        //TODO: по хорошему если не выбран корпус то надо давать выбирать из n-го этажа всех корпусов
        //но для этого надо перерисовать области в svg-select-floor.svg
      }

      if (newStepNumber === 3 && this.$store.state.selectedZone.floorIndex === null) {
        this.$store.commit("updatecurrentFloorIndex", 0);
      }

      if (newStepNumber === 3 && this.$store.state.selectedZone.areaSquare != null) {
        this.$refs.selectAreaEl.selectAreaBySquare();
      }

      if (newStepNumber === 4 && this.$store.state.selectedZone.areaSquare === null) {
        //если не выбрано ни обно помещение то выберем первое на текущем на этаже
        let currentFloor = this.$store.state.availableFloorlist[this.$store.state.selectedZone.floorIndex];
        let firstAreaOnCurrentFloot = this.$store.state.availableArealist[currentFloor][0];
        this.$store.commit("updateSelectedArea", firstAreaOnCurrentFloot);
      }

      if (newStepNumber === 5) {
        //если на шаге выбора планировки не было сделано ни одного выбора, то выберем планировку "без перегородки"
        this.$refs.selectRoomLayoutEl.sendSelectedPartitionsInStore();

        //выберем перегородки на следующем шаге, если была выбрана планировка с перегородкой
        if (this.$store.state.selectedZone.selectedRoomlayout != 4 && this.$store.state.selectedZone.selectedRoomlayout != 5) {
          this.$refs.selectOptionsEl.selectPartitionsMaterialFromPrevStep(true);
        } else  {
          this.$refs.selectOptionsEl.selectPartitionsMaterialFromPrevStep(false);
        }
        
      }

      if (newStepNumber === 6) {   
        this.$refs.selectOptionsEl.sendSelectedOptionsToStore();
      }
    },
    reRenderStepsComponents: function () {
      //здесь можно скинуть состоние компонентов, пока не нужно,
      //можно скидывать через мутации в сторе
      //this.selectFloorKey++;
      //если обновления ключа будет недостаточно, то вызвать внутренний метод
      //this.$refs.selectFloorEl.updatePossibleFloorElArr()
    },
  },
  computed: {
    globalCurrentStep() {
      return this.$store.getters.currentStep
    }
  },
  watch: {
    activeStep (val, oldVal) {
      if (val!=oldVal) this.$store.commit("updateCurrentStep",val);
      //следим, если нажимается кнопка назад, значит надо скинуть состояние компонтов, что бы новые состояния не конфликтовали со старыми
      if (this.activeStep < this.previousStep) this.reRenderStepsComponents();
      this.previousStep = val;
    },
    globalCurrentStep (val) {
      this.activeStep = val
    }
  },
};
</script>

<style scoped>
/*steps custom styles*/
:root {
  --step-size: 21px;
  --step-font-size: 1rem;
}

.my-step-list {
  height: 100%;
  position: relative;
}

@media (max-width: 1200px) {
  .my-step-list {
    height: 100vh;
  }
}

.my-step-list.firstStep >>> .steps {
  display: none;
}

@media (max-width: 1024px) {
  .my-step-list >>> .steps {
    display: none !important;
  }
}

.my-step-list >>> .steps + .step-content {
  padding: 0 !important;
  height: 100%;
}

.my-step-list >>> .steps {
  background-image: url(../assets/landing-img/steps-bg.png);
  height: 5rem;
  display: flex;
}

.my-step-list >>> .steps .step-items {
  display: flex;
  max-width: 80vw;
  margin: auto;
  flex: auto;
}

.my-step-list >>> .steps + .step-content .step-item {
  height: 100%;
}

.my-step-list >>> .steps .step-items .step-item {
  display: flex;
  flex-grow: 0;
}

.my-step-list >>> .steps .step-items .step-item.is-active .step-marker {
  background-color: transparent;
}

.my-step-list >>> .steps .step-items .step-item:not(:first-child)::before,
.my-step-list >>> .steps .step-items .step-item:only-child::before {
  height: var(--step-size);
  top: 0rem;
}

.my-step-list >>> .steps .step-items .step-item:not(:first-child),
.my-step-list >>> .steps .step-items .step-item:only-child {
  flex-shrink: 0;
  flex-grow: 1;
}

.my-step-list >>> .steps .step-items .my-step-item.is-previous .step-marker,
.my-step-list >>> .steps .step-items .my-step-item.is-previous .step-details {
  color: #555555;
}

.my-step-list >>> .steps .step-items .my-step-item.is-active .step-marker,
.my-step-list >>> .steps .step-items .my-step-item.is-active .step-details {
  color: #000000;
}

.b-steps .steps .step-items .step-item .step-link {
  vertical-align: middle;
}

.my-step-list >>> .steps .step-items .my-step-item .step-link .step-marker {
  display: inline-block;
  height: var(--step-size);
  line-height: var(--step-size);
  border-radius: 0;
}

.my-step-list >>> .steps .step-items .my-step-item .step-link .step-details {
  display: inline-block;
  height: var(--step-size);
  line-height: var(--step-size);
  padding: 0 !important;
  white-space: nowrap;
}

.my-step-list >>> .steps .step-items .my-step-item .step-link .step-details .step-title {
  font-size: var(--step-font-size);
  height: var(--step-size);
  line-height: var(--step-size);
}

.my-step-list >>> .steps .step-items .my-step-item.is-active .step-link .step-details::after {
  content: "";
  width: calc(100% + 3rem);
  height: 0.3rem;
  background-color: #447be0;
  display: inline-block;
  position: relative;
  top: 2rem;
  left: calc(100% * -1 - 2.5rem);
}

.my-step-list >>> .steps .step-items .my-step-item .step-marker,
.my-step-list >>> .steps .step-items .my-step-item .step-details {
  color: rgb(85 85 85 / 50%);
}

@media (max-width: 1024px) {
  .my-step-list >>> .steps .step-items .my-step-item .step-details {
    display: none !important;
  }
}

.my-step-list >>> .steps .step-items .step-item:not(:first-child)::before,
.my-step-list >>> .steps .step-items .step-item:only-child::before {
  content: ">";
  display: flex;
  position: static;
  justify-content: center;
}

.my-nav-button {
  position: absolute;
  bottom: 5%;
}

.my-nav-button__prev {
  left: 10vw;
}

.my-nav-button__next {
  right: 10vw;
}

@media (max-width: 1024px) {
  .my-nav-button__prev {
    left: 3vw;
  }

  .my-nav-button__next {
    right: 3vw;
  }
}
</style>