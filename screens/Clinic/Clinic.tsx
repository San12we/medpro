import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import FeatherIcon from '@expo/vector-icons/Feather';

type WorkingDaySlot = {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
};

type WorkingDays = {
  [key: string]: WorkingDaySlot[];
};

type Experience = {
  institution: string;
  year: string;
  roles: string;
  notableAchievement: string;
};

type InsuranceProvider = {
  _id: string;
  name: string;
  icon: string;
};

type Service = {
  label: string;
  value: string;
};

type PracticeInformationProps = {
  navigation: NativeStackNavigationProp<any>;
  route: RouteProp<any>;
};

const servicesList: Service[] = [
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

const _startHour = 9; // Define the start hour
const _color = "#ececec";
const _borderRadius = 16;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const Hourblock: React.FC<{ block: string }> = ({ block }) => (
  <View style={styles.hourBlock}>
    <Text>{block}</Text>
  </View>
);

const DayBlock: React.FC<{
  day: string;
  workingDays: WorkingDays;
  setWorkingDays: React.Dispatch<React.SetStateAction<WorkingDays>>;
}> = ({ day, workingDays, setWorkingDays }) => {
  const slots = workingDays[day] || [];

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

  const removeSlot = (index: number) => {
    setWorkingDays((prev) => {
      const updatedDaySlots = (prev[day] || []).filter((_, i) => i !== index);
      return { ...prev, [day]: updatedDaySlots };
    });
  };

  return (
    <Animated.View style={styles.dayBlockContainer} entering={_entering} exiting={_exiting} layout={_layout}>
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

const Day: React.FC<{
  day: string;
  workingDays: WorkingDays;
  setWorkingDays: React.Dispatch<React.SetStateAction<WorkingDays>>;
}> = ({ day, workingDays, setWorkingDays }) => {
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

const PracticeInformation: React.FC<PracticeInformationProps> = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: { auth: { user: any } }) => state.auth?.user);
  const userId = user?.userId;
  const router = useRouter();

  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [practiceName, setPracticeName] = useState('');
  const [practiceLocation, setPracticeLocation] = useState('');
  const [workingDays, setWorkingDays] = useState<WorkingDays>({
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
    Sun: [],
  });
  const [experience, setExperience] = useState<Experience[]>([]);
  const [institution, setInstitution] = useState('');
  const [year, setYear] = useState('');
  const [roles, setRoles] = useState('');
  const [notableAchievement, setNotableAchievement] = useState('');
  const [showExperienceInput, setShowExperienceInput] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedInsuranceProviders, setSelectedInsuranceProviders] = useState<string[]>([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const { insuranceProviders } = useInsurance();
  const { missingFields } = useLocalSearchParams();
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [currentDayIndex, setCurrentDayIndex] = useState<string | null>(null);
  const { colors } = useTheme();

  useEffect(() => {
    if (user) {
      setProfileImage(user.profileImage);
    }
  }, [user]);

  const handlePickImage = async () => {
    const imageUri = await pickImage();
    if (imageUri) {
      setUploading(true);
      try {
        const profileImageUrl = await uploadImage(imageUri);
        if (profileImageUrl) {
          setProfileImage(profileImageUrl);
        }
      } catch (error) {
        console.error('Image upload failed:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    setUploading(true);
    try {
      let profileImageUrl = profileImage;
      if (!profileImageUrl) {
        profileImageUrl = await handlePickImage();
        if (!profileImageUrl) {
          throw new Error('Failed to upload image');
        }
      }

      const payload = {
        userId,
        practiceName,
        practiceLocation,
        profileImage: profileImageUrl,
        workingDays,
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

      if (!response.ok) throw new Error('Failed to update practice information');

      Alert.alert('Practice information updated successfully.');
    } catch (error) {
      console.error('Failed to update practice information:', error);
      Alert.alert('Failed to update practice information');
    } finally {
      setUploading(false);
    }
  };

  const handleStartTimeChange = (event: any, selectedTime: Date | undefined, day: string, index: number) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setWorkingDays((prev) => {
        const updatedDays = { ...prev };
        if (updatedDays[day] && updatedDays[day][index]) {
          updatedDays[day][index].startTime = formattedTime;
        }
        return updatedDays;
      });
    }
  };

  const handleEndTimeChange = (event: any, selectedTime: Date | undefined, day: string, index: number) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setWorkingDays((prev) => {
        const updatedDays = { ...prev };
        if (updatedDays[day] && updatedDays[day][index]) {
          updatedDays[day][index].endTime = formattedTime;
        }
        return updatedDays;
      });
    }
  };

  const renderInsuranceProvider = ({ item }: { item: InsuranceProvider }) => (
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

  const renderServiceCard = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={[
        styles.serviceCard,
        selectedServices.includes(item.value) && styles.activeServiceCard,
      ]}
      onPress={() => toggleService(item.value)}
    >
      <Text style={styles.serviceCardText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const goBack = () => {
    router.push('/(tabs)/profile');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <SafeAreaView style={[styles.container, { paddingTop: 20 }]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack}>
            <FeatherIcon color="#000" name="arrow-left" size={24} />
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
          {Object.keys(workingDays).map((day) => (
            <Day key={day} day={day} workingDays={workingDays} setWorkingDays={setWorkingDays} />
          ))}

          {showStartTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => handleStartTimeChange(event, selectedTime, currentDayIndex!, 0)}
            />
          )}
          {showEndTimePicker && (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => handleEndTimeChange(event, selectedTime, currentDayIndex!, 0)}
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
                icon={<Ionicons name={"person-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={roles} onChangeText={setRoles}
              />
              <CustomInput
                label='Notable Achievement' placeholder='Enter notable achievement'
                icon={<Ionicons name={"medal-outline"} size={iconSize.md} color={Colors.light.iconSecondary} style={styles.icon} />}
                value={notableAchievement} onChangeText={setNotableAchievement}
              />
              <TouchableOpacity style={styles.addButton} onPress={() => {
                setShowExperienceInput(false);
                setExperience((prev) => [...prev, { institution, year, roles, notableAchievement }]);
                setInstitution('');
                setYear('');
                setRoles('');
                setNotableAchievement('');
              }}>
                <Text style={styles.addButtonText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.experienceContainer}>
            {experience.map((exp, index) => (
              <View key={index} style={styles.experienceCard}>
                <Text style={styles.experienceCardText}>{exp.institution}</Text>
                <Text style={styles.experienceCardText}>{exp.year}</Text>
                <Text style={styles.experienceCardText}>{exp.roles}</Text>
                <Text style={styles.experienceCardText}>{exp.notableAchievement}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  textAdd: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  profileImage: {
    width: '100%',
    height: 200,
    borderRadius: 0,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: Colors.light.gray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: Colors.light.textSecondary,
    fontSize: fontSize.md,
  },
  editButton: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: Colors.light.primary,
    borderRadius: _borderRadius,
  },
  editButtonText: {
    color: Colors.light.textPrimary,
    fontSize: fontSize.md,
  },
  sectionHeader: {
    fontSize: fontSize.lg,
    fontFamily: fontFamily.bold,
    marginVertical: spacing.md,
  },
  servicesContainer: {
    paddingVertical: spacing.sm,
  },
  serviceCard: {
    padding: spacing.sm,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: _borderRadius,
    marginRight: spacing.sm,
  },
  activeServiceCard: {
    backgroundColor: Colors.light.primary,
  },
  serviceCardText: {
    color: Colors.light.textPrimary,
    fontSize: fontSize.md,
  },
  selectedServicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: spacing.md,
  },
  insuranceProvidersContainer: {
    paddingVertical: spacing.sm,
  },
  insuranceProviderCard: {
    padding: spacing.sm,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: _borderRadius,
    marginRight: spacing.sm,
    alignItems: 'center',
  },
  activeInsuranceProviderCard: {
    backgroundColor: Colors.light.primary,
  },
  insuranceProviderIcon: {
    width: 40,
    height: 40,
    marginBottom: spacing.sm,
  },
  insuranceProviderCardText: {
    color: Colors.light.textPrimary,
    fontSize: fontSize.md,
  },
  dayContainer: {
    padding: spacing.md,
    borderRadius: _borderRadius,
    marginBottom: spacing.md,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  daySwitch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  dayBlockContainer: {
    padding: spacing.md,
    borderRadius: _borderRadius,
    backgroundColor: Colors.light.cardBackground,
    marginBottom: spacing.md,
  },
  dayBlockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  hourBlock: {
    padding: spacing.sm,
    backgroundColor: Colors.light.gray,
    borderRadius: _borderRadius,
    marginHorizontal: spacing.sm,
  },
  removeButton: {
    padding: spacing.sm,
    backgroundColor: Colors.light.danger,
    borderRadius: _borderRadius,
  },
  addHourButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    backgroundColor: Colors.light.primary,
    borderRadius: _borderRadius,
    marginTop: spacing.md,
  },
  addHourIcon: {
    width: 20,
    height: 20,
    marginRight: spacing.sm,
  },
  addButton: {
    padding: spacing.md,
    backgroundColor: Colors.light.primary,
    borderRadius: _borderRadius,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  addButtonText: {
    color: Colors.light.textPrimary,
    fontSize: fontSize.md,
  },
  experienceInputContainer: {
    padding: spacing.md,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: _borderRadius,
    marginBottom: spacing.md,
  },
  experienceContainer: {
    marginVertical: spacing.md,
  },
  experienceCard: {
    padding: spacing.md,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: _borderRadius,
    marginBottom: spacing.sm,
  },
  experienceCardText: {
    fontSize: fontSize.md,
    color: Colors.light.textPrimary,
  },
  submitButton: {
    padding: spacing.md,
    backgroundColor: Colors.light.primary,
    borderRadius: _borderRadius,
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  submitButtonText: {
    color: Colors.light.textPrimary,
    fontSize: fontSize.md,
  },
});

export default PracticeInformation;
