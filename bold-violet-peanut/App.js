import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const gerarSequenciaAleatoria = (sequencia) => {
  const novoBloco = Math.floor(Math.random() * 9);
  return [...sequencia, novoBloco];
};

const App = () => {
  const [sequencia, setSequencia] = useState([]);
  const [inputUsuario, setInputUsuario] = useState([]);
  const [quadradosAtivos, setQuadradosAtivos] = useState(Array(9).fill(false));
  const [mensagem, setMensagem] = useState('');
  const [jogoAtivo, setJogoAtivo] = useState(false);
  const [sequenciaExibida, setSequenciaExibida] = useState(false);
  const [nivelAtual, setNivelAtual] = useState(1);
  const [tempoSequencia, setTempoSequencia] = useState(1000);

  const comecarJogo = () => {
    setNivelAtual(1);
    setSequencia([Math.floor(Math.random() * 9)]);
    setInputUsuario([]);
    setQuadradosAtivos(Array(9).fill(false));
    setMensagem('');
    setJogoAtivo(true);
    setSequenciaExibida(false);
    setTempoSequencia(1000);
  };

  const reiniciarJogo = () => {
    Alert.alert('Reiniciar Jogo', 'Você realmente deseja reiniciar?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sim', onPress: comecarJogo },
    ]);
  };

  const escolherQuadrado = (index) => {
    if (!jogoAtivo || sequenciaExibida) return;

    const novaSequencia = [...inputUsuario, index];
    setInputUsuario(novaSequencia);

    if (novaSequencia[novaSequencia.length - 1] !== sequencia[novaSequencia.length - 1]) {
      setMensagem('Você errou! Tente novamente.');
      Alert.alert('Erro', 'Você errou! O jogo será reiniciado.');
      setTimeout(() => comecarJogo(), 1500);
    } else {
      if (novaSequencia.length === sequencia.length) {
        setMensagem('Parabéns! Você acertou! A velocidade vai aumentar!');
        setTimeout(() => {
          const novaSequencia = gerarSequenciaAleatoria(sequencia);
          setSequencia(novaSequencia);
          setNivelAtual(novaSequencia.length);
          setInputUsuario([]);
          setTempoSequencia((prevTempo) => Math.max(200, prevTempo - 100));
        }, 1500);

        setTimeout(() => {
          setMensagem('');
        }, 2000);
      }
    }
  };

  useEffect(() => {
    if (!sequencia.length || sequenciaExibida) return;

    const animarSequencia = async () => {
      setSequenciaExibida(true);

      for (let i = 0; i < sequencia.length; i++) {
        animarQuadrado(sequencia[i]);
        await new Promise((resolve) => setTimeout(resolve, tempoSequencia));
        desativarQuadrado(sequencia[i]);
        await new Promise((resolve) => setTimeout(resolve, tempoSequencia));
      }

      setSequenciaExibida(false);
    };

    animarSequencia();
  }, [sequencia, tempoSequencia]);

  const animarQuadrado = (index) => {
    setQuadradosAtivos((prev) => {
      const novosQuadrados = [...prev];
      novosQuadrados[index] = true;
      return novosQuadrados;
    });
  };

  const desativarQuadrado = (index) => {
    setQuadradosAtivos((prev) => {
      const novosQuadrados = [...prev];
      novosQuadrados[index] = false;
      return novosQuadrados;
    });
  };

  const coresQuadrados = [
    '#0000FF',
    '#FF0000',
    '#FFFF00',
    '#800080',
    '#008000',
    '#808080',
    '#FFA500',
    '#000000',
    '#FFC0CB',
  ];

  const obterNivel = () => {
    if (nivelAtual <= 3) {
      return 'Você está no nível fácil!';
    } else if (nivelAtual <= 6) {
      return 'Você está no nível médio!';
    } else {
      return 'Você está no nível difícil!';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jogo Genius</Text>
      {!jogoAtivo ? (
        <TouchableOpacity style={styles.button} onPress={comecarJogo}>
          <Text style={styles.buttonText}>Iniciar Jogo</Text>
        </TouchableOpacity>
      ) : null}
      <Text style={styles.mensagem}>{mensagem}</Text>
      <Text style={styles.nivelText}>{obterNivel()}</Text>
      <View style={styles.grid}>
        {Array.from({ length: 9 }).map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.square,
              quadradosAtivos[index] && styles.active,
              {
                backgroundColor: quadradosAtivos[index] ? coresQuadrados[index] : '#D3D3D3',
              },
            ]}
            onPress={() => escolherQuadrado(index)}
          />
        ))}
      </View>
      <TouchableOpacity style={styles.restartButton} onPress={reiniciarJogo}>
        <Text style={styles.buttonText}>Reiniciar Jogo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  mensagem: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  nivelText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    justifyContent: 'space-between',
  },
  square: {
    width: 90,
    height: 90,
    margin: 5,
    borderRadius: 5,
  },
  active: {
    opacity: 0.8,
  },
  restartButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});

export default App;