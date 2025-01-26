import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, TextInput, ScrollView, FlatList, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { TaskContext } from '../../context/TaskContext'; // Import TaskContext
import { styles } from './Style/AddTaskStyle';
import { backArrowImg, calenderImg } from '../../theme/Images';
import { Colors } from "../../theme/Colors";
import { Snackbar } from 'react-native-paper'; // Import Snackbar
import { Picker } from '@react-native-picker/picker'; // Ensure Picker is imported from correct package

export default function AddTask() {
  const router = useRouter();
  const { params } = router;
  const initialDate = params && params.selectedDate ? new Date(params.selectedDate) : new Date();
  const { addTask } = useContext(TaskContext); // Access addTask from TaskContext
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [inputFocus, setInputFocus] = useState('');
  const [assignTo, setAssignTo] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [currentShift, setCurrentShift] = useState({
    shiftName: '',
    startTime: initialDate,
    endTime: initialDate,
    durationOfConsultation: 30,
    breaks: [],
    slots: [], // Initialize slots to avoid undefined errors
  });
  const [shifts, setShifts] = useState([]);
  const [userId, setUserId] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false); // Snackbar visibility state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message state

  useEffect(() => {
    const loadUserId = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserId(userData.userId);
          console.log('Retrieved user data:', userData); // Log the user data
        }
      } catch (error) {
        console.error('Failed to load user data', error);
      }
    };

    loadUserId();
  }, []);

  const goback = () => {
    router.push('/(tabs)/home');
  };

  const showDatepicker = (input) => {
    setInputFocus(input);
    setShowDatePicker(true);
  };

  const onChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setCurrentShift((prevShift) => ({
        ...prevShift,
        [inputFocus]: selectedDate,
      }));
    }
  };

  const handleAddShift = () => {
    if (!currentShift.shiftName) {
      setSnackbarMessage('Please fill in the shift name.');
      setSnackbarVisible(true);
      return;
    }
    setShifts([...shifts, currentShift]);
    setCurrentShift({ shiftName: '', startTime: initialDate, endTime: initialDate, durationOfConsultation: 30, breaks: [] });
  };

  const handleCreateSchedule = () => {
    if (!assignTo || shifts.length === 0) {
      setSnackbarMessage('Please fill in all required fields.');
      setSnackbarVisible(true);
      return;
    }

    const newEntry = {
      shifts,
      assignTo,
      recurrence,
      type: 'Schedule', // Always mark as Schedule
    };

    addTask(newEntry); // Add schedule globally
    router.push('/(tabs)/task');
  };

  const handleSaveSchedule = async () => {
    if (shifts.length === 0) {
      setSnackbarMessage('Please add some shifts before saving!');
      setSnackbarVisible(true);
      return;
    }

    const formattedShifts = shifts.map((shift) => ({
      name: shift.shiftName,
      startTime: shift.startTime,
      endTime: shift.endTime,
      date: shift.startTime.toISOString().split('T')[0],
      durationOfConsultation: shift.durationOfConsultation, // Include durationOfConsultation
      slots: shift.slots || [],
    }));

    const payload = {
      professionalId: userId, // Use userId as professionalId
      availability: formattedShifts.reduce((acc, shift) => {
        const dayKey = shift.date;
        if (!acc[dayKey]) {
          acc[dayKey] = [];
        }
        acc[dayKey].push({
          shiftName: shift.name,
          startTime: shift.startTime,
          endTime: shift.endTime,
          durationOfConsultation: shift.durationOfConsultation, // Include durationOfConsultation
          slots: shift.slots,
        });
        return acc;
      }, {}),
      recurrence,
    };

    try {
      await axios.put("https://medplus-health.onrender.com/api/schedule", payload);
      setSnackbarMessage('Your schedule has been saved successfully!');
      setSnackbarVisible(true);
      setShifts([]); // Clear shifts after saving
      setCurrentShift({ shiftName: '', startTime: initialDate, endTime: initialDate, durationOfConsultation: 30, breaks: [] });
      setAssignTo('');
      setRecurrence('none');
    } catch (error) {
      setSnackbarMessage('Error saving schedule.');
      setSnackbarVisible(true);
    }
  };

  const renderShiftItem = ({ item, index }) => (
    <View style={[styles.previewCard, { backgroundColor: index % 2 === 0 ? '#f0f0f0' : '#e0e0e0' }]}>
      <Text style={styles.previewCardTitle}>{item.shiftName}</Text>
      <Text style={styles.previewCardText}>{item.startTime.toLocaleTimeString()} - {item.endTime.toLocaleTimeString()}</Text>
      <Text style={styles.previewCardText}>Duration: {item.durationOfConsultation} minutes</Text>
    </View>
  );

  return (
    <ScrollView style={styles.addTaskContainer}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goback}>
          <Image source={backArrowImg} style={styles.backArrow} />
        </TouchableOpacity>
        <Text style={styles.textAdd}>Add Schedule for {initialDate.toDateString()}</Text>
      </View>
      <View style={styles.inputContainer}>
        
        <View style={styles.inputView}>
          <Text style={styles.label}>Recurrence</Text>
          <Picker selectedValue={recurrence} style={styles.picker} onValueChange={(itemValue) => setRecurrence(itemValue)}>
            <Picker.Item label="None" value="none" />
            <Picker.Item label="Daily" value="daily" />
            <Picker.Item label="Weekly" value="weekly" />
           
          </Picker>
        </View>
        <View style={styles.shiftContainer}>
          <View style={styles.inputView}>
            <Text style={styles.label}>Shift Name</Text>
            <TextInput
              placeholder="Shift Name"
              style={styles.Input}
              value={currentShift.shiftName}
              onChangeText={(text) => setCurrentShift({ ...currentShift, shiftName: text })}
            />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.label}>Start Time</Text>
            <View style={styles.dateView}>
              <TextInput
                placeholder="Start Time"
                style={styles.InputDate}
                onFocus={() => showDatepicker('startTime')}
                value={currentShift.startTime.toLocaleTimeString()}
              />
              <TouchableOpacity onPress={() => showDatepicker('startTime')}>
                <Image source={calenderImg} style={styles.calenderImgs} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.label}>End Time</Text>
            <View style={styles.dateView}>
              <TextInput
                placeholder="End Time"
                style={styles.InputDate}
                onFocus={() => showDatepicker('endTime')}
                value={currentShift.endTime.toLocaleTimeString()}
              />
              <TouchableOpacity onPress={() => showDatepicker('endTime')}>
                <Image source={calenderImg} style={styles.calenderImgs} />
              </TouchableOpacity>
            </View>
            {showDatePicker && (
              <DateTimePicker
                testID="dateTimePicker"
                value={inputFocus === 'startTime' ? currentShift.startTime : currentShift.endTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={onChange}
              />
            )}
          </View>
          <View style={styles.inputView}>
            <Text style={styles.label}>Duration of Consultation (minutes)</Text>
            <TextInput
              placeholder="Duration"
              style={styles.Input}
              keyboardType="numeric"
              value={currentShift.durationOfConsultation.toString()}
              onChangeText={(text) => setCurrentShift({ ...currentShift, durationOfConsultation: parseInt(text, 10) })}
            />
          </View>
          <TouchableOpacity onPress={handleAddShift} style={styles.addShiftButton}>
            <Text style={styles.addShiftButtonText}>Add Shift</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Schedule Preview</Text>
          <FlatList
            data={shifts}
            renderItem={renderShiftItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          />
        </View>
        <TouchableOpacity style={styles.btn} onPress={handleSaveSchedule}>
          <Text style={styles.btnText}>Save</Text>
        </TouchableOpacity>
      </View>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
}



import React, { useState } from "react";
import { TouchableOpacity, View, Image, TextInput, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Button from "../../components/Button";
import { loginUser } from "../(services)/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginAction } from "../(redux)/authSlice";
import { styles } from "../../screens/Login/Style/LoginStyle";
import { LoginImg, UserImg, PasswordImg } from "../../theme/Images";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passwordValidator";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser({ email: email.value, password: password.value });
      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userId", response.user._id);
        dispatch(loginAction({ user: response.user, token: response.token, professionalId: response.professionalId }));
        if (response.user.completedProfile) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(tabs)/profile");
        }
      } else {
        Toast.show({
          type: "error",
          text1: "Login failed",
          text2: "Invalid email or password",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.loginContainer}>
      <Image source={LoginImg} style={styles.loginImg} />
      <View style={styles.mainContainer}>
        <Text style={styles.welComeText}>Hello, {"\n"} Welcome back again</Text>
        <View style={styles.loginInputView}>
          <Image source={UserImg} style={styles.imgInput} />
          <TextInput
            placeholder="Email"
            style={styles.loginInput}
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.loginInputView}>
          <Image source={PasswordImg} style={styles.imgInput} />
          <TextInput
            placeholder="Password"
            style={styles.loginInput}
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            secureTextEntry
          />
        </View>
        <Text style={styles.forgetText}>Forget Password</Text>
        <TouchableOpacity style={styles.btn} onPress={onLoginPressed} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign in"}</Text>
        </TouchableOpacity>
        <Text style={styles.contiueText}>or continue with</Text>
      </View>
      <TouchableOpacity onPress={() => router.replace("/auth/register")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
      <Toast />
    </ScrollView>
  );
}







