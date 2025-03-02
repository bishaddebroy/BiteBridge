import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const PaymentFailedScreen = ({ navigation }) => {
  const handleTryAgain = () => {
    navigation.navigate('Order');
  };

  const handleCancel = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.failedIcon}>
          <Ionicons name="close-circle" size={100} color="#FF3B30" />
        </View>
        
        <Text style={styles.title}>Payment Failed</Text>
        
        <Text style={styles.message}>
          We couldn't process your payment. Please check your payment details and try again.
        </Text>
        
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Possible reasons:</Text>
          <Text style={styles.errorItem}>• Insufficient funds</Text>
          <Text style={styles.errorItem}>• Invalid card details</Text>
          <Text style={styles.errorItem}>• Transaction declined by bank</Text>
          <Text style={styles.errorItem}>• Network connectivity issues</Text>
        </View>
      </View>
      
      <View style={styles.buttonsContainer}>
        <Button
          mode="contained"
          style={styles.button}
          onPress={handleTryAgain}
        >
          Try Again
        </Button>
        
        <Button
          mode="outlined"
          style={[styles.button, styles.secondaryButton]}
          onPress={handleCancel}
        >
          Cancel
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
  failedIcon: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#FF3B30',
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  errorContainer: {
    backgroundColor: '#FFF5F5',
    padding: 16,
    borderRadius: 8,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  buttonsContainer: {
    width: '100%',
  },
  button: {
    marginBottom: 12,
    paddingVertical: 8,
  },
  secondaryButton: {
    borderColor: '#FF3B30',
  },
});

export default PaymentFailedScreen;