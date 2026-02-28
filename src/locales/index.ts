import zh from "./locales/zh-CN.json";
import { createI18n } from "vue-i18n";

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem("i18n_redirected") || "zh-CN",
  messages: { "zh-CN": zh },
  fallbackLocale: "zh-CN",
});

export default i18n;
