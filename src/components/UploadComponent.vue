<template>
  <div class="upload-container">
    <input type="file" @change="handleFileUpload" accept=".xlsx, .xls" />
    <div v-if="errors && errors.upload" class="error-message">
      {{ errors.upload }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    errors: {
      type: Object,
      default: null
    }
  },
  emits: ['file-uploaded'],
  setup(props, { emit }) {
    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        emit('file-uploaded', file);
      }
    };

    return { handleFileUpload };
  }
};
</script>

<style scoped>
.upload-container {
  margin-bottom: 20px;
}
.error-message {
  color: red;
  margin-top: 10px;
}
</style>