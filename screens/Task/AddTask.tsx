import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  ScrollView,
  Button,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import FeatherIcon from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather as Icon } from '@expo/vector-icons';

// https://fonts.google.com/specimen/Nunito+Sans
import { useFonts } from 'expo-font';
import NSLight from '../../assets/fonts/NunitoSans_7pt-ExtraLight.ttf';
import NSRegular from '../../assets/fonts/NunitoSans_7pt_Condensed-Regular.ttf';
import NSBold from '../../assets/fonts/NunitoSans_7pt_Condensed-Bold.ttf';
import NSExtraBold from '../../assets/fonts/NunitoSans_7pt_Condensed-ExtraBold.ttf';

import AsyncStorage from '@react-native-async-storage/async-storage';

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const spacing = 10;
const _color = "#ececec";
const _borderRadius = 16;
const _startHour = 8;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);






function Hourblock({ block }: { block: number }) {
  return (
    <View style={styles.hourBlock}>
      <Text>
        {block > 9 ? block : `0${block}`}:00
        {block >= 12 ? ' PM' : ' AM'}
      </Text>
    </View>
  );
}

function DayBlock({ day, schedules, setSchedules }: { day: string; schedules: any; setSchedules: any }) {
  const hours = schedules[day] || []; 

  const addSlot = () => {
  setSchedules((prev) => {
    const updatedDaySlots = [...(prev[day] || [])];
    const nextSlot = (_startHour + updatedDaySlots.length) % 24;

    if (updatedDaySlots.includes(nextSlot)) {
      alert('This slot already exists!');
      return prev;
    }

    updatedDaySlots.push(nextSlot);
    return { ...prev, [day]: updatedDaySlots };
  });
};


  const removeSlot = (hour: number) => {
    setSchedules((prev: any) => {
      const updatedDaySlots = (prev[day] || []).filter((h: number) => h !== hour);
      return { ...prev, [day]: updatedDaySlots };
    });
  };

  return (
    <Animated.View style={styles.dayBlockContainer} entering={_entering} exiting={_exiting} layout={_layout}>
      {hours.map((hour: number) => (
        <Animated.View
          key={`hour-${hour}`}
          style={styles.dayBlockRow}
          entering={_entering}
          exiting={_exiting}
          layout={_layout}
        >
          <Text>From:</Text>
          <Hourblock block={hour} />
          <Text>To:</Text>
          <Hourblock block={(hour + 1) % 24} />
          <Pressable onPress={() => removeSlot(hour)}>
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
}

function Day({ day, schedules, setSchedules }: { day: string; schedules: any; setSchedules: any }) {
  const [isOn, setIsOn] = useState(false);

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
      {isOn && <DayBlock day={day} schedules={schedules} setSchedules={setSchedules} />}
    </Animated.View>
  );
}

const AddTask = () => {
  const [schedules, setSchedules] = useState<any>({});
  const [user, setUser] = useState({ fullName: '', email: '', profileImage: '' });
  const router = useRouter();
  useEffect(() => {
    const loadUserData = async () => {
      const storedImage = await AsyncStorage.getItem('profileImage');
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const { firstName, username: userEmail } = JSON.parse(userData);
        setUser({
          fullName: firstName,
          email: userEmail,
          profileImage: storedImage || 'https://randomuser.me/api/portraits/men/86.jpg',
        });
      }
    };

    loadUserData();
  }, []);

  const handleSubmit = () => {
    console.log('Schedules Submitted:', schedules);
    alert('Schedules have been submitted successfully!');
  };

  const renderSlot = ({ item }: { item: number }) => (
    <View style={styles.slotCard}>
      <Text style={styles.slotText}>
        {item}:00 - {(item + 1) % 24}:00
      </Text>
    </View>
  );

  const renderPreview = () => {
    const [recurrence, setRecurrence] = useState(null);
    const [isRecurrenceOptionsVisible, setIsRecurrenceOptionsVisible] = useState(false);
  
    const toggleRecurrenceOptions = () => {
      setIsRecurrenceOptionsVisible(!isRecurrenceOptionsVisible);
    };
  
    const selectRecurrence = (option) => {
      setRecurrence(option);
      setIsRecurrenceOptionsVisible(false);
    };
  
    if (!Object.keys(schedules).some((day) => schedules[day]?.length)) return null;
  
    return (
      <View style={styles.previewContainer}>
        <View style={styles.header}>
          <Text style={styles.previewTitle}>Preview:</Text>
          <TouchableOpacity onPress={toggleRecurrenceOptions} style={styles.recurrenceIcon}>
            <Ionicons name="repeat-outline" size={24} color="black" />
          </TouchableOpacity>
          {isRecurrenceOptionsVisible && (
            <View style={styles.recurrenceDropdown}>
              <TouchableOpacity onPress={() => selectRecurrence('Daily')}>
                <Text style={styles.recurrenceOption}>Daily</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => selectRecurrence('Weekly')}>
                <Text style={styles.recurrenceOption}>Weekly</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {Object.keys(schedules).map((day) => (
          <View key={day} style={styles.dayPreview}>
            <Text style={styles.previewDay}>{day}</Text>
            <FlatList
              data={schedules[day]}
              renderItem={renderSlot}
              horizontal
              keyExtractor={(item) => `preview-${day}-${item}`}
              contentContainerStyle={styles.slotList}
            />
          </View>
        ))}
      </View>
    );
  };

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
              source={{ uri: user.profileImage }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
          >
            <Text
              style={{ fontFamily: 'NSExtraBold', fontSize: 16, color: '#fff' }}
            >
              {user.fullName}
            </Text>
            <Text
              style={{ fontFamily: 'NSRegular', fontSize: 14, color: '#fff' }}
            >
              {user.email}
            </Text>
          </View>
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
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.container}>
        {weekDays.map((day) => (
          <Day
            day={day}
            schedules={schedules}
            setSchedules={setSchedules}
            key={day}
          />
        ))}
        {renderPreview()}
        <Button title="Submit" onPress={handleSubmit} color="black" />
      </ScrollView>
    </View>
  );
};


export default AddTask;

const styles = StyleSheet.create({
  container: {
    padding: spacing,
    gap: spacing,
    backgroundColor: '#ecf2f9',
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: _color,
    padding: spacing,
    borderRadius: _borderRadius,
    gap: spacing,
  },

  recurrenceOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: 'black',
  },
    recurrenceDropdown: {
    position: 'absolute',
    top: 32,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  daySwitch: {
    transform: [{ scale: 0.7 }],
  },
  dayBlockContainer: {
    gap: spacing,
  },
  dayBlockRow: {
    flexDirection: 'row',
    gap: spacing,
    alignItems: 'center',
  },
  hourBlock: {
    borderWidth: 1,
    borderColor: _color,
    borderRadius: _borderRadius - spacing / 2,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing / 4,
  },
  removeButton: {
    backgroundColor: _color,
    height: 30,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: _borderRadius - spacing / 2,
  },
  addHourButton: {
    flexDirection: 'row',
    gap: spacing / 2,
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    backgroundColor: _color,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing / 2,
  },
  addHourIcon: {
    width: 20,
    height: 20,
    tintColor: 'blue',
  },
  previewContainer: {
    marginTop: spacing * 2,
  },
  previewTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: spacing,
  },
  dayPreview: {
    marginBottom: spacing,
        backgroundColor: '#ecf2f9'
  },
  previewDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: spacing / 2,

  },
  slotList: {
    gap: spacing,
    
  },
  slotCard: {
    backgroundColor: '#a0eecc',
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    marginRight: spacing,
  },
  slotText: {
    fontSize: 14,
  },
});
