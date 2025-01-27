import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
  View,
  ScrollView,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Switch,
  Pressable,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import useInsurance from '../../hooks/useInsurance';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '../../firebase/config';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useNavigation, useTheme } from '@react-navigation/native';
import { fontSize, iconSize, spacing } from '../../constants/dimensions';
import { Colors } from '../../constants/Colors';
import { fontFamily } from '../../constants/fontFamily';
import CustomInput from '../../components/CustomInput';
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { backArrowImg } from '@/theme/Images';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';

const servicesList = [
  { label: 'General medical care', value: 'General medical care' },
  { label: 'Preventive health screenings', value: 'Preventive health screenings' },
  { label: 'Vaccinations and immunizations', value: 'Vaccinations and immunizations' },
  { label: 'Chronic disease management', value: 'Chronic disease management' },
  { label: 'Women\'s health services', value: 'Women\'s health services' },
  { label: 'Pediatric care', value: 'Pediatric care' },
  { label: 'Minor surgical procedures', value: 'Minor surgical procedures' },
  { label: 'Physical therapy and rehabilitation', value: 'Physical therapy and rehabilitation' },
  { label: 'Mental health counseling', value: 'Mental health counseling' },
  { label: 'Nutritional and lifestyle counseling', value: 'Nutritional and lifestyle counseling' },
  { label: 'Diagnostic and laboratory services', value: 'Diagnostic and laboratory services' },
  { label: 'Specialist referrals and consultations', value: 'Specialist referrals and consultations' },
];

