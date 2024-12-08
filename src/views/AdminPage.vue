<template>
  <div class="admin-page">
    <h1>Admin Paneli</h1>
    <p>Admin paneline hoş geldiniz. Buradan sistem ayarlarını yönetebilirsiniz.</p>

    <!-- Kullanıcı Listesi ve İşlemleri -->
    <div class="user-management">
      <h2>Kullanıcı Yönetimi</h2>
      <div v-if="users.length" class="user-list">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Kullanıcı Adı</th>
              <th>Email</th>
              <th>Roller</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.email }}</td>
              <td>{{ formattedRoles(user.roles) }}</td>
              <td class="action-buttons">
                <button @click="makeAdmin(user.id)" class="admin-button">Admin Yap</button>
                <button @click="makeModerator(user.id)" class="moderator-button">Moderatör Yap</button>
                <button @click="deleteUser(user.id)" class="delete-button">Sil</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="!users.length" class="info-message">Kullanıcı bulunamadı. Lütfen yenileyin.</p>
    </div>

    <!-- Yeni Kullanıcı Ekleme ve Şifre Değiştirme -->
    <div class="form-sections">
      <!-- Yeni Kullanıcı Ekle -->
      <div class="add-user">
        <h2>Yeni Kullanıcı Ekle</h2>
        <div class="input-group">
          <label for="add-user-username">Kullanıcı Adı:</label>
          <input v-model="newUser.username" id="add-user-username" type="text" placeholder="Kullanıcı adı" />
        </div>
        <div class="input-group">
          <label for="add-user-email">Email:</label>
          <input v-model="newUser.email" id="add-user-email" type="email" placeholder="Email" />
        </div>
        <div class="input-group">
          <label for="add-user-password">Şifre:</label>
          <input v-model="newUser.password" id="add-user-password" type="password" placeholder="Şifre" />
        </div>
        <button @click="addUser" class="add-user-button">Kullanıcı Ekle</button>
      </div>

      <!-- Şifre Değiştirme -->
      <div class="password-change">
        <h2>Şifre Değiştir</h2>
        <div class="input-group">
          <label for="change-user-username">Kullanıcı Adı:</label>
          <input v-model="passwordChangeRequest.username" id="change-user-username" type="text" placeholder="Kullanıcı adı" />
        </div>
        <div class="input-group">
          <label for="change-user-password">Yeni Şifre:</label>
          <input v-model="passwordChangeRequest.newPassword" id="change-user-password" type="password" placeholder="Yeni şifre" />
        </div>
        <button @click="changePassword" class="password-change-button">Şifre Değiştir</button>
      </div>
    </div>

    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>

    <div class="actions">
      <button @click="logout" class="logout-button">Çıkış Yap</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';

