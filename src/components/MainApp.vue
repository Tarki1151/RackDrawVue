<template>
  <div class="app-container">
    <div class="app-content">
      <h1>Kabin Yerleşim Uygulaması</h1>
      <UploadComponent @file-uploaded="uploadFile" :errors="errors" />
      <div class="language-selector">
        <label for="language">Dil / Language: </label>
        <select id="language" @change="changeLanguage($event.target.value)" v-model="language">
          <option value="tr">Türkçe</option>
          <option value="en">English</option>
        </select>
      </div>
      <div class="options-container">
        <div class="option">
          <label for="gridSize">Izgaraya Yapış</label>
          <select id="gridSize" v-model="gridSize" @change="handleGridChange">
            <option :value="0">Izgarasız</option>
            <option :value="10">10x10</option>
            <option :value="20">20x20</option>
          </select>
        </div>
        <div class="option">
          <label for="labelMargin">Etiket Boşluğu</label>
          <select id="labelMargin" v-model="labelMargin" @change="handleMarginChange">
            <option :value="0">0 px</option>
            <option :value="5">5 px</option>
            <option :value="10">10 px</option>
            <option :value="15">15 px</option>
          </select>
        </div>
      </div>
      <div class="button-container">
        <router-link to="/">
          <button class="help-button">Yardım</button>
        </router-link>
        <button @click="handleZoomIn">Yakınlaştır</button>
        <button @click="handleZoomOut">Uzaklaştır</button>
        <button @click="exportToPNG">PNG Olarak Dışa Aktar</button>
        <button @click="exportToSVG">SVG Olarak Dışa Aktar</button>
        <button @click="exportToPDF">PDF Olarak Dışa Aktar</button>
      </div>
      <v-stage v-if="Object.keys(cabinets).length > 0" ref="stage" :config="stageConfig">
        <v-layer>
          <RackComponent
            v-for="(data, cabinet) in cabinets"
            :key="cabinet"
            :cabinet="cabinet"
            :data="data"
            :position="positions[cabinet]"
            @drag-move="handleDragMove"
            @drag-end="handleDragEnd"
            :grid-size="gridSize"
            :label-margin="labelMargin"
            :label-alignment="labelAlignment"
            :show-products="true"
          />
        </v-layer>
      </v-stage>
      <div v-else class="welcome-message">
        <p>Excel dosyasını yükleyin...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import UploadComponent from './UploadComponent.vue';
