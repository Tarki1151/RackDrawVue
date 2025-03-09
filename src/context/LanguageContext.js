// src/context/LanguageContext.js
import { ref, provide, inject } from 'vue';

// Türkçe ve İngilizce çeviriler
const translations = {
  tr: {
    app_title: "Kabin Yerleşim Uygulaması",
    app_snap_to_grid: "Izgaraya Yapış",
    app_no_grid: "Izgarasız",
    app_label_margin: "Etiket Boşluğu",
    app_label_margin_0: "0 px",
    app_label_margin_5: "5 px",
    app_label_margin_10: "10 px",
    app_label_margin_15: "15 px",
    app_help_button: "Yardım",
    app_zoom_in: "Yakınlaştır",
    app_zoom_out: "Uzaklaştır",
    app_export_png: "PNG Olarak Dışa Aktar",
    app_export_svg: "SVG Olarak Dışa Aktar",
    app_export_pdf: "PDF Olarak Dışa Aktar",
    app_upload_excel: "Excel dosyasını yükleyin...",
    app_max_cabinet_warning: "Not: Maksimum 15 kabin desteklenir. 15’ten fazla kabin içeren Excel dosyalarını bölerek yükleyin."
  },
  en: {
    app_title: "Cabinet Layout Application",
    app_snap_to_grid: "Snap to Grid",
    app_no_grid: "No Grid",
    app_label_margin: "Label Margin",
    app_label_margin_0: "0 px",
    app_label_margin_5: "5 px",
    app_label_margin_10: "10 px",
    app_label_margin_15: "15 px",
    app_help_button: "Help",
    app_zoom_in: "Zoom In",
    app_zoom_out: "Zoom Out",
    app_export_png: "Export as PNG",
    app_export_svg: "Export as SVG",
    app_export_pdf: "Export as PDF",
    app_upload_excel: "Upload an Excel file...",
    app_max_cabinet_warning: "Note: Maximum 15 cabinets are supported. Split Excel files with more than 15 cabinets and upload separately."
  }
};

const LanguageSymbol = Symbol('Language');

export function provideLanguage() {
  const language = ref('tr');

  const changeLanguage = (lang) => {
    language.value = lang;
  };

  const t = (key) => translations[language.value][key] || key;

  provide(LanguageSymbol, { language, t, changeLanguage });

  return { language, t, changeLanguage };
}

export function useLanguage() {
  const context = inject(LanguageSymbol);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}