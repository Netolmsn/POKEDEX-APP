import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from '@react-navigation/native';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [pins, setPins] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);

      const randomPins = Array.from({ length: 5 }).map((_, i) => ({
        id: i.toString(),
        latitude: loc.coords.latitude + (Math.random() - 0.5) * 0.02,
        longitude: loc.coords.longitude + (Math.random() - 0.5) * 0.02,
      }));
      setPins(randomPins);
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (pins.length > 0 && mapRef.current) {
        const randomPin = pins[Math.floor(Math.random() * pins.length)];
        mapRef.current.animateToRegion({
          latitude: randomPin.latitude,
          longitude: randomPin.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    }, [pins])
  );

  if (!location) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#e3350d" /></View>;
  }

  return (
    <View style={styles.container}>
      <MapView 
        ref={mapRef}
        style={styles.map} 
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {pins.map(pin => (
          <Marker key={pin.id} coordinate={{ latitude: pin.latitude, longitude: pin.longitude }} pinColor="blue" />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});