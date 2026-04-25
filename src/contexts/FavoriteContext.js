import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FavoriteContext = createContext({});

export const FavoriteProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('@poke_favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Erro ao carregar", error);
    }
  };

  const toggleFavorite = async (pokemon) => {
    try {
      let updatedFavorites = [...favorites];
      const isFav = updatedFavorites.find(p => p.name === pokemon.name);

      if (isFav) {
        updatedFavorites = updatedFavorites.filter(p => p.name !== pokemon.name);
      } else {
        updatedFavorites.push(pokemon);
      }

      setFavorites(updatedFavorites);
      await AsyncStorage.setItem('@poke_favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Erro ao salvar", error);
    }
  };

  const isFavorite = (name) => {
    return favorites.some(p => p.name === name);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
};