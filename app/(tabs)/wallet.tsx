import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Inbox from '../../screens/Inbox/Inbox' // Ensure correct import path

const wallet = () => {
  return (
    <View style={{ flex: 1 }}>
      <Inbox /> {/* Ensure Inbox component is used correctly */}
    </View>
  )
}

export default wallet

const styles = StyleSheet.create({})

