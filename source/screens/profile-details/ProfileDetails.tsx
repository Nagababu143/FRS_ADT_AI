import { Image, ImageBackground, Text, View } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native'; // ✅ Import useRoute to get navigation params
import { profileDetailsStyles } from './ProfileDetailsStyles';
import ProfileInfo from '../../components/profile-info/ProfileInfo';
import AppButton from '../../components/app-button/AppButton';
import { navigate } from '../../utils/NavigationType';

const ProfileDetails = () => {
  const route = useRoute();
  const { data } = route.params || {}; // ✅ Get response data from navigation params

  // ✅ Profile & Face Validation Data
  const PROFILE_INFO = [
    { title: 'Full Name', value: data?.fullName || 'N/A' },
    { title: 'Aadhar Number', value: data?.aadharNumber || 'N/A', masked: true },
    { title: 'Phone Number', value: data?.phoneNumber || 'N/A' },
    { title: 'Gender', value: data?.gender || 'N/A' },
    { title: 'Emotions', value: data?.emotions || 'N/A' },
    { title: 'Face Match Status', value: data?.message || 'N/A' },
    { title: 'Similarity Score', value: data?.similarity ? `${data.similarity.toFixed(2)}%` : 'N/A' },
  ];

  return (
    <View style={profileDetailsStyles.container}>
      <ImageBackground
        resizeMode="cover"
        style={profileDetailsStyles.imgCont}
        source={require('../../assets/banners/frs_banner.png')}
      >
        <Image style={profileDetailsStyles.ttdLogo} source={require('../../assets/logos/scan_logo.png')} />

        <View>
          <Text style={profileDetailsStyles.mainText}>Profile Validation Details</Text>

          {/* ✅ User's Profile & Face Match Info */}
          <View style={profileDetailsStyles.profileDetailsCont}>
            {PROFILE_INFO.map((each, index) => (
              <ProfileInfo key={index} title={each.title} value={each.value}/>
            ))}
          </View>

          {/* ✅ User Uploaded Image */}
          {data?.imageUrl && (
            <Image source={{ uri: data.imageUrl }} style={profileDetailsStyles.userImage} />
          )}

          {/* ✅ Matched Image from Face Validation */}
          {data?.matchedImageUrl && (
            <Image source={{ uri: data.matchedImageUrl }} style={profileDetailsStyles.matchedImage} />
          )}
        </View>

        <AppButton title="Done" appearance="gradient" onButtonPress={() => navigate('Landing')} />
      </ImageBackground>
    </View>
  );
};

export default ProfileDetails;
