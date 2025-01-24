import { View, Text, TouchableOpacity, Image, StatusBar, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'expo-router';
import { WelcomeImg } from '../../theme/Images';
import { styles } from './Style/InitialScreenStyle';

export default function InitialScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const gotToLogin = () => {
    router.push('auth/login');
  };

  return (
    <>
      <StatusBar backgroundColor="#20bf55" />
      <View style={styles.container}>
        <View style={styles.mainContainer}>
          <View>
            <Image source={WelcomeImg} style={styles.img} />
            <View>
              <Animated.Text style={[styles.text, { opacity: fadeAnim }]}>
                Deliver healthcare efficiently with cutting-edge technology.
              </Animated.Text>
              <Animated.Text style={[styles.textSub, { opacity: fadeAnim }]}>
                Streamline schedules, manage appointments, track daily tasks, and access patient data seamlessly—all in one place.
              </Animated.Text>
            </View>
          </View>
          <TouchableOpacity style={styles.btn} onPress={gotToLogin}>
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}