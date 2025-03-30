// src/screens/Payment/OrderScreen.js
import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { Button, Divider, TextInput, RadioButton, HelperText } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../contexts/CartContext';
import { formatCardNumber, validatePaymentForm } from '../../utils/cardValidation';
import { useFocusEffect } from '@react-navigation/native';

const OrderScreen = ({ navigation }) => {
  // Use CartContext 
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);
  
  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(4.99);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [loading, setLoading] = useState(false);
  
  // Payment form fields
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [errors, setErrors] = useState({});
  const [formTouched, setFormTouched] = useState(false);

  // Flag to indicate if the component has performed initial check
  const hasCheckedCart = useRef(false);

  // Check cart only on screen focus, not on every render
  useFocusEffect(
    React.useCallback(() => {
      // Check if cart is empty only if we're not in the payment process
      if (cartItems.length === 0 && !loading && hasCheckedCart.current) {
        Alert.alert('Cart Empty', 'No items in your cart.');
        navigation.navigate('Home');
      }
      
      // After first check, we'll set this to true
      hasCheckedCart.current = true;
      
      // Prevent hardware back button from causing issues during payment
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => loading
      );
      
      return () => backHandler.remove();
    }, [cartItems, loading, navigation])
  );

  useEffect(() => {
    calculateTotals();
  }, [cartItems]);

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

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      removeFromCart(itemId);
      return;
    }
    
    updateQuantity(itemId, quantity);
  };

  const handlePayment = async () => {
    // Mark form as touched to show validation errors
    setFormTouched(true);
    
    if (paymentMethod === 'creditCard') {
      // Validate payment form
      const validationResult = validatePaymentForm({
        cardNumber,
        expiryDate,
        cvv,
        cardholderName
      });
      
      setErrors(validationResult.errors);
      
      if (!validationResult.isValid) {
        return;
      }
    }
    
    setLoading(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setLoading(false);
      
      // 90% chance of success, 10% chance of failure (for demo purposes)
      const isSuccess = Math.random() < 0.9;
      
      if (isSuccess) {
        // We don't clear the cart here - we'll do it in the PaymentSuccessScreen
        // Pass payment info to PaymentSuccess screen
        navigation.replace('PaymentSuccess', {
          total: total.toFixed(2),
          orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`
        });
      } else {
        navigation.replace('PaymentFailed');
      }
    }, 2000);
  };

  // Format expiry date input (MM/YY)
  const formatExpiryDate = (text) => {
    // Remove any non-digit characters
    const digitsOnly = text.replace(/\D/g, '');
    
    if (digitsOnly.length <= 2) {
      return digitsOnly;
    }
    
    // Format as MM/YY
    return `${digitsOnly.substring(0, 2)}/${digitsOnly.substring(2, 4)}`;
  };

  const handleExpiryDateChange = (text) => {
    setExpiryDate(formatExpiryDate(text));
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Processing your payment...</Text>
      </View>
    );
  }

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
                onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
              >
                <Ionicons name="remove" size={16} color="#007BFF" />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{item.quantity}</Text>
              
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
              >
                <Ionicons name="add" size={16} color="#007BFF" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.id)}
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
              value={cardNumber}
              onChangeText={(text) => setCardNumber(formatCardNumber(text))}
              style={styles.input}
              keyboardType="number-pad"
              error={formTouched && errors.cardNumber}
              maxLength={19} // 16 digits + 3 spaces
            />
            {formTouched && errors.cardNumber && (
              <HelperText type="error">{errors.cardNumber}</HelperText>
            )}
            
            <View style={styles.cardDetailsRow}>
              <View style={styles.halfInputContainer}>
                <TextInput 
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={handleExpiryDateChange}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  error={formTouched && errors.expiryDate}
                  maxLength={5} // MM/YY format
                />
                {formTouched && errors.expiryDate && (
                  <HelperText type="error">{errors.expiryDate}</HelperText>
                )}
              </View>
              
              <View style={styles.halfInputContainer}>
                <TextInput 
                  label="CVV"
                  placeholder="123"
                  value={cvv}
                  onChangeText={setCvv}
                  style={[styles.input, styles.halfInput]}
                  keyboardType="number-pad"
                  secureTextEntry
                  error={formTouched && errors.cvv}
                  maxLength={4}
                />
                {formTouched && errors.cvv && (
                  <HelperText type="error">{errors.cvv}</HelperText>
                )}
              </View>
            </View>
            
            <TextInput 
              label="Cardholder Name"
              placeholder="John Doe"
              value={cardholderName}
              onChangeText={setCardholderName}
              style={styles.input}
              error={formTouched && errors.cardholderName}
            />
            {formTouched && errors.cardholderName && (
              <HelperText type="error">{errors.cardholderName}</HelperText>
            )}
          </View>
        )}
        
        <View style={styles.spacer} />
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          mode="contained"
          style={styles.payButton}
          loading={loading}
          disabled={loading || cartItems.length === 0}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 12,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInputContainer: {
    width: '48%',
  },
  halfInput: {
    width: '100%',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  payButton: {
    width: '100%',
    paddingVertical: 8,
  },
});

export default OrderScreen;