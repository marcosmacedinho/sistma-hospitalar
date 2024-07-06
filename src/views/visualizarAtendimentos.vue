<template>
  <div class="visualizar-atendimentos-container">
    <h1>{{ saudacao }}, {{ titulo }} {{ nomeMedico }}</h1>
    <h2>Atendimentos Registrados</h2>
    <div v-if="atendimentos.length">
      <div class="atendimentos-list">
        <div v-for="atendimento in atendimentos" :key="atendimento.id" class="atendimento-item">
          <div class="atendimento-header">
            <strong>{{ atendimento.nomePaciente }}</strong> - ({{ atendimento.genero }})
          </div>
          <div class="atendimento-details">
            <div class="info-item"><strong>Data de Nascimento:</strong> {{ atendimento.dataNascimento }}</div>
            <div class="info-item"><strong>Número do SUS:</strong> {{ atendimento.numeroSUS }}</div>
            <div class="info-item"><strong>Endereço:</strong> {{ atendimento.endereco }}</div>
            <div class="info-item"><strong>Telefone:</strong> {{ atendimento.telefone }}</div>
            <div class="info-item"><strong>Sintomas:</strong> {{ atendimento.sintomas }}</div>
            <div class="info-item"><strong>Temperatura:</strong> {{ atendimento.temperatura }} °C</div>
            <div class="info-item"><strong>Pressão Arterial:</strong> {{ atendimento.pressaoArterial }}</div>
            <div class="info-item"><strong>Cefaleia:</strong> {{ atendimento.cefaleia }}</div>
            <div class="info-item"><strong>Vômito:</strong> {{ atendimento.vomito }}</div>
            <div class="info-item"><strong>Dores no Corpo:</strong> {{ atendimento.doresCorpo }}</div>
            <div class="info-item"><strong>Histórico Médico:</strong> {{ atendimento.historicoMedico }}</div>
            <button @click="finalizeAtendimento(atendimento)">Atendimento Finalizado</button>
          </div>
          <hr />
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-records">Nenhum atendimento registrado até o momento.</p>
    </div>
    <h2>Atendimentos Finalizados</h2>
    <div v-if="atendimentosFinalizados.length">
      <div class="atendimentos-list">
        <div v-for="atendimento in atendimentosFinalizados" :key="atendimento.id" class="atendimento-item">
          <div class="atendimento-header">
            <strong>{{ atendimento.nomePaciente }}</strong> - ({{ atendimento.genero }})
          </div>
          <div class="atendimento-details">
            <div class="info-item"><strong>Data de Nascimento:</strong> {{ atendimento.dataNascimento }}</div>
            <div class="info-item"><strong>Número do SUS:</strong> {{ atendimento.numeroSUS }}</div>
            <div class="info-item"><strong>Endereço:</strong> {{ atendimento.endereco }}</div>
            <div class="info-item"><strong>Telefone:</strong> {{ atendimento.telefone }}</div>
            <div class="info-item"><strong>Sintomas:</strong> {{ atendimento.sintomas }}</div>
            <div class="info-item"><strong>Temperatura:</strong> {{ atendimento.temperatura }} °C</div>
            <div class="info-item"><strong>Pressão Arterial:</strong> {{ atendimento.pressaoArterial }}</div>
            <div class="info-item"><strong>Cefaleia:</strong> {{ atendimento.cefaleia }}</div>
            <div class="info-item"><strong>Vômito:</strong> {{ atendimento.vomito }}</div>
            <div class="info-item"><strong>Dores no Corpo:</strong> {{ atendimento.doresCorpo }}</div>
            <div class="info-item"><strong>Histórico Médico:</strong> {{ atendimento.historicoMedico }}</div>
            <div class="info-item"><strong>Atendimento Finalizado:</strong> {{ atendimento.finalizadoEm }}</div>
          </div>
          <hr />
        </div>
      </div>
    </div>
    <div v-else>
      <p class="no-records">Nenhum atendimento finalizado.</p>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { collection, getDocs, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useRouter } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
  setup() {
    const atendimentos = ref([]);
    const atendimentosFinalizados = ref([]);
    const nomeMedico = ref('');
    const generoMedico = ref('');
    const saudacao = ref('');
    const titulo = ref('');

    const auth = getAuth();
    const router = useRouter();

    onMounted(async () => {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            nomeMedico.value = userData.fullName;
            generoMedico.value = userData.gender;
            saudacao.value = obterSaudacao();
            titulo.value = generoMedico.value === 'F' ? 'Dra.' : 'Dr.';

            const querySnapshot = await getDocs(collection(db, 'atendimentos'));
            querySnapshot.forEach((doc) => {
              const atendimento = doc.data();
              atendimento.id = doc.id;
              if (atendimento.finalizado) {
                atendimentosFinalizados.value.push(atendimento);
              } else {
                atendimentos.value.push(atendimento);
              }
            });
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      });
    });

    const obterSaudacao = () => {
      const hora = new Date().getHours();
      if (hora < 12) return 'Bom dia';
      if (hora < 18) return 'Boa tarde';
      return 'Boa noite';
    };

    const finalizeAtendimento = async (atendimento) => {
      const agora = new Date();
      const atendimentoDoc = doc(db, 'atendimentos', atendimento.id);
      await setDoc(atendimentoDoc, { ...atendimento, finalizado: true, finalizadoEm: agora.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) });
      atendimentos.value = atendimentos.value.filter((a) => a.id !== atendimento.id);
      atendimentosFinalizados.value.push({ ...atendimento, finalizado: true, finalizadoEm: agora.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'medium' }) });
    };

    return { atendimentos, atendimentosFinalizados, nomeMedico, saudacao, titulo, finalizeAtendimento };
  },
};
</script>

<style scoped>
.visualizar-atendimentos-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

h2 {
  margin-bottom: 10px;
}

.atendimentos-list {
  margin-bottom: 20px;
}

.atendimento-item {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  text-align: start;
}

.atendimento-header {
  font-size: 24px;
  margin-bottom: 20px;
}

.atendimento-details {
  font-size: 14px;
}

.info-item {
  margin: 10px 0;
  font-size: 16px;
}

button {
  padding: 8px;
  font-size: 14px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  align-self: center;
}

button:hover {
  background-color: #45a049;
}

.no-records {
  text-align: center;
  font-size: 16px;
  color: #777;
}
</style>
