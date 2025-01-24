import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import FeatherIcon from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pickImage, uploadImage } from '../../utils/imageUtils';
import { useRouter } from 'expo-router';

export default function Example() {
  const [form, setForm] = useState({
    emailNotifications: true,
    pushNotifications: false,
    availability: false,
  });
  const [profileImage, setProfileImage] = useState(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isPaymentModalVisible, setPaymentModalVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [experience, setExperience] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const loadProfileData = async () => {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }

      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { firstName, username: userEmail } = JSON.parse(userData);
        setFullName(firstName);
        setEmail(userEmail);
      }
    };

    loadProfileData();
  }, []);

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setProfileImage(imageUri);
      await handleUploadImage(imageUri);
    } else {
      Alert.alert('No image selected');
    }
  };

  const handleUploadImage = async (imageUri) => {
    setUploading(true);
    try {
      const profileImageUrl = await uploadImage(imageUri);
      if (profileImageUrl) {
        setProfileImage(profileImageUrl);
      }
    } catch (error) {
      Alert.alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSetup = () => {
    setPaymentModalVisible(true);
  };

  const closePaymentModal = () => {
    setPaymentModalVisible(false);
  };

  const openModal = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const saveField = () => {
    saveProfileData(currentField, currentValue);
    closeModal();
  };

  const incrementExperience = () => {
    setExperience(experience + 1);
    saveProfileData('experience', experience + 1);
  };

  const decrementExperience = () => {
    if (experience > 0) {
      setExperience(experience - 1);
      saveProfileData('experience', experience - 1);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#ecf2f9', }}>
      <View style={styles.header}>
        <View style={styles.headerAction}>
          <TouchableOpacity
            onPress={() => {
              router.push('/(tabs)/home')
            }}>
            <FeatherIcon
              color="#000"
              name="arrow-left"
              size={24} />
          </TouchableOpacity>
        </View>

        <Text numberOfLines={1} style={styles.headerTitle}>
          Settings
        </Text>

        <View style={[styles.headerAction, { alignItems: 'flex-end' }]}>
          <TouchableOpacity
            onPress={() => {
              // handle onPress
            }}>
            <FeatherIcon
              color="#000"
              name="more-vertical"
              size={24} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.section, { paddingTop: 4 }]}>
          <Text style={styles.sectionTitle}>Account</Text>

          <View style={styles.sectionBody}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.profile}>
              <Image
                alt=""
                source={{
                  uri: profileImage || 'https://via.placeholder.com/60',
                }}
                style={styles.profileAvatar} />

              <View style={styles.profileBody}>
                <Text style={styles.profileName}>{fullName || 'John Doe'}</Text>

                <Text style={styles.profileHandle}>{email || 'john@example.com'}</Text>
              </View>

              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={22} />
            </TouchableOpacity>
            {uploading && <Text style={styles.uploadingText}>Uploading...</Text>}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => router.push('/personal')} style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Manage Personal Information</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => router.push('/professional')} style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Manage Professional Information</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Clinics</Text>
          <View style={styles.sectionBody}>
            <TouchableOpacity onPress={() => router.push('/clinic')} style={[styles.rowWrapper, styles.rowFirst]}>
              <View style={styles.row}>
                <Text style={styles.rowLabel}>Manage Clinics</Text>
                <View style={styles.rowSpacer} />
                <FeatherIcon color="#bcbcbc" name="chevron-right" size={19} />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={[styles.sectionBody, styles.paymentMethodSection]}>
            <TouchableOpacity
             onPress={()=>{
                
              }}
              style={styles.row}>
              <Text style={styles.rowLabel}>Manage Payment Method</Text>
              <View style={styles.rowSpacer} />
              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insurance Provider</Text>
          <View style={styles.insuranceProviderSection}>
            <TouchableOpacity
              onPress={()=>{

              }}
              style={styles.row}>
              <Text style={styles.rowLabel}>Manage Insurance Provider</Text>
              <View style={styles.rowSpacer} />
              <FeatherIcon
                color="#bcbcbc"
                name="chevron-right"
                size={19} />
            </TouchableOpacity>
          </View>
        </View>

        <Modal
          visible={isPaymentModalVisible}
          animationType="slide"
          onRequestClose={closePaymentModal}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Payment Setup</Text>
            <TouchableOpacity onPress={closePaymentModal} style={styles.uploadButton}>
              <Text style={styles.uploadButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>

        <Modal visible={isModalVisible} animationType="slide" onRequestClose={closeModal} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Edit {currentField}</Text>
              <TextInput
                style={styles.input}
                value={currentValue}
                onChangeText={setCurrentValue}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={saveField} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal} style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.section}>
          <View style={styles.sectionBody}>
            <View
              style={[
                styles.rowWrapper,
                styles.rowFirst,
                styles.rowLast,
                { alignItems: 'center' },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  // handle onPress
                }}
                style={styles.row}>
                <Text style={[styles.rowLabel, styles.rowLabelLogout]}>
                  Log Out
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={styles.contentFooter}>App Version 2.24 #50491</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  /** Header */
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
  /** Content */
  content: {
    paddingHorizontal: 16,
  },
  contentFooter: {
    marginTop: 24,
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    color: '#a69f9f',
  },
  /** Section */
  section: {
    paddingVertical: 12,
  },
  sectionTitle: {
    margin: 8,
    marginLeft: 12,
    fontSize: 13,
    letterSpacing: 0.33,
    fontWeight: '500',
    color: '#a69f9f',
    textTransform: 'uppercase',
  },
  sectionBody: {
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  /** Profile */
  profile: {
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 9999,
    marginRight: 12,
  },
  profileBody: {
    marginRight: 'auto',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#292929',
  },
  profileHandle: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '400',
    color: '#858585',
  },
  /** Row */
  row: {
    height: 44,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 12,
  },
  rowWrapper: {
    paddingLeft: 16,
    backgroundColor: '#9bf4d5',
    borderTopWidth: 1,
    borderColor: '#f0f0f0',
  },
  rowFirst: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  rowLabel: {
    fontSize: 16,
    letterSpacing: 0.24,
    color: '#000',
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  rowValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ababab',
    marginRight: 4,
  },
  rowLast: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  rowLabelLogout: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    color: '#dc2626',
  },
  uploadButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  uploadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#007bff',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  paymentMethodSection: {
    backgroundColor: '#e0f7fa', // Different background color
  },
  insuranceProviderSection: {
    backgroundColor: '#e0f7fa', // Different background color
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  submitButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});