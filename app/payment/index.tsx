import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Transaction from '../../screens/Payment/Transaction'

const index = () => {
  return (
    <View style={styles.container}>
      <Transaction />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})