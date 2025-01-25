import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'expo-router';
import { styles } from './Style/LoginStyle'
import { LoginImg, UserImg, GoogleImg, AppleImg, FacebookImg, PasswordImg } from '../../theme/Images'
import { loginUser } from '../../app/(services)/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../../app/(redux)/userSlice'; // Import setUser action
import { useMutation } from '@tanstack/react-query'; // Import useMutation

export default function Login() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch(); // Initialize dispatch

  const mutation = useMutation(loginUser, {
    onSuccess: async (data) => {
      const { professionalId, user, token, profileImage } = data;
      const userData = {
        id: user._id,
        professionalId,
        profileImage,
        firstName: user.firstName,
        username: user.username,
        email: user.email,
        token,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      dispatch(setUser(userData)); // Dispatch setUser action
      console.log('Login successful:', userData);
      router.push('/(tabs)/home');
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ email: username, password });
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
        <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={mutation.isLoading}>
          <Text style={styles.btnText}>{mutation.isLoading ? 'Signing in...' : 'Sign in'}</Text>
        </TouchableOpacity>
        <Text style={styles.contiueText}>or continue with</Text>
      </View>
     
      <TouchableOpacity onPress={gotToSignup}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}