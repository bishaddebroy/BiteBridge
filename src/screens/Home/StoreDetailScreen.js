// src/screens/Home/StoreDetailScreen.js
import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
  Platform
} from 'react-native';
import { Button, Card, Title, Paragraph, Divider, Badge, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../../constants/mockData';
import { CartContext } from '../../contexts/CartContext';
import { getUserLocation } from '../../services/locationService';
import { calculateDistance, formatDistance, geocodeAddress } from '../../services/geocodingService';

const StoreDetailScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [storeFoodCategories, setStoreFoodCategories] = useState([]);
  const [distance, setDistance] = useState(null);
  const [formattedDistance, setFormattedDistance] = useState(null);
  
  // Use CartContext instead of local cart state
  const { cartItems, addToCart, getItemCount } = useContext(CartContext);

  useEffect(() => {
    // In a real app, you would fetch store details from an API
    // Here we're just using our mock data
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        
        // Get store data
        const storeData = STORES.find((s) => s.id === storeId);
        
        if (!storeData) {
          Alert.alert('Error', 'Store not found');
          navigation.goBack();
          return;
        }
        
        setStore(storeData);
        
        // Get user location
        const location = await getUserLocation();
        if (location) {
          setUserLocation(location);
          
          // Calculate distance to store
          const dist = calculateDistance(
            location.latitude,
            location.longitude,
            storeData.coordinate.latitude,
            storeData.coordinate.longitude
          );
          
          setDistance(dist);
          setFormattedDistance(formatDistance(dist));
        }
        
        // Get store's food categories (in real app, this would come from API)
        // This is just for demonstration
        setStoreFoodCategories([
          { id: '1', name: 'Italian' },
          { id: '3', name: 'Pizza' },
          { id: '7', name: 'Pasta' }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching store details:', error);
        Alert.alert('Error', 'Failed to load store details');
        setLoading(false);
      }
    };
    
    fetchStoreDetails();
  }, [storeId, navigation]);

  const handleAddToCart = async (item) => {
    try {
      const success = await addToCart(item, storeId, store.name);
      
      if (success) {
        Alert.alert('Success', `${item.name} added to cart`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const goToPayment = () => {
    if (cartItems.length === 0) {
      Alert.alert('Cart Empty', 'Add items to the cart before proceeding to checkout.');
      return;
    }
    
    navigation.navigate('Payment', { screen: 'Order' });
  };
  
  const openDirections = () => {
    if (!store || !store.coordinate) {
      Alert.alert('Error', 'Store location not available');
      return;
    }
    
    const { latitude, longitude } = store.coordinate;
    let url;
    
    if (Platform.OS === 'ios') {
      url = `maps://app?saddr=Current%20Location&daddr=${latitude},${longitude}`;
    } else {
      url = `google.navigation:q=${latitude},${longitude}`;
    }
    
    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          // Fallback to browser-based maps if native maps app isn't available
          const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
          return Linking.openURL(browserUrl);
        }
      })
      .catch(err => {
        console.error('Error opening directions:', err);
        Alert.alert('Error', 'Could not open directions. Please try again.');
        
        // Fallback to browser-based maps as last resort
        const browserUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(browserUrl).catch(() => {
          Alert.alert('Error', 'Could not open directions in any map application.');
        });
      });
  };

  const renderCategory = ({ item }) => (
    <Chip 
      style={styles.categoryChip}
      textStyle={styles.categoryChipText}
    >
      {item.name}
    </Chip>
  );

  const renderItem = ({ item }) => {
    return (
      <Card style={styles.itemCard}>
        <Card.Cover source={{ uri: item.image }} style={styles.itemImage} />
        <Card.Content>
          <Title style={styles.itemName}>{item.name}</Title>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            onPress={() => handleAddToCart(item)}
            style={styles.addButton}
          >
            Add to Cart
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (!store) {
    return (
      <View style={styles.centered}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Image source={{ uri: store.image }} style={styles.storeImage} />
        
        <View style={styles.headerContainer}>
          <Text style={styles.storeName}>{store.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={18} color="#FFD700" />
            <Text style={styles.rating}>{store.rating}</Text>
          </View>
        </View>
        
        {storeFoodCategories.length > 0 && (
          <View style={styles.categoriesContainer}>
            <FlatList
              data={storeFoodCategories}
              renderItem={renderCategory}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>
        )}
        
        <Text style={styles.description}>{store.description}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.addressContainer}>
            <Ionicons name="location" size={18} color="#007BFF" />
            <Text style={styles.address}>{store.address}</Text>
          </View>
          
          {distance && (
            <View style={styles.distanceContainer}>
              <Ionicons name="navigate" size={18} color="#007BFF" />
              <Text style={styles.distance}>{formattedDistance} away</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={openDirections}
          >
            <Ionicons name="map" size={20} color="#007BFF" />
            <Text style={styles.actionText}>Directions</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // In a real app, this would call the restaurant
              Alert.alert('Demo', 'This would call the restaurant in a real app');
            }}
          >
            <Ionicons name="call" size={20} color="#007BFF" />
            <Text style={styles.actionText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              // In a real app, this would share the restaurant
              Alert.alert('Demo', 'This would share the restaurant in a real app');
            }}
          >
            <Ionicons name="share-social" size={20} color="#007BFF" />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={styles.sectionTitle}>Available Items</Text>
        
        <FlatList
          data={store.items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          horizontal={false}
          scrollEnabled={false}
          numColumns={2}
          contentContainerStyle={styles.itemsContainer}
        />
      </ScrollView>
      
      {cartItems.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity style={styles.cartButton} onPress={goToPayment}>
            <Text style={styles.cartButtonText}>Proceed to Checkout</Text>
            <Badge size={24} style={styles.badge}>
              {cartItems.reduce((total, item) => total + item.quantity, 0)}
            </Badge>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storeImage: {
    width: '100%',
    height: 200,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  storeName: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
  },
  categoriesContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  categoryChip: {
    marginRight: 8,
    backgroundColor: '#F0F0F0',
  },
  categoryChipText: {
    fontSize: 12,
  },
  description: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 12,
    lineHeight: 24,
  },
  infoRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 8,
    fontSize: 14,
    color: '#007BFF',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#F8F8F8',
    marginTop: 16,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    marginTop: 4,
    color: '#007BFF',
    fontSize: 12,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  itemsContainer: {
    paddingHorizontal: 8,
  },
  itemCard: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    elevation: 2,
  },
  itemImage: {
    height: 120,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  itemName: {
    fontSize: 16,
  },
  priceContainer: {
    marginTop: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  cardActions: {
    justifyContent: 'center',
  },
  addButton: {
    marginVertical: 8,
  },
  cartButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'white',
    elevation: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  cartButton: {
    backgroundColor: '#007BFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    position: 'relative',
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  badge: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#FF3B30',
  },
});

export default StoreDetailScreen;