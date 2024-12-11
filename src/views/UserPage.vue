<template>
  <div class="vehicle-entry-page">
    <!-- Başlık ve Açıklama -->
    <h1>Otopark Yönetim Sistemi</h1>
    <p>{{ message }}</p>

    <!-- Araç Girişi Formu -->
    <div class="form-wrapper">
      <div class="form-section">
        <h2>Araç Girişi</h2>
        <form @submit.prevent="submitForm">
          <div class="input-group">
            <label for="plaka">Araç Plakası:</label>
            <input
              type="text"
              id="plaka"
              v-model="plaka"
              placeholder="Araç plakası girin"
            />
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
    };
  },
  methods: {
    // Kullanıcı bilgilerini almak ve mesajı güncellemek
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
    submitForm() {
  if (!this.plaka || !this.aracTuru) {
    this.errorMessage = "Lütfen tüm alanları doldurun!";
    this.successMessage = "";
    return;
  }

  axios
    .post(
      `http://localhost:8080/api/arac/girisYapti?plaka=${this.plaka}&aracTuru=${this.aracTuru}`,
      {}, // Gövde boş
      {
        withCredentials: true, // Çerezlerin ve kimlik doğrulama bilgilerini dahil et
      }
    )
    .then(() => {
      this.successMessage = "Araç başarıyla kaydedildi!";
      this.errorMessage = "";
      this.plaka = "";
      this.aracTuru = "";
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
          this.$router.push("/signin"); // Çıkış yaptıktan sonra giriş sayfasına yönlendirme
        })
        .catch(() => {
          alert("Çıkış işlemi sırasında bir hata oluştu.");
        });
    },
  },
  mounted() {
    this.fetchUserContent();
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

/* Header ve Form Ayrımı */
.header-wrapper {
  margin-bottom: 40px; /* Header ile form arasına boşluk ekler */
}

.form-wrapper {
  margin-top: 20px; /* Üst kısım ile form arasındaki boşluk */
}

/* Araç Girişi Formu */
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
</style>
