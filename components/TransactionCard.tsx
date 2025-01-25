import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const TransactionCard = ({ description, amount, date }: { description: string; amount: number; date: string }) => (
  <View style={styles.transactionCard}>
    <Text style={styles.transactionText}>{description}</Text>
    <Text style={styles.transactionText}>Amount: {amount}</Text>
    <Text style={styles.transactionDate}>Date: {new Date(date).toLocaleDateString()}</Text>
  </View>
);

const styles = StyleSheet.create({
  transactionCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  transactionText: {
    fontSize: 16,
    color: '#000', // Adjust color as needed
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
  },
});

export default TransactionCard;
