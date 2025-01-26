import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { firebase } from '../firebase/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.cancelled) {
    return result.uri;
  } else {
    return null;
  }
};

export const uploadImage = async (imageUri) => {
  try {
    const { uri } = await FileSystem.getInfoAsync(imageUri);
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = () => resolve(xhr.response);
      xhr.onerror = (e) => reject(new TypeError('Network request failed'));
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const ref = firebase.storage().ref().child(filename);
    await ref.put(blob);
    blob.close();

    const url = await ref.getDownloadURL();
    await AsyncStorage.setItem('profileImage', url);

    Alert.alert('Profile image uploaded successfully');
    return url;
  } catch (error) {
    Alert.alert('Image upload failed');
    return null;
  }
};
