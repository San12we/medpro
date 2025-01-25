import React from 'react';
import { Text, StyleSheet } from 'react-native';

const InfoCard = ({ label, value, isVisible }: { label: string; value: string; isVisible: boolean }) => (
  <Text style={styles.infoText}>{label}: {isVisible ? value : '******'}</Text>
);

const styles = StyleSheet.create({
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000', // Adjust color as needed
  },
});

export default InfoCard;
