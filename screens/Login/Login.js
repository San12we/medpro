import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import { styles } from './Style/LoginStyle'
import { LoginImg, UserImg, GoogleImg, AppleImg, FacebookImg, PasswordImg } from '../../theme/Images'
import { loginUser } from '../../app/(services)/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const data = await loginUser({ email: username, password });
      const { professionalId, user } = data;
      const userData = {
        userId: user._id,
        professionalId,
        profileImage: user.profileImage,
        firstName: user.firstName,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        completedProfile: user.completedProfile,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      console.log('Login successful:', userData);
      router.push('/(tabs)/home');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  useEffect(() => {
    const retrieveUserData = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          console.log('Retrieved user data:', userData);
        }
      } catch (error) {
        console.error('Failed to retrieve user data:', error);
      }
    };

    retrieveUserData();
  }, []);

  const gotToSignup = () => {
    router.push('auth/register');
  };

  return (
    <View style={styles.loginContainer}>
      <Image source={LoginImg} style={styles.loginImg} />
      <View style={styles.mainContainer}>
        <Text style={styles.welComeText}>Hello, {"\n"} Welcome back again</Text>
      
        <View style={styles.loginInputView}>
          <Image source={UserImg} style={styles.imgInput} />
          <TextInput
            placeholder='Username'
            style={styles.loginInput}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.loginInputView}>
          <Image source={PasswordImg} style={styles.imgInput} />
          <TextInput
            placeholder='Password'
            style={styles.loginInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <Text style={styles.forgetText}>Forget Password</Text>
        <TouchableOpacity style={styles.btn} onPress={handleLogin}>
          <Text style={styles.btnText}>Sign in</Text>
        </TouchableOpacity>
        <Text style={styles.contiueText}>or continue with</Text>
      </View>
     
      <TouchableOpacity onPress={gotToSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}