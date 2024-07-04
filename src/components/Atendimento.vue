<template>
    <div class="atendimento-container">
      <h2>Ficha de Atendimento</h2>
      <form @submit.prevent="submitAtendimento">
        <div class="section">
          <h3>Dados Pessoais</h3>
          <div class="form-group">
            <label>Nome do Paciente</label>
            <input type="text" v-model="nomePaciente" required>
          </div>
          <div class="form-group">
            <label>Idade</label>
            <input type="number" v-model="idade" required>
          </div>
          <div class="form-group">
            <label>Gênero</label>
            <input type="text" v-model="genero" required>
          </div>
          <div class="form-group">
            <label>Endereço</label>
            <input type="text" v-model="endereco" required>
          </div>
          <div class="form-group">
            <label>Telefone</label>
            <input type="text" v-model="telefone" required>
          </div>
        </div>
        
        <div class="section">
          <h3>Informações Médicas</h3>
          <div class="form-group">
            <label>Sintomas</label>
            <input type="text" v-model="sintomas" required>
          </div>
          <div class="form-group">
            <label>Peso (kg)</label>
            <input type="number" v-model="peso" required>
          </div>
          <div class="form-group">
            <label>Altura (cm)</label>
            <input type="number" v-model="altura" required>
          </div>
          <div class="form-group">
            <label>Histórico Médico</label>
            <textarea v-model="historicoMedico"></textarea>
          </div>
        </div>
  
        <button type="submit" :disabled="saving">{{ editingAtendimento ? 'Atualizar Atendimento' : 'Salvar Atendimento' }}</button>
      </form>
  
      <div v-if="atendimentos.length">
        <h3>Atendimentos Registrados</h3>
        <ul>
          <li v-for="atendimento in atendimentos" :key="atendimento.id">
            <div class="atendimento-item">
              <strong>Nome:</strong> {{ atendimento.nomePaciente }}<br>
              <strong>Idade:</strong> {{ atendimento.idade }}<br>
              <strong>Gênero:</strong> {{ atendimento.genero }}<br>
              <strong>Endereço:</strong> {{ atendimento.endereco }}<br>
              <strong>Telefone:</strong> {{ atendimento.telefone }}<br>
              <strong>Sintomas:</strong> {{ atendimento.sintomas }}<br>
              <strong>Peso:</strong> {{ atendimento.peso }} kg<br>
              <strong>Altura:</strong> {{ atendimento.altura }} cm<br>
              <strong>Histórico Médico:</strong> {{ atendimento.historicoMedico }}<br>
              <div class="atendimento-actions">
                <button @click="editAtendimento(atendimento)">Editar</button>
                <button @click="deleteAtendimento(atendimento)">Excluir</button>
              </div>
            </div>
            <hr>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  import { db } from '../firebaseConfig';
  import { useRouter } from 'vue-router';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  
  export default {
    setup() {
      const nomePaciente = ref('');
      const idade = ref(0);
      const genero = ref('');
      const endereco = ref('');
      const telefone = ref('');
      const sintomas = ref('');
      const peso = ref(0);
      const altura = ref(0);
      const historicoMedico = ref('');
      const atendimentos = ref([]);
      const atendimentosCollection = collection(db, 'atendimentos');
      const router = useRouter();
      const auth = getAuth();
      const editingAtendimento = ref(null);
      const saving = ref(false);
  
      const submitAtendimento = async () => {
        try {
          saving.value = true;
          if (editingAtendimento.value) {
            await updateDoc(doc(db, 'atendimentos', editingAtendimento.value.id), {
              nomePaciente: nomePaciente.value,
              idade: idade.value,
              genero: genero.value,
              endereco: endereco.value,
              telefone: telefone.value,
              sintomas: sintomas.value,
              peso: peso.value,
              altura: altura.value,
              historicoMedico: historicoMedico.value,
              data: new Date(),
            });
            alert('Atendimento atualizado');
          } else {
            await addDoc(atendimentosCollection, {
              nomePaciente: nomePaciente.value,
              idade: idade.value,
              genero: genero.value,
              endereco: endereco.value,
              telefone: telefone.value,
              sintomas: sintomas.value,
              peso: peso.value,
              altura: altura.value,
              historicoMedico: historicoMedico.value,
              data: new Date(),
            });
            alert('Atendimento salvo');
          }
          clearFields();
          fetchAtendimentos();
        } catch (error) {
          alert(`Erro ao salvar atendimento: ${error.message}`);
        } finally {
          saving.value = false;
        }
      };
  
      const fetchAtendimentos = async () => {
        const querySnapshot = await getDocs(atendimentosCollection);
        atendimentos.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      };
  
      const editAtendimento = (atendimento) => {
        editingAtendimento.value = atendimento;
        nomePaciente.value = atendimento.nomePaciente;
        idade.value = atendimento.idade;
        genero.value = atendimento.genero;
        endereco.value = atendimento.endereco;
        telefone.value = atendimento.telefone;
        sintomas.value = atendimento.sintomas;
        peso.value = atendimento.peso;
        altura.value = atendimento.altura;
        historicoMedico.value = atendimento.historicoMedico;
      };
  
      const deleteAtendimento = async (atendimento) => {
        if (confirm(`Tem certeza que deseja excluir o atendimento de ${atendimento.nomePaciente}?`)) {
          await deleteDoc(doc(db, 'atendimentos', atendimento.id));
          fetchAtendimentos();
        }
      };
  
      const clearFields = () => {
        editingAtendimento.value = null;
        nomePaciente.value = '';
        idade.value = 0;
        genero.value = '';
        endereco.value = '';
        telefone.value = '';
        sintomas.value = '';
        peso.value = 0;
        altura.value = 0;
        historicoMedico.value = '';
      };
  
      onMounted(() => {
        onAuthStateChanged(auth, user => {
          if (!user) {
            router.push('/login');
          } else {
            fetchAtendimentos();
          }
        });
      });
  
      return {
        nomePaciente,
        idade,
        genero,
        endereco,
        telefone,
        sintomas,
        peso,
        altura,
        historicoMedico,
        submitAtendimento,
        atendimentos,
        editAtendimento,
        deleteAtendimento,
        saving,
        editingAtendimento
      };
    },
  };
  </script>
  
  <style scoped>
  .atendimento-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 12px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
  }
  
  h2, h3 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  .section {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    background: #fff;
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
  .form-group textarea {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-group textarea {
    resize: vertical;
    height: 100px;
  }
  
  button {
    padding: 12px;
    font-size: 16px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
    margin-top: 10px;
    align-self: center;
  }
  
  button:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
  }
  
  .atendimento-item {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding: 15px;
  }
  
  .atendimento-actions {
    margin-top: 10px;
  }
  
  .atendimento-actions button {
    margin-right: 10px;
  }
  </style>
  