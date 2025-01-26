import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
} from 'react-native';

import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

export default function Inbox() {
  const user = useSelector((state) => state.auth?.user);

  React.useEffect(() => {
    StatusBar.setBarStyle('light-content');
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        style={{
          height: 260,
          borderRadius: 20,
          marginTop: -20,
          paddingTop: 60,
          paddingHorizontal: 10,
        }}
        start={[0, 1]}
        end={[1, 0]}
        colors={['#232526', '#414345']}
      >
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity>
            <Image
              style={{ width: 50, height: 50, borderRadius: 100 }}
              source={{ uri: user?.profileImage || 'https://randomuser.me/api/portraits/men/86.jpg' }}
            />
          </TouchableOpacity>
          <View
            style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}
          >
            <Text
              style={{ fontWeight: 'bold', fontSize: 16, color: '#fff' }}
            >
            Dr. {user?.firstName}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing code...
});