import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedState from "pinia-plugin-persistedstate";
import naive from "naive-ui";
import App from "./App.vue";
import router from "./router";
import i18n from "./locales";

// Types
import "./types/global.d.ts";

import "./styles/main.scss";
import "./styles/animate.scss";

const app = createApp(App);

// Pinia
const pinia = createPinia();
pinia.use(piniaPluginPersistedState);
app.use(pinia);

// Router
app.use(router);

// i18n
app.use(i18n);

// Naive UI
app.use(naive);

app.mount("#app");
