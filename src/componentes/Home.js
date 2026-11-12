import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';

export default function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      // Usamos el endpoint de personajes con un límite para traer varios de una vez
      const res = await fetch("https://dragonball-api.com/api/characters?limit=100");
      const json = await res.json();
      // La API de Dragon Ball guarda el array de personajes dentro de la propiedad "items"
      setData(json.items);
    };

    obtenerDatos();
  }, []); 

  return (
    <ScrollView>
      <View style={styles.lista}>
        {data.map((personaje, index) => {
          return (
            <View key={index} style={styles.item}>
              <Text>{personaje.id} - {personaje.name}</Text>
              <Image
                source={{
                  uri: personaje.image, // La API ya nos da la URL directa
                }}
                style={styles.imagen}
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  lista: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    justifyContent: 'space-between',
    padding: 10,
  },
  item: {
    backgroundColor: 'aliceblue',
    width: '48%',
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagen: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  buscador: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
  },
});