const _color = "#ececec";
const _borderRadius = 16;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const PracticeInformation = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [practiceName, setPracticeName] = useState('');
  const [practiceLocation, setPracticeLocation] = useState('');
  const [workingDays, setWorkingDays] = useState([
    { day: 'Mon', active: false, startTime: '', endTime: '' },
    { day: 'Tue', active: false, startTime: '', endTime: '' },
    { day: 'Wed', active: false, startTime: '', endTime: '' },
    { day: 'Thu', active: false, startTime: '', endTime: '' },
    { day: 'Fri', active: false, startTime: '', endTime: '' },
    { day: 'Sat', active: false, startTime: '', endTime: '' },
    { day: 'Sun', active: false, startTime: '', endTime: '' },
  ]);
  const [experience, setExperience] = useState([]);
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [roles, setRoles] = useState('');
  const [notableAchievement, setNotableAchievement] = useState('');
  const [showExperienceInput, setShowExperienceInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedInsuranceProviders, setSelectedInsuranceProviders] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const { insuranceProviders } = useInsurance();
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const { missingFields } = useLocalSearchParams();
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState(null);
  const navigation = useNavigation();
  const { colors } = useTheme();

  useEffect(() => {
    const loadProfileImage = async () => {
      const storedImage = await AsyncStorage.getItem('profileImage');
      if (storedImage) {
        setProfileImage(storedImage);
      }
    };

    loadProfileImage();
  }, []);

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserId(userData.userId);
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };

    loadUserId();
  }, []);

  useEffect(() => {
    if (missingFields) {
      const fields = JSON.parse(missingFields);
      fields.forEach(field => {
        if (field === 'practiceName') setPracticeName('');
        if (field === 'practiceLocation') setPracticeLocation('');
        if (field === 'workingDays') setWorkingDays([
          { day: 'Mon', active: false, startTime: '', endTime: '' },
          { day: 'Tue', active: false, startTime: '', endTime: '' },
          { day: 'Wed', active: false, startTime: '', endTime: '' },
          { day: 'Thu', active: false, startTime: '', endTime: '' },
          { day: 'Fri', active: false, startTime: '', endTime: '' },
          { day: 'Sat', active: false, startTime: '', endTime: '' },
          { day: 'Sun', active: false, startTime: '', endTime: '' },
        ]);
        if (field === 'selectedInsuranceProviders') setSelectedInsuranceProviders([]);
      });
    }
  }, [missingFields]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const toggleDay = (dayIndex) => {
    const updatedDays = [...workingDays];
    updatedDays[dayIndex].active = !updatedDays[dayIndex].active;
    setWorkingDays(updatedDays);
  };

  const toggleInsuranceProvider = (providerId) => {
    setSelectedInsuranceProviders((prev) =>
      prev.includes(providerId)
        ? prev.filter((id) => id !== providerId)
        : [...prev, providerId]
    );
  };

  const addExperience = () => {
    if (!institution || !year || !roles || !notableAchievement) {
      Alert.alert('Please fill out all fields for the experience.');
      return;
    }

    setExperience((prev) => [
      ...prev,
      { institution, year, roles, notableAchievement },
    ]);

    setInstitution('');
    setYear('');
    setRoles('');
    setNotableAchievement('');
    setShowExperienceInput(false);
  };

  const uploadImage = async () => {
    setUploading(true);
    try {
      const { uri } = await FileSystem.getInfoAsync(profileImage);
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => resolve(xhr.response);
        xhr.onerror = (e) => reject(new TypeError('Network request failed'));
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      const filename = profileImage.substring(profileImage.lastIndexOf('/') + 1);
      const ref = firebase.storage().ref().child(filename);
      await ref.put(blob);
      blob.close();

      const url = await ref.getDownloadURL();
      setProfileImage(url);
      await AsyncStorage.setItem('profileImage', url);

      Alert.alert('Profile image uploaded successfully');
      return url;
    } catch (error) {
      console.error('Image upload failed:', error);
      Alert.alert('Image upload failed');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!practiceName || !practiceLocation || !phone || !email || !licenseNumber) {
      Alert.alert('Please fill out all mandatory fields.');
      return;
    }

    const selectedDays = workingDays.filter((day) => day.active).map((day) => ({
      day: day.day,
      startTime: day.startTime,
      endTime: day.endTime,
    }));

    if (selectedDays.length === 0) {
      Alert.alert('Please select working days and specify working hours.');
      return;
    }

    if (selectedInsuranceProviders.length === 0) {
      Alert.alert('Please select at least one insurance provider.');
      return;
    }

    setUploading(true);
    try {
      let profileImageUrl = profileImage;
      if (!profileImageUrl) {
        profileImageUrl = await uploadImage();
        if (!profileImageUrl) {
          throw new Error('Failed to upload image');
        }
      }

      const payload = {
        userId,
        practiceName,
        practiceLocation,
        profileImage: profileImageUrl,
        workingDays: selectedDays,
        experience,
        insuranceProviders: selectedInsuranceProviders,
        contactInfo: { phone, email, website },
        services: selectedServices,
      };

      const response = await fetch('https://medplus-health.onrender.com/api/professionals/practice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseBody = await response.json();

      if (!response.ok) throw new Error('Failed to update practice information');

      Alert.alert('Practice information updated successfully.');
     
    } catch (error) {
      console.error('Failed to update practice information:', error);
      Alert.alert('Failed to update practice information');
    } finally {
      setUploading(false);
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      const updatedDays = [...workingDays];
      updatedDays[currentDayIndex].startTime = formattedTime;
      setWorkingDays(updatedDays);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      const updatedDays = [...workingDays];
      updatedDays[currentDayIndex].endTime = formattedTime;
      setWorkingDays(updatedDays);
    }
  };

  const renderInsuranceProvider = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.insuranceProviderCard,
        selectedInsuranceProviders.includes(item._id) && styles.activeInsuranceProviderCard,
      ]}
      onPress={() => toggleInsuranceProvider(item._id)}
    >
      <Image source={{ uri: item.icon }} style={styles.insuranceProviderIcon} />
      <Text style={styles.insuranceProviderCardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderServiceCard = ({ item }) => (
    !selectedServices.includes(item.value) && (
      <TouchableOpacity
        style={[
          styles.serviceCard,
          selectedServices.includes(item.value) && styles.activeServiceCard,
        ]}
        onPress={() => toggleService(item.value)}
      >
        <Text style={styles.serviceCardText}>{item.label}</Text>
      </TouchableOpacity>
    )
  );

  const toggleService = (service) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const goBack = () => {
    navigation.goBack();
  };

  const renderSlot = ({ item }) => (
    <View style={styles.slotCard}>
      <Text style={styles.slotText}>
        {item.startTime} - {item.endTime} {item.isAvailable ? "(Available)" : "(Not Available)"}
      </Text>
    </View>
  );

  const renderPreview = () => {
    if (!workingDays.some((day) => day.active)) return null;

    return (
      <View style={styles.previewContainer}>
        {workingDays.map((day, index) => (
          day.active && (
            <View key={index} style={styles.dayPreview}>
              <Text style={styles.previewDay}>{day.day}</Text>
              <FlatList
                data={[{ startTime: day.startTime, endTime: day.endTime }]}
                renderItem={renderSlot}
                horizontal
                keyExtractor={(item, index) => `preview-${day.day}-${index}-${item.startTime}-${item.endTime}`}
                contentContainerStyle={styles.slotList}
              />
            </View>
          )
        ))}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={[styles.container, { paddingTop: 20 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <Image source={backArrowImg} style={styles.backArrow} />
          </TouchableOpacity>
          <Text style={styles.textAdd}>Practice Information</Text>
        </View>
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={{ paddingBottom: 2 * spacing.xl }}>
          <View style={styles.profileContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Add Photo</Text>
              </View>
            )}
            <TouchableOpacity style={styles.editButton} onPress={pickImage}>
              <Text style={styles.editButtonText}>Upload</Text>
            </TouchableOpacity>
          </View>

          <CustomInput
            label='Clinic Name (Required)' placeholder='Enter clinic name'
            icon={<Ionicons name={"business-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={practiceName} onChangeText={setPracticeName}
          />
          <CustomInput
            label='Location (Required)' placeholder='Enter location'
            icon={<Ionicons name={"location-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={practiceLocation} onChangeText={setPracticeLocation}
          />
          <CustomInput
            label='Phone (Required)' placeholder='Enter phone number'
            icon={<Feather name={"phone"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={phone} onChangeText={setPhone}
          />
          <CustomInput
            label='Email (Required)' placeholder='Enter email'
            icon={<Feather name={"mail"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={email} onChangeText={setEmail}
          />
          <CustomInput
            label='Website' placeholder='Enter website'
            icon={<Feather name={"globe"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
            value={website} onChangeText={setWebsite}
          />
          <Text style={styles.sectionHeader}>Services</Text>
          <FlatList
            data={servicesList}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.value}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
          />
          <View style={styles.selectedServicesContainer}>
            {selectedServices.map((service, index) => (
              <View key={index} style={styles.serviceCard}>
                <Text style={styles.serviceCardText}>{service}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.sectionHeader}>Supported Insurance Providers</Text>
          <View style={styles.insuranceProvidersContainer}>
            <FlatList
              data={insuranceProviders}
              renderItem={renderInsuranceProvider}
              keyExtractor={(item) => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
            />
          </View>

          <Text style={styles.sectionHeader}>Working Days</Text>
          <View style={styles.dayCardsContainer}>
            {workingDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dayCard, day.active && styles.activeDayCard]}
                onPress={() => toggleDay(index)}
              >
                <Text style={styles.dayCardText}>{day.day}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {workingDays.map((day, index) => (
            day.active && (
              <View key={index} style={styles.hoursContainer}>
                <TouchableOpacity onPress={() => { setShowStartTimePicker(true); setCurrentDayIndex(index); }}>
                  <TextInput
                    style={styles.input}
                    placeholder="Start Time (e.g., 9:00 AM)"
                    value={day.startTime}
                    editable={false}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowEndTimePicker(true); setCurrentDayIndex(index); }}>
                  <TextInput
                    style={styles.input}
                    placeholder="End Time (e.g., 5:00 PM)"
                    value={day.endTime}
                    editable={false}
                  />
                </TouchableOpacity>
              </View>
            )
          ))}

          {showStartTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleStartTimeChange}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={handleEndTimeChange}
            />
          )}

          {renderPreview()}

          <Text style={styles.sectionHeader}>Experience (Optional)</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setShowExperienceInput(true)}>
            <Text style={styles.addButtonText}>Add Experience</Text>
          </TouchableOpacity>

          {showExperienceInput && (
            <View style={styles.experienceInputContainer}>
              <CustomInput
                label='Institution' placeholder='Enter institution'
                icon={<Ionicons name={"school-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={institution} onChangeText={setInstitution}
              />
              <CustomInput
                label='Year' placeholder='Enter year'
                icon={<Ionicons name={"calendar-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={year} onChangeText={setYear}
              />
              <CustomInput
                label='Roles' placeholder='Enter roles'
                icon={<Feather name={"briefcase"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={roles} onChangeText={setRoles}
              />
              <CustomInput
                label='Notable Achievement' placeholder='Enter notable achievement'
                icon={<Feather name={"award"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={notableAchievement} onChangeText={setNotableAchievement}
              />
              <TouchableOpacity style={styles.addButton} onPress={addExperience}>
                <Text style={styles.addButtonText}>Save Experience</Text>
              </TouchableOpacity>
            </View>
          )}

          {experience.length > 0 && (
            <View style={styles.experienceList}>
              {experience.map((exp, index) => (
                <View key={index} style={styles.experienceItem}>
                  <Text style={styles.experienceInstitution}>{exp.institution}</Text>
                  <Text style={styles.experienceDetails}>
                    {exp.year} - {exp.roles}
                  </Text>
                  <Text style={styles.experienceAchievement}>
                    Achievement: {exp.notableAchievement}
                  </Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={[styles.submitButton, { borderColor: Colors.light.orange }]}
            onPress={handleSubmit}
            disabled={uploading}
          >
            {uploading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.submitButtonText, { color: Colors.light.orange }]}>Submit</Text>
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
    tintColor: Colors.light.textPrimary 
  },
  textAdd: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
  },
  editButton: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: Colors.light.orange,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    color: Colors.light.textPrimary,
  },
  dayCardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  dayCard: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  activeDayCard: {
    backgroundColor: Colors.light.orange,
    borderColor: Colors.light.orange,
  },
  dayCardText: {
    color: Colors.light.textPrimary,
  },
  hoursContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  addButton: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  addButtonText: {
    fontSize: fontSize.md,
    color: Colors.light.orange,
    fontWeight: '600',
  },
  experienceInputContainer: {
    marginBottom: spacing.md,
  },
  experienceList: {
    marginBottom: spacing.md,
  },
  experienceItem: {
    backgroundColor: '#fff',
    padding: spacing.md,
  },
  experienceInstitution: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  experienceDetails: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  experienceAchievement: {
    fontSize: 14,
    color: '#777',
  },
  submitButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  insuranceProvidersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  insuranceProviderCard: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: 8,
    width: 100,
    alignItems: 'center',
  },
  activeInsuranceProviderCard: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  insuranceProviderCardText: {
    color: '#333',
  },
  insuranceProviderIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: Colors.light.textPrimary,
  },
  selectedServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  serviceCard: {
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  activeServiceCard: {
    backgroundColor: Colors.light.orange,
    borderColor: Colors.light.orange,
  },
  serviceCardText: {
    color: Colors.light.textPrimary,
  },
  servicesContainer: {
    marginBottom: spacing.md,
  },
});

export default PracticeInformation;
