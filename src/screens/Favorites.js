import React, { useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FavoriteContext } from '../contexts/FavoriteContext';

export default function Favorites() {
  const { favorites, toggleFavorite } = useContext(FavoriteContext);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
      <TouchableOpacity onPress={() => toggleFavorite(item)}>
        <Text style={{ color: '#e3350d', fontWeight: 'bold' }}>Remover</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.empty}>Nenhum Pokémon favoritado ainda.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.name}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 8, marginBottom: 10, elevation: 2 },
  image: { width: 60, height: 60 },
  name: { fontSize: 18, textTransform: 'capitalize', flex: 1, marginLeft: 12, fontWeight: '500' },
  empty: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});