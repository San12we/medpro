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
import styles from './Style/ClinicStyle';
import { pickImage, uploadImage } from '../../utils/imageUtils';
import { useDispatch, useSelector } from 'react-redux';
import { clearUser } from '../../app/(redux)/userSlice';
import Schedule from '../../components/Schedule';

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

const Hourblock = ({ block }) => (
  <View style={styles.hourBlock}>
    <Text>{block}</Text>
  </View>
);

const DayBlock = ({ day, workingDays, setWorkingDays }) => {
  const slots = workingDays[day] || [];
  const [recurrence, setRecurrence] = useState('None');

  const addSlot = () => {
    setWorkingDays((prev) => {
      const updatedDaySlots = [...(prev[day] || [])];
      const nextSlot = {
        startTime: `${_startHour + updatedDaySlots.length}:00`,
        endTime: `${_startHour + updatedDaySlots.length + 1}:00`,
        isAvailable: true,
      };
      updatedDaySlots.push(nextSlot);
      return { ...prev, [day]: updatedDaySlots };
    });
  };

  const removeSlot = (index) => {
    setWorkingDays((prev) => {
      const updatedDaySlots = (prev[day] || []).filter((_, i) => i !== index);
      return { ...prev, [day]: updatedDaySlots };
    });
  };

  return (
    <Animated.View style={styles.dayBlockContainer} entering={_entering} exiting={_exiting} layout={_layout}>
      <View style={styles.recurrenceContainer}>
        <Text>Recurrence:</Text>
        <TouchableOpacity onPress={() => setRecurrence('None')}>
          <Text style={recurrence === 'None' ? styles.selectedRecurrence : styles.recurrenceOption}>None</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecurrence('Daily')}>
          <Text style={recurrence === 'Daily' ? styles.selectedRecurrence : styles.recurrenceOption}>Daily</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRecurrence('Weekly')}>
          <Text style={recurrence === 'Weekly' ? styles.selectedRecurrence : styles.recurrenceOption}>Weekly</Text>
        </TouchableOpacity>
      </View>
      {slots.map((slot, index) => (
        <Animated.View
          key={`slot-${index}`}
          style={styles.dayBlockRow}
          entering={_entering}
          exiting={_exiting}
          layout={_layout}
        >
          <Text>From:</Text>
          <Hourblock block={slot.startTime} />
          <Text>To:</Text>
          <Hourblock block={slot.endTime} />
          <Pressable onPress={() => removeSlot(index)}>
            <View style={styles.removeButton}>
              <Ionicons name="close" size={20} color="black" />
            </View>
          </Pressable>
        </Animated.View>
      ))}
      <AnimatedPressable layout={_layout} onPress={addSlot}>
        <View style={styles.addHourButton}>
          <Image source={{ uri: 'plusImg' }} style={styles.addHourIcon} />
          <Text>Add Slot</Text>
        </View>
      </AnimatedPressable>
    </Animated.View>
  );
};

const Day = ({ day, workingDays, setWorkingDays }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (workingDays[day]?.length) {
      setIsOn(true);
    }
  }, [workingDays, day]);

  return (
    <Animated.View style={[styles.dayContainer, { backgroundColor: isOn ? 'transparent' : _color }]} layout={_layout}>
      <View style={styles.dayHeader}>
        <Text>{day}</Text>
        <Switch
          value={isOn}
          onValueChange={setIsOn}
          trackColor={{ true: _color }}
          style={styles.daySwitch}
        />
      </View>
      {isOn && <DayBlock day={day} workingDays={workingDays} setWorkingDays={setWorkingDays} />}
    </Animated.View>
  );
};

const PracticeInformation = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth?.user);
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [practiceName, setPracticeName] = useState('');
  const [practiceLocation, setPracticeLocation] = useState('');
  const [workingDays, setWorkingDays] = useState({
    Mon: {},
    Tue: {},
    Wed: {},
    Thu: {},
    Fri: {},
    Sat: {},
    Sun: {},
  });
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
    if (user) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

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

 

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setProfileImage(imageUri);
    }
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

  const handleUploadImage = async () => {
    setUploading(true);
    try {
      const profileImageUrl = await uploadImage(profileImage);
      if (profileImageUrl) {
        setProfileImage(profileImageUrl);
      }
    } catch (error) {
      console.error('Image upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!practiceName || !practiceLocation || !phone || !email) {
      Alert.alert('Please fill out all mandatory fields.');
      return;
    }

    const selectedDays = Object.keys(workingDays).filter((day) => workingDays[day].startTime && workingDays[day].endTime).map((day) => ({
      day,
      slots: [workingDays[day]],
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
        profileImageUrl = await handleUploadImage();
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
      const updatedDays = { ...workingDays };
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
      const updatedDays = { ...workingDays };
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
            <TouchableOpacity style={styles.editButton} onPress={handlePickImage}>
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
          <Schedule schedules={workingDays} setSchedules={setWorkingDays} />

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

export default PracticeInformation;