import { Text, View } from 'react-native';
import React from 'react';
import { IProfileInfo } from '../../interfaces/IProfileInfo';
import { formatValueWithStars } from '../../utils/Constants';
import { profileInfoStyles } from './ProfileInfoStyles';

const ProfileInfo = ({title, value , masked = false}:IProfileInfo) => {
  return (
    <View>
      <Text style={profileInfoStyles.titieText}>{title}</Text>
      <Text style={profileInfoStyles.valueText}>{masked ? formatValueWithStars() : value}</Text>
    </View>
  );
};

export default ProfileInfo;
