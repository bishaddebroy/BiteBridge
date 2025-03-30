// src/screens/Map/MapScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  TouchableOpacity, 
  Platform, 
  Alert,
  ScrollView
} from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import { Searchbar, Card, Title, Paragraph, ActivityIndicator, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../../constants/mockData';
import { getUserLocation } from '../../services/locationService';
import { calculateDistance, formatDistance, geocodeAddress } from '../../services/geocodingService';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.03;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = ({ navigation }) => {
  const [region, setRegion] = useState({
    latitude: 44.6488, // Halifax coordinates (center)
    longitude: -63.5752,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStores, setFilteredStores] = useState([]);
  const [storesWithDistances, setStoresWithDistances] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [geocoding, setGeocoding] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // 'distance', 'rating'
  const mapRef = useRef(null);

  // Load user location and geocode store addresses
  useEffect(() => {
    const initializeMap = async () => {
      try {
        setLoading(true);
        
        // Get user location
        const location = await getUserLocation();
        if (location) {
          setUserLocation(location);
          setRegion({
            ...location,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        }
        
        // Update stores with distances
        await updateStoresWithDistances(location);
        
        setLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to load map data. Please try again.');
      }
    };
    
    initializeMap();
  }, []);

  // Geocode all store addresses
  const geocodeStoreAddresses = async () => {
    try {
      setGeocoding(true);
      
      // For each store that doesn't have accurate coordinates, geocode its address
      const geocodingPromises = STORES.map(async (store) => {
        // Skip if store already has accurate coordinates (not mock data)
        if (store.hasAccurateCoordinates) {
          return store;
        }
        
        const geocoded = await geocodeAddress(store.address);
        
        if (geocoded) {
          return {
            ...store,
            coordinate: {
              latitude: geocoded.latitude,
              longitude: geocoded.longitude
            },
            formattedAddress: geocoded.formattedAddress || store.address,
            hasAccurateCoordinates: true
          };
        }
        
        return store;
      });
      
      const updatedStores = await Promise.all(geocodingPromises);
      
      // In a real app, you would save these geocoded results
      // For this demo, we'll just use them for this session
      console.log('Geocoded all store addresses');
      
      return updatedStores;
    } catch (error) {
      console.error('Error geocoding store addresses:', error);
      return STORES;
    } finally {
      setGeocoding(false);
    }
  };

  // Update stores with distances from user location
  const updateStoresWithDistances = async (location) => {
    try {
      // First geocode all addresses if needed
      const geocodedStores = await geocodeStoreAddresses();
      
      if (!location) {
        setStoresWithDistances(geocodedStores);
        setFilteredStores(geocodedStores);
        return;
      }
      
      // Calculate distance for each store
      const storesWithDist = geocodedStores.map(store => {
        const distance = calculateDistance(
          location.latitude,
          location.longitude,
          store.coordinate.latitude,
          store.coordinate.longitude
        );
        
        return {
          ...store,
          distance,
          formattedDistance: formatDistance(distance)
        };
      });
      
      // Sort stores by distance
      const sortedStores = [...storesWithDist].sort((a, b) => a.distance - b.distance);
      
      setStoresWithDistances(sortedStores);
      setFilteredStores(sortedStores);
    } catch (error) {
      console.error('Error updating stores with distances:', error);
      setStoresWithDistances(STORES);
      setFilteredStores(STORES);
    }
  };

  // Filter stores when search query changes
  useEffect(() => {
    filterStores();
  }, [searchQuery, storesWithDistances, sortBy]);

  const filterStores = () => {
    let filtered = [...storesWithDistances];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(store => {
        // Search in store name and description
        const matchesStore = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            store.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Search in menu items
        const matchesMenu = store.items.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        return matchesStore || matchesMenu;
      });
    }
    
    // Apply sorting
    if (sortBy === 'distance') {
      filtered.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    } else if (sortBy === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
    
    setFilteredStores(filtered);
    
    // If we have filtered results, center the map on the first result
    if (filtered.length > 0 && searchQuery) {
      const { coordinate } = filtered[0];
      mapRef.current?.animateToRegion({
        latitude: coordinate.latitude,
        longitude: coordinate.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
    }
  };

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
  };

  const handleStoreDetail = (storeId, storeName) => {
    navigation.navigate('StoreDetail', { storeId, storeName });
  };

  const toggleSortBy = () => {
    setSortBy(sortBy === 'distance' ? 'rating' : 'distance');
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search restaurants or dishes"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={toggleSortBy}
        >
          <Ionicons 
            name={sortBy === 'distance' ? 'locate' : 'star'} 
            size={22} 
            color="#007BFF" 
          />
        </TouchableOpacity>
      </View>
      
      <View style={styles.chipContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip 
            icon="information" 
            mode="outlined" 
            style={styles.infoChip}
          >
            {geocoding 
              ? 'Geocoding addresses...' 
              : filteredStores.length === 0 
                ? 'No results found' 
                : `${filteredStores.length} restaurants found`
            }
          </Chip>
          
          <Chip 
            icon={sortBy === 'distance' ? 'map-marker-distance' : 'star'}
            mode="outlined"
            selected
            onPress={toggleSortBy}
            style={styles.sortChip}
          >
            Sorted by {sortBy === 'distance' ? 'distance' : 'rating'}
          </Chip>
        </ScrollView>
      </View>
      
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredStores.map((store) => (
          <Marker
            key={store.id}
            coordinate={store.coordinate}
            title={store.name}
            description={store.description}
            onPress={() => handleMarkerPress(store)}
          >
            <View style={styles.markerContainer}>
              <View style={styles.marker}>
                <Ionicons name="restaurant" size={24} color="#FF3B30" />
              </View>
            </View>
            <Callout tooltip>
              <View>
                <Card style={styles.calloutCard}>
                  <Card.Content>
                    <Title style={styles.calloutTitle}>{store.name}</Title>
                    <Paragraph numberOfLines={2}>{store.description}</Paragraph>
                    <View style={styles.calloutFooter}>
                      <View style={styles.ratingContainer}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.rating}>{store.rating}</Text>
                      </View>
                      {store.formattedDistance && (
                        <Text style={styles.distance}>{store.formattedDistance}</Text>
                      )}
                      <Text style={styles.calloutAction}>View Details</Text>
                    </View>
                  </Card.Content>
                </Card>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {selectedStore && (
        <TouchableOpacity 
          style={styles.storePreview}
          onPress={() => handleStoreDetail(selectedStore.id, selectedStore.name)}
          activeOpacity={0.9}
        >
          <Card style={styles.previewCard}>
            <Card.Content>
              <Title>{selectedStore.name}</Title>
              <Paragraph numberOfLines={1}>{selectedStore.description}</Paragraph>
              <View style={styles.previewFooter}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{selectedStore.rating}</Text>
                </View>
                {selectedStore.formattedDistance && (
                  <View style={styles.distanceContainer}>
                    <Ionicons name="location" size={16} color="#007BFF" />
                    <Text style={styles.distance}>{selectedStore.formattedDistance}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.address}>{selectedStore.address}</Text>
            </Card.Content>
            <Card.Actions style={styles.previewActions}>
              <TouchableOpacity 
                style={styles.detailButton}
                onPress={() => handleStoreDetail(selectedStore.id, selectedStore.name)}
              >
                <Text style={styles.detailButtonText}>View Details</Text>
                <Ionicons name="chevron-forward" size={20} color="#007BFF" />
              </TouchableOpacity>
            </Card.Actions>
          </Card>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 10,
    right: 60, // Leave room for sort button
    zIndex: 5,
  },
  searchbar: {
    elevation: 4,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  sortButton: {
    position: 'absolute',
    top: 0,
    right: -50,
    backgroundColor: 'white',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  chipContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    left: 10,
    right: 10,
    zIndex: 5,
    flexDirection: 'row',
  },
  infoChip: {
    marginRight: 8,
    backgroundColor: 'white',
  },
  sortChip: {
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    alignItems: 'center',
  },
  marker: {
    padding: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  calloutCard: {
    width: 200,
    borderRadius: 10,
  },
  calloutTitle: {
    fontSize: 16,
  },
  calloutFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 12,
    color: '#007BFF',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  calloutAction: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  storePreview: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  previewCard: {
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  previewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  address: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  previewActions: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'flex-end',
  },
  detailButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailButtonText: {
    color: '#007BFF',
    fontWeight: 'bold',
    marginRight: 4,
  },
});

export default MapScreen;