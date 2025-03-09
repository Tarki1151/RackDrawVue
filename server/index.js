const express = require('express');
const cors = require('cors');
const multer = require('multer');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const port = 3001;

// CORS ayarları
app.use(cors());
app.use(express.json());

// Dosya yükleme ayarları
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Excel dosyasını parse etme fonksiyonu
const parseExcel = (fileBuffer) => {
  const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
  const result = {};

  workbook.SheetNames.forEach(sheetName => {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    const headers = jsonData[0] || [];
    const rows = jsonData.slice(1);

    const cabinetData = rows.map(row => {
      const item = {};
      headers.forEach((header, index) => {
        item[header] = row[index] || 'Bilinmeyen';
      });
      return item;
    }).filter(item => Object.keys(item).length > 0);

    if (cabinetData.length > 0) {
      result[sheetName] = cabinetData;
    }
  });

  return result;
};

// Upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ errors: { upload: 'Dosya yüklenmedi.' } });
  }

  try {
    const parsedData = parseExcel(req.file.buffer);
    res.json(parsedData);
  } catch (error) {
    console.error('Excel parse hatası:', error);
    res.status(500).json({ errors: { upload: 'Dosya işlenirken bir hata oluştu.' } });
  }
});

// Sunucuyu başlat
app.listen(port, () => {
  console.log(`Server http://localhost:${port} üzerinde çalışıyor`);
});