export default {
  name: 'AdminPage',
  setup() {
    const router = useRouter();
    const users = ref([]);
    const errorMessage = ref('');
    const successMessage = ref('');
    const passwordChangeRequest = ref({ username: '', newPassword: '' });
    const newUser = ref({ username: '', email: '', password: '' });

    const checkAdminStatus = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/test/admin", {
          withCredentials: true, // Oturum bilgilerini (ör. çerezleri) dahil eder
        });
        //message.value = response.data; // Başarı durumunda gelen veriyi message'a atar
      } catch (error) {
        //message.value = "Error loading content."; // Hata mesajı görüntülenir
        router.push("/signin"); // Giriş sayfasına yönlendirme
      }
    };


    const formattedRoles = (roles) => {
      if (!Array.isArray(roles)) return '';
      return roles.map((role) => role.name.replace('ROLE_', '')).join(', ');
    };

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/users', {
          withCredentials: true,
        });
        users.value = response.data;
        successMessage.value = '';
        errorMessage.value = '';
      } catch (error) {
        errorMessage.value = 'Kullanıcıları yüklerken hata oluştu.';
        successMessage.value = '';
      }
    };

    const addUser = async () => {
      try {
        await axios.post('http://localhost:8080/api/auth/signup', newUser.value, {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        successMessage.value = 'Kullanıcı başarıyla eklendi.';
        errorMessage.value = '';
        newUser.value = { username: '', email: '', password: '' };
        fetchUsers();
      } catch (error) {
        errorMessage.value = 'Kullanıcı eklenirken hata oluştu.';
        successMessage.value = '';
      }
    };

    const makeModerator = async (userId) => {
      try {
        await axios.post(`http://localhost:8080/api/users/${userId}/moderator`, {}, {
          withCredentials: true,
        });
        successMessage.value = `Kullanıcı (ID: ${userId}) moderatör yapıldı.`;
        errorMessage.value = '';
        fetchUsers();
      } catch (error) {
        errorMessage.value = 'Kullanıcı moderatör yapılırken hata oluştu.';
        successMessage.value = '';
      }
    };

    const makeAdmin = async (userId) => {
      try {
        await axios.post(`http://localhost:8080/api/users/${userId}/admin`, {}, {
          withCredentials: true,
        });
        successMessage.value = `Kullanıcı (ID: ${userId}) admin yapıldı.`;
        errorMessage.value = '';
        fetchUsers();
      } catch (error) {
        errorMessage.value = 'Kullanıcı admin yapılırken hata oluştu.';
        successMessage.value = '';
      }
    };

    const deleteUser = async (userId) => {
      try {
        await axios.delete(`http://localhost:8080/api/users/${userId}`, {
          withCredentials: true,
        });
        successMessage.value = `Kullanıcı (ID: ${userId}) silindi.`;
        errorMessage.value = '';
        fetchUsers();
      } catch (error) {
        errorMessage.value = 'Kullanıcı silinirken hata oluştu.';
        successMessage.value = '';
      }
    };

    const changePassword = async () => {
      try {
        await axios.put(
          'http://localhost:8080/api/users/change-password',
          passwordChangeRequest.value,
          {
            withCredentials: true,
          }
        );
        successMessage.value = 'Şifre başarıyla değiştirildi.';
        errorMessage.value = '';
        passwordChangeRequest.value = { username: '', newPassword: '' };
      } catch (error) {
        errorMessage.value = 'Şifre değiştirme sırasında hata oluştu.';
        successMessage.value = '';
      }
    };

    const logout = async () => {
      try {
        await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
        window.location.reload();
        router.push('/signin');
      } catch (error) {
        //alert('Çıkış işlemi sırasında bir hata oluştu.');
      }
    };

    onMounted(async () => {
      checkAdminStatus();
      await fetchUsers();
    });

    return {
      users,
      fetchUsers,
      formattedRoles,
      makeModerator,
      makeAdmin,
      deleteUser,
      addUser,
      changePassword,
      passwordChangeRequest,
      logout,
      successMessage,
      errorMessage,
      newUser,
    };
  },
};
</script>

<style scoped>
/* Genel Stiller */
/* Genel Stiller */
.user-management,
.add-user,
.password-change {
  margin: 20px 0;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.user-management h2,
.add-user h2,
.password-change h2 {
  font-size: 1.5em;
  margin-bottom: 15px;
}

.table-container {
  max-width: 100%;
  overflow-x: auto;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-list th, .user-list td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.user-list th {
  background-color: #f4f4f4;
  font-weight: bold;
}

.user-list tr:hover {
  background-color: #f1f1f1;
}

/* Action Butonları */
.action-buttons button {
  padding: 10px 15px;
  font-size: 0.9em;
  margin-right: 10px;
  border-radius: 5px;
  cursor: pointer;
}

.admin-button {
  background-color: #007bff; /* Mavi */
  color: white;
}

.admin-button:hover {
  background-color: #0056b3; /* Koyu Mavi */
}

.moderator-button {
  background-color: #5bc0de; /* Açık Mavi */
  color: white;
}

.moderator-button:hover {
  background-color: #31b0d5; /* Daha Koyu Açık Mavi */
}

.delete-button {
  background-color: #dc3545; /* Kırmızı */
  color: white;
}

.delete-button:hover {
  background-color: #c82333; /* Koyu Kırmızı */
}

/* Formları yan yana yerleştirmek için düzenleme */
.form-sections {
  display: flex;
  justify-content: space-between;
}

.add-user,
.password-change {
  display: inline-block;
  vertical-align: top;
  width: 48%;
  margin-right: 2%;
}

.password-change {
  margin-right: 0;
}

.input-group {
  margin-bottom: 15px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  padding: 10px 15px;
  border: none;
  background-color: #007bff;
  color: white;
  font-size: 1em;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
}

.success-message {
  color: green;
}

.actions {
  margin-top: 20px;
  text-align: right;
}

.logout-button {
  padding: 10px 15px;
  background-color: #dc3545;
}
</style>


