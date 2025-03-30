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
} from 'react-native';
import { Button, Card, Title, Paragraph, Divider, Badge, ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../../constants/mockData';
import { CartContext } from '../../contexts/CartContext';

const StoreDetailScreen = ({ route, navigation }) => {
  const { storeId, highlightItemId } = route.params;
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Use CartContext instead of local cart state
  const { cartItems, addToCart, getItemCount } = useContext(CartContext);
  
  useEffect(() => {
    // Fetch store details
    const fetchStoreDetails = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch store details from an API
        // Here we're just using mock data with a small delay to simulate network
        setTimeout(() => {
          const storeData = STORES.find((s) => s.id === storeId);
          setStore(storeData);
          setLoading(false);
          
          // If there's a highlighted item, scroll to it
          if (highlightItemId && storeData) {
            // Implementation would depend on your UI structure
            // You might need a ref and scrollToItem function
          }
        }, 300);
      } catch (error) {
        console.error('Error fetching store details:', error);
        Alert.alert('Error', 'Failed to load store details');
        setLoading(false);
      }
    };
    
    fetchStoreDetails();
  }, [storeId, highlightItemId]);

  const handleAddToCart = async (item) => {
    try {
      const success = await addToCart(item, storeId, store.name);
      
      if (success) {
        Alert.alert(
          'Added to Cart', 
          `${item.name} has been added to your cart.`,
          [
            { 
              text: 'Keep Shopping', 
              style: 'default' 
            },
            { 
              text: 'View Cart', 
              onPress: () => navigation.navigate('Payment', { screen: 'Order' }) 
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const goToPayment = () => {
    if (getItemCount() === 0) {
      Alert.alert('Cart Empty', 'Add items to the cart before proceeding to checkout.');
      return;
    }
    
    navigation.navigate('Payment', { screen: 'Order' });
  };

  const renderItem = ({ item }) => {
    // Check if this item is in the cart
    const itemInCart = cartItems.find(cartItem => cartItem.id === item.id);
    const isHighlighted = highlightItemId === item.id;
    
    return (
      <Card 
        style={[
          styles.itemCard,
          isHighlighted && styles.highlightedCard
        ]}
      >
        <Card.Cover source={{ uri: item.image }} style={styles.itemImage} />
        <Card.Content>
          <Title style={styles.itemName}>{item.name}</Title>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            {itemInCart && (
              <Badge style={styles.cartBadge}>
                {itemInCart.quantity}
              </Badge>
            )}
          </View>
        </Card.Content>
        <Card.Actions style={styles.cardActions}>
          <Button 
            mode="contained" 
            onPress={() => handleAddToCart(item)}
            style={styles.addButton}
            icon={itemInCart ? "cart-plus" : "cart"}
          >
            {itemInCart ? 'Add More' : 'Add to Cart'}
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Loading store details...</Text>
      </View>
    );
  }

  if (!store) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={60} color="#FF3B30" />
        <Text style={styles.errorText}>Store not found</Text>
        <Button 
          mode="contained" 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const itemCount = getItemCount();

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
        
        <Text style={styles.description}>{store.description}</Text>
        
        <View style={styles.addressContainer}>
          <Ionicons name="location" size={18} color="#007BFF" />
          <Text style={styles.address}>{store.address}</Text>
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
      
      {itemCount > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity style={styles.cartButton} onPress={goToPayment}>
            <Text style={styles.cartButtonText}>Proceed to Checkout</Text>
            <Badge size={24} style={styles.badge}>
              {itemCount}
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
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
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
  description: {
    fontSize: 16,
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 12,
    lineHeight: 24,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  address: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
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
    paddingBottom: 100, // Add space for the cart button at bottom
  },
  itemCard: {
    flex: 1,
    margin: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  highlightedCard: {
    borderWidth: 2,
    borderColor: '#007BFF',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  cartBadge: {
    backgroundColor: '#007BFF',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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