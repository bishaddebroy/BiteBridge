import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { registerUser } from '../../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);

  const handleRegister = async () => {
    // Basic validation
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const userData = {
        name,
        phone,
        createdAt: new Date(),
      };
      
      await registerUser(email, password, userData);
      Alert.alert('Success', 'Account created successfully');
      // Navigation is handled by AuthContext
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Registration Failed', error.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerSubtitle}>Fill in your details to register</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          label="Full Name*"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email*"
          value={email}
          onChangeText={setEmail}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Phone Number"
          value={phone}
          onChangeText={setPhone}
          mode="outlined"
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TextInput
          label="Password*"
          value={password}
          onChangeText={setPassword}
          mode="outlined"
          secureTextEntry={secureTextEntry}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye-off" : "eye"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />

        <TextInput
          label="Confirm Password*"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          mode="outlined"
          secureTextEntry={secureConfirmTextEntry}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={secureConfirmTextEntry ? "eye-off" : "eye"}
              onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
            />
          }
        />

        <Text style={styles.requiredText}>* Required fields</Text>

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading}
          style={styles.registerButton}
        >
          Register
        </Button>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    marginTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    padding: 20,
    paddingTop: 0,
  },
  input: {
    marginBottom: 16,
  },
  requiredText: {
    color: '#666',
    marginBottom: 20,
    fontSize: 12,
  },
  registerButton: {
    paddingVertical: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 30,
  },
  loginText: {
    color: '#333',
  },
  loginLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;