<template>
  <div class="upload-component">
    <input type="file" accept=".xlsx, .xls" @change="handleFileChange" />
    <button @click="uploadFile">{{ t.upload_button }}</button>
    <div v-if="errors" style="color: red">{{ errors }}</div>
  </div>
</template>

<script>
import { useLanguage } from '../context/LanguageContext';

export default {
  props: {
    errors: {
      type: Object,
      default: null
    }
  },
  emits: ['file-uploaded'],
  setup(props, { emit }) {
    const { t } = useLanguage();

    const handleFileChange = (event) => {
      const file = event.target.files[0];
      emit('file-uploaded', file);
    };

    const uploadFile = () => {
      emit('file-uploaded', null);
    };

    return { t, handleFileChange, uploadFile };
  }
};
</script>

<style scoped>
.upload-component {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}
</style>