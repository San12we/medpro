import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from './Style/TaskStyle';
import { notificationImg, UserProfile, AddImg } from '../../theme/Images';
import { Agenda, calendarTheme } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from '../../context/TaskContext';

export default function Task() {
  const router = useRouter();
  const { items } = useContext(TaskContext);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        const storedProfileImage = await AsyncStorage.getItem('profileImage');
        const storedUsername = await AsyncStorage.getItem('username');
        const storedFirstName = await AsyncStorage.getItem('firstName');
        if (storedProfileImage) setProfileImage({ uri: storedProfileImage });
        if (storedUsername) setUsername(storedUsername);
        else if (storedFirstName) setUsername(storedFirstName);
      } catch (error) {
        console.error('Failed to load profile data', error);
      }
    };

    loadProfileData();
  }, []);

  const customTheme = {
    ...calendarTheme,
    agendaTodayColor: '#20bf55',
    agendaKnobColor: '#20bf55',
    selectedDayBackgroundColor: '#20bf55',
    dotColor: '#20bf55',
  };

  const renderEmptyData = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Task for this day</Text>
      </View>
    );
  };

  const renderItem = (item) => (
    <View style={{ marginVertical: 10, marginTop: 20, backgroundColor: 'white', marginHorizontal: 10, padding: 10 }}>
      <Text>{item.name}</Text>
      <Text>{item.time}</Text>
      <Text>{item.task}</Text>
      {item.type === 'Schedule' && <Text>Type: Schedule</Text>}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.taskView}>
        <View style={styles.profileView}>
          <View>
            <Image source={profileImage || UserProfile} style={styles.userProfile} />
          </View>
          <View style={styles.details}>
            <Text style={styles.mesText}>Task List</Text>
            <Text style={styles.taskText}>Upcoming Task</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Image source={notificationImg} style={styles.notiImg} />
        </TouchableOpacity>
      </View>

      <View style={styles.calenderView}>
        <View style={styles.mainCalenderView}>
          <Agenda
            items={items.tasks} // Ensure accessing tasks correctly
            theme={customTheme}
            showOnlySelectedDayItems={true}
            renderEmptyData={renderEmptyData}
            renderItem={renderItem}
            onDayPress={(day) => setSelectedDate(new Date(day.timestamp))} // Capture selected date
          />
        </View>
      </View>
      <TouchableOpacity style={styles.stickyCircle} onPress={() => router.push({ pathname: '/addtask', params: { selectedDate: selectedDate.toISOString() } })}>
        <Image source={AddImg} style={styles.addImg} />
      </TouchableOpacity>
    </View>
  );
}