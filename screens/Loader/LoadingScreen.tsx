import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import LottieView from 'lottie-react-native'; // For modern animations
import Colors from '@/components/Shared/Colors';


const LoadingScreen = ({ message = "Loading..." }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          {/* Modern Lottie Animation */}
          <LottieView
            source={require('../../assets/animation/loading2.json')} // Replace with your Lottie animation file
            autoPlay
            loop
            style={styles.animation}
          />
          <Text style={styles.loadingText}>{message}</Text>
        </View>
      ) : (
        <Text style={styles.contentText}>Ready!</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.orange700, // Use your preferred background color
  },
  loadingContainer: {
    alignItems: 'center',
  },
  animation: {
    width: 150,
    height: 150,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: Colors.blue30, // Use your preferred text color
    fontWeight: 'bold',
  },
  contentText: {
    fontSize: 18,
    color: Colors.primary, // Use your preferred text color
    fontWeight: 'bold',
  },
});

export default LoadingScreen;