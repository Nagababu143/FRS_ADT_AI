import { Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { IAppButton } from '../../interfaces/IAppButton';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../utils/Colors';
import { appButtonStyles } from './AppButtonStyles';

const AppButton = ({title , appearance = 'default' , gradients = [Colors.royalBlue,Colors.razzleDazzleRose] , onButtonPress}:IAppButton) => {
  return (
    <>
    {
        appearance === 'default'
        ?
        <TouchableOpacity onPress={onButtonPress} activeOpacity={0.7}  style={appButtonStyles.defaultButton}>
            <Text style={appButtonStyles.defaultButtonText}>{title}</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={onButtonPress} activeOpacity={0.7}>
            <LinearGradient colors={gradients} style={appButtonStyles.lgButton} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={appButtonStyles.lgButtonText}>
                    {title}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    }
   </>
  );
};

export default AppButton;
