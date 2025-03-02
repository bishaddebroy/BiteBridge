import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Button, Divider, TextInput, RadioButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { getData, storeData, STORAGE_KEYS } from '../../utils/asyncStorage';

const OrderScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(4.99);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

  const loadCartItems = async () => {
    const savedCart = await getData(STORAGE_KEYS.CART_ITEMS);
    if (savedCart && savedCart.length > 0) {
      setCartItems(savedCart);
    } else {
      // No items in cart, go back to home
      Alert.alert('Cart Empty', 'No items in your cart.');
      navigation.goBack();
    }
  };

  const calculateTotals = () => {
    const itemsSubtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(itemsSubtotal);
    
    const calculatedTax = itemsSubtotal * 0.15; // 15% tax
    setTax(calculatedTax);
    
    setTotal(itemsSubtotal + calculatedTax + deliveryFee);
  };

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(id);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedCart);
    await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
  };

  const removeItem = async (id) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    
    if (updatedCart.length === 0) {
      Alert.alert('Cart Empty', 'No items in your cart.');
      await storeData(STORAGE_KEYS.CART_ITEMS, []);
      navigation.goBack();
      return;
    }
    
    setCartItems(updatedCart);
    await storeData(STORAGE_KEYS.CART_ITEMS, updatedCart);
  };

  const handlePayment = async () => {
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(async () => {
      setLoading(false);
      
      // 90% chance of success, 10% chance of failure (for demo purposes)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        // Clear cart after successful payment
        await storeData(STORAGE_KEYS.CART_ITEMS, []);
        navigation.navigate('PaymentSuccess');
      } else {
        navigation.navigate('PaymentFailed');
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        
        {cartItems.map(item => (
          <View key={item.id} style={styles.cartItem}>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.storeName}>from {item.storeName}</Text>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color="#007BFF" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#007BFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeItem(item.id)}
              >
                <Ionicons name="trash-outline" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
        
        <Divider style={styles.divider} />
        
        <View style={styles.costsSummary}>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Tax (15%)</Text>
            <Text style={styles.costValue}>${tax.toFixed(2)}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Delivery Fee</Text>
            <Text style={styles.costValue}>${deliveryFee.toFixed(2)}</Text>
          </View>
          
          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.sectionTitle}>Payment Method</Text>
        
        <View style={styles.paymentMethodContainer}>
          <RadioButton.Group
            onValueChange={value => setPaymentMethod(value)}
            value={paymentMethod}
          >
            <View style={styles.paymentOption}>
              <RadioButton value="creditCard" />
              <View style={styles.paymentOptionContent}>
                <Text style={styles.paymentOptionTitle}>Credit/Debit Card</Text>
                <View style={styles.cardIcons}>
                  <Ionicons name="card-outline" size={20} color="#666" />
                </View>
              </View>
            </View>
            
            <Divider />
            
            <View style={styles.paymentOption}>
              <RadioButton value="paypal" />
              <View style={styles.paymentOptionContent}>
                <Text style={styles.paymentOptionTitle}>PayPal</Text>
              </View>
            </View>
            
            <Divider />
            
            <View style={styles.paymentOption}>
              <RadioButton value="applePay" />
              <View style={styles.paymentOptionContent}>
                <Text style={styles.paymentOptionTitle}>Apple Pay</Text>
              </View>
            </View>
          </RadioButton.Group>
        </View>
        
        {paymentMethod === 'creditCard' && (
          <View style={styles.cardDetailsContainer}>
            <TextInput 
              label="Card Number"
              placeholder="1234 5678 9012 3456"
              style={styles.input}
              keyboardType="number-pad"
            />
            
            <View style={styles.cardDetailsRow}>
              <TextInput 
                label="Expiry Date"
                placeholder="MM/YY"
                style={[styles.input, styles.halfInput]}
                keyboardType="number-pad"
              />
              
              <TextInput 
                label="CVV"
                placeholder="123"
                style={[styles.input, styles.halfInput]}
                keyboardType="number-pad"
                secureTextEntry
              />
            </View>
            
            <TextInput 
              label="Cardholder Name"
              placeholder="John Doe"
              style={styles.input}
            />
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.payButton}
          loading={loading}
          disabled={loading}
          onPress={handlePayment}
        >
          Pay Now ${total.toFixed(2)}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  cartItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 1,
  },
  itemDetails: {
    marginBottom: 12,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  storeName: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#007BFF',
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    marginLeft: 'auto',
  },
  divider: {
    marginVertical: 16,
  },
  costsSummary: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  costLabel: {
    fontSize: 14,
    color: '#666',
  },
  costValue: {
    fontSize: 14,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  paymentMethodContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  paymentOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  paymentOptionTitle: {
    fontSize: 16,
    marginLeft: 8,
  },
  cardIcons: {
    flexDirection: 'row',
  },
  cardDetailsContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  spacer: {
    height: 100,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 16,
    elevation: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  payButton: {
    width: '100%',
    paddingVertical: 8,
  },
});

export default OrderScreen;