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
import { Feather as Icon } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

export default function Wallet() {
  const user = useSelector((state) => state.auth?.user);



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
      <View
        style={{
          backgroundColor: '#fff',
          height: 200,
          marginTop: -120,
          borderRadius: 20,
          marginHorizontal: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
          padding: 14,
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16 }}>
              Balance
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 24 }}>KSH 52,645</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#333',
                paddingLeft: 4,
                paddingRight: 10,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Icon name='arrow-up-right' size='20' color='#fff' />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: 4,
                }}
              >
                Send
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#333',
                marginLeft: 10,
                paddingLeft: 4,
                paddingRight: 10,
                paddingVertical: 4,
                borderRadius: 4,
              }}
            >
              <Icon name='arrow-down-left' size='20' color='#fff' />
              <Text
                style={{
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: 16,
                  marginLeft: 4,
                }}
              >
                Request
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='trending-down' color='green' size='30' />
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Received</Text>
            <Text
              style={{ fontSize: 16, marginTop: 4 }}
            >
              KSH 0
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='trending-up' color='red' size='30' />
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Spent</Text>
            <Text
              style={{ fontSize: 16, marginTop: 4 }}
            >
              KSH 0
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Icon name='pocket' color='#0984e3' size='30' />
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Saved</Text>
            <Text
              style={{ fontSize: 16, marginTop: 4 }}
            >
              KSH 0
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // ...existing code...
});