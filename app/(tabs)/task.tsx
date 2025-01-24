import { StyleSheet, View } from 'react-native'
import React from 'react'
import Task from '../../screens/Task/Task'

const TaskScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Task />
    </View>
  )
}

export default TaskScreen

const styles = StyleSheet.create({})