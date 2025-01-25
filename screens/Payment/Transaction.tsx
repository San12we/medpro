import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Alert, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../components/Shared/Colors';
import { useNavigation } from '@react-navigation/native';
import InfoCard from '../../components/InfoCard';
import TransactionCard from '../../components/TransactionCard';
import { fetchBanks, fetchSubaccountInfo, fetchTransactions } from '../../utils/api';
import axios from 'axios';


const Transaction: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [subaccountData, setSubaccountData] = useState({
    business_name: '',
    settlement_bank: '',
    account_number: '',
    percentage_charge: '2.5',
  });
  const [banks, setBanks] = useState<{ name: string; code: string }[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAccountInfoVisible, setIsAccountInfoVisible] = useState(false);
  const [viewMode, setViewMode] = useState<'default' | 'payment'>('default');
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const storedUserId = await AsyncStorage.getItem('userId');
      setUserId(storedUserId);
      try {
        const [banksData, subaccountInfo, transactionsData] = await Promise.all([
          fetchBanks(),
          fetchSubaccountInfo(storedUserId),
          fetchTransactions(),
        ]);
        setBanks(banksData);
        setSubaccountData(subaccountInfo || subaccountData);
        setTransactions(transactionsData);
      } catch (error) {
        showAlert(error.message);
      }
      setLoading(false);
    })();
  }, []);

  const showAlert = (message: string) => Alert.alert('Error', message);

  const handleUpdatePayment = async () => {
    const { business_name, settlement_bank, account_number, percentage_charge } = subaccountData;
    if (!business_name || !settlement_bank || !account_number) {
      showAlert('All fields are required.');
      return;
    }
    try {
      await axios.post('https://medplus-health.onrender.com/api/payment/create-subaccount', {
        business_name,
        settlement_bank,
        account_number,
        percentage_charge,
        professionalId: userId,
      });
      Alert.alert('Success', 'Subaccount updated successfully.');
      setViewMode('default');
    } catch {
      showAlert('Failed to update payment info.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.SECONDARY} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8f8f8' }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons color="#000" name="arrow-back" size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.container}>
       
        {viewMode === 'default' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoCardRow}>
                <InfoCard label="Business Name" value={subaccountData.business_name} isVisible={isAccountInfoVisible} />
                <TouchableOpacity onPress={() => setIsAccountInfoVisible(!isAccountInfoVisible)}>
                  <Ionicons name={isAccountInfoVisible ? 'eye-off' : 'eye'} size={24} color={Colors.iconColor} />
                </TouchableOpacity>
              </View>
              <InfoCard label="Account Number" value={subaccountData.account_number} isVisible={isAccountInfoVisible} />
              <InfoCard label="Bank" value={subaccountData.settlement_bank} isVisible={isAccountInfoVisible} />
            </View>
          </View>
        )}

       
        {!subaccountData.business_name && viewMode === 'default' && (
          <TouchableOpacity style={styles.updateButton} onPress={() => setViewMode('payment')}>
            <Text style={styles.updateButtonText}>Update Payment Info</Text>
          </TouchableOpacity>
        )}

        
        {viewMode === 'payment' && (
          <View style={styles.paymentForm}>
            <Text style={styles.sectionTitle}>Update Payment</Text>
            <TextInput
              style={styles.input}
              placeholder="Business Name"
              value={subaccountData.business_name}
              onChangeText={(text) => setSubaccountData({ ...subaccountData, business_name: text })}
            />
            <Picker
              selectedValue={subaccountData.settlement_bank}
              onValueChange={(itemValue) => setSubaccountData({ ...subaccountData, settlement_bank: itemValue })}
              style={styles.picker}
            >
              {banks.map((bank, index) => (
                <Picker.Item key={`${bank.code}-${index}`} label={bank.name} value={bank.code} />
              ))}
            </Picker>
            <TextInput
              style={styles.input}
              placeholder="Account Number"
              value={subaccountData.account_number}
              onChangeText={(text) => setSubaccountData({ ...subaccountData, account_number: text })}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton} onPress={handleUpdatePayment}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setViewMode('default')}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Transaction History Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Transaction History</Text>
          {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
              <TransactionCard key={index} {...transaction} />
            ))
          ) : (
            <Text style={styles.noTransactionsText}>No transactions found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light_gray,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.primary,
  },
  updateButton: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  updateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  infoCard: {
    padding: 15,
    backgroundColor: Colors.SECONDARY,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.textPrimary,
  },
  paymentForm: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    marginBottom: 20,
  },
  input: {
    marginBottom: 18,
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  submitButton: {
    backgroundColor: Colors.SECONDARY,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
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
    color: Colors.textPrimary,
  },
  transactionDate: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noTransactionsText: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
    fontSize: 16,
  },
  infoCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconColor: {
    color: '#888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 16,
  },
  headerAction: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#000',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    textAlign: 'center',
  },
});

export default Transaction;