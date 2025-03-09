<template>
  <v-group
    :config="{ x: position.x, y: position.y, draggable: true }"
    @dragmove="handleDragMove"
    @dragend="handleDragEnd"
  >
    <!-- Kabin Çerçevesi -->
    <v-rect
      :config="{
        width: 180,
        height: 600,
        stroke: 'black',
        strokeWidth: 2,
        fill: 'transparent'
      }"
    />
    <!-- 1'den 42'ye Numaralandırma (aşağıdan yukarı) -->
    <v-text
      v-for="u in 42"
      :key="u"
      :config="{
        text: u.toString(),
        fontSize: 10,
        fill: 'black',
        x: 5,
        y: 600 - ((600 / 42) * u),
        align: 'left'
      }"
    />
    <!-- Enine Çizgiler (her U seviyesi için) -->
    <v-line
      v-for="u in 42"
      :key="'line-' + u"
      :config="{
        points: [0, 600 - ((600 / 42) * u), 180, 600 - ((600 / 42) * u)],
        stroke: 'lightgray',
        strokeWidth: 1,
        dash: [5, 5]
      }"
    />
    <!-- Kabin Etiketi (Cabinet Adı) -->
    <v-text
      :config="{
        text: cabinet,
        fontSize: 14,
        fill: 'black',
        x: labelAlignment === 'left' ? 5 : labelAlignment === 'right' ? 175 : 90,
        y: -15 + (labelMargin * -1),
        align: labelAlignment
      }"
    />
    <!-- Ürünler -->
    <v-group v-for="(item, index) in data" :key="'item-' + index">
      <v-rect
        v-if="Number(item.Rack) <= 42"
        :config="{
          x: 18,
          y: 600 - ((600 / 42) * Math.min(Number(item.Rack) + Number(item.U) - 1, 42)),
          width: 150,
          height: (600 / 42) * Math.min(Number(item.U), 43 - Number(item.Rack)),
          fill: isBack(item) ? '#FFA500' : '#ADD8E6',
          stroke: 'black',
          strokeWidth: 1
        }"
      />
      <!-- Ürün Etiketi (Üstte ve Sola Yaslı) -->
      <v-text
        v-if="Number(item.Rack) <= 42"
        :config="{
          text: formatProductName(item.BrandModel),
          fontSize: 10,
          fill: 'black',
          x: 23,
          y: 600 - ((600 / 42) * Math.min(Number(item.Rack) + Number(item.U) - 1, 42)) + 5,
          align: 'left',
          textBaseline: 'top'
        }"
      />
      <!-- 42U’dan Yüksek Notu -->
      <v-text
        v-if="Number(item.U) + Number(item.Rack) - 1 > 42 && Number(item.Rack) <= 42"
        :config="{
          text: `Ürün 42U'dan Yüksek ${Number(item.U)}U !`,
          fontSize: 8,
          fill: 'black',
          x: 23,
          y: 600 - ((600 / 42) * Math.min(Number(item.Rack) + Number(item.U) - 1, 42)) + 20,
          align: 'left',
          textBaseline: 'top'
        }"
      />
    </v-group>
  </v-group>
</template>

<script>
export default {
  props: {
    cabinet: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    position: {
      type: Object,
      required: true
    },
    gridSize: {
      type: Number,
      default: 10
    },
    labelMargin: {
      type: Number,
      default: 0
    },
    labelAlignment: {
      type: String,
      default: 'left'
    },
    showProducts: {
      type: Boolean,
      default: true
    }
  },
  emits: ['drag-move', 'drag-end'],
  setup(props, { emit }) {
    const fixedHeight = 600; // Sabit yükseklik 600px

    // Renkleri sabitledik
    const backColor = '#FFA500'; // Turuncu (arka)
    const frontColor = '#ADD8E6'; // Açık mavi (ön)

    // Face değerine göre cihazın arka mı ön mü olduğunu kontrol et
    const isBack = (item) => {
      const face = item.Face ? item.Face.toString().toLowerCase() : '';
      return face === 'back' || face === 'arka';
    };

    // Ürün adını 25 karakterle sınırlandırıp baş harfleri büyük yap
    const formatProductName = (name) => {
      if (!name) return '';
      const limitedName = name.length > 25 ? name.substring(0, 25) + '...' : name;
      return limitedName
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const handleDragMove = (e) => {
      const newX = props.gridSize > 0 ? Math.round(e.target.x() / props.gridSize) * props.gridSize : e.target.x();
      const newY = props.gridSize > 0 ? Math.round(e.target.y() / props.gridSize) * props.gridSize : e.target.y();
      e.target.x(newX);
      e.target.y(newY);
      emit('drag-move', e, props.gridSize);
    };

    const handleDragEnd = (e) => {
      emit('drag-end', props.cabinet, e);
    };

    return { fixedHeight, backColor, frontColor, isBack, formatProductName, handleDragMove, handleDragEnd };
  }
};
</script>