import RackComponent from './RackComponent.vue';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export default {
  name: 'MainApp',
  components: { UploadComponent, RackComponent },
  setup() {
    const cabinets = ref({}); // Kabin verileri
    const positions = ref({}); // Kabin pozisyonları
    const file = ref(null); // Yüklenen dosya
    const errors = ref(null); // Hata mesajları
    const gridSize = ref(10); // Grid boyutu
    const labelMargin = ref(0); // Etiket boşluğu
    const labelAlignment = ref('left'); // Etiket hizalaması
    const zoomLevel = ref(1); // Yakınlaştırma seviyesi
    const stage = ref(null); // v-stage referansı
    const stageConfig = ref({ width: 0, height: 0, scaleX: 1, scaleY: 1 }); // Sahne yapılandırması
    const language = ref('tr'); // Dil state'i

    onMounted(() => {
      stageConfig.value = {
        width: window.innerWidth,
        height: window.innerHeight,
        scaleX: zoomLevel.value,
        scaleY: zoomLevel.value
      };

      const handleResize = () => {
        stageConfig.value = {
          width: window.innerWidth,
          height: window.innerHeight,
          scaleX: zoomLevel.value,
          scaleY: zoomLevel.value
        };
      };
      window.addEventListener('resize', handleResize);

      onUnmounted(() => {
        window.removeEventListener('resize', handleResize);
      });
    });

    const uploadFile = async (fileData) => {
      file.value = fileData;
      if (!file.value) return;
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const parsedCabinets = {};
          workbook.SheetNames.forEach(sheetName => {
            if (sheetName.toLowerCase() === 'bilinmeyen') return;
            
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            const headers = jsonData[0] || [];
            const rows = jsonData.slice(1);

            const cabinetData = rows
              .map(row => {
                const item = {};
                headers.forEach((header, index) => {
                  item[header] = row[index] || '';
                });
                return item;
              })
              .filter(item => item.Rack && item.U && item.BrandModel);

            if (cabinetData.length > 0) {
              parsedCabinets[sheetName] = cabinetData;
            }
          });

          cabinets.value = parsedCabinets;
          errors.value = null;
          const cabinetNames = Object.keys(parsedCabinets);
          const extraSpace = 200;
          const initialPositions = cabinetNames.reduce((acc, cabinet, i) => {
            const xPosition = 20 + i * extraSpace; // 20 piksel soldan başla
            acc[cabinet] = { x: xPosition, y: 20 }; // 20 piksel aşağı başla
            return acc;
          }, {});
          positions.value = initialPositions;
          console.log('Parsed Cabinets:', parsedCabinets); // Debug
        };
        reader.onerror = () => {
          errors.value = { upload: 'Dosya okunamadı.' };
        };
        reader.readAsBinaryString(file.value);
      } catch (error) {
        console.error('Dosya işleme hatası:', error);
        errors.value = { upload: 'Dosya yüklenirken bir hata oluştu: ' + error.message };
      }
    };

    const handleDragMove = (e, gridSizeValue) => {
      const newX = gridSizeValue > 0 ? Math.round(e.target.x() / gridSizeValue) * gridSizeValue : e.target.x();
      const newY = gridSizeValue > 0 ? Math.round(e.target.y() / gridSizeValue) * gridSizeValue : e.target.y();
      e.target.x(newX);
      e.target.y(newY);
    };

    const handleDragEnd = (cabinet, e) => {
      positions.value[cabinet] = { x: e.target.x(), y: e.target.y() };
    };

    const handleGridChange = (e) => {
      gridSize.value = parseInt(e.target.value);
    };

    const handleMarginChange = (e) => {
      labelMargin.value = parseInt(e.target.value);
    };

    const handleZoomIn = () => {
      zoomLevel.value = Math.min(zoomLevel.value + 0.1, 2);
      stageConfig.value.scaleX = zoomLevel.value;
      stageConfig.value.scaleY = zoomLevel.value;
    };

    const handleZoomOut = () => {
      zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5);
      stageConfig.value.scaleX = zoomLevel.value;
      stageConfig.value.scaleY = zoomLevel.value;
    };

    const exportToPNG = () => {
      const dataURL = stage.value.getStage().toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.href = dataURL;
      link.download = 'rack-diagram.png';
      link.click();
    };

    const exportToSVG = () => {
      const svgData = stage.value.getStage().toDataURL({
        mimeType: 'image/svg+xml',
        pixelRatio: 2
      });
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'rack-diagram.svg';
      link.click();
      URL.revokeObjectURL(url);
    };

    const exportToPDF = () => {
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = stage.value.getStage().toDataURL({ pixelRatio: 2 });
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 20;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 10, 10, pdfWidth, pdfHeight);
      pdf.save('rack-diagram.pdf');
    };

    const changeLanguage = (lang) => {
      language.value = lang; // Dil state'ini güncelle
    };

    return {
      cabinets,
      positions,
      file,
      errors,
      gridSize,
      labelMargin,
      labelAlignment,
      zoomLevel,
      stage,
      stageConfig,
      language, // language state'ini return et
      uploadFile,
      handleDragMove,
      handleDragEnd,
      handleGridChange,
      handleMarginChange,
      handleZoomIn,
      handleZoomOut,
      exportToPNG,
      exportToSVG,
      exportToPDF,
      changeLanguage // changeLanguage fonksiyonunu return et
    };
  }
};
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-image: url('/public/bg.jpg');
  background-size: cover;
  background-position: center;
}
.app-content {
  background-color: rgba(255, 255, 255, 0.9);
  min-height: 100vh;
  padding: 20px;
}
.language-selector {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
}
.options-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.option {
  display: flex;
  align-items: center;
  gap: 5px;
}
.button-container {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
button {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #0056b3;
}
.welcome-message {
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: #333;
}
</style>