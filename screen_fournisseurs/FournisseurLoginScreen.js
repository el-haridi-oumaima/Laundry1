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
import AsyncStorage from '@react-native-async-storage/async-storage';

// Récupération de la largeur de l'écran pour adapter les éléments
const { width } = Dimensions.get('window');

export default function LoginScreen() {
  // États pour l'email et le mot de passe
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  // Fonction appelée lors du clic sur le bouton "Login"
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Appel à l'API de login
      const response = await fetch('http://192.168.43.107:8080/api/fournisseur/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Stocker l'identifiant du fournisseur dans le stockage local
        // Changed from data.clientId to data.fournisseurId to match backend response
        await AsyncStorage.setItem('fournisseurId', data.fournisseurId.toString());
        navigation.navigate('homeScreen'); // Redirection vers l'écran Home
      } else {
        Alert.alert('Login failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'An error occurred');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Image d'en-tête locale (à placer dans /assets/images/login-banner.png) */}
        <Image
          source={require('../assets/login-banner.png')}
          style={styles.headerImage}
        />

        {/* Titre de connexion */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Login</Text>
        </View>

        {/* Champ email */}
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

        {/* Champ mot de passe */}
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

        {/* Lien mot de passe oublié */}
        <Text style={styles.forgotText}>Forgot password?</Text>

        {/* Bouton Login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Log in <Ionicons name="arrow-forward" size={16} color="white" /></Text>
        </TouchableOpacity>

        {/* Texte de séparation */}
        <Text style={styles.orText}>Or log in with</Text>

        {/* Icônes des réseaux sociaux */}
        <View style={styles.socialContainer}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios-filled/50/000000/mac-os.png' }}
            style={styles.socialIcon}
          />
          <Image
            source={{ uri: 'https://img.icons8.com/color/48/000000/google-logo.png' }}
            style={styles.socialIcon}
          />
          <Image
            source={{ uri: 'https://img.icons8.com/fluency/48/000000/facebook-new.png' }}
            style={styles.socialIcon}
          />
        </View>
      </View>
    </ScrollView>
  );
}

// Styles de l'écran
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#e6ebf9',
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
  titleContainer: {
    marginTop: -40,
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingVertical: 15,
    paddingHorizontal: 35,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleText: {
    color: 'rgb(54, 172, 226)',
    fontWeight: '700',
    fontSize: 24,
    textAlign: 'center',
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
  },
  forgotText: {
    alignSelf: 'flex-end',
    color: '#007AFF',
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: 'rgb(37, 164, 238)',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    color: '#888',
    marginBottom: 10,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  socialIcon: {
    width: 40,
    height: 40,
    marginHorizontal: 10,
  },
});