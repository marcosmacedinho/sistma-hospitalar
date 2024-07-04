<template>
  <div class="auth-container">
    <h2>Login</h2>
    <form @submit.prevent="login">
      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" placeholder="Email" required />
      </div>
      <div class="form-group">
        <label>Senha</label>
        <input
          type="password"
          v-model="password"
          placeholder="Senha"
          required
        />
      </div>
      <div class="form-group">
        <label>Tipo de Usuário</label>
        <select v-model="userType" required>
          <option value="atendente">Atendente</option>
          <option value="medico">Médico</option>
        </select>
      </div>
      <button type="submit">Login</button>
      <router-link to="/register">Ir para o Cadastro</router-link>
    </form>
  </div>
</template>

<script>
import { ref } from "vue";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref("");
    const password = ref("");
    const userType = ref("atendente");
    const auth = getAuth();
    const router = useRouter();

    const login = async () => {
      try {
        await signInWithEmailAndPassword(auth, email.value, password.value);
        if (userType.value === "atendente") {
          router.push("/atendimento");
        } else if (userType.value === "medico") {
          router.push("/visualizar-atendimentos");
        }
      } catch (error) {
        alert(`Erro ao fazer login: ${error.message}`);
      }
    };

    return { email, password, userType, login };
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
