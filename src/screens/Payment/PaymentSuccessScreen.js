// src/screens/Payment/PaymentSuccessScreen.js
import React, { useEffect, useContext } from 'react';
import { View, Text, StyleSheet, BackHandler } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { CartContext } from '../../contexts/CartContext';
import { CommonActions } from '@react-navigation/native';

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { clearCart } = useContext(CartContext);
  const { orderId, total } = route.params || { 
    orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
    total: '0.00'
  };
  
  // Clear cart when this screen mounts
  useEffect(() => {
    clearCart();
    
    // Prevent going back to Order screen with hardware back button
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleContinueShopping();
        return true;
      }
    );
    
    return () => backHandler.remove();
  }, []);

  const handleContinueShopping = () => {
    // Reset navigation to Home screen
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    );
  };

  const handleViewOrders = () => {
    // Reset navigation and navigate to Profile > Orders
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { 
            name: 'Profile',
            state: {
              routes: [{ name: 'Orders' }],
            }
          }
        ],
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color="#4CAF50" />
        </View>
        
        <Text style={styles.title}>Payment Successful!</Text>
        
        <Text style={styles.message}>
          Your order has been placed successfully. You will receive a confirmation email shortly.
        </Text>
        
        <View style={styles.orderDetailsContainer}>
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Order ID:</Text>
            <Text style={styles.orderDetailValue}>{orderId}</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Amount Paid:</Text>
            <Text style={styles.orderDetailValue}>${total}</Text>
          </View>
          
          <View style={styles.orderDetailRow}>
            <Text style={styles.orderDetailLabel}>Date:</Text>
            <Text style={styles.orderDetailValue}>
              {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleViewOrders}
        >
          View My Orders
        </Button>
        
        <Button
          mode="outlined"
          style={[styles.button, styles.secondaryButton]}
          onPress={handleContinueShopping}
        >
          Continue Shopping
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    padding: 20,
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  successIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  orderDetailsContainer: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  orderDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  orderDetailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDetailValue: {
    fontSize: 16,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  secondaryButton: {
    borderColor: '#007BFF',
  },
});

export default PaymentSuccessScreen;