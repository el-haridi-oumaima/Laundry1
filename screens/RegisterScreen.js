import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

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
      const response = await fetch('http://100.72.107.23:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message);
        navigation.navigate('Home');
      } else {
        Alert.alert('Registration Failed', data.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while registering');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Image header */}
        <Image
          source={require('../assets/login-banner.png')}
          style={styles.headerImage}
        />

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.inactiveTab}>
            <Text style={styles.tabTextInactive}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.activeTab}>
            <Text style={styles.tabTextActive}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Full Name */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#555" />
          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#555" />
          <TextInput
            placeholder="Email"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
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

        {/* Register Button */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerText}>
            Register <Ionicons name="arrow-forward" size={16} color="white" />
          </Text>
        </TouchableOpacity>

        {/* Already have account */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#e6ebf9', // comme LoginScreen
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  headerImage: {
    width: width,
    height: 280,
    resizeMode: 'cover',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: -40,
    backgroundColor: '#fff',
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 20,
  },
  activeTab: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: 'rgb(54, 172, 226)',
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 35,
    backgroundColor: '#f0f0f0',
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  tabTextInactive: {
    color: '#003b57',
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: 15,
  },
  registerButton: {
    backgroundColor: 'rgb(37, 164, 238)',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  registerText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#007AFF',
    textAlign: 'center',
  },
});