import React, { useState } from "react";
import { TouchableOpacity, View, Image, TextInput, ScrollView, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Button from "../../components/Button";
import { loginUser } from "../(services)/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginAction } from "..//(redux)/authSlice";
import { LoginImg, UserImg, PasswordImg } from "../../theme/Images";
import { emailValidator } from "@/helpers/emailValidator";
import { passwordValidator } from "@/helpers/passwordValidator";

const styles = StyleSheet.create({
  loginContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  loginImg: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  mainContainer: {
    width: '100%',
    alignItems: 'center',
  },
  welComeText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  loginInputView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  imgInput: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  loginInput: {
    flex: 1,
    height: 40,
  },
  feedbackText: {
    color: 'red',
    marginBottom: 10,
  },
  forgetText: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    color: '#007bff',
  },
  btn: {
    width: '100%',
    padding: 15,
    backgroundColor: '#007bff',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
  },
  contiueText: {
    marginBottom: 20,
    color: '#a9a9a9',
  },
  signupText: {
    color: '#007bff',
    marginTop: 20,
  },
});

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    setLoading(true);
    setFeedback("");
    try {
      const response = await loginUser({ email: email.value, password: password.value });
      if (response.token) {
        await AsyncStorage.setItem("userToken", response.token);
        await AsyncStorage.setItem("userId", response.user._id);
        dispatch(loginAction({ user: response.user, token: response.token, professionalId: response.professionalId }));
        if (response.user.completedProfile) {
          router.replace("/(tabs)/home");
        } else {
          router.replace("/(tabs)/profile");
        }
      } else {
        setFeedback("Invalid email or password");
      }
    } catch (error) {
      setFeedback("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.loginContainer}>
      <Image source={LoginImg} style={styles.loginImg} />
      <View style={styles.mainContainer}>
        <Text style={styles.welComeText}>Hello, {"\n"} Welcome back again</Text>
        <View style={styles.loginInputView}>
          <Image source={UserImg} style={styles.imgInput} />
          <TextInput
            placeholder="Email"
            style={styles.loginInput}
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            autoCapitalize="none"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.loginInputView}>
          <Image source={PasswordImg} style={styles.imgInput} />
          <TextInput
            placeholder="Password"
            style={styles.loginInput}
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            secureTextEntry
          />
        </View>
         <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => router.push("/auth/resetPassword")}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
        <TouchableOpacity style={styles.btn} onPress={onLoginPressed} disabled={loading}>
          <Text style={styles.btnText}>{loading ? "Signing in..." : "Sign in"}</Text>
        </TouchableOpacity>
        <Text style={styles.contiueText}>or continue with</Text>
      </View>
      <TouchableOpacity onPress={() => router.replace("/auth/register")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}