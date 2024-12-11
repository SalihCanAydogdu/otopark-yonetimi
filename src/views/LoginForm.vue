<template>
  <div class="login-background">
    <div class="login-container">
      <img src="@/assets/otopark_yonetim_sistemi.png" alt="OtoparkYonetimSistemi Logo" class="logo"/>
      <h1>Giriş Yap</h1>
      
            
      <!-- İlk Adım: Kullanıcı Adı ve Şifre -->
      <form v-if="currentStep === 'login'" @submit.prevent="login">
        <div class="form-group">
          <label for="username">Kullanıcı Adı:</label>
          <input v-model="username" id="username" type="text" required />
        </div>
        <div class="form-group">
          <label for="password">Şifre:</label>
          <input v-model="password" id="password" type="password" required />
        </div>
        <button type="submit">Giriş Yap</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      
      <!-- İkinci Adım: Doğrulama Kodu -->
      <form v-else-if="currentStep === 'verify'" @submit.prevent="verifyCode">
        <div class="form-group">
          <label for="verificationCode">Doğrulama Kodu:</label>
          <input v-model="verificationCode" id="verificationCode" type="text" required />
        </div>
        <button type="submit">Doğrulamayı Tamamla</button>
        <button type="button" @click="resendCode" class="resend-button">Kodu Yeniden Gönder</button>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </form>
      
      <!-- Başarılı Giriş -->
      <div v-else class="success-message">
        <p>Giriş başarılı! Yönlendiriliyorsunuz...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  name: 'LoginForm',
  setup() {
    const username = ref('');
    const password = ref('');
    const verificationCode = ref('');
    const errorMessage = ref('');
    const currentStep = ref('login'); // 'login' veya 'verify'
    const isLoading = ref(false); // Yükleme göstergesi
    const router = useRouter();

    // Giriş Yapma Metodu
    const login = async () => {
      try {
        isLoading.value = true; // Yükleme başlıyor
        const response = await axios.post('http://localhost:8080/api/auth/signin', {
          username: username.value,
          password: password.value,
        }, {
          withCredentials: true, // Çerezleri dahil et
        });

        // İlk adım başarılı, doğrulama kodu gönderildi
        currentStep.value = 'verify';
        errorMessage.value = ''; // Hata mesajını temizle
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      } finally {
        isLoading.value = false; // Yükleme tamamlandı
      }
    };

    // Doğrulama Kodu Doğrulama Metodu
    const verifyCode = async () => {
      try {
        isLoading.value = true;
        await axios.post('http://localhost:8080/api/auth/verify-code', {
          code: verificationCode.value,
        }, {
          withCredentials: true,
        });

        currentStep.value = 'success';
        await checkAuth(); // Doğrulama sonrası oturum geçerliliğini kontrol et
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Doğrulama başarısız. Lütfen kodu kontrol edin.';
      } finally {
        isLoading.value = false;
      }
    };

    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/auth/check-auth', {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        });
        router.push('/');
        if (response.status !== 200) {
          throw new Error('Yetkilendirme başarısız');
        }
      } catch (error) {
        router.push('/signin');
      }
    };

    // Doğrulama Kodunu Yeniden Gönderme Metodu
    const resendCode = async () => {
      try {
        isLoading.value = true;
        const response = await axios.post('http://localhost:8080/api/auth/resend-code', {
          username: username.value, // Veya kullanıcıyı belirlemenin başka bir yolu
        }, {
          withCredentials: true,
        });
        errorMessage.value = 'Doğrulama kodu yeniden gönderildi.';
      } catch (error) {
        errorMessage.value = error.response?.data?.message || 'Doğrulama kodu gönderilirken bir hata oluştu.';
      } finally {
        isLoading.value = false;
      }
    };

    // Sayfa yüklendiğinde oturum kontrolü
    onMounted(async () => {
      await checkAuth();
    });

    return {
      username,
      password,
      verificationCode,
      errorMessage,
      currentStep,
      isLoading,
      login,
      verifyCode,
      resendCode,
    };
  },
};
</script>

<style scoped>
.login-background {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #719fdf;
  text-align: center;
}

.login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 1200px; /* Genişliği 1200px olarak ayarladık */
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo {
  width: 180px;
  margin-bottom: 1rem;
}

h1 {
  margin-bottom: 1.5rem;
  color: #333;
  font-size: 2rem;
}

form {
  width: 100%;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
}

label {
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
  display: block;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

button {
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  margin-top: 1rem;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 0.9em;
  margin-top: 1rem;
}

.resend-button {
  margin-top: 0.5rem;
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  text-decoration: underline;
  font-size: 0.9rem;
}

.resend-button:hover {
  color: #0056b3;
}

.success-message {
  color: green;
  font-size: 1.2rem;
}

/* Orta büyüklükte ekranlar ve daha büyükleri için */
@media (min-width: 769px) {
  .login-container {
    max-width: 900px; /* Masaüstü ekranlarda genişlik 900px */
  }

  h1 {
    font-size: 2.5rem;
  }
}

/* Küçük ekranlar için */
@media (max-width: 768px) {
  .login-background {
    padding: 0 1rem;
  }

  .login-container {
    padding: 1rem;
    max-width: 100%; /* Küçük ekranlarda genişlik 100% */
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>