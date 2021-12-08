<template>
  <a class="stickyCta" href="#assemble-your-office" @click="$store.commit('updateCurrentStep',1)">
    <div class="stickyCta_caption">
      <p>Собрать офис</p>
    </div>

    <div class="stickyCta_svg">
      <img src="img/ruler-and-pencil.svg" alt="" />
    </div>
  </a>
</template>

<script>
export default {
  name: "stickyCta",
};
</script>

<style scoped>
.stickyCta {
  position: fixed;
  right: 3vw;
  bottom: 3vh;
  display: flex;
  align-items: center;
}

@media (max-width: 1220px) {
  .stickyCta {
    display: none;
  }
}

.stickyCta_svg {
  background-color: white;
  border-radius: 50%;
  border: 5px solid white;
  width: 60px;
  height: 60px;
  padding: 5px;
  flex: none;
  box-shadow: 0px 0px 4px 2px rgb(0 0 0 / 37%);
}

.stickyCta > img {
  width: 100%;
  height: 100%;
}

.stickyCta_caption {
  width: 0px;
  transition: width 0.5s ease-in-out;
  display: inline-block;
  overflow: hidden;
  margin-right: -26px;
  border-bottom-left-radius: 26px;
  border-top-left-radius: 26px;
  box-shadow: 0px 0px 4px 2px rgb(0 0 0 / 37%);
}

.stickyCta_caption > p {
  background-color: white;
  font-size: 16px;
  color: #000;
  white-space: nowrap;
  padding: 18px 9px;
}

.stickyCta:hover .stickyCta_caption {
  width: 125px;
  transition: width 0.5s ease-in-out;
}
</style>