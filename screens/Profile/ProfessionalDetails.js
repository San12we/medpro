import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Style/ProfessionalDetailsStyle';

const ProfessionalDetails = ({ details }) => {
  return (
    <View style={styles.infoView}>
      <Text style={styles.profileText}>Professional Details</Text>
      <View style={styles.separator} />
      <Text>Degree: {details.medicalDegree}</Text>
      <Text>Specialization: {details.specialization}</Text>
      <Text>License: {details.licenseNumber}</Text>
    </View>
  );
};

export default ProfessionalDetails;
