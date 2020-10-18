import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { getCurrentPositionAsync, requestPermissionsAsync } from 'expo-location';

import mapMarker from '../images/map-marker.png';
import { Feather } from '@expo/vector-icons';

import api from '../services/api';

interface Orphanages {
  id: number,
  name: string,
  latitude: number,
  longitude: number,
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<Orphanages[]>([]);
  const navigation = useNavigation();
  const [mapPosition, setMapPosition] = useState({latitude: 0, longitude: 0});

  useFocusEffect(
    useCallback(() => {
      api.get('orphanages').then(res => {
        setOrphanages(res.data);
      });
    }, [])
  );

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

  function NavigateToOrphanageDetails(id: number){
    navigation.navigate('OrphanageDetails', {id});
  }

  return (
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: mapPosition.latitude,
          longitude: mapPosition.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05
        }}
      >
        { orphanages.map(element => {
          return (
            <Marker key={element.id}
            icon={mapMarker}
            calloutAnchor={{
              x: 0.5,
              y: -0.1
            }}
            coordinate={{
              latitude: element.latitude,
              longitude: element.longitude
            }}
            >
              <Callout onPress={() => NavigateToOrphanageDetails(element.id)} tooltip> 
              {/* tooltip erase the default styling */}
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{element.name}</Text>
                </View>
              </Callout>
            </Marker>
          )
        })}
      </MapView> 

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {orphanages.length} orphanages found
        </Text>
        <RectButton style={styles.createOrphanageButton} onPress={() => navigation.navigate('SelectMapPosition')}>
          <Feather name="plus" size={20} color="#fff" />
        </RectButton>
      
      </View> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    width: Dimensions.get('window').width,
    height: '100%'
    // height: Dimensions.get('window').height,
  },

  calloutContainer: {
    width: 160,
    height: 46,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    justifyContent: "center",
    alignItems: 'center'
  },

  calloutText: {
    color: '#0089a5',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold'
  },

  footer: {
    position: 'absolute',
    left: 24,
    right: 24,
    bottom: 32,

    backgroundColor: '#fff',
    borderRadius: 20,
    height: 56,
    paddingLeft: 24,
    
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    elevation: 3
  },

  footerText : {
    color: '#8fa7b3',
    fontFamily: 'Nunito_700Bold'
  },

  createOrphanageButton: {
    width: 56,
    height: 56,
    backgroundColor: '#15c3d6',
    borderRadius: 20,

    justifyContent: 'center',
    alignItems: 'center'
  }

});
