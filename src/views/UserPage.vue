<template>
  <div class="vehicle-entry-page">
    <!-- Başlık ve Açıklama -->
    <h1>Otopark Yönetim Sistemi</h1>
    <p>{{ message }}</p>

    <!-- Otoparktaki Araçlar Listesi -->
    <div class="vehicles-list">
      <h2>Otoparktaki Araçlar</h2>
      <div class="vehicle-cards">
        <div class="vehicle-card" v-for="arac in otoparktakiAraclar" :key="arac.id">
          <img :src="getImageForVehicle(arac.aracTuru)" alt="Araç Türü Resmi" class="vehicle-image" />
          <h3>{{ arac.aracTuru }}</h3>
          <p><strong>Plaka:</strong> {{ arac.plaka }}</p>
          <p><strong>Giriş Saati:</strong> {{ arac.girisSaati }}</p>

          <!-- Action Buttons -->
          <div class="actions">
            <button @click="fiyatHesapla(arac.id, arac.aracTuru)" class="action-button">Fiyat Hesapla</button>
            <button @click="indirimliFiyatHesapla(arac.id, arac.plaka, arac.aracTuru)" class="action-button">İndirimli Fiyat Hesapla</button>
            <button @click="aracCikisYap(arac.id)" class="action-button">Araç Çıkışı Yap</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Araç Girişi Formu -->
    <div class="form-wrapper">
      <div class="form-section">
        <h2>Araç Girişi</h2>
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <label for="plaka">Araç Plakası:</label>
            <input type="text" id="plaka" v-model="plaka" placeholder="Araç plakası girin" />
          </div>

          <div class="input-group">
            <label for="aracTuru">Araç Türü:</label>
            <select id="aracTuru" v-model="aracTuru">
              <option disabled value="">Araç Türü Seçin</option>
              <option value="IkiTekerliArac">İKİ TEKERLİ ARAÇ</option>
              <option value="Otomobil">OTOMOBİL</option>
              <option value="HafifTicariArac">HAFİF TİCARİ ARAÇ</option>
              <option value="AgirTicariArac">AĞIR TİCARİ ARAÇ</option>
            </select>
          </div>

          <button type="submit" class="submit-button">Araç Girişi Yap</button>
        </form>
      </div>
    </div>

    <!-- Mesajlar -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <!-- Çıkış Yap Butonu -->
    <div class="actions">
      <button @click="logout" class="logout-button">Çıkış Yap</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  name: "VehicleEntryPage",
  data() {
    return {
      message: "Otopark yönetim sistemine hoşgeldiniz, buradan araçların girişini kontrol edebilirsiniz.",
      plaka: "",
      aracTuru: "",
      errorMessage: "",
      successMessage: "",
      otoparktakiAraclar: [], // Otoparktaki araçların listesi
    };
  },
  methods: {
    fetchUserContent() {
      axios
        .get("http://localhost:8080/api/test/user", {
          withCredentials: true, // Oturum bilgilerini dahil eder
        })
        .then((response) => {
          if (response.data) {
            this.message = "Otopark yönetim sistemine hoşgeldiniz, buradan araçların giriş- çıkışını kontrol edebilirsiniz."; // Gelen veriyi message'a ata
          } else {
            this.message = "No data available.";
          }
        })
        .catch(() => {
          this.message = "Error loading content."; // Hata mesajı göster
          this.$router.push("/signin"); // Giriş sayfasına yönlendirme
        });
    },
    fetchOtoparktakiAraclar() {
      axios
        .get("http://localhost:8080/api/arac/otoparktakiAraclar", {
          withCredentials: true,
        })
        .then((response) => {
          this.otoparktakiAraclar = response.data; // Gelen veriyi listeye ata
        })
        .catch(() => {
          this.errorMessage = "Otoparktaki araçlar yüklenirken bir hata oluştu.";
        });
    },
    submitForm() {
      if (!this.plaka || !this.aracTuru) {
        this.errorMessage = "Lütfen tüm alanları doldurun!";
        this.successMessage = "";
        return;
      }

      axios
        .post(
          `http://localhost:8080/api/arac/girisYapti?plaka=${this.plaka}&aracTuru=${this.aracTuru}`,
          {},
          { withCredentials: true }
        )
        .then(() => {
          this.successMessage = "Araç başarıyla kaydedildi!";
          this.errorMessage = "";
          this.plaka = "";
          this.aracTuru = "";
          this.fetchOtoparktakiAraclar(); // Listeyi güncelle
        })
        .catch((error) => {
          this.errorMessage =
            error.response && error.response.data
              ? error.response.data
              : "Bir hata oluştu!";
          this.successMessage = "";
        });
    },
    logout() {
      axios
        .post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true })
        .then(() => {
          window.location.reload();
          this.$router.push("/signin");
        })
        .catch(() => {
          alert("Çıkış işlemi sırasında bir hata oluştu.");
        });
    },
    getImageForVehicle(aracTuru) {
      switch (aracTuru) {
        case "IkiTekerliArac":
          return new URL('@/assets/ikiTekerliArac.png', import.meta.url).href;
        case "Otomobil":
          return new URL('@/assets/otomobil.png', import.meta.url).href;
        case "HafifTicariArac":
          return new URL('@/assets/hafifTicariArac.png', import.meta.url).href;
        case "AgirTicariArac":
          return new URL('@/assets/agirTicariArac.png', import.meta.url).href;
        default:
          return "";
      }
    },
    
    // Fiyat Hesapla metodu
    fiyatHesapla(id, aracTuru) {
      axios
        .get(`http://localhost:8080/api/arac/fiyatHesapla/${aracTuru}`, {
          params: { id },
          withCredentials: true,
        })
        .then((response) => {
          alert(`Fiyat: ${response.data}`);
        })
        .catch(() => {
          alert("Fiyat hesaplama sırasında bir hata oluştu.");
        });
    },

    // İndirimli fiyat hesapla metodu
    indirimliFiyatHesapla(id, plaka, aracTuru) {
      axios
        .get(`http://localhost:8080/api/arac/indirimHesapla/${aracTuru}`, {
          params: { id, plaka },
          withCredentials: true,
        })
        .then((response) => {
          alert(`İndirimli Fiyat: ${response.data}`);
        })
        .catch(() => {
          alert("İndirimli fiyat hesaplama sırasında bir hata oluştu.");
        });
    },

    // Araç çıkışı yapma metodu
    aracCikisYap(id) {
      axios
        .post("http://localhost:8080/api/arac/cikisYapti", null, {
          params: { id },
          withCredentials: true,
        })
        .then(() => {
          alert("Araç çıkışı yapıldı.");
          this.fetchOtoparktakiAraclar(); // Listeyi güncelle
        })
        .catch(() => {
          alert("Araç çıkışı sırasında bir hata oluştu.");
        });
    }
  },
  mounted() {
    this.fetchUserContent();
    this.fetchOtoparktakiAraclar(); // İlk yüklemede araçları getir
  },
};
</script>


