import React, { useState } from "react";
import { TouchableOpacity, StyleSheet, View, Alert } from "react-native";
import { Text } from "react-native-paper";
import { useRouter } from "expo-router";
import Background from "../../components/Background";
import Logo from "../../components/Logo";
import Header from "../../components/Header";
import Button from "../../components/Button";

import { theme } from "../../core/theme";
import { emailValidator } from "../../helpers/emailValidator";
import { passwordValidator } from "../../helpers/passwordValidator";
import { loginUser } from "../(services)/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { loginAction } from "../(redux)/authSlice";
import TextInput from "@/components/TextInput";

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const onLoginPressed = async () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }

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
        Alert.alert("Login failed", "Invalid email or password");
      }
    } catch (error) {
      Alert.alert("Login failed", "An error occurred. Please try again.");
    }
  };

  return (
    <Background>
      <Logo />
      <Header>Welcome back.</Header>
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
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => router.push("/auth/resetPassword")}>
          <Text style={styles.forgot}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>
      <Button mode="contained" onPress={onLoginPressed}>
        Log in
      </Button>
      <View style={styles.row}>
        <Text>You do not have an account yet?</Text>
      </View>
      <View style={styles.row}>
        <TouchableOpacity onPress={() => router.replace("/auth/register")}>
          <Text style={styles.link}>Create!</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  forgotPassword: {
    width: "100%",
    alignItems: "flex-end",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  },
  forgot: {
    fontSize: 13,
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: "bold",
    color: theme.colors.primary,
  },
});