import React, { createContext, useState } from 'react';
import useAppointments from '../hooks/useAppointments';

export const TaskContext = createContext();

// todo
// fetch appointments using the doctorsId
// map the appointments into the tasks

export const TaskProvider = ({ children }) => {
  const [items, setItems] = useState({
    tasks: {
      '2024-05-14': [{ name: 'Meeting with client', time: '10:00 AM To 11:00 AM', task: 'Discuss project updates', myStatus: 'Pending' }],
      '2024-04-30': [
        { name: 'Team brainstorming session', time: '9:00 AM', task: 'Plan upcoming tasks', myStatus: 'In Progress' },
        { name: 'Project presentation', time: '2:00 PM', task: 'Present project progress', myStatus: 'Done' },
        { name: 'Project presentation', time: '5:00 PM', task: 'Review feedback', myStatus: 'Pending' }
      ],
      '2024-05-15': [
        { name: 'Team brainstorming session', time: '9:00 AM', task: 'Discuss project strategies', myStatus: 'In Progress' },
        { name: 'Project presentation', time: '2:00 PM', task: 'Finalize project plan', myStatus: 'Done' }
      ],
      '2024-05-13': [
        { name: 'Team brainstorming session', time: '9:00 AM', task: 'Brainstorm new ideas', myStatus: 'Pending' },
        { name: 'Project presentation', time: '2:00 PM', task: 'Review project milestones', myStatus: 'Done' }
      ],
    },
    schedules: {},
  });

  const { appointments } = useAppointments();

  // Log appointments
  console.log('Appointments:', appointments);

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
