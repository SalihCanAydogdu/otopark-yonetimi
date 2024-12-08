<template>
  <div class="public-page container mt-5">
    <h1>Otopark Yönetim Sistemi ve Fiyatlandırma</h1>

    <!-- Fiyatlandırma Tablosu -->
    <div class="card my-5">
      <div class="card-header bg-primary text-white text-center">
        <h2>Fiyatlandırma</h2>
      </div>
      <div class="card-body">
        <table class="table table-bordered table-hover w-100">
          <thead class="table-primary">
            <tr>
              <th>Araç Türü</th>
              <th>Giriş Ücreti (TL)</th>
              <th>Otoparkta Bulunulan Dakika Başına Ücret (TL)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="price in pricing" :key="price.vehicleType">
              <td>{{ price.vehicleType }}</td>
              <td>{{ price.entryFee }}</td>
              <td>{{ price.perMinuteFee }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- İndirim Tablosu -->
    <div class="card my-5">
      <div class="card-header bg-success text-white text-center">
        <h2>İndirimler</h2>
      </div>
      <div class="card-body">
        <table class="table table-bordered table-hover w-100">
          <thead class="table-success">
            <tr>
              <th>Giriş Sayısı</th>
              <th>İndirim Oranı</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="discount in discounts" :key="discount.range">
              <td>{{ discount.range }}</td>
              <td>{{ discount.discountRate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PublicPage",
  data() {
    return {
      message: null, // Gelen mesajı saklamak için
      pricing: [
        { vehicleType: "İki Tekerlekli Araçlar", entryFee: 12, perMinuteFee: 1.10 },
        { vehicleType: "Otomobiller", entryFee: 20, perMinuteFee: 1.25 },
        { vehicleType: "Hafif Ticari Araçlar", entryFee: 35, perMinuteFee: 1.75 },
        { vehicleType: "Ağır Ticari Araçlar", entryFee: 48, perMinuteFee: 2.25 },
      ],
      discounts: [
        { range: "0-4 giriş", discountRate: "%0 indirim" },
        { range: "5-29 giriş", discountRate: "%5 indirim" },
        { range: "30 ve üzeri giriş", discountRate: "%8 indirim" },
      ],
    };
  },
  async mounted() {
    // Yeniden yükleme kontrolü
    if (!sessionStorage.getItem("reloaded")) {
      sessionStorage.setItem("reloaded", "true"); // Yeniden yükleme bayrağını ayarla
      window.location.reload(); // Sayfayı yeniden yükle
    } else {
      sessionStorage.removeItem("reloaded"); // Bayrağı temizle
      
    }
  },
};
</script>

<style scoped>
/* Başlık Stili */
h1 {
  color: #212529; /* Turuncu renk */
  font-size: 3em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
}

/* Card içeriği */
.card {
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  border-radius: 10px;
}

.card-header {
  padding: 5px;
  font-size: 1.2em;
  font-weight: 600;
}

/* Tablo */
table {
  margin: 10px 0; /* Tablo ile başlık arasındaki boşluk azaltıldı */
  width: 100%;
}
th {
  background-color: #f8f9fa;
  color: #212529;
  font-weight: bold;
  text-transform: uppercase;
}
td {
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  vertical-align: middle;
}

/* Genel Boşluk Ayarları */
.public-page {
  padding-bottom: 50px;
}
</style>
