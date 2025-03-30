// src/services/geocodingService.js

// Replace this with your actual Google API key
const GOOGLE_API_KEY = 'AIzaSyBLIQ3FesZhqTUS5AO2opiyIFrWT9xQaEs';

/**
 * Converts an address to geographic coordinates (latitude and longitude)
 * 
 * @param {string} address - The address to geocode
 * @returns {Promise<{latitude: number, longitude: number} | null>} Geographic coordinates or null if geocoding failed
 */
export const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;
      return { 
        latitude: lat, 
        longitude: lng,
        formattedAddress: data.results[0].formatted_address
      };
    }
    
    console.warn(`Geocoding failed for address: ${address}`);
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

/**
 * Performs reverse geocoding to convert coordinates to an address
 * 
 * @param {number} latitude - Latitude coordinate
 * @param {number} longitude - Longitude coordinate
 * @returns {Promise<string | null>} Address or null if reverse geocoding failed
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`
    );
    
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    
    console.warn(`Reverse geocoding failed for coordinates: ${latitude}, ${longitude}`);
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};

/**
 * Calculates distance between two geographic coordinates using the Haversine formula
 * 
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

/**
 * Converts degrees to radians
 * 
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI/180);
};

/**
 * Formats a distance for display
 * 
 * @param {number} distance - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    // Convert to meters if less than 1 km
    return `${Math.round(distance * 1000)} m`;
  } else {
    // Format to 1 decimal place if 1 km or more
    return `${distance.toFixed(1)} km`;
  }
};