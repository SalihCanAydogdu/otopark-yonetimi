<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="logo-and-nav">
          <div class="logo">
            <img src="@/assets/otopark_yonetim_sistemi.png" alt="OtoparkYonetimSistemi logo" />
          </div>
          <nav class="nav">
            <div class="left-nav">
              <router-link to="/">Fiyatlandirma</router-link>
              <router-link to="/user" v-if="isUserAuthenticated">Otopark Yonetim Sistemi</router-link>
              <router-link to="/admin" v-if="isAdminAuthenticated">Admin</router-link>
            </div>
            <div class="signin-container">
              <router-link
                v-if="!isAuthenticated"
                to="/signin"
              >
                Giriş
              </router-link>
              <a
                v-else
                class="logout-link"
                @click.prevent="logout"
              >
                Çıkış
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <router-view></router-view>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>
          <strong>OtoparkYonetimSistemi</strong>
        </p>
      </div>
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import { useRouter } from "vue-router";

export default {
  name: "App",
  data() {
    return {
      isUserAuthenticated: false,
      isAdminAuthenticated: false,
    };
  },
  computed: {
    isAuthenticated() {
      return (
        this.isUserAuthenticated ||
        this.isAdminAuthenticated
      );
    },
  },
  methods: {
    fetchUserContent() {
      axios
        .get("http://localhost:8080/api/test/user", { withCredentials: true })
        .then(() => {
          this.isUserAuthenticated = true;
        })
        .catch(() => {
          this.isUserAuthenticated = false;
        });
    },
    fetchAdminContent() {
      axios
        .get("http://localhost:8080/api/test/admin", { withCredentials: true })
        .then(() => {
          this.isAdminAuthenticated = true;
        })
        .catch(() => {
          this.isAdminAuthenticated = false;
        });
    },
    logout() {
      const router = useRouter();
      axios
        .post("http://localhost:8080/api/auth/logout", {}, { withCredentials: true })
        .then(() => {
          this.isUserAuthenticated = false;
          this.isAdminAuthenticated = false;
          window.location.reload();
          router.replace("/signin");
        })
        .catch(() => {
          //alert("Çıkış işlemi sırasında bir hata oluştu.");
        });
    },
  },
  created() {
    this.fetchUserContent();
    this.fetchAdminContent();
  },
};
</script>

<style scoped>
/* Genel düzenlemeler */
html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

body {
  background-color: #f1f1f1;
}

/* Konteyner */
.container {
  max-width: 90vw;
  margin: 0 auto;
  padding: 0 5vw;
}

/* Header */
.header {
  background-color: #343a40;
  padding: 4vh 0;
  border-bottom: 1px solid #ddd;
  position: relative;
  text-align: center; 
}

.logo-and-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo img {
  width: 22%;
  margin-right: 2vw;
  display: block;
}

/* Navigasyon Menüsü */
.nav {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}

.left-nav {
  display: flex;
  gap: 2vw;
  margin-left: -25vw;
}

.nav a, .logout-link {
  text-decoration: none;
  color: white;
  font-size: 1.8vw;
  transition: color 0.3s ease;
  text-align: center;
}

.nav a:hover, .logout-link:hover {
  color: #007bff;
}

.signin-container {
  margin-left: auto;
}

/* Ana İçerik */
.main-content {
  flex: 1;
  background-color: white;
  padding: 5vh 0;
  min-height: calc(100vh - 30vh);
}

/* Footer */
.footer {
  background-color: #343a40;
  color: white;
  padding: 3vh 0;
  text-align: center;
}

.footer p {
  margin: 0.5vh 0;
}

/* Responsive Tasarım (Tablet ve Mobil) */
@media (max-width: 1024px) {
  .header {
    padding: 6vh 0;
  }

  .logo-and-nav {
    flex-direction: column;
    align-items: center;
  }

  .logo img {
    width: 40%;
    margin-bottom: 3vh;
  }

  .nav {
    flex-direction: column;
    gap: 2vh;
    align-items: center;
  }

  .nav a, .logout-link {
    font-size: 4vw;
  }

  .left-nav {
    margin-left: 0;
  }

  .signin-container {
    margin-top: 2vh;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 8vh 0;
  }

  .logo-and-nav {
    flex-direction: column;
    align-items: center;
  }

  .logo img {
    width: 50%;
    margin-bottom: 4vh;
  }

  .nav {
    flex-direction: column;
    gap: 3vh;
    align-items: center;
  }

  .nav a, .logout-link {
    font-size: 5vw;
  }

  .signin-container {
    margin-top: 3vh;
  }
}

@media (max-width: 480px) {
  .logo img {
    width: 60%;
  }

  .nav a, .logout-link {
    font-size: 6vw;
    padding: 2vh 0;
  }

  .footer {
    font-size: 3vw;
  }

  .footer p {
    font-size: 4vw;
    margin: 1vh 0;
  }

  .signin-container {
    margin-top: 4vh;
  }
}
</style>
