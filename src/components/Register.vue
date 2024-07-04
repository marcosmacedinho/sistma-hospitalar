<template>
    <div>
      <h2>Registrar</h2>
      <form @submit.prevent="register">
        <input type="email" v-model="email" placeholder="Email" required>
        <input type="password" v-model="password" placeholder="Senha" required>
        <input type="password" v-model="confirmPassword" placeholder="Confirme a Senha" required>
        <button type="submit">Registrar</button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
  import { useRouter } from 'vue-router';
  
  export default {
    setup() {
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const auth = getAuth();
      const router = useRouter();
  
      const register = async () => {
        if (password.value !== confirmPassword.value) {
          alert('As senhas não coincidem');
          return;
        }
  
        try {
          await createUserWithEmailAndPassword(auth, email.value, password.value);
          alert('Usuário registrado com sucesso');
          router.push('/login');
        } catch (error) {
          alert(`Erro ao registrar: ${error.message}`);
        }
      };
  
      return { email, password, confirmPassword, register };
    },
  };
  </script>
  
  <style scoped>
  form {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    margin: auto;
  }
  input {
    margin-bottom: 10px;
    padding: 8px;
    font-size: 16px;
  }
  button {
    padding: 10px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
  }
  button:hover {
    background-color: #45a049;
  }
  </style>
  