<style scoped>
/* Genel Stiller */
.vehicle-entry-page {
  margin: 2px auto;
  padding: 20px;
  max-width: 1400px;
  border-radius: 8px;
  background-color: white;
}

/* Araç Kartları */
.vehicle-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.vehicle-card {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.vehicle-card h3 {
  margin-bottom: 10px;
  font-size: 1.2em;
}

.vehicle-card p {
  margin: 5px 0;
  font-size: 0.9em;
  color: #333;
}

.vehicle-image {
  width: 100%;
  height: auto;
  max-height: 150px;
  object-fit: contain;
  margin-bottom: 15px;
}

/* Form ve Mesajlar */
.form-wrapper {
  margin-top: 20px;
}

.form-section {
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.form-section h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submit-button {
  width: 100%;
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.submit-button:hover {
  background-color: #0056b3;
}

/* Mesajlar */
.error-message {
  color: red;
  margin-top: 15px;
  font-weight: bold;
  text-align: center;
}

.success-message {
  color: green;
  margin-top: 15px;
  font-weight: bold;
  text-align: center;
}

/* Çıkış Butonu */
.actions {
  text-align: right;
  margin-top: 20px;
}

.logout-button {
  padding: 10px 15px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333;
}

/* Action Buttons */
.action-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.action-button:hover {
  background-color: #218838;
}

.actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
}
</style>
