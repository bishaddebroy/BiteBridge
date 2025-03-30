import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data to AsyncStorage
export const storeData = async (key, value) => {
  try {
    const jsonValue = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
    return true;
  } catch (error) {
    console.error('Error storing data:', error);
    return false;
  }
};

// Get data from AsyncStorage
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      try {
        return JSON.parse(value);
      } catch (e) {
        return value;
      }
    }
    return null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    return null;
  }
};

// Remove data from AsyncStorage
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing data:', error);
    return false;
  }
};

// Clear all data from AsyncStorage
export const clearAllData = async () => {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USER_NAME: 'user_name',
  USER_EMAIL: 'user_email',
  USER_PHONE: 'user_phone',
  IS_LOGGED_IN: 'is_logged_in',
  CART_ITEMS: 'cart_items',
  RECENT_SEARCHES: 'recent_searches',
  USER_PHOTO_URL: 'user_photo_url',
};