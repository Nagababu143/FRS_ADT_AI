import { Image, ImageBackground, ScrollView, Text, View, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import InputRenderer from '../../components/input-renderer/InputRenderer';
import { registrationStyles } from './RegistrationStyles';
import { IInputRenderer } from '../../interfaces/IInputRenderer';
import CheckBox from '../../components/check-box/CheckBox';
import AppButton from '../../components/app-button/AppButton';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

const Registration = () => {
  const route = useRoute();
  const { imageBuffer } = route.params || {}; // Get imageBuffer from navigation params

  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [aadharNumber, setAadharNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsChecked, setTermsChecked] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ Middle Loader state

  // Handle form submission

  const registrationHandler = async () => {
    if (!fullName || !aadharNumber || !phoneNumber) {
      Alert.alert("Error", "All fields are required.", [
        { text: "OK", onPress: () => navigation.navigate("Landing") }
      ]);
      return;
    }
  
    setLoading(true);
  
    try {
      // ✅ Prepare API Payload
      const payload = {
        image: `data:image/jpeg;base64,${imageBuffer}`,
        fullName,
        aadharNumber,
        phoneNumber,
        type: "registration",
      };
  
      console.log("Sending API Request with Payload:", payload);
  
      // **API Call**
      const response = await axios.post(
        "https://yt0321nob3.execute-api.us-east-1.amazonaws.com/dev/TTD_FRS",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );
  
      console.log("API Response:", response.data);
  
      // ✅ Parse response body
      const responseBody = typeof response.data.body === "string" ? JSON.parse(response.data.body) : response.data.body;
  
      if (response.status === 200 && responseBody.statusCode === 200) {
        Alert.alert(
          "Success",
          responseBody.message || "Registration completed successfully!",
          [{ text: "OK", onPress: () => navigation.navigate("ProfileDetails", { data: responseBody }) }]
        );
      } else {
        throw new Error(responseBody.message || "Something went wrong.");
      }
  
    } catch (error) {
      console.error("Error:", error);
  
      let errorMessage = "An unexpected error occurred.";
  
      if (error.response) {
        console.log("Server Error Response:", error.response.data);
        errorMessage = error.response.data?.message || "Server error. Please try again later.";
      } else if (error.request) {
        errorMessage = "Network error. Please check your internet connection.";
      } else {
        errorMessage = error.message || "An unexpected error occurred.";
      }
  
      // ✅ Show Alert and Navigate to Landing Page
      Alert.alert("Error", errorMessage, [
        { text: "OK", onPress: () => navigation.navigate("Landing") }
      ]);
  
    } finally {
      setLoading(false);
    }
  };
  
  

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={registrationStyles.container}
        pointerEvents={loading ? 'none' : 'auto'} // ✅ Prevents user interaction
      >
        <ImageBackground resizeMode="cover" style={registrationStyles.imgCont} source={require('../../assets/banners/frs_banner.png')}>
          <Image style={registrationStyles.ttdLogo} source={require('../../assets/logos/scan_logo.png')} />
          <View style={registrationStyles.registerTextCont}>
            <Text style={registrationStyles.registerText}>Get register now</Text>
            <Text style={registrationStyles.registerDescription}>Create your profile to continue</Text>
          </View>

          {imageBuffer && <Image source={{ uri: `data:image/jpeg;base64,${imageBuffer}` }} style={registrationStyles.imagePreview} />}

          <View style={registrationStyles.inputsCont}>
            <InputRenderer label="Full Name" value={fullName} onChangeText={setFullName} />
            <InputRenderer label="Aadhar Number" value={aadharNumber} keyboardType="number-pad" onChangeText={setAadharNumber} />
            <InputRenderer label="Phone Number" value={phoneNumber} keyboardType="number-pad" onChangeText={setPhoneNumber} />
            <CheckBox label="Agree terms & conditions" checked={termsChecked} setChecked={setTermsChecked} />
          </View>

          <AppButton
            title="Register"
            appearance="gradient"
            onButtonPress={registrationHandler}
            disabled={loading} // ✅ Button disabled while loading
          />
        </ImageBackground>
      </ScrollView>

      {/* ✅ Middle of the Page Loader */}
      {loading && (
        <View style={registrationStyles.loaderOverlay}>
          <View style={registrationStyles.loaderBox}>
            <ActivityIndicator size="large" color="white" />
            <Text style={registrationStyles.loaderText}>Processing...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Registration;
