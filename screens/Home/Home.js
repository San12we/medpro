import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { styles } from './Style/HomeStyle';
import { notificationImg, UserProfile, AddTaskImg } from '../../theme/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from '../../context/TaskContext';

const TaskItem = ({ taskName, taskDetails, taskStatus }) => (
  <View style={styles.taskContainer}>
    <Text style={styles.taskName}>{taskName}</Text>
    <Text style={styles.taskDetails}>{taskDetails}</Text>
    <Text>Status : {taskStatus}</Text>
  </View>
);

const CustomTaskItem = ({ taskName, taskDetails, myStatus }) => {
  let statusColor;

  switch (myStatus) {
    case 'Pending':
      statusColor = 'red';
      break;
    case 'In Progress':
      statusColor = 'yellow';
      break;
    case 'Done':
      statusColor = 'green';
      break;
    default:
      statusColor = 'gray';
      break;
  }
  return (
    <View style={styles.taskContainer}>
      <View style={styles.statusCircle}>
        <Text style={styles.taskName}>{taskName}</Text>
        <View style={[styles.pendingTask, { backgroundColor: statusColor }]}></View>
      </View>
      <View style={styles.statusDetails}>
        <Text style={styles.taskDetails}>{taskDetails}</Text>
        <Text style={styles.taskDetails}>{myStatus}</Text>
      </View>
    </View>
  );
};

export default function Home() {
  const navigation = useNavigation();
  const { items, calculateProgress } = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');

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

  useEffect(() => {
    const retrieveData = async () => {
      try {
        const profileImage = await AsyncStorage.getItem('profileImage');
        const username = await AsyncStorage.getItem('username');
        const firstName = await AsyncStorage.getItem('firstName');
        console.log('Profile Image:', profileImage);
        console.log('Username:', username);
        console.log('First Name:', firstName);
      } catch (error) {
        console.error('Failed to retrieve data from AsyncStorage', error);
      }
    };

    retrieveData();
  }, []);

  useEffect(() => {
    filterTasks(activeTab);
  }, [items]);

  const filterTasks = (myStatus) => {
    let allTasks = [];
    Object.keys(items.tasks).forEach(date => {
      const tasksForDate = items.tasks[date] || []; // Ensure tasksForDate is always an array
      allTasks = [...allTasks, ...tasksForDate];
    });

    let filtered;
    if (myStatus === 'All') {
      filtered = allTasks;
    } else {
      filtered = allTasks.filter(task => task.myStatus === myStatus);
    }
    setFilteredTasks(filtered);
    setActiveTab(myStatus);
  };

  const goToTask = () => {
    navigation.navigate('AddTask');
  };

  const todayDate = new Date().toISOString().split('T')[0];
  const todayProgress = calculateProgress(todayDate);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.homeContainer}>
        <View style={styles.homeView}>
          <View style={styles.profileView}>
            <View>
              <Image source={profileImage || UserProfile} style={styles.userProfileImg} />
            </View>
          </View>
          <TouchableOpacity>
            <Image source={notificationImg} style={styles.notiImg} />
          </TouchableOpacity>
        </View>

        <View style={styles.taskSummaryView}>
          <View style={styles.taskSummaryCard}>
            <Text style={styles.taskText}>Today Appointments Summary</Text>
            <View style={styles.addView}>
              <View>
                <Text>Progress <Text style={styles.percentageText}>{todayProgress.toFixed(2)}%</Text> </Text>
              </View>
            </View>
          </View>
        </View>

        <ScrollView>
          <View style={styles.upComings}>
            <Text style={styles.upcoingText}>UpComing Events</Text>
            <FlatList
              data={filteredTasks}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TaskItem taskName={item.name} taskDetails={item.task} taskStatus={item.myStatus || 'Pending'} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.taskListView}>
            <Text style={styles.upcoingText}>My Consultations List</Text>
            <View style={styles.filterContainer}>
              <TouchableOpacity onPress={() => filterTasks('All')} style={[styles.filterButton, activeTab === 'All' && styles.activeFilterButton]}>
                <Text style={[styles.filterText, activeTab === 'All' && styles.activeFilterText]}>All</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => filterTasks('Pending')} style={[styles.filterButton, activeTab === 'Pending' && styles.activeFilterButton]}>
                <Text style={[styles.filterText, activeTab === 'Pending' && styles.activeFilterText]}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => filterTasks('In Progress')} style={[styles.filterButton, activeTab === 'In Progress' && styles.activeFilterButton]}>
                <Text style={[styles.filterText, activeTab === 'In Progress' && styles.activeFilterText]}>In Progress</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => filterTasks('Done')} style={[styles.filterButton, activeTab === 'Done' && styles.activeFilterButton]}>
                <Text style={[styles.filterText, activeTab === 'Done' && styles.activeFilterText]}>Done</Text>
              </TouchableOpacity>
            </View>
            {filteredTasks.map((item, index) => (
              <CustomTaskItem key={index} taskName={item.name} taskDetails={item.task} myStatus={item.myStatus || 'Pending'} />
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}