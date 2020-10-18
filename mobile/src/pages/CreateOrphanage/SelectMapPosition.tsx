import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import MapView, { MapEvent, Marker } from 'react-native-maps';

import mapMarkerImg from '../../images/map-marker.png';

import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';

export default function SelectMapPosition() {
  const navigation = useNavigation();
  const [position, setPosition] = useState({latitude: 0, longitude: 0});
  const [mapPosition, setMapPosition] = useState({latitude: 0, longitude: 0});

  useEffect(() => {
      async function loadMapPosition() {
        const { granted } = await requestPermissionsAsync();
        
        if (granted) {
          const { coords } = await getCurrentPositionAsync();
          
          const { latitude, longitude } = coords;

          setMapPosition({latitude, longitude});
        }
      }
      loadMapPosition();
    }, []);

  if (mapPosition.latitude === 0) {
    return (
      <View><Text>Loading...</Text></View>
    )
  }

  function handleNextStep() {
    navigation.navigate('OrphanageData', { position });
  }

  function setMarker(event: MapEvent) {
    setPosition(event.nativeEvent.coordinate)
  }

  return (
    <View style={styles.container}>
      <MapView 
        initialRegion={{
          latitude: mapPosition.latitude,
          longitude: mapPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        style={styles.mapStyle}
        onPress={setMarker}
      >
        { position.latitude !== 0 && (
          <Marker 
          icon={mapMarkerImg}
          coordinate={{ latitude: position.latitude, longitude: position.longitude }}
          />)
        }
      </MapView>
      { position.latitude !== 0 && (
        <RectButton style={styles.nextButton} onPress={handleNextStep}>
          <Text style={styles.nextButtonText}>Next</Text>
        </RectButton>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative'
  },

  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

  nextButton: {
    backgroundColor: '#15c3d6',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 56,

    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 40,
  },

  nextButtonText: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 16,
    color: '#FFF',
  }
})