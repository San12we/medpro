import React, { useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from 'expo-router';

import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";
import TextInput from "../../components/TextInput";
import { theme } from "../../core/theme";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import { nameValidator } from "../../helpers/nameValidator";
import { registerUser, verifyEmail, requestPasswordReset } from "../(services)/api/api";

export default function RegisterScreen() {
  const [firstName, setFirstName] = useState({ value: "", error: "" });
  const [lastName, setLastName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });
  const [userType, setUserType] = useState("professional"); // Default userType
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const router = useRouter();

  const onSignUpPressed = async () => {
    const firstNameError = nameValidator(firstName.value);
    const lastNameError = nameValidator(lastName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (firstNameError || lastNameError || emailError || passwordError) {
      setFirstName({ ...firstName, error: firstNameError });
      setLastName({ ...lastName, error: lastNameError });
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

    try {
      await registerUser({
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        userType,
      });
      setIsVerifying(true);
    } catch (error) {
      console.error("Failed to register user:", error);
    }
  };

  const onVerifyPressed = async () => {
    try {
      await verifyEmail({ email: email.value, verificationCode });
      router.replace("/auth/login");
    } catch (error) {
      console.error("Failed to verify email:", error);
    }
  };

  const onResendCodePressed = async () => {
    try {
      await requestPasswordReset(email.value);
      setResendMessage("Verification code resent to your email.");
    } catch (error) {
      console.error("Failed to resend verification code:", error);
      setResendMessage("Failed to resend verification code.");
    }
  };

  return (
    <Background>
      
      <Logo />
      <Header>Create Account</Header>
      {!isVerifying ? (
        <>
          <TextInput
            label="First Name"
            returnKeyType="next"
            value={firstName.value}
            onChangeText={(text) => setFirstName({ value: text, error: "" })}
            error={!!firstName.error}
            errorText={firstName.error}
          />
          <TextInput
            label="Last Name"
            returnKeyType="next"
            value={lastName.value}
            onChangeText={(text) => setLastName({ value: text, error: "" })}
            error={!!lastName.error}
            errorText={lastName.error}
          />
          <TextInput
            label="Email"
            returnKeyType="next"
            value={email.value}
            onChangeText={(text) => setEmail({ value: text, error: "" })}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />
          <TextInput
            label="Password"
            returnKeyType="done"
            value={password.value}
            onChangeText={(text) => setPassword({ value: text, error: "" })}
            error={!!password.error}
            errorText={password.error}
            secureTextEntry
          />
          <Button
            mode="contained"
            onPress={onSignUpPressed}
            style={{ marginTop: 24 }}
          >
            Next
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="Verification Code"
            returnKeyType="done"
            value={verificationCode}
            onChangeText={(text) => setVerificationCode(text)}
            error={false}
            errorText=""
          />
          <Button
            mode="contained"
            onPress={onVerifyPressed}
            style={{ marginTop: 24 }}
          >
            Verify
          </Button>
          <Button
            mode="text"
            onPress={onResendCodePressed}
            style={{ marginTop: 24 }}
          >
            Resend Code
          </Button>
          {resendMessage ? <Text>{resendMessage}</Text> : null}
        </>
      )}
      <View style={styles.row}>
        <Text>I already have an account !</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.replace("/auth/login")}>
          <Text style={styles.link}>Log in</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});