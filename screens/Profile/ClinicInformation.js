import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Style/ClinicInformationStyle';

const ClinicInformation = ({ info }) => {
  // Add default values or checks
  const practiceName = info?.practiceName || 'N/A';
  const practiceLocation = info?.practiceLocation || 'N/A';
  const workingHours = info?.workingHours || { startTime: 'N/A', endTime: 'N/A' };

  return (
    <View style={styles.infoView}>
      <Text style={styles.profileText}>Clinic Information</Text>
      <View style={styles.separator} />
      <Text>Practice: {practiceName}</Text>
      <Text>Location: {practiceLocation}</Text>
      <Text>Working Hours: {workingHours.startTime} - {workingHours.endTime}</Text>
    </View>
  );
};

export default ClinicInformation;