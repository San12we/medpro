import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [items, setItems] = useState({
    tasks: {},
    schedules: {},
  });
  const [professionalId, setProfessionalId] = useState(null); // Add state for professionalId

  useEffect(() => {
    const fetchProfessionalId = async () => {
      try {
        const storedProfessionalId = await AsyncStorage.getItem('professionalId');
        if (storedProfessionalId) {
          setProfessionalId(storedProfessionalId);
        }
      } catch (error) {
        console.error('Error fetching professional ID from AsyncStorage:', error);
      }
    };

    fetchProfessionalId();
  }, []); // Fetch professionalId on component mount

  useEffect(() => {
    if (professionalId) {
      fetchAppointments(professionalId);
    }
  }, [professionalId]); // Trigger fetchAppointments when professionalId changes

  const fetchAppointments = async (professionalId) => {
    try {
      const response = await axios.get(`https://medplus-health.onrender.com/api/appointments/doctor/${professionalId}`);
      const appointments = response.data;

      const tasks = appointments.reduce((acc, appointment) => {
        const dateKey = new Date(appointment.date).toISOString().split('T')[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push({
          name: `Appointment with ${appointment.patientName}`,
          time: appointment.time,
          task: `Consultation`,
          myStatus: appointment.status,
        });
        return acc;
      }, {});

      setItems((prevItems) => ({
        ...prevItems,
        tasks: {
          ...prevItems.tasks,
          ...tasks,
        },
      }));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const addTask = (newEntry) => {
    const dateKey = new Date().toISOString().split('T')[0]; // Use current date as key
    const category = newEntry.type === 'Schedule' ? 'schedules' : 'tasks';

    setItems((prevItems) => {
      const updatedItems = { ...prevItems };
      if (!updatedItems[category][dateKey]) updatedItems[category][dateKey] = [];
      updatedItems[category][dateKey].push(newEntry);
      return updatedItems;
    });
  };

  const calculateProgress = (date) => {
    const tasks = items.tasks[date] || [];
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.myStatus === 'Done').length;
    return totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  };

  return (
    <TaskContext.Provider value={{ items, addTask, calculateProgress }}>
      {children}
    </TaskContext.Provider>
  );
};
