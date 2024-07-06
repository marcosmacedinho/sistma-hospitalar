<template>
  <div class="auth-container">
    <h2>Registrar</h2>
    <form @submit.prevent="register">
      <div class="form-group">
        <label>Nome Completo</label>
        <input type="text" v-model="fullName" placeholder="Nome Completo" required />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input type="password" v-model="password" placeholder="Senha" required />
      </div>
      <div class="form-group">
        <label>Confirmar Senha</label>
        <input type="password" v-model="confirmPassword" placeholder="Confirme a Senha" required />
      </div>
      <div class="form-group">
        <label>Gênero</label>
        <select v-model="gender" required>
          <option value="" disabled>Selecione o Gênero</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
        </select>
      </div>
      <button type="submit">Registrar</button>
      <router-link to="/login">Ir para o Login</router-link>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'vue-router';
import { db } from '../firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

export default {
  setup() {
    const fullName = ref('');
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const gender = ref('');
    const auth = getAuth();
    const router = useRouter();

    const register = async () => {
      if (password.value !== confirmPassword.value) {
        alert('As senhas não coincidem');
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
        const user = userCredential.user;
        await setDoc(doc(db, 'users', user.uid), {
          fullName: fullName.value,
          email: email.value,
          gender: gender.value,
          uid: user.uid,
        });
        alert('Usuário registrado com sucesso');
        router.push('/login');
      } catch (error) {
        alert(`Erro ao registrar: ${error.message}`);
      }
    };

    return { fullName, email, password, confirmPassword, gender, register };
  },
};
</script>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
}

form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 10px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin: 10px 0;
  align-self: center;
}

button:hover {
  background-color: #45a049;
}
</style>
