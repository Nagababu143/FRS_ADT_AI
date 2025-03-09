import { Text, View , SafeAreaView, ImageBackground, Image } from 'react-native';
import React from 'react';
import { landingStyles } from './LandingStyles';
import AppButton from '../../components/app-button/AppButton';
import { useNavigation, useRoute } from '@react-navigation/native';

const Landing = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={landingStyles.container}>
      <ImageBackground source={require('../../assets/banners/frs_banner.png')} resizeMode="cover" style={landingStyles.imgCont}>
        <Image style={landingStyles.ttdLogo} source={require('../../assets/logos/adt_ai_logo.png')} resizeMode="center" />
        <View>
          <View>
            <Text style={landingStyles.scanMeText}>Scan Me</Text>
            <Image style={landingStyles.scanLogo} source={require('../../assets/logos/scan_logo.png')} resizeMode="cover" />
          </View>
          <View>
            <Text style={landingStyles.frText}>Face recognition</Text>
            <Text style={landingStyles.frDescription}>Scan your face to verify your identity</Text>
          </View>
        </View>
        <View style={landingStyles.buttonsCont}>
          {/* ✅ Pass 'validation' as a param */}
          <AppButton title="Validation" onButtonPress={() => navigation.navigate('Facecapture', { type: 'validate' })} />
          {/* ✅ Pass 'registration' as a param */}
          <AppButton title="Register" appearance="gradient" onButtonPress={() => navigation.navigate('Facecapture', { type: 'registration' })} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Landing;
