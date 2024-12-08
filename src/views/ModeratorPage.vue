<template>
  <div>
    <h1>Moderator Page</h1>
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
  name: "ModeratorPageView",
  data() {
    return {
      message: "Loading...", // Başlangıçta mesaj "Loading..." olarak ayarlanır
    };
  },
  methods: {
    fetchModeratorContent() {
      const router = useRouter(); 
      axios
        .get("http://localhost:8080/api/test/mod", {
          withCredentials: true, // Oturum bilgilerini (ör. çerezleri) dahil eder
        })
        .then((response) => {
          this.message = response.data; // Başarı durumunda gelen veriyi message'a atar
        })
        .catch(() => {
          this.message = "Error loading content."; // Hata mesajı görüntülenir
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
    this.fetchModeratorContent(); // Bileşen yüklendiğinde içerik çekme fonksiyonu çağrılır
  },
};
</script>

<style scoped>
h1 {
  color: #FF5722; /* Turuncu renk */
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
