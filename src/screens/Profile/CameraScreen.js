// src/screens/Profile/CameraScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../contexts/AuthContext';
import { uploadProfilePicture } from '../../services/authService';

const CameraScreen = ({ navigation }) => {
  const { user, refreshUser } = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Function to handle picking an image from the gallery
  const pickImage = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to your photo library to select a profile picture.');
        return;
      }

      // Launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Function to handle taking a photo using the device camera
  const takePhoto = async () => {
    try {
      // Request camera permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Please allow camera access to take a profile picture.');
        return;
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo. Please try again.');
    }
  };

  const retakePicture = () => {
    setImage(null);
  };

  // Function to save the profile picture
  const saveProfilePicture = async () => {
    if (!image || !user) return;
    
    try {
      setLoading(true);
      
      // Upload the image to Firebase
      await uploadProfilePicture(image, user.uid);
      
      // Refresh the user data to get the updated profile image URL
      await refreshUser();
      
      Alert.alert(
        'Success',
        'Profile picture updated successfully',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Failed to update profile picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {image ? (
        // Preview captured image
        <View style={styles.previewContainer}>
          <Image source={{ uri: image }} style={styles.previewImage} />
          
          <View style={styles.previewActions}>
            <TouchableOpacity
              style={styles.previewButton}
              onPress={retakePicture}
              disabled={loading}
            >
              <Ionicons name="refresh" size={24} color="white" />
              <Text style={styles.previewButtonText}>Retake</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.previewButton, styles.saveButton]}
              onPress={saveProfilePicture}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={24} color="white" />
                  <Text style={styles.previewButtonText}>Save</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Show options to take photo or select from gallery
        <View style={styles.optionsContainer}>
          <Text style={styles.title}>Update Profile Picture</Text>
          
          <TouchableOpacity style={styles.optionButton} onPress={takePhoto}>
            <View style={styles.iconContainer}>
              <Ionicons name="camera-outline" size={32} color="#007BFF" />
            </View>
            <Text style={styles.optionText}>Take Photo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionButton} onPress={pickImage}>
            <View style={styles.iconContainer}>
              <Ionicons name="images-outline" size={32} color="#007BFF" />
            </View>
            <Text style={styles.optionText}>Choose from Gallery</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: '100%',
    maxWidth: 350,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eeeeee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 20,
    padding: 12,
  },
  cancelButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  previewImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 40,
  },
  previewActions: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  previewButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#007BFF',
  },
  previewButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 8,
  },
});

export default CameraScreen;