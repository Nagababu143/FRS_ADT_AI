import React, { useEffect, useRef, useReducer, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';
import RNFS from 'react-native-fs';
import { useNavigation, useRoute } from '@react-navigation/native';
import ImageResizer from 'react-native-image-resizer';
import axios from 'axios';
import FaceDetector from '@react-native-ml-kit/face-detection';

const actions = ['position_face', 'blink', 'turn_head'];
const reducer = (state, action) => {
  const currentIndex = actions.indexOf(state.action);
  if (action.type === actions[currentIndex + 1]) {
    return { action: action.type, completed: action.type === 'done' };
  }
  return state;
};

const Facecapture = () => {
  const camera = useRef(null);
  const device = useCameraDevice('front');
  const { hasPermission, requestPermission } = useCameraPermission();
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [state, dispatch] = useReducer(reducer, { action: 'position_face', completed: false });
  const actionRef = useRef('position_face');
  let lastFace = useRef(null);
  let lastEyeDistances = useRef({ left: null, right: null });
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraActive, setCameraActive] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false); // Track camera readiness

  // Request camera permission on mount
  useEffect(() => {
    if (!hasPermission) {
      requestPermission().then((permission) => {
        if (permission !== 'authorized') {
          Alert.alert('Camera Permission Denied', 'You need to grant camera permission to use this feature.');
        }
      });
    }
  }, [hasPermission]);

  // Periodic face detection
  useEffect(() => {
    let detectionInterval;
    if (!isProcessing && isCameraReady) {
      detectionInterval = setInterval(detectFace, 100);
    }
    return () => clearInterval(detectionInterval);
  }, [isProcessing, isCameraReady]);

  const stopProcessing = () => {
    setIsProcessing(true);
    setCameraActive(false);
  };



  const detectFace = async () => {
    if (!camera.current || loading || !isCameraReady) return;

    try {
      const photo = await camera.current.takePhoto({});
      const resizedImage = await ImageResizer.createResizedImage(photo.path, 1920, 1080, 'JPEG', 100, 0);
      const faceDetectionResult = await FaceDetector.detect(resizedImage.uri, { landmarkMode: 'all', contourMode: 'all' });

      if (faceDetectionResult.length === 0) {
        setFaceDetected(false);
        setIsProcessing(false);
        return;
      }

      setFaceDetected(true);
      const face = faceDetectionResult[0];

      // Enhanced Static Face Detection
      if (lastFace.current) {
        const deltaTime = Date.now() - lastFace.current.timestamp;
        const deltaX = Math.abs(face.frame.x - lastFace.current.frame.x);
        const deltaY = Math.abs(face.frame.y - lastFace.current.frame.y);
        const deltaRotation = Math.abs(face.rotationY - lastFace.current.rotationY);
        const deltaNose = Math.abs(face.landmarks.nose?.x - lastFace.current.landmarks.nose?.x);

        if (deltaX < 1 && deltaY < 1 && deltaRotation < 1 && deltaNose < 1 && deltaTime > 3000) {
          console.log('Possible Photo Spoofing Detected!');
          Alert.alert('Liveness Failed', 'Please use a real face, not a photo.');
          return;
        }
      }

      // Light Reflection Check (Detect Screens)
      if (face.landmarks?.eye?.left?.x && face.landmarks?.eye?.right?.x) {
        const brightnessDiff = Math.abs(face.landmarks.eye.left.brightness - face.landmarks.eye.right.brightness);
        if (brightnessDiff < 0.03) {
          console.log('Possible Screen Spoofing Detected!');
          Alert.alert('Liveness Failed', 'Please do not use a screen.');
          return;
        }
      }

      lastFace.current = { ...face, timestamp: Date.now() };
      handleChallengeResponse(face, photo.path);
    } catch (error) {
      console.error('Error detecting face:', error);
      stopProcessing();
    }
  };

  const blinkCount = useRef(0);
  const lastBlinkTime = useRef(0);
  const spoofDetected = useRef(false);
  
  const detectBlink = (face) => {
    if (!face.contours?.leftEye || !face.contours?.rightEye) {
      console.log('No eye contours detected!');
      return false;
    }
  
    // Calculate Eye Lid Distance
    const getEyeLidDistance = (eye) => {
      if (!eye?.points || eye.points.length < 6) {
        console.log('Insufficient points for eye lid distance calculation.');
        return null;
      }
      return Math.abs(eye.points[2].y - eye.points[5].y); // Ensure indices are correct
    };
  
    const leftEyeDistance = getEyeLidDistance(face.contours.leftEye);
    const rightEyeDistance = getEyeLidDistance(face.contours.rightEye);
  
    if (leftEyeDistance === null || rightEyeDistance === null) {
      return false;
    }
  
    // Initialize Baseline Values
    if (!lastEyeDistances.current.left || !lastEyeDistances.current.right) {
      lastEyeDistances.current = { left: leftEyeDistance, right: rightEyeDistance };
      console.log('Initialized baseline eye distances:', lastEyeDistances.current);
      return false;
    }
  
    const baselineLeft = lastEyeDistances.current.left;
    const baselineRight = lastEyeDistances.current.right;
  
    const blinkThreshold = 0.6; // Adjust sensitivity for blinks
    const eyeReopenThreshold = 1.05; // Ensure reopening after a blink
  
    // Detect Blink
    const isBlink =
      leftEyeDistance < blinkThreshold * baselineLeft &&
      rightEyeDistance < blinkThreshold * baselineRight;
  
    if (isBlink) {
      console.log('Blink Detected! Waiting for eyes to reopen...');
      blinkCount.current++;
  
      // Prevent Instant Spoofing
      const now = Date.now();
      if (blinkCount.current === 1) {
        lastBlinkTime.current = now;
      } else if (blinkCount.current >= 2) {
        const blinkTimeDiff = now - lastBlinkTime.current;
        if (blinkTimeDiff < 500) {
          console.log('Possible Spoof Detected! Blinking too fast.');
          spoofDetected.current = true;
        }
        blinkCount.current = 0;
      }
  
      // Wait for Reopen Confirmation
      setTimeout(() => {
        const reopenLeft = leftEyeDistance > eyeReopenThreshold * baselineLeft;
        const reopenRight = rightEyeDistance > eyeReopenThreshold * baselineRight;
  
        if (reopenLeft && reopenRight && !spoofDetected.current) {
          console.log('Blink Confirmed!');
        } else {
          console.log('Blink not confirmed! Possible spoofing detected.');
        }
      }, 500); // Ensure this delay matches the expected reopening time
  
      return isBlink;
    }
  
    // Update Baseline Values
    lastEyeDistances.current = { left: leftEyeDistance, right: rightEyeDistance };
    return false;
  };

  // Stronger Head Movement Detection
  const handleChallengeResponse = (face, imagePath) => {
    console.log('Current Action:', actionRef.current);
    switch (actionRef.current) {
      case 'position_face':
        if (face.frame) {
          actionRef.current = 'blink';
          dispatch({ type: 'blink' });
        }
        break;

      case 'blink':
        if (detectBlink(face)) {
          console.log('Blink Detected!');
          actionRef.current = 'turn_head';
          dispatch({ type: 'turn_head' });
        } else {
          console.log('No Blink Detected Yet...');
        }
        break;

      case 'turn_head':
        if (face.rotationY !== undefined && face.rotationY !== null) {
          console.log(`Detected Head Rotation: ${face.rotationY.toFixed(2)}°`);
          const headTurnThreshold = 10; // Adjust as needed

          if (Math.abs(face.rotationY) > headTurnThreshold) {
            console.log('Head Turn Detected!');
            stopProcessing();
            captureImage(imagePath);
          } else {
            console.log('Waiting for Head Turn...');
          }
        } else {
          console.log('rotationY data not available!');
        }
        break;

      default:
        break;
    }
  };

  // Capture and process the final image
  const captureImage = async (imagePath) => {
    if (loading) return;
    setLoading(true);
    setIsProcessing(true);

    try {
      // Resize the image only at this point
      const resizedImage = await ImageResizer.createResizedImage(imagePath, 800, 800, 'JPEG', 70, 0);
      const base64Image = await RNFS.readFile(resizedImage.uri, 'base64');
      const base64WithPrefix = `data:image/jpeg;base64,${base64Image}`;
    //  console.log('base64WithPrefix', base64WithPrefix);

      if (type === 'registration') {
        console.log('Navigating to Registration with Image Buffer...');
        stopProcessing();
        navigation.navigate('Registration', { imageBuffer: base64WithPrefix });
        setLoading(false);
        return;
      }

      const payload = {
        image: base64WithPrefix, // Send as Base64 with prefix
        type: type, // Include type
      };

      const response = await axios.post(
        'https://yt0321nob3.execute-api.us-east-1.amazonaws.com/dev/TTD_FRS',
        payload,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Full API Response:', response.data);
      stopProcessing();
      navigation.navigate('ProfileDetails', { data: response.data });
    } catch (error) {
      console.error('Error processing image:', error);

      let errorMessage = 'Something went wrong. Please try again.';
      if (error.response) {
        console.log('Error Response Data:', error.response.data);
        console.log('Error Status Code:', error.response.status);

        if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = 'Invalid image format. Please try again.';
        } else if (error.response.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      }

      Alert.alert('Error', errorMessage, [{ text: 'OK', onPress: () => navigation.navigate('Landing') }]);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  if (!hasPermission) return <Text>No access to camera</Text>;
  if (!device) return <Text>Loading camera...</Text>;

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        style={styles.camera}
        device={device}
        isActive={cameraActive}
        photo={true}
        onInitialized={() => setIsCameraReady(true)} // Track camera readiness
      />
      {loading && (
        <View style={styles.loaderOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.loaderText}>Processing...</Text>
        </View>
      )}
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{faceDetected ? `Step: ${state.action}` : 'Looking for Face...'}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camera: { flex: 1, width: '100%' },
  statusContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  statusText: { color: 'green', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  loaderOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center' },
  loaderText: { color: 'white', marginTop: 10, fontSize: 16 },
});

export default Facecapture;