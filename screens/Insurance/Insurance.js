import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { styles } from './Style/InsuranceStyle';
import { UserProfile, notificationImg } from '../../theme/Images';
import useInsurance from '../../hooks/useInsurance';

const InsuranceScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { insuranceProviders, clearCacheAndFetchAfresh } = useInsurance();
  const [filteredProviders, setFilteredProviders] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    console.log('Insurance Providers:', insuranceProviders);
    setFilteredProviders(insuranceProviders);
    loadProfileData();
  }, [insuranceProviders]);

  const loadProfileData = async () => {
    try {
      const storedProfileImage = await AsyncStorage.getItem('profileImage');
      const storedUsername = await AsyncStorage.getItem('username');
      const storedFirstName = await AsyncStorage.getItem('firstName');
      if (storedProfileImage) setProfileImage({ uri: storedProfileImage });
      if (storedUsername) setUsername(storedUsername);
      else if (storedFirstName) setUsername(storedFirstName);
    } catch (error) {
      console.error('Failed to load profile data', error);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredProviders(insuranceProviders);
    } else {
      const filtered = insuranceProviders.filter(provider =>
        provider.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProviders(filtered);
    }
  };

  const removeProvider = (id) => {
    // Remove provider logic here
  };

  return (
    <View style={styles.container}>
      <View style={styles.homeView}>
        <View style={styles.profileView}>
          <View>
            <Image source={profileImage || UserProfile} style={styles.userProfileImg} />
          </View>
        </View>
        <TouchableOpacity>
          <Image source={notificationImg} style={styles.notiImg} />
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Insurance Settings</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>
      <FlatList
        data={filteredProviders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.providerItem}>
            <Text>{item.name}</Text>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity>
                <Text style={styles.editButton}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeProvider(item.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default InsuranceScreen;
