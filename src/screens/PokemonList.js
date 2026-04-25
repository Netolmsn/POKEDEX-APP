import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Modal, ScrollView, SafeAreaView } from 'react-native';
import api from '../services/api';
import { FavoriteContext } from '../contexts/FavoriteContext';

const typeTranslations = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico', grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Venenoso', ground: 'Terrestre', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto', rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio', steel: 'Aço', fairy: 'Fada'
};

const statTranslations = {
  hp: 'HP', attack: 'Ataque', defense: 'Defesa', 'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade'
};

export default function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [details, setDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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

  const openDetails = async (pokemon) => {
    setSelectedPokemon(pokemon);
    setDetails(null);
    setLoadingDetails(true);
    try {
      const [pokemonResponse, speciesResponse] = await Promise.all([
        api.get(`pokemon/${pokemon.id}`),
        api.get(`pokemon-species/${pokemon.id}`)
      ]);

      const flavorTextEntry = speciesResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'pt-BR' || entry.language.name === 'pt'
      ) || speciesResponse.data.flavor_text_entries.find(
        (entry) => entry.language.name === 'en'
      );
      
      const cleanDescription = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\n|\f|\r/g, ' ') : 'Descrição não disponível.';

      setDetails({
        ...pokemonResponse.data,
        description: cleanDescription
      });

    } catch (error) {
      console.error("Erro ao buscar detalhes", error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const filteredPokemons = pokemons.filter(p => p.name.includes(search.toLowerCase()));

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => openDetails(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      
      <TouchableOpacity 
        style={styles.favButton}
        onPress={(e) => {
          e.stopPropagation();
          toggleFavorite(item);
        }}
      >
        <Text style={{ color: isFavorite(item.name) ? '#e3350d' : '#888', fontWeight: 'bold' }}>
          {isFavorite(item.name) ? '❤️' : '🤍'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
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

      <Modal
        visible={!!selectedPokemon}
        animationType="slide"
        onRequestClose={() => setSelectedPokemon(null)}
      >
        <SafeAreaView style={styles.modalContainer}>
          {selectedPokemon && (
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedPokemon(null)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕ Fechar</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>{selectedPokemon.name}</Text>
            </View>
          )}

          {loadingDetails ? (
            <ActivityIndicator size="large" color="#e3350d" style={{ marginTop: 50 }} />
          ) : details ? (
            <ScrollView contentContainerStyle={styles.modalContent}>
              <Image 
                source={{ uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${details.id}.png` }} 
                style={styles.modalImage} 
              />
              
              <Text style={styles.descriptionText}>"{details.description}"</Text>
              
              <View style={styles.infoBox}>
                <Text style={styles.infoText}>📏 Altura: {details.height / 10} m</Text>
                <Text style={styles.infoText}>⚖️ Peso: {details.weight / 10} kg</Text>
              </View>

              <Text style={styles.sectionTitle}>Tipos</Text>
              <View style={styles.typeContainer}>
                {details.types.map((t, index) => (
                  <View key={index} style={styles.typeBadge}>
                    <Text style={styles.typeText}>{typeTranslations[t.type.name] || t.type.name}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Status Base</Text>
              {details.stats.map((s, index) => (
                <View key={index} style={styles.statRow}>
                  <Text style={styles.statName}>{statTranslations[s.stat.name] || s.stat.name.toUpperCase()}</Text>
                  <Text style={styles.statValue}>{s.base_stat}</Text>
                  <View style={styles.statBarBackground}>
                    <View style={[styles.statBarFill, { width: `${Math.min(s.base_stat, 100)}%` }]} />
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
             <Text style={styles.errorText}>Não foi possível carregar os detalhes.</Text>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  input: { height: 45, backgroundColor: '#fff', borderColor: '#ddd', borderWidth: 1, borderRadius: 8, marginBottom: 16, paddingHorizontal: 12 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  image: { width: 60, height: 60 },
  name: { fontSize: 18, textTransform: 'capitalize', flex: 1, marginLeft: 12, fontWeight: '500' },
  favButton: { padding: 10 },
  modalContainer: { flex: 1, backgroundColor: '#fff' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeButton: { padding: 8, backgroundColor: '#f0f0f0', borderRadius: 8 },
  closeButtonText: { color: '#333', fontWeight: 'bold' },
  modalTitle: { fontSize: 24, fontWeight: 'bold', textTransform: 'capitalize', marginLeft: 20 },
  modalContent: { padding: 20, alignItems: 'center' },
  modalImage: { width: 200, height: 200, marginBottom: 20 },
  descriptionText: { fontSize: 16, fontStyle: 'italic', color: '#555', textAlign: 'center', marginBottom: 20, paddingHorizontal: 10, lineHeight: 24 },
  infoBox: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 20 },
  infoText: { fontSize: 16, fontWeight: 'bold', color: '#555' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', alignSelf: 'flex-start', marginTop: 10, marginBottom: 10, color: '#333' },
  typeContainer: { flexDirection: 'row', alignSelf: 'flex-start', marginBottom: 20 },
  typeBadge: { backgroundColor: '#e3350d', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 10 },
  typeText: { color: '#fff', fontWeight: 'bold', textTransform: 'capitalize' },
  statRow: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 8 },
  statName: { width: 80, fontSize: 12, color: '#666', fontWeight: 'bold' },
  statValue: { width: 30, fontSize: 12, fontWeight: 'bold', textAlign: 'right', marginRight: 10 },
  statBarBackground: { flex: 1, height: 10, backgroundColor: '#eee', borderRadius: 5, overflow: 'hidden' },
  statBarFill: { height: '100%', backgroundColor: '#4caf50', borderRadius: 5 },
  errorText: { textAlign: 'center', marginTop: 20, color: '#666' }
});