
<!-- profile upload -->

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { pickImage, uploadImage } from '../../utils/imageUtils'; // Import utility functions
import { updateDoctorProfile } from '../../utils/api'; // Import API utility function
import { backArrowImg } from '../../theme/Images';

const DoctorRegistrationForm = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadProfileImage = async () => {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    };

    loadProfileImage();
  }, []);

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setProfileImage(imageUri);
    }
  };

  const handleSubmit = async () => {
    if (!profileImage || !fullName || !email || !phoneNumber) {
      Alert.alert('Please fill out all fields and upload a profile image.');
      return;
    }

    try {
      setUploading(true);
      const profileImageUrl = await uploadImage(profileImage);
      if (!profileImageUrl) {
        throw new Error('Failed to upload image');
      }

      const payload = {
        fullName,
        email,
        phoneNumber,
        profileImage: profileImageUrl,
      };

      await updateDoctorProfile(payload);
    } catch (error) {
      console.error('Failed to update profile:', error);
      Alert.alert('Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const goback = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <SafeAreaView style={styles.container}>
        {/* header section */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goback}>
            <Image source={backArrowImg} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.textAdd}>Personal Information</Text>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.profileContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editButton} onPress={handlePickImage}>
              <Text style={styles.editButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Full Name (e.g., Dr. John Doe)"
            value={fullName}
            onChangeText={setFullName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default DoctorRegistrationForm;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', justifyContent: 'center', paddingTop: 20 },
  scrollContainer: { alignItems: 'center', paddingBottom: 20, paddingHorizontal: 20 },
  profileContainer: { alignItems: 'center', marginBottom: 30 },
  profileImage: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, borderColor: '#6200ee' },
  placeholderImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#aaa', fontSize: 16 },
  editButton: { marginTop: 10, backgroundColor: '#6200ee', paddingVertical: 5, paddingHorizontal: 15, borderRadius: 20 },
  editButtonText: { color: '#fff', fontSize: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingHorizontal: 20 },
  backArrow: { width: 30, height: 30 },
  textAdd: { fontSize: 20, fontWeight: 'bold' },
  input: { width: '100%', height: 50, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 20, fontSize: 16, paddingHorizontal: 10 },
  submitButton: { backgroundColor: '#6200ee', paddingVertical: 15, borderRadius: 5, alignItems: 'center', width: '100%' },
  submitButtonText: { color: '#fff', fontSize: 16 },
});
