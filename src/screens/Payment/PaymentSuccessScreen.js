import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PaymentSuccessScreen = ({ navigation }) => {
  const handleContinueShopping = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handleViewOrders = () => {
    navigation.navigate('Profile', { screen: 'Orders' });
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
        
        <View style={styles.orderIdContainer}>
          <Text style={styles.orderIdLabel}>Order ID:</Text>
          <Text style={styles.orderId}>ORD-{Math.floor(100000 + Math.random() * 900000)}</Text>
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
  orderIdContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  orderIdLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  orderId: {
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