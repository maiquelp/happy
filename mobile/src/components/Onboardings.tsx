import { Image, StyleSheet, View } from 'react-native';
import React from 'react';

import Onboarding from 'react-native-onboarding-swiper'; // 0.4.0

import onboard1 from '../../assets/onboarding1.png';
import onboard2 from '../../assets/onboarding2.png';
import { useNavigation } from '@react-navigation/native';

export default function Onboardings() {
  const navigation = useNavigation();
  
  return (
    // <View style={styles.container}>

    <Onboarding imageContainerStyles={styles.container}
    pages={[
        {
            backgroundColor: '#fff',
            image: <Image source={onboard1} style={styles.size} />,
            title: '',
            subtitle: '',
            },
            {
                backgroundColor: '#fff',
                image: <Image source={onboard2} style={styles.size} />,
                title: '',
                subtitle: '',
            }
        ]}
        onDone={() => navigation.navigate('OrphanagesMap')}
        onSkip={() => navigation.navigate('OrphanagesMap')}
    />
    // </View>  
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
  },
  size: {
    width: 440,
    height: 800,
  }
});

