<template>
  <div>
    <h1>User Page</h1>
    <p>{{ message }}</p>
    <!-- Çıkış Yap Butonu -->
    <div class="actions">
      <button @click="logout" class="logout-button">Çıkış Yap</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';

export default {
  name: "UserPageView",
  data() {
    return {
      message: "Loading...", // Başlangıçta "Loading..." yazacak
    };
  },
  methods: {
    fetchUserContent() {
      const router = useRouter();
      axios
        .get("http://localhost:8080/api/test/user", {
          withCredentials: true, // Oturum bilgilerini dahil eder
        })
        .then((response) => {
          if (response.data) {
            this.message = response.data; // Gelen veriyi message'a ata
          } else {
            this.message = "No data available.";
          }
        })
        .catch(() => {
          this.message = "Error loading content."; // Hata mesajı göster
          router.push("/signin");
        });
    },
    logout() {
      const router = useRouter();
      axios
        .post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true })
        .then(() => {
          router.push("/signin"); // Çıkış yaptıktan sonra giriş sayfasına yönlendirme
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
h1 {
  color: #4CAF50;
}

/* Çıkış Butonu Stili */
.actions {
  margin-top: 20px;
  text-align: right;
}

.logout-button {
  padding: 10px 15px;
  background-color: #dc3545; /* Kırmızı */
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.logout-button:hover {
  background-color: #c82333; /* Daha koyu kırmızı */
}
</style>
