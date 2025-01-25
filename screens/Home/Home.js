import { View, Text, Image, TouchableOpacity, FlatList, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useContext, useEffect } from 'react';
import { styles } from './Style/HomeStyle';
import { notificationImg, UserProfile, AddTaskImg } from '../../theme/Images';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TaskContext } from '../../context/TaskContext';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { LinearGradient } from 'expo-linear-gradient';

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
  const user = useSelector((state) => state.auth?.user); // Access user from state with optional chaining

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
                source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/86.jpg' }}
              />
            </TouchableOpacity>
            <View
              style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
            >
              <Text
                style={{ fontFamily: 'NSExtraBold', fontSize: 16, color: '#fff' }}
              >
               Dr. {user?.firstName}
              </Text>
             
            </View>
          </View>
        </LinearGradient>

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