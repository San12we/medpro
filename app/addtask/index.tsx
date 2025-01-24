import React from 'react';
import { View } from 'react-native';
import AddTask from '../../screens/Task/AddTask';

import { useNavigation, useRoute } from '@react-navigation/native';

const AddTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingTop: 20 }}>
      <AddTask navigation={navigation} route={route} />
    </View>
  );
};

export default AddTaskScreen;