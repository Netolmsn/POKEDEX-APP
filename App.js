import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FavoriteProvider } from './src/contexts/FavoriteContext';

import PokemonList from './src/screens/PokemonList';
import MapScreen from './src/screens/MapScreen';
import Favorites from './src/screens/Favorites';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <FavoriteProvider>
      <NavigationContainer>
        <Tab.Navigator 
          screenOptions={{ 
            tabBarActiveTintColor: '#e3350d', 
            tabBarInactiveTintColor: 'gray',
            headerTitleAlign: 'center',
          }}
        >
          <Tab.Screen name="Pokédex" component={PokemonList} />
          <Tab.Screen name="Mapa" component={MapScreen} />
          <Tab.Screen name="Favoritos" component={Favorites} />
        </Tab.Navigator>
      </NavigationContainer>
    </FavoriteProvider>
  );
}