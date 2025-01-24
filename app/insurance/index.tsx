import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Insurance from '../../screens/Insurance/Insurance'
const index = () => {
  return (
    <View style={styles.container}>
      <Insurance />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  })