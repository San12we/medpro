import React, { useState, useEffect } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity, TextInput

} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import DateTimePicker from '@react-native-community/datetimepicker';


const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const spacing = 10;
const _color = "#ececec";
const _borderRadius = 16;
const _damping = 14;
const _entering = FadeInDown.springify().damping(_damping);
const _exiting = FadeOut.springify().damping(_damping);
const _layout = LinearTransition.springify().damping(_damping);

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DayBlock = ({ day, schedules, setSchedules }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setStartTime(formattedTime);
      setSchedules((prev) => ({ ...prev, [day]: { ...prev[day], startTime: formattedTime } }));
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
      setEndTime(formattedTime);
      setSchedules((prev) => ({ ...prev, [day]: { ...prev[day], endTime: formattedTime } }));
    }
  };

  return (
    <Animated.View style={styles.dayBlockContainer} entering={_entering} exiting={_exiting} layout={_layout}>
      <TouchableOpacity onPress={() => setShowStartTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Start Time (e.g., 9:00 AM)"
          value={startTime}
          editable={false}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setShowEndTimePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="End Time (e.g., 5:00 PM)"
          value={endTime}
          editable={false}
        />
      </TouchableOpacity>
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
    </Animated.View>
  );
};

const Day = ({ day, schedules, setSchedules }) => {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    if (schedules[day]?.startTime && schedules[day]?.endTime) {
      setIsOn(true);
    }
  }, [schedules, day]);

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
};

const Schedule = ({ schedules, setSchedules }) => {
  const renderPreview = () => {
    if (!Object.keys(schedules).some((day) => schedules[day]?.startTime && schedules[day]?.endTime)) return null;

    return (
      <View style={styles.previewContainer}>
        {Object.keys(schedules).map((day) => (
          schedules[day]?.startTime && schedules[day]?.endTime && (
            <View key={day} style={styles.dayPreview}>
              <Text style={styles.previewDay}>{day}</Text>
              <Text style={styles.slotText}>
                {schedules[day].startTime} - {schedules[day].endTime}
              </Text>
            </View>
          )
        ))}
      </View>
    );
  };

  return (
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
    </ScrollView>
  );
};

export default Schedule;

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
  input: {
    borderWidth: 1,
    borderColor: _color,
    borderRadius: _borderRadius - spacing / 2,
    padding: spacing / 2,
    textAlign: 'center',
  },
  previewContainer: {
    marginTop: spacing * 2,
  },
  dayPreview: {
    marginBottom: spacing,
    backgroundColor: '#ecf2f9',
    padding: spacing,
    borderRadius: _borderRadius - spacing / 2,
  },
  previewDay: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: spacing / 2,
  },
  slotText: {
    fontSize: 14,
  },
});
