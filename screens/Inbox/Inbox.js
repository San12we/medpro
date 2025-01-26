import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  TextInput,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useSelector } from 'react-redux';

import { fetchBanks, createSubaccount } from '../../utils/api'; 

export default function Inbox() {
  const user = useSelector((state) => state.auth?.user);
  const [subaccountData, setSubaccountData] = useState({
    business_name: '',
    settlement_bank: '',
    account_number: '',
    percentage_charge: '2.5',
  });
  const [banks, setBanks] = useState([]);
  const [viewMode, setViewMode] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    StatusBar.setBarStyle('light-content');

    const loadBanks = async () => {
      try {
        const banksData = await fetchBanks();
        setBanks(banksData);
      } catch (error) {
        console.error('Error fetching banks:', error);
      }
    };

    loadBanks();
    setLoading(false);
  }, []);

  const handleUpdatePayment = async () => {
    const { business_name, settlement_bank, account_number, percentage_charge } = subaccountData;
    if (!business_name || !settlement_bank || !account_number) {
      alert('All fields are required.');
      return;
    }
    try {
      await createSubaccount({
        business_name,
        settlement_bank,
        account_number,
        percentage_charge,
        professionalId: user.userId,
      });
      alert('Subaccount updated successfully.');
      setViewMode('default');
    } catch {
      alert('Failed to update payment info.');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size='large' />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{
          height: 260,
          borderRadius: 20,
          marginTop: -20,
          paddingTop: 60,
          paddingHorizontal: 10,
        }}
        start={[0, 1]}
        end={[1, 0]}
        colors={['#232526', '#414345']}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Image
              style={{ width: 50, height: 50, borderRadius: 100 }}
              source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/86.jpg' }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
          >
            <Text
              style={{ fontWeight: 'bold', color: '#fff' }}
            >
            Dr. {user?.firstName}
            </Text>
          </View>
        </View>
      </LinearGradient>
      <View
        style={{
          backgroundColor: '#fff',
          height: 200,
          marginTop: -120,
          borderRadius: 20,
          marginHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 14,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text>
              Balance
            </Text>
            <Text style={{ fontWeight: 'bold' }}>KSH 52,645</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#333',
                paddingLeft: 4,
                paddingRight: 10,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Icon name='arrow-up-right' size={20} color='#fff' />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginLeft: 4,
                }}
              >
                Send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#333',
                marginLeft: 10,
                paddingLeft: 4,
                paddingRight: 10,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Icon name='arrow-down-left' size={20} color='#fff' />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  marginLeft: 4,
                }}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='trending-down' color='green' size={30} />
            <Text style={{ fontWeight: 'bold' }}>Received</Text>
            <Text
              style={{ marginTop: 4 }}
            >
              KSH0
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='trending-up' color='red' size={30} />
            <Text style={{ fontWeight: 'bold' }}>Spent</Text>
            <Text
              style={{ marginTop: 4 }}
            >
              KSH 0
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='pocket' color='#0984e3' size={30} />
            <Text style={{ fontWeight: 'bold' }}>Saved</Text>
            <Text
              style={{ marginTop: 4 }}
            >
              KSH 0
            </Text>
          </View>
        </View>
      </View>
      <ScrollView style={{ marginTop: 20, paddingHorizontal: 10 }} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ fontWeight: 'bold' }}>
            Recent Transactions
          </Text>
          <TouchableOpacity>
            <Icon name='more-horizontal' size={24} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            backgroundColor: '#fff',
            marginTop: 10,
            borderRadius: 10,
            paddingVertical: 6,
            paddingHorizontal: 10,
            flexDirection: 'row',
          }}
        >
          <View>
            <Icon name='arrow-down' size={30} color='green' />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text>
              Sample Transaction
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontWeight: 'bold', color: 'green' }}>
              + KSH 0
            </Text>
          </View>
        </View>
        <View style={{ marginTop: 20, paddingHorizontal: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>
            Payment Method
          </Text>
          {viewMode === 'default' && (
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
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  updateButton: {
    backgroundColor: '#333',
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
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
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
  },
});