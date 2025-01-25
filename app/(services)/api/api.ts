import axios from "axios";

const API_URL = "https://project03-rj91.onrender.com";

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  userType: string;
}

interface UserData {
  [key: string]: any;
}

// login
const loginUser = async ({ email, password }: LoginData): Promise<any> => {
  const response = await axios.post(`${API_URL}/api/users/login`, {
    email,
    password,
  });
  return response.data;
};

// register
const registerUser = async (data: RegisterData): Promise<any> => {
  console.log("Data being sent to API:", data);
  const response = await axios.post(`${API_URL}/api/users/register`, data);
  return response.data;
};

// Google login
const googleLoginUser = async (userData: UserData): Promise<any> => {
  const response = await axios.post(`${API_URL}/api/users/google-login`, userData);
  return response.data;
};

const setPassword = async (token: string, password: string): Promise<any> => {
  const response = await axios.post(
    `${API_URL}/api/users/set-password`,
    { password },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// reset password
const resetPassword = async (email: string, verificationCode: string, newPassword: string): Promise<any> => {
  const response = await axios.post(`${API_URL}/api/users/reset-password`, { email, verificationCode, newPassword });
  return response.data;
};

// request password reset
const requestPasswordReset = async (email: string): Promise<any> => {
  const response = await fetch(`${API_URL}/api/users/request-password-reset`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error("Failed to request password reset");
  }

  return response.json();
};

// verify email
const verifyEmail = async ({ email, verificationCode }: { email: string; verificationCode: string }): Promise<any> => {
  const response = await axios.post(`${API_URL}/api/users/verify-email`, {
    email,
    verificationCode,
  });
  return response.data;
};

// export the functions
export { loginUser, registerUser, googleLoginUser, setPassword, resetPassword, requestPasswordReset, verifyEmail };

export default {
  loginUser,
  registerUser,
  googleLoginUser,
  setPassword,
  resetPassword,
  requestPasswordReset,
  verifyEmail,
};