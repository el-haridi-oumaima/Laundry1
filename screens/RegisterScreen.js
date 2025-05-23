import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert('Error', 'All fields are required');
    return;
  }

  try {
    const response = await fetch('http://100.72.105.219:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },

      body: JSON.stringify({ name, email, password }), // ← nom ajouté ici

    });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Success', data.message);

      navigation.navigate('Home'); // ← redirection vers Home

    } else {
      Alert.alert('Registration Failed', data.message);
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Error', 'An error occurred while registering');
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#555" />
        <TextInput
          placeholder="Full Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" />
        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#555" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>
          Register <Ionicons name="arrow-forward" size={16} color="white" />
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003b57',
    marginBottom: 30,
    alignSelf: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    color: '#007AFF',
    textAlign: 'center',
  },

});


