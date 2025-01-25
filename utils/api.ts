import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PAYSTACK_SECRET_KEY = process.env.EXPO_PUBLIC_PAYSTACK_SECRET_KEY;

export const fetchBanks = async () => {
  try {
    const response = await axios.get('https://api.paystack.co/bank?country=kenya', {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    return response.data.data || [];
  } catch (error) {
    throw new Error('Failed to fetch banks.');
  }
};

export const fetchSubaccountInfo = async (userId: string | null) => {
  if (!userId) return null;
  try {
    const response = await axios.get(`https://medplus-health.onrender.com/api/subaccount/${userId}`);
    return response.data;
  } catch {
    throw new Error('Failed to fetch account info.');
  }
};

export const fetchTransactions = async () => {
  try {
    const reference = await AsyncStorage.getItem('transactionReference');
    if (!reference) throw new Error('Transaction reference not found.');
    const response = await axios.get(`https://api.paystack.co/transaction/${reference}`, {
      headers: { Authorization: `Bearer ${PAYSTACK_SECRET_KEY}` },
    });
    return response.data || [];
  } catch (error) {
    return [];
  }
};

export const createSubaccount = async (data: {
  business_name: string;
  settlement_bank: string;
  account_number: string;
  percentage_charge: string;
  professionalId: string;
}) => {
  try {
    await axios.post('https://medplus-health.onrender.com/api/payment/create-subaccount', data);
  } catch (error) {
    throw new Error('Failed to create subaccount.');
  }
};