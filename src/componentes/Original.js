import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const API_URL = 'https://dragonball-api.com/api/characters?limit=100';

function normalizarNombre(nombre) {
  return nombre
    .trim()
    .toLocaleLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export default function Original() {
  const [personajes, setPersonajes] = useState([]);
  const [personaje, setPersonaje] = useState(null);
  const [respuesta, setRespuesta] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [resuelto, setResuelto] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const elegirPersonaje = (lista = personajes) => {
    if (lista.length === 0) return;

    const disponibles = lista.filter((item) => item.id !== personaje?.id);
    const opciones = disponibles.length > 0 ? disponibles : lista;
    const siguiente = opciones[Math.floor(Math.random() * opciones.length)];

    setPersonaje(siguiente);
    setRespuesta('');
    setMensaje('');
    setResuelto(false);
  };

  const cargarPersonajes = async () => {
    setCargando(true);
    setError('');

    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`La solicitud terminó con el estado ${response.status}`);
      }

      const data = await response.json();
      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error('La API no devolvió personajes.');
      }

      setPersonajes(data.items);
      elegirPersonaje(data.items);
    } catch (errorCarga) {
      console.error('No se pudieron cargar los personajes:', errorCarga);
      setError('No se pudieron cargar los personajes. Revisa tu conexión e inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPersonajes();
  }, []);

  const comprobarRespuesta = () => {
    if (!respuesta.trim() || !personaje || resuelto) return;

    if (normalizarNombre(respuesta) === normalizarNombre(personaje.name)) {
      setMensaje(`¡Correcto! Es ${personaje.name}.`);
      setResuelto(true);
      setAciertos((total) => total + 1);
    } else {
      setMensaje('Todavía no. ¡Inténtalo otra vez!');
    }
  };

  if (cargando) {
    return (
      <View style={styles.centrado}>
        <ActivityIndicator size="large" color="#e85d04" />
        <Text style={styles.textoCargando}>Cargando personajes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.titulo}>Adivina el personaje</Text>
        <Text style={styles.error}>{error}</Text>
        <Pressable style={styles.boton} onPress={cargarPersonajes}>
          <Text style={styles.textoBoton}>Reintentar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Adivina el personaje</Text>
      <Text style={styles.subtitulo}>¡Demuestra cuánto sabes de Dragon Ball!</Text>

      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>PISTAS</Text>
        <Text style={styles.pista}>
          Raza: {personaje?.race || 'Desconocida'}
        </Text>
        <Text style={styles.pista}>
          Género: {personaje?.gender || 'Desconocido'}
        </Text>
        <Text style={styles.pista}>
          Afiliación: {personaje?.affiliation || 'Desconocida'}
        </Text>
      </View>

      <TextInput
        style={styles.entrada}
        placeholder="Escribe el nombre del personaje"
        placeholderTextColor="#777"
        value={respuesta}
        onChangeText={setRespuesta}
        onSubmitEditing={comprobarRespuesta}
        returnKeyType="done"
        autoCapitalize="words"
        accessibilityLabel="Nombre del personaje"
      />

      <Pressable
        style={[styles.boton, resuelto && styles.botonDeshabilitado]}
        onPress={comprobarRespuesta}
        disabled={resuelto}
      >
        <Text style={styles.textoBoton}>Comprobar</Text>
      </Pressable>

      {mensaje ? (
        <Text style={mensaje.startsWith('¡Correcto!') ? styles.correcto : styles.mensaje}>
          {mensaje}
        </Text>
      ) : null}

      <Text style={styles.puntuacion}>Aciertos: {aciertos}</Text>

      <Pressable style={styles.botonSecundario} onPress={() => elegirPersonaje()}>
        <Text style={styles.textoBotonSecundario}>Otro personaje</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  centrado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff8f0',
  },
  contenedor: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff8f0',
  },
  titulo: {
    color: '#9d0208',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitulo: {
    color: '#555',
    fontSize: 16,
    marginTop: 8,
    marginBottom: 28,
    textAlign: 'center',
  },
  tarjeta: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    backgroundColor: '#fff',
    borderColor: '#ffba08',
    borderWidth: 2,
  },
  etiqueta: {
    color: '#d00000',
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginBottom: 12,
  },
  pista: {
    color: '#333',
    fontSize: 17,
    marginVertical: 5,
  },
  entrada: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    backgroundColor: '#fff',
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
  },
  boton: {
    backgroundColor: '#e85d04',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
  },
  botonDeshabilitado: {
    opacity: 0.6,
  },
  textoBoton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  mensaje: {
    color: '#b45309',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  correcto: {
    color: '#15803d',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 16,
  },
  puntuacion: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 22,
  },
  botonSecundario: {
    borderWidth: 1,
    borderColor: '#e85d04',
    borderRadius: 10,
    padding: 13,
    alignItems: 'center',
    marginTop: 14,
  },
  textoBotonSecundario: {
    color: '#c2410c',
    fontSize: 16,
    fontWeight: 'bold',
  },
  textoCargando: {
    color: '#555',
    fontSize: 16,
    marginTop: 12,
  },
  error: {
    color: '#b91c1c',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 18,
  },
});