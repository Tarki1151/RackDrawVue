<template>
  <div class="welcome-container">
    <img src="/logo.png" alt="Şirket Logosu" class="company-logo" />
    <div class="content-container">
      <div class="language-selector">
        <label for="language">Dil / Language: </label>
        <select id="language" @change="changeLanguage($event.target.value)" v-model="language">
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>
      <h1>{{ t.welcome_title }}</h1>
      <p>{{ t.welcome_description }}</p>

      <h2>{{ t.welcome_how_to_use }}</h2>
      <ol>
        <li>
          <strong>{{ t.welcome_step_1 }}</strong>
          <a href="/templates/input_template.xlsx" download>{{ t.welcome_download_template }}</a>
        </li>
        <li>
          <strong>{{ t.welcome_step_2 }}</strong>
          <ul>
            <li><strong>Rack:</strong> {{ t.welcome_step_2_rack }}</li>
            <li><strong>U:</strong> {{ t.welcome_step_2_u }}</li>
            <li><strong>BrandModel:</strong> {{ t.welcome_step_2_brandmodel }}</li>
            <li><strong>Face:</strong> {{ t.welcome_step_2_face }}</li>
            <li><strong>Owner:</strong> {{ t.welcome_step_2_owner }}</li>
            <li><strong>Serial:</strong> {{ t.welcome_step_2_serial }}</li>
          </ul>
          <p><em>{{ t.welcome_step_2_note }}</em></p>
        </li>
        <li>{{ t.welcome_step_3 }}</li>
        <li>{{ t.welcome_step_4 }}</li>
        <li>{{ t.welcome_step_5 }}</li>
      </ol>

      <h2>{{ t.welcome_tips }}</h2>
      <ul>
        <li>{{ t.welcome_tip_1 }}</li>
        <li>{{ t.welcome_tip_2 }}</li>
        <li>{{ t.welcome_tip_3 }}</li>
      </ul>

      <router-link to="/app">
        <button class="start-button">{{ t.welcome_start_button }}</button>
      </router-link>
    </div>
  </div>
</template>

<script>
import { useLanguage } from '../context/LanguageContext';

export default {
  setup() {
    const { language, t, changeLanguage } = useLanguage();
    return { language, t, changeLanguage };
  }
};
</script>

<style scoped>
.welcome-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-image: url('/public/bg.jpg'); /* Doğru yol */
  background-size: cover;
  background-position: center;
  color: #333;
  text-align: center;
  font-family: Arial, sans-serif;
}
.content-container {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 10px;
  max-width: 900px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.language-selector {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.language-selector label {
  background-color: white;
  padding: 5px 10px;
  border-radius: 5px;
  color: #333;
}
.company-logo {
  width: 250px;
  margin-bottom: 20px;
}
h1 { font-size: 2.5em; margin-bottom: 20px; }
h2 { font-size: 1.8em; margin-top: 20px; }
p, li { font-size: 1.2em; line-height: 1.5; }
ol { text-align: left; max-width: 800px; margin: 20px 0; }
ul { text-align: left; max-width: 800px; margin-bottom: 20px; }
a { color: #007bff; text-decoration: none; }
a:hover { text-decoration: underline; }
.start-button {
  padding: 10px 20px;
  font-size: 1.2em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
}
.start-button:hover { background-color: #0056b3; }
</style>