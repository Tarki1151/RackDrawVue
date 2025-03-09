<template>
  <router-view />
</template>

<script>
import { provide, ref, computed } from 'vue';
import translations from './translations';

export default {
  setup() {
    const language = ref('tr');
    const t = computed(() => translations[language.value]);

    provide('language', language);
    provide('t', t);

    const changeLanguage = (newLang) => {
      language.value = newLang;
    };
    provide('changeLanguage', changeLanguage);

    return { language, t };
  }
};
</script>
