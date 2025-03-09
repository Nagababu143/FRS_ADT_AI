import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';

const Facecapture = () => {
  const camera = useRef<Camera>(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || {}; // Get 'type' param from navigation
  const [loading, setLoading] = useState(false); // Loading state

  console.log("Type:", type);
  const requestStoragePermission = async () => {
    const result = await request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    if (result !== RESULTS.GRANTED) {
      Alert.alert("Permission Denied", "Storage access is required to process images.");
    }
  };

  useEffect(() => {

    const checkPermission = async () => {
      if (!hasPermission) {
        const permission = await requestPermission();
        if (permission !== 'authorized') {
          Alert.alert('Camera Permission Denied', 'You need to grant camera permission to use this feature.');
        }
      }
    };
    checkPermission();
   //  requestStoragePermission();
  }, [hasPermission, requestPermission]);

  const captureImage = async () => {
    if (!camera.current || loading) return; // Prevent multiple clicks
  
    setLoading(true); // Start loading
  
    try {
      const photo = await camera.current.takePhoto({}); // Capture photo
      const imagePath = photo.path.trim(); // Get file path
  
      console.log("Captured image path:", imagePath);
  
      // ✅ Read file as a buffer (Base64)
      const base64Image = await RNFS.readFile(imagePath, 'base64');
      console.log("Base64 Image Length:", base64Image.length);
  
      // ✅ Ensure correct format (JPEG/PNG)
      const base64WithPrefix = `data:image/jpeg;base64,${base64Image}`;
  
      // **If type is 'registration', navigate to registration screen**
      if (type === 'registration') {
        console.log("Navigating to Registration with Image Buffer...");
        navigation.navigate('Registration', { imageBuffer: base64WithPrefix });
        setLoading(false);
        return;
      }
  
      // **If type is 'validation', proceed with API call**
      console.log("Sending API request for validation...");
  
      const payload = {
        image: base64WithPrefix, // Send as Base64 with prefix
        type: type, // Include type
      };
  
      const response = await axios.post(
        "https://yt0321nob3.execute-api.us-east-1.amazonaws.com/dev/TTD_FRS",
        payload,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
  
      console.log("Full API Response:", response.data);
  
      // ✅ Success Handling
      if (response.status === 200) {
        Alert.alert("Success", response.data.body?.message || "Validation successful!");
      } else {
        Alert.alert("Error", response.data.body?.message || "Validation failed.");
      }
    } catch (error) {
      console.error("Error processing image:", error);
  
      // ✅ Handle API Response Errors
      let errorMessage = "Something went wrong. Please try again.";
  
      if (error.response) {
        console.log("Error Response Data:", error.response.data);
        console.log("Error Status Code:", error.response.status);
  
        if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Invalid image format. Please try again.";
        } else if (error.response.status === 500) {
          errorMessage = "Server error. Please try again later.";
        }
      }
  
      Alert.alert("Error", errorMessage, [{ text: "OK", onPress: () => navigation.navigate("Landing") }]);

    } finally {
      setLoading(false); // Stop loading
    }
  };
  
  
  
  
  
  
  

  if (!hasPermission) return <Text>No access to camera</Text>;
  if (!device) return <Text>Loading camera...</Text>;

  return (
    <View style={styles.container}>
      <Camera ref={camera} style={styles.camera} device={device} isActive={true} photo={true} />

      {/* ✅ Full-screen Loader Overlay */}
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loaderText}>Processing...</Text>
        </View>
      )}

      <TouchableOpacity 
        style={[styles.captureButton, loading && { backgroundColor: 'gray' }]} 
        onPress={captureImage} 
        disabled={loading} // Disable button while loading
      >
        <Text style={styles.buttonText}>
          {type === 'registration' ? 'Capture & Register' : 'Capture & Validate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  captureButton: { 
    position: 'absolute', 
    bottom: 20, 
    backgroundColor: 'blue', 
    padding: 15, 
    borderRadius: 10 
  },
  buttonText: { color: 'white', fontSize: 16 },
  
  // ✅ Full-screen loader styles
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent overlay
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    color: 'white',
    marginTop: 10,
    fontSize: 16,
  }
});

export default Facecapture;
