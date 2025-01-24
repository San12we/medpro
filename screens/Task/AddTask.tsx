import React, { useEffect, useState } from 'react';
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
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

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
const [user, setUser] = useState({ fullName: '', email: '', profileImage: '' });
useEffect(()=>{
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
})

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
  const hours = schedules[day] || []; // Safeguard schedules[day]

  const addSlot = () => {
    setSchedules((prev: any) => {
      const updatedDaySlots = [...(prev[day] || []), (_startHour + hours.length) % 24]; // Add a new slot
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
          <Text>Add Hour</Text>
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
  const [schedules, setSchedules] = useState<any>({}); // Initialize schedules as an object

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
    if (!Object.keys(schedules).some((day) => schedules[day]?.length)) return null;

    return (
      <View style={styles.previewContainer}>
        <Text style={styles.previewTitle}>Preview:</Text>
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
    <SafeAreaView>
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
          <TouchableOpacity style={{ justifyContent: 'center' }}>
            <Icon name='bell' color='#fff' size='26' />
          </TouchableOpacity>
        </View>
      <ScrollView contentContainerStyle={styles.container}>
      {weekDays.map((day) => (
        <Day day={day} schedules={schedules} setSchedules={setSchedules} key={day} />
      ))}
      {renderPreview()}
      <Button title="Submit" onPress={handleSubmit} color="blue" />
    </ScrollView>
    </SafeAreaView>
    
  );
};

export default AddTask;

const styles = StyleSheet.create({
  container: {
    padding: spacing,
    gap: spacing,
  },
  dayContainer: {
    borderWidth: 1,
    borderColor: _color,
    padding: spacing,
    borderRadius: _borderRadius,
    gap: spacing,
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
    backgroundColor: '#f0f0f0',
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
    marginRight: spacing,
  },
  slotText: {
    fontSize: 14,
  },
});
