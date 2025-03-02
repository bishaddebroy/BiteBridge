import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Divider, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { PAYMENTS } from '../../constants/mockData';

const PaymentsScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Here we're using mock data
    loadPayments();
  }, []);

  const loadPayments = async () => {
    try {
      // Simulate API call delay
      setTimeout(() => {
        setPayments(PAYMENTS);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading payments:', error);
      Alert.alert('Error', 'Failed to load payment history. Please try again.');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Success':
        return '#4CAF50';
      case 'Pending':
        return '#FFC107';
      case 'Failed':
        return '#FF3B30';
      default:
        return '#007BFF';
    }
  };

  const getPaymentIcon = (method) => {
    switch (method) {
      case 'Credit Card':
        return 'card-outline';
      case 'PayPal':
        return 'logo-paypal';
      case 'Apple Pay':
        return 'logo-apple';
      default:
        return 'cash-outline';
    }
  };

  const renderPaymentItem = ({ item }) => {
    return (
      <Card style={styles.paymentCard}>
        <View style={styles.paymentHeader}>
          <View style={styles.dateContainer}>
            <Text style={styles.paymentId}>Payment #{item.id.split('-')[1]}</Text>
            <Text style={styles.paymentDate}>{item.date}</Text>
          </View>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: getStatusColor(item.status) + '20' },
            ]}
            textStyle={{ color: getStatusColor(item.status) }}
          >
            {item.status}
          </Chip>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.paymentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>${item.amount.toFixed(2)}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method</Text>
            <View style={styles.methodContainer}>
              <Ionicons name={getPaymentIcon(item.method)} size={16} color="#666" />
              <Text style={styles.detailValue}>{item.method}</Text>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>{item.date}</Text>
          </View>
        </View>

        <Divider style={styles.divider} />

        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'Payment Receipt',
                `Receipt for payment ${item.id} would show here`
              );
            }}
          >
            <Ionicons name="receipt-outline" size={16} color="#007BFF" />
            <Text style={styles.actionText}>Receipt</Text>
          </TouchableOpacity>

          {item.status === 'Failed' && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                Alert.alert(
                  'Retry Payment',
                  `You can retry the payment ${item.id}`
                );
              }}
            >
              <Ionicons name="refresh-outline" size={16} color="#007BFF" />
              <Text style={styles.actionText}>Retry</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert(
                'Payment Details',
                `Details for payment ${item.id} would show here`
              );
            }}
          >
            <Ionicons name="information-circle-outline" size={16} color="#007BFF" />
            <Text style={styles.actionText}>Details</Text>
          </TouchableOpacity>
        </View>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Loading your payment history...</Text>
      </View>
    );
  }

  if (payments.length === 0) {
    return (
      <View style={styles.centered}>
        <Ionicons name="card-outline" size={60} color="#ccc" />
        <Text style={styles.noPaymentsText}>No payments yet</Text>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.shopButtonText}>Start Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={payments}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
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
  noPaymentsText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    color: '#666',
  },
  shopButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  shopButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    padding: 16,
  },
  paymentCard: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  dateContainer: {
    flex: 1,
  },
  paymentId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  paymentDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusChip: {
    height: 30,
  },
  divider: {
    marginHorizontal: 16,
  },
  paymentDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 6,
  },
  actionsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    color: '#007BFF',
    marginLeft: 6,
  },
});

export default PaymentsScreen;