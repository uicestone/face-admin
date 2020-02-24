import Vue from "vue";
import "./pollyfills";
import VueNotify from "vue-notifyjs";
import VeeValidate from "vee-validate";
import lang from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale";
import App from "./App.vue";
import moment from "moment";
import router from "./router/router";

// Plugins
import GlobalComponents from "./globalComponents";
import GlobalDirectives from "./globalDirectives";
import SideBar from "./components/UIComponents/SidebarPlugin";

// library imports

import "element-ui/lib/theme-chalk/index.css";
import "./assets/sass/paper-dashboard.scss";
import "./assets/sass/demo.scss";

import sidebarLinks from "./sidebarLinks";
import "./registerServiceWorker";
import { createProvider } from "./vue-apollo";
// plugin setup
Vue.use(GlobalDirectives);
Vue.use(GlobalComponents);
Vue.use(VueNotify);
Vue.use(SideBar, { sidebarLinks: sidebarLinks });
Vue.use(VeeValidate, { fieldsBagName: "veeFields" });
locale.use(lang);
moment.locale("zh-CN");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App),
  apolloProvider: createProvider(),
  router
});
