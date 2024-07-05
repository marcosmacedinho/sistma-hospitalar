<template>
  <div class="visualizar-atendimentos-container">
    <h2>Atendimentos Registrados</h2>
    <div v-if="atendimentos.length">
      <div class="atendimentos-list">
        <div v-for="atendimento in atendimentos" :key="atendimento.id" class="atendimento-item">
          <div class="atendimento-header">
            <strong>{{ atendimento.nomePaciente }}</strong> - ({{ atendimento.genero }})
          </div>
          <div class="atendimento-details">
            <div class="info-item">
              <strong>Data de Nascimento:</strong> {{ atendimento.dataNascimento }}
            </div>
            <div class="info-item">
              <strong>Número do SUS:</strong> {{ atendimento.numeroSUS }}
            </div>
            <div class="info-item">
              <strong>Endereço:</strong> {{ atendimento.endereco }}
            </div>
            <div class="info-item">
              <strong>Telefone:</strong> {{ atendimento.telefone }}
            </div>
            <div class="info-item">
              <strong>Sintomas:</strong> {{ atendimento.sintomas }}
            </div>
            <div class="info-item">
              <strong>Temperatura:</strong> {{ atendimento.temperatura }} °C
            </div>
            <div class="info-item">
              <strong>Pressão Arterial:</strong> {{ atendimento.pressaoArterial }}
            </div>
            <div class="info-item">
              <strong>Cefaleia:</strong> {{ atendimento.cefaleia }}
            </div>
            <div class="info-item">
              <strong>Vômito:</strong> {{ atendimento.vomito }}
            </div>
            <div class="info-item">
              <strong>Dores no Corpo:</strong> {{ atendimento.doresCorpo }}
            </div>
          </div>
          <hr>
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-records">Nenhum atendimento registrado.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Certifique-se de que o caminho está correto
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  setup() {
    const atendimentos = ref([]);
    const atendimentosCollection = collection(db, 'atendimentos');
    const router = useRouter();
    const auth = getAuth();

    const fetchAtendimentos = async () => {
      const querySnapshot = await getDocs(atendimentosCollection);
      atendimentos.value = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
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
      atendimentos,
    };
  },
};
</script>

  
  <style scoped>
  .visualizar-atendimentos-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
    background: #f5f5f5;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    font-family: 'Roboto', sans-serif;
  }
  
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
    font-size: 24px;
  }
  
  .atendimentos-list {
    margin-top: 20px;
  }
  
  .atendimento-item {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
    padding: 20px;
  }
  
  .atendimento-header {
    font-weight: bold;
    margin-bottom: 10px;
    font-size: 18px;
  }
  
  .atendimento-details {
    line-height: 1.6;
  }
  
  .info-item {
    margin-bottom: 10px;
  }
  
  .no-records {
    text-align: center;
    margin-top: 20px;
    color: #888;
    font-style: italic;
  }
  
  @media screen and (max-width: 600px) {
    .visualizar-atendimentos-container {
      padding: 15px;
    }
    
    .atendimento-item {
      padding: 15px;
    }
  }
  </style>
  