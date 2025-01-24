import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { styles } from './Style/RegistrationStyle';
import { LoginImg, UserImg, GoogleImg, AppleImg, FacebookImg, PasswordImg, InboxImg } from '../../theme/Images';
import { registerUser, verifyEmail, requestPasswordReset } from '../../app/(services)/api/api';

export default function Registration() {
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [userType, setUserType] = useState("professional"); // Default userType
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      password: password.value,
      userType,
    };

    try {
      await registerUser(userData);
      setIsVerifying(true);
    } catch (error) {
      Alert.alert("Registration failed", error.message || "An error occurred. Please try again.");
    }
  };

  const handleVerify = async () => {
    try {
      await verifyEmail({ email: email.value, verificationCode });
      Alert.alert("Success", "Email verified successfully!");
      router.replace("/auth/login");
    } catch (error) {
      Alert.alert("Verification failed", error.message || "An error occurred. Please try again.");
    }
  };

  const handleResendCode = async () => {
    try {
      await requestPasswordReset(email.value);
      setResendMessage("Verification code resent to your email.");
    } catch (error) {
      setResendMessage("Failed to resend verification code.");
    }
  };

  const gotToSignin = () => {
    router.push("/auth/login");
  };

  return (
    <View style={styles.loginContainer}>
      <Image source={LoginImg} style={styles.loginImg} />
      <View style={styles.mainContainer}>
        <Text style={styles.welComeText}>Sign up</Text>
        {!isVerifying ? (
          <>
            <View style={styles.loginInputView}>
              <Image source={UserImg} style={styles.imgInput} />
              <TextInput
                placeholder='First Name'
                style={styles.loginInput}
                value={firstName.value}
                onChangeText={(text) => setFirstName({ value: text, error: "" })}
              />
            </View>
            <View style={styles.loginInputView}>
              <Image source={UserImg} style={styles.imgInput} />
              <TextInput
                placeholder='Last Name'
                style={styles.loginInput}
                value={lastName.value}
                onChangeText={(text) => setLastName({ value: text, error: "" })}
              />
            </View>
            <View style={styles.loginInputView}>
              <Image source={InboxImg} style={styles.imgInput} />
              <TextInput
                placeholder='Email'
                style={styles.loginInput}
                value={email.value}
                onChangeText={(text) => setEmail({ value: text, error: "" })}
              />
            </View>
            <View style={styles.loginInputView}>
              <Image source={PasswordImg} style={styles.imgInput} />
              <TextInput
                placeholder='Password'
                style={styles.loginInput}
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: "" })}
                secureTextEntry
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleRegister}>
              <Text style={styles.btnText}>Sign up</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.loginInputView}>
              <TextInput
                placeholder='Verification Code'
                style={styles.loginInput}
                value={verificationCode}
                onChangeText={(text) => setVerificationCode(text)}
              />
            </View>
            <TouchableOpacity style={styles.btn} onPress={handleVerify}>
              <Text style={styles.btnText}>Verify Email</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleResendCode}>
              <Text style={styles.resendText}>Resend Verification Code</Text>
            </TouchableOpacity>
            {resendMessage ? <Text style={styles.resendMessage}>{resendMessage}</Text> : null}
          </>
        )}
        <Text style={styles.contiueText}>or continue with</Text>
      </View>
      <View style={styles.socialView}>
        <View style={styles.bgImg}>
          <Image source={GoogleImg} style={styles.socialImg} />
        </View>
        <View style={styles.bgImg}>
          <Image source={AppleImg} style={styles.socialImg} />
        </View>
        <View style={styles.bgImg}>
          <Image source={FacebookImg} style={styles.socialImg} />
        </View>
      </View>
      <TouchableOpacity onPress={gotToSignin}>
        <Text style={styles.signupText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}