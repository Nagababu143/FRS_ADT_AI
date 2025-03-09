import { Image, ImageBackground, Text, View } from 'react-native';
import React from 'react';
import { validationStyles } from './ValidationStyles';

const Validation = () => {
  return (
    <View style={validationStyles.container}>
      <ImageBackground resizeMode="cover" style={validationStyles.imgCont} source={require('../../assets/banners/validation_banner.png')} alt="Validation_Banner" >
        <Image style={validationStyles.ttdLogo} source={require('../../assets/logos/adt_ai_logo.png')} alt="ADT_AI_logo"/>
        <Text style={validationStyles.progressText}>Hold still, we're processing</Text>
      </ImageBackground>
    </View>
  );
};

export default Validation;
