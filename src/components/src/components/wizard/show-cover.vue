<template>
  <div class="my-custom-bg">
    <div class="my-col-width my-align-page-content-center-left">
      <h1 class="my-sectionHeader">Собери свой идеальный офис</h1>
    </div>
  </div>
</template>

<script>
export default {
  name: "showCover",
  mounted() {
    document.body.classList.add("coverBg");
  },
  beforeDestroy() {
    document.body.classList.remove("coverBg");
  },
};
</script>

<style>
.my-custom-bg {
  background-image: url(../../assets/wizard/first-screen-cover.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
}

.my-align-page-content-center-left {
  display: flex;
  flex-direction: column;
  flex: auto;
  height: 100%;
  justify-content: center;
  align-items: flex-start;
}
</style>
