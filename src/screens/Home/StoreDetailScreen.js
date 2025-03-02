import React, { useState, useEffect } from 'react';
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
import { Button, Card, Title, Paragraph, Divider, Badge } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { STORES } from '../../constants/mockData';
import { storeData, getData, STORAGE_KEYS } from '../../utils/asyncStorage';

const StoreDetailScreen = ({ route, navigation }) => {
  const { storeId } = route.params;
  const [store, setStore] = useState(null);
  const [cart, setCart] = useState([]);
  
  useEffect(() => {
    // In a real app, you would fetch store details from an API
    // Here we're just using our mock data
    const storeData = STORES.find((s) => s.id === storeId);
    setStore(storeData);
    
    // Load cart from AsyncStorage
    const loadCart = async () => {
      const savedCart = await getData(STORAGE_KEYS.CART_ITEMS);
      if (savedCart) {
        setCart(savedCart);
      }
    };
    
    loadCart();
  }, [storeId]);

  const addToCart = async (item) => {
    // Check if item is already in cart
    const existingItemIndex = cart.findIndex(
      (cartItem) => cartItem.id === item.id
    );
    
    let updatedCart = [];
    
    if (existingItemIndex >= 0) {
      // Item exists, update quantity
      updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1,
      };
    } else {
      // Item doesn't exist, add it with quantity 1
      updatedCart = [...cart, { ...item, quantity: 1, storeId, storeName: store.name }];
    }
    
    setCart(updatedCart);
    await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
    
    Alert.alert('Success', `${item.name} added to cart`);
  };

  const goToPayment = () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Add items to the cart before proceeding to checkout.');
      return;
    }
    
    navigation.navigate('Payment', { screen: 'Order' });
  };

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
            onPress={() => addToCart(item)}
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
      
      {cart.length > 0 && (
        <View style={styles.cartButtonContainer}>
          <TouchableOpacity style={styles.cartButton} onPress={goToPayment}>
            <Text style={styles.cartButtonText}>Proceed to Checkout</Text>
            <Badge size={24} style={styles.badge}>
              {cart.reduce((total, item) => total + item.quantity, 0)}
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