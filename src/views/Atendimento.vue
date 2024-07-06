<template>
  <div class="Atendimento-container">
    <h2>Ficha de Atendimento</h2>
    <form @submit.prevent="submitAtendimento">
      <!-- Dados Pessoais -->
      <div v-if="currentStep === 1" class="section">
        <h3>Dados Pessoais</h3>
        <div class="form-group">
          <label>Nome do Paciente</label>
          <input type="text" v-model="nomePaciente" required>
        </div>
        <div class="form-group">
          <label>Data de Nascimento</label>
          <input type="date" v-model="dataNascimento" required>
        </div>
        <div class="form-group">
          <label>Gênero</label>
          <select v-model="genero" required>
            <option value="" disabled selected>Selecione</option>
            <option value="Masculino">Masculino</option>
            <option value="Feminino">Feminino</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div class="form-group">
          <label>Número do SUS</label>
          <input type="text" v-model="numeroSUS" required>
        </div>
        <div class="form-group">
          <label>Endereço</label>
          <input type="text" v-model="endereco" required>
        </div>
        <div class="form-group">
          <label>Telefone</label>
          <input type="text" v-model="telefone" required>
        </div>
        <div class="button-group">
          <button type="button" @click="nextStep" :disabled="!validateStep1">Próximo</button>
        </div>
      </div>

      <!-- Informações Médicas -->
      <div v-if="currentStep === 2" class="section">
        <h3>Informações Médicas</h3>
        <div class="form-group">
          <label>Principais Sintomas</label>
          <input type="text" v-model="sintomas" required>
        </div>
        <div class="form-group">
          <label>Temperatura</label>
          <input type="number" step="0.1" v-model="temperatura" required>
        </div>
        <div class="form-group">
          <label>Pressão Arterial</label>
          <input type="text" v-model="pressaoArterial" required>
        </div>
        <div class="form-group">
          <label>Cefaleia</label>
          <select v-model="cefaleia">
            <option value="SIM">SIM</option>
            <option value="NÃO">NÃO</option>
          </select>
        </div>
        <div class="form-group">
          <label>Vômito</label>
          <select v-model="vomito">
            <option value="SIM">SIM</option>
            <option value="NÃO">NÃO</option>
          </select>
        </div>
        <div class="form-group">
          <label>Dores no Corpo</label>
          <select v-model="doresCorpo">
            <option value="SIM">SIM</option>
            <option value="NÃO">NÃO</option>
          </select>
        </div>
        <div class="form-group">
          <label>Condição Geral do Paciente/Causa</label>
          <input type="text" v-model="condicaoGeral" required>
        </div>
        <div class="button-group">
          <button type="button" @click="prevStep">Voltar</button>
          <button type="submit" :disabled="saving">{{ editingAtendimento ? 'Atualizar Atendimento' : 'Salvar Atendimento' }}</button>
        </div>
      </div>
    </form>

    <div v-if="atendimentos.length" class="atendimentos-registrados">
      <h3>Atendimentos Registrados</h3>
      <div class="card-container">
        <div v-for="atendimento in atendimentos" :key="atendimento.id" class="card">
          <div class="card-content">
            <h4><strong>Paciente: </strong>{{ atendimento.nomePaciente }}</h4>
            <p><strong>Data de Nascimento:</strong> {{ atendimento.dataNascimento }}</p>
            <p><strong>Gênero:</strong> {{ atendimento.genero }}</p>
            <p><strong>Número do SUS:</strong> {{ atendimento.numeroSUS }}</p>
            <p><strong>Endereço:</strong> {{ atendimento.endereco }}</p>
            <p><strong>Telefone:</strong> {{ atendimento.telefone }}</p>
            <p><strong>Principais Sintomas:</strong> {{ atendimento.sintomas }}</p>
            <p><strong>Condição Geral do Paciente/Causa:</strong> {{ atendimento.condicaoGeral }}</p>
            <p><strong>Temperatura:</strong> {{ atendimento.temperatura }}</p>
            <p><strong>Pressão Arterial:</strong> {{ atendimento.pressaoArterial }}</p>
            <p><strong>Cefaleia:</strong> {{ atendimento.cefaleia }}</p>
            <p><strong>Vômito:</strong> {{ atendimento.vomito }}</p>
            <p><strong>Dores no Corpo:</strong> {{ atendimento.doresCorpo }}</p>
          </div>
          <div class="card-actions">
            <button @click="editAtendimento(atendimento)">Editar</button>
            <button @click="deleteAtendimento(atendimento)">Excluir</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>



<script>
import { ref, onMounted, computed } from 'vue';
import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  setup() {
    const nomePaciente = ref('');
    const dataNascimento = ref('');
    const genero = ref('');
    const numeroSUS = ref('');
    const endereco = ref('');
    const telefone = ref('');
    const sintomas = ref('');
    const temperatura = ref('');
    const pressaoArterial = ref('');
    const cefaleia = ref('');
    const vomito = ref('');
    const doresCorpo = ref('');
    const condicaoGeral = ref('');
    const atendimentos = ref([]);
    const atendimentosCollection = collection(db, 'atendimentos');
    const router = useRouter();
    const auth = getAuth();
    const editingAtendimento = ref(null);
    const saving = ref(false);
    const currentStep = ref(1);

    const submitAtendimento = async () => {
      try {
        saving.value = true;
        const atendimentoData = {
          nomePaciente: nomePaciente.value,
          dataNascimento: dataNascimento.value,
          genero: genero.value,
          numeroSUS: numeroSUS.value,
          endereco: endereco.value,
          telefone: telefone.value,
          sintomas: sintomas.value,
          temperatura: parseFloat(temperatura.value),
          pressaoArterial: pressaoArterial.value,
          cefaleia: cefaleia.value,
          vomito: vomito.value,
          doresCorpo: doresCorpo.value,
          condicaoGeral: condicaoGeral.value,
          data: new Date(),
        };
        if (editingAtendimento.value) {
          await updateDoc(doc(db, 'atendimentos', editingAtendimento.value.id), atendimentoData);
          alert('Atendimento atualizado');
        } else {
          await addDoc(atendimentosCollection, atendimentoData);
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
      dataNascimento.value = atendimento.dataNascimento;
      genero.value = atendimento.genero;
      numeroSUS.value = atendimento.numeroSUS;
      endereco.value = atendimento.endereco;
      telefone.value = atendimento.telefone;
      sintomas.value = atendimento.sintomas;
      temperatura.value = atendimento.temperatura.toString();
      pressaoArterial.value = atendimento.pressaoArterial;
      cefaleia.value = atendimento.cefaleia;
      vomito.value = atendimento.vomito;
      doresCorpo.value = atendimento.doresCorpo;
      condicaoGeral.value = atendimento.condicaoGeral;
      currentStep.value = 2;
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
      dataNascimento.value = '';
      genero.value = '';
      numeroSUS.value = '';
      endereco.value = '';
      telefone.value = '';
      sintomas.value = '';
      temperatura.value = '';
      pressaoArterial.value = '';
      cefaleia.value = '';
      vomito.value = '';
      doresCorpo.value = '';
      condicaoGeral.value = '';
      currentStep.value = 1;
    };

    const validateStep1 = computed(() => {
      return (
        nomePaciente.value &&
        dataNascimento.value &&
        genero.value &&
        numeroSUS.value &&
        endereco.value &&
        telefone.value
      );
    });

    const validateStep2 = computed(() => {
      return (
        sintomas.value &&
        temperatura.value &&
        pressaoArterial.value &&
        (cefaleia.value || vomito.value || doresCorpo.value)
      );
    });

    const nextStep = () => {
      if (validateStep1.value) {
        currentStep.value = 2;
      }
    };

    const prevStep = () => {
      currentStep.value = 1;
    };

    const validateTemperatura = () => {
      const value = temperatura.value;
      if (!/^\d+(\.\d+)?$/.test(value)) {
        temperatura.value = value.slice(0, -1);
      }
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
      dataNascimento,
      genero,
      numeroSUS,
      endereco,
      telefone,
      sintomas,
      temperatura,
      pressaoArterial,
      cefaleia,
      vomito,
      doresCorpo,
      condicaoGeral,
      submitAtendimento,
      atendimentos,
      editAtendimento,
      deleteAtendimento,
      saving,
      editingAtendimento,
      currentStep,
      nextStep,
      prevStep,
      validateStep1,
      validateStep2,
      validateTemperatura,
    };
  },
};
</script>



<style scoped>
.Atendimento-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  font-family: 'Roboto', sans-serif;
}

h2,
h3 {
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
  text-align: start;
}

.form-group input,
.form-group textarea,
.form-group select {
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

.button-group {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 12px;
  font-size: 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-top: 10px;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

button:hover {
  background-color: #45a049;
}

.atendimentos-registrados {
  margin-top: 40px;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 500px;
  padding: 20px;
  margin-bottom: 20px;
}

.card-content {
  margin-bottom: 20px;
  text-align: start;
}

.card-content h4 {
  margin-top: 0;
  font-size: 20px;
  color: #333;
}

.card-content p {
  margin: 10px 0;
  font-size: 16px;
}

.card-actions {
  display: flex;
  justify-content: center;
}

.card-actions button {
  background-color: #2196f3;
  color: white;
  border: none;
  padding: 8px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 5px;
}

.card-actions button:hover {
  background-color: #0b7dda;
}
</style>
