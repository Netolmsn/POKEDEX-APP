import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import api from '../services/api';
import { FavoriteContext } from '../contexts/FavoriteContext';

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const { toggleFavorite, isFavorite } = useContext(FavoriteContext);

  const fetchPokemons = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await api.get(`pokemon?limit=20&offset=${offset}`);
      const newPokemons = response.data.results.map((poke) => {
        const id = poke.url.split('/')[6];
        return {
          ...poke,
          id,
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
        };
      });
      setPokemons([...pokemons, ...newPokemons]);
      setOffset(offset + 20);
    } catch (error) {
      console.error("Erro", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPokemons(); }, []);

  const filteredPokemons = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Text style={{ color: isFavorite(item.name) ? '#e3350d' : '#888', fontWeight: 'bold' }}>
          {isFavorite(item.name) ? '❤️ Remover' : '🤍 Favoritar'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Buscar Pokémon..." 
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredPokemons}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
        onEndReached={search === '' ? fetchPokemons : null}
        onEndReachedThreshold={0.1}
        ListFooterComponent={loading && <ActivityIndicator size="large" color="#e3350d" style={{ margin: 20 }}/>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  input: { height: 45, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  image: { width: 60, height: 60 },
  name: { fontSize: 18, textTransform: 'capitalize', flex: 1, marginLeft: 12, fontWeight: '500' }
});