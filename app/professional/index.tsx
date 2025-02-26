import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView, Image, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useTheme } from '@react-navigation/native';
import { fontSize, iconSize, spacing } from '../../constants/dimensions';
import { Colors } from '../../constants/Colors';
import { fontFamily } from '../../constants/fontFamily';
import CustomInput from '../../components/CustomInput';
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import FeatherIcon from '@expo/vector-icons/Feather';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfessionalDetailsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [formData, setFormData] = useState({
    medicalDegree: '',
    institution: '',
    year: '',
    specialization: '',
    licenseNumber: '',
    issuingMedicalBoard: '',
    yearsOfExperience: '',
    specializedTreatment: '',
  });
  const [consultationFee, setConsultationFee] = useState('');
  const [uploading, setUploading] = useState(false);
  const [professionalId, setProfessionalId] = useState(null);

  useEffect(() => {
    const fetchProfessionalId = async () => {
      if (user && user.professional) {
        setProfessionalId(user.professional);
      } else {
        const storedProfessionalId = await AsyncStorage.getItem('professionalId');
        if (storedProfessionalId) {
          setProfessionalId(storedProfessionalId);
        }
      }
    };

    fetchProfessionalId();
  }, [user]);

  useEffect(() => {
    if (user) {
      console.log('User:', user); // Log the entire user object
      console.log('Professional ID:', professionalId);
    }
  }, [user, professionalId]);

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleSave = async () => {
    const missingFields = Object.keys(formData).filter(
      (key) => formData[key].trim() === ''
    );

    if (missingFields.length > 0) {
      Alert.alert('Error', `Missing fields: ${missingFields.join(', ')}`);
      return;
    }

    if (!professionalId) {
      Alert.alert('Error', 'Professional ID not found.');
      return;
    }

    const payload = {
      ...formData,
      consultationFee,
      medicalDegrees: [
        {
          degree: formData.medicalDegree,
          institution: formData.institution,
          year: formData.year,
        },
      ],
    };

    try {
      setUploading(true);
      const response = await axios.put(
        `https://medplus-health.onrender.com/api/professionals/update-profile/${professionalId}`,
        payload
      );

      if (response.status === 200) {
        Alert.alert('Success', 'Profile updated successfully!');
        router.push('/(tabs)/profile');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile.');
    } finally {
      setUploading(false);
    }
  };

  const goback = () => {
    router.push('/(tabs)/profile')
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={[styles.container, { paddingTop: 20 }]}>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 2 * spacing.xl }}>
          <View style={styles.header}>
            <TouchableOpacity onPress={goback}>
              <FeatherIcon color="#000" name="arrow-left" size={24} />
            </TouchableOpacity>
            <Text style={styles.textAdd}>Professional Information</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Medical Degree</Text>
            <Picker
              selectedValue={formData.medicalDegree}
              style={styles.input}
              onValueChange={(value) => handleInputChange('medicalDegree', value)}
            >
              <Picker.Item label="Select Medical Degree" value="" />
              <Picker.Item label="Bachelor of Medicine and Bachelor of Surgery (MBCHB)" value="MBCHB" />
              <Picker.Item label="Bachelors of Dental Surgery" value="BDS" />
            </Picker>
          </View>

          <CustomInput
            label='Institution' placeholder='Enter institution'
            icon={<Ionicons name={"school-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={formData.institution} onChangeText={(text) => handleInputChange('institution', text)}
          />
          <CustomInput
            label='Year' placeholder='Enter year'
            icon={<Ionicons name={"calendar-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={formData.year} onChangeText={(text) => handleInputChange('year', text)}
          />
          <View style={styles.formGroup}>
            <Text style={styles.label}>Specialization</Text>
            <Picker
              selectedValue={formData.specialization}
              style={styles.input}
              onValueChange={(value) => handleInputChange('specialization', value)}
            >
              <Picker.Item label="Select Specialization" value="" />
              <Picker.Item label="Critical Care Medicine" value="Critical Care Medicine" />
              <Picker.Item label="Neuro-anaesthesia" value="Neuro-anaesthesia" />
              <Picker.Item label="Cardiac Anaesthesia" value="Cardiac Anaesthesia" />
              <Picker.Item label="Paediatric Anaesthesia" value="Paediatric Anaesthesia" />
              <Picker.Item label="Critical Care Anaesthesia" value="Critical Care Anaesthesia" />
              <Picker.Item label="Regional Anaesthesia" value="Regional Anaesthesia" />
              <Picker.Item label="Pain Management" value="Pain Management" />
              <Picker.Item label="Cardiothoracic Anaesthesia" value="Cardiothoracic Anaesthesia" />
              <Picker.Item label="Ambulatory Anaesthesia" value="Ambulatory Anaesthesia" />
              <Picker.Item label="Obstetric Anaesthesia" value="Obstetric Anaesthesia" />
              <Picker.Item label="Transplant Anaesthesia" value="Transplant Anaesthesia" />
            </Picker>
          </View>
          <CustomInput
            label='License Number' placeholder='Enter license number'
            icon={<Feather name={"file-text"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={formData.licenseNumber} onChangeText={(text) => handleInputChange('licenseNumber', text)}
          />
          <CustomInput
            label='Issuing Medical Board' placeholder='Enter issuing medical board'
            icon={<Feather name={"clipboard"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={formData.issuingMedicalBoard} onChangeText={(text) => handleInputChange('issuingMedicalBoard', text)}
          />
          <CustomInput
            label='Years of Experience' placeholder='Enter years of experience'
            icon={<Ionicons name={"time-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={formData.yearsOfExperience} onChangeText={(text) => handleInputChange('yearsOfExperience', text)}
          />
          <View style={styles.formGroup}>
            <Text style={styles.label}>Specialized Treatment</Text>
            <Picker
              selectedValue={formData.specializedTreatment}
              style={styles.input}
              onValueChange={(value) => handleInputChange('specializedTreatment', value)}
            >
              <Picker.Item label="Select Specialized Treatment" value="" />
              <Picker.Item label="Cardiac Diagnostic and Therapeutic Procedures" value="Cardiac Diagnostic and Therapeutic Procedures" />
              <Picker.Item label="Latest Cancer Treatment Options" value="Latest Cancer Treatment Options" />
              <Picker.Item label="Orthopedics" value="Orthopedics" />
              <Picker.Item label="Infertility Treatments" value="Infertility Treatments" />
              <Picker.Item label="Cosmetic Surgery" value="Cosmetic Surgery" />
              <Picker.Item label="Dental Treatment" value="Dental Treatment" />
              <Picker.Item label="General Surgery" value="General Surgery" />
              <Picker.Item label="Organ Transplants" value="Organ Transplants" />
              <Picker.Item label="Rehabilitation and Geriatric" value="Rehabilitation and Geriatric" />
              <Picker.Item label="Bariatric Surgery" value="Bariatric Surgery" />
              <Picker.Item label="Pediatrics" value="Pediatrics" />
              <Picker.Item label="Second Opinion Consults" value="Second Opinion Consults" />
            </Picker>
          </View>
          <CustomInput
            label='Consultation Fee' placeholder='Enter consultation fee'
            icon={<Feather name={"dollar-sign"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={consultationFee} onChangeText={setConsultationFee}
          />
          <TouchableOpacity style={[styles.saveButton, { borderColor: Colors.light.orange }]} onPress={handleSave} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.saveText, { color: Colors.light.orange }]}>Save</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  backArrow: {
    width: 20,
    height: 20,
    tintColor: Colors.light.textPrimary // Ensure the back arrow is visible
  },
  textAdd: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: fontSize.md,
    fontFamily: fontFamily.regular,
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: spacing.sm,
    fontSize: fontSize.md,
  },
  icon: {
    marginHorizontal: spacing.sm,
  },
  saveButton: {
    borderWidth: 1,
    padding: spacing.md,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginVertical: spacing.md,
  },
  saveText: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
  },
});

export default ProfessionalDetailsScreen;
