import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Searchbar, Card, Title, Paragraph } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../../constants/mockData';

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
  const [filteredStores, setFilteredStores] = useState(STORES);
  const [selectedStore, setSelectedStore] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    // Filter stores based on search query
    if (searchQuery) {
      const filtered = STORES.filter(store => 
        store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStores(filtered);
      
      // If we have filtered results, center the map on the first result
      if (filtered.length > 0) {
        const { coordinate } = filtered[0];
        mapRef.current?.animateToRegion({
          latitude: coordinate.latitude,
          longitude: coordinate.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    } else {
      setFilteredStores(STORES);
    }
  }, [searchQuery]);

  const handleMarkerPress = (store) => {
    setSelectedStore(store);
  };

  const handleStoreDetail = (storeId, storeName) => {
    navigation.navigate('StoreDetail', { storeId, storeName });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search stores"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>
      
      <MapView
        ref={mapRef}
        //provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={setRegion}
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
                <Ionicons name="location" size={24} color="#FF3B30" />
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
                <Text style={styles.address}>{selectedStore.address}</Text>
              </View>
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
  searchContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 5,
  },
  searchbar: {
    elevation: 4,
    borderRadius: 10,
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