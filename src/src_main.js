import Vue from "vue";
import App from "./App.vue";
import store from "./store/store";
import Buefy from "buefy";
import "./styles/buefy-custom.scss";

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  store,
  pagesLib: null,
  render: (h) => h(App),
}).$mount("#app");