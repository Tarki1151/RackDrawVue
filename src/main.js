// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { provideLanguage } from './context/LanguageContext';

const app = createApp({
  ...App,
  setup() {
    provideLanguage(); // Dil bağlamını sağla
  }
});

app.use(router);
app.mount('#app');
