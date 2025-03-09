import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import ImageResizer from 'react-native-image-resizer';

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
      console.log("photo",photo)
      
      const imagePath = photo.path.trim(); // Get file path
      console.log("imagePath",imagePath)
  
      // Resize the image
      const resizedImage = await ImageResizer.createResizedImage(imagePath, 800, 800, 'JPEG', 80);
    console.log(resizedImage.uri)
  
      // Prepare FormData
      const formData = new FormData();
      formData.append('image', {
        uri: resizedImage.uri.replace('file://', ''),
        name: 'photo.jpg',
        type: 'image/jpeg',
      });
      formData.append('type', type); // 'validate' or 'registration'
  
      // API Call
      const response = await fetch('https://yt0321nob3.execute-api.us-east-1.amazonaws.com/dev/TTD_FRS', {
        method: 'POST',
        headers: { 'Content-Type': 'multipart/form-data' },
        body: formData,
      });
      console.log("response",response)
      const result = await response.json();
      console.log("API Response:", result);
  
      // Handle Response
      if (result.statusCode === 200) {
        Alert.alert(
          "Success",
          result.body?.message || "Registration completed successfully!",
          [{ text: "OK", onPress: () => navigation.navigate("ProfileDetails", { data: result.body }) }]
        );
      } else {
        Alert.alert(
          "Error",
          result.body?.message || "Something went wrong.",
          [{ text: "OK", onPress: () => navigation.navigate("Landing") }]
        );
      }
    } catch (error) {
      console.error('Error processing image:', error);
      Alert.alert("Error", "Something went wrong. Please try again.");
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
