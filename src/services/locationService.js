// src/services/locationService.js
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../utils/asyncStorage';
import { geocodeAddress, reverseGeocode } from './geocodingService';

/**
 * Gets the user's current location
 * 
 * @returns {Promise<{latitude: number, longitude: number} | null>} User's coordinates or null if permission is denied
 */
export const getCurrentLocation = async () => {
  try {
    // Request permission to access location
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      console.log('Location permission denied');
      return null;
    }
    
    // Get current position with high accuracy
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });
    
    const { latitude, longitude } = location.coords;
    
    // Store location in AsyncStorage for future use
    await AsyncStorage.setItem(
      STORAGE_KEYS.USER_LOCATION, 
      JSON.stringify({ latitude, longitude, timestamp: Date.now() })
    );
    
    return { latitude, longitude };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

/**
 * Gets the user's last known location from AsyncStorage
 * 
 * @returns {Promise<{latitude: number, longitude: number} | null>} Last known location or null
 */
export const getLastKnownLocation = async () => {
  try {
    const locationJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_LOCATION);
    
    if (!locationJson) {
      return null;
    }
    
    const location = JSON.parse(locationJson);
    
    // Check if location is less than 15 minutes old
    const fifteenMinutesAgo = Date.now() - (15 * 60 * 1000);
    
    if (location.timestamp < fifteenMinutesAgo) {
      // Location is too old, get new location
      return getCurrentLocation();
    }
    
    return { latitude: location.latitude, longitude: location.longitude };
  } catch (error) {
    console.error('Error getting last known location:', error);
    return null;
  }
};

/**
 * Gets the user's location, first trying cached location, then current location
 * 
 * @returns {Promise<{latitude: number, longitude: number} | null>} User's coordinates or null
 */
export const getUserLocation = async () => {
  // First try to get from cache
  const cachedLocation = await getLastKnownLocation();
  
  if (cachedLocation) {
    return cachedLocation;
  }
  
  // If not in cache or too old, get current location
  return getCurrentLocation();
};

/**
 * Gets the user's current address based on coordinates
 * 
 * @returns {Promise<string | null>} User's address or null if geocoding fails
 */
export const getUserAddress = async () => {
  const location = await getUserLocation();
  
  if (!location) {
    return null;
  }
  
  // Use reverse geocoding to get address
  return reverseGeocode(location.latitude, location.longitude);
};

/**
 * Saves a delivery address to AsyncStorage
 * 
 * @param {string} address - The address to save
 * @returns {Promise<boolean>} Success status
 */
export const saveDeliveryAddress = async (address) => {
  try {
    // Geocode the address to get coordinates
    const coordinates = await geocodeAddress(address);
    
    if (!coordinates) {
      return false;
    }
    
    // Store both address and coordinates
    const addressData = {
      formattedAddress: coordinates.formattedAddress || address,
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      timestamp: Date.now()
    };
    
    await AsyncStorage.setItem(
      STORAGE_KEYS.DELIVERY_ADDRESS, 
      JSON.stringify(addressData)
    );
    
    return true;
  } catch (error) {
    console.error('Error saving delivery address:', error);
    return false;
  }
};

/**
 * Gets the saved delivery address
 * 
 * @returns {Promise<{address: string, latitude: number, longitude: number} | null>} Saved address or null
 */
export const getDeliveryAddress = async () => {
  try {
    const addressJson = await AsyncStorage.getItem(STORAGE_KEYS.DELIVERY_ADDRESS);
    
    if (!addressJson) {
      return null;
    }
    
    return JSON.parse(addressJson);
  } catch (error) {
    console.error('Error getting delivery address:', error);
    return null;
  }
};