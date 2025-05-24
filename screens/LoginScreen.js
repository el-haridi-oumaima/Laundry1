import React, { useState } from 'react'; // Import de React et du hook useState pour gérer l'état local
import {
  View,          // Conteneur de base pour l'interface utilisateur
  Text,          // Composant pour afficher du texte
  TextInput,     // Composant pour les champs de saisie utilisateur
  TouchableOpacity, // Bouton cliquable avec effet tactile
  StyleSheet,    // Pour gérer les styles CSS en JS
  Alert,         // Pour afficher des alertes pop-up à l'utilisateur
} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Pour utiliser des icônes (ici Ionicons)
import { useNavigation } from '@react-navigation/native'; // Pour gérer la navigation entre écrans
import AsyncStorage from '@react-native-async-storage/async-storage';

// Déclaration du composant fonctionnel LoginScreen
export default function LoginScreen() {
  // États locaux pour stocker l'email et le mot de passe saisis
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Récupération de l'objet navigation pour changer d'écran
  const navigation = useNavigation();

  // Fonction appelée lors du clic sur le bouton "Login"
  const handleLogin = async () => {
    // Vérifie que les champs ne sont pas vides
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields'); // Affiche une alerte si un champ est vide
      return; // Arrête la fonction
    }

    try {
      // Envoi d'une requête POST à ton backend Spring Boot pour l'authentification
      const response = await fetch('http://100.72.105.219:8080/api/auth/login', {

        method: 'POST', // Méthode HTTP POST
        headers: {
          'Content-Type': 'application/json', // On précise que le corps est en JSON
        },
        body: JSON.stringify({ email, password }), // Corps de la requête JSON avec email et password
      });

      // Récupère la réponse JSON du backend
      const data = await response.json();

      // Si la connexion a réussi (champ success = true dans la réponse)
      if (data.success) {
        // Stocker clientId en local pour réutilisation dans l'app
        await AsyncStorage.setItem('clientId', data.clientId.toString());

        navigation.navigate('Home'); // Navigue vers l'écran "Home"
      } else {
        // Sinon affiche une alerte avec le message d'erreur retourné
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      // Si une erreur réseau ou autre survient
      console.error('Login error:', error); // Log dans la console
      Alert.alert('Error', 'Something went wrong'); // Affiche une alerte générique
    }
  };

  // JSX qui décrit l'interface utilisateur
  return (
    <View style={styles.container}> {/* Conteneur principal */}
      <Text style={styles.title}>Welcome Back!</Text> {/* Titre de l'écran */}

      {/* Champ de saisie pour l'email avec icône */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#555" />
        <TextInput
          placeholder="Email"           // Texte affiché quand le champ est vide
          style={styles.input}          // Applique le style défini
          value={email}                 // Valeur liée à l'état email
          onChangeText={setEmail}       // Met à jour l'état email à chaque saisie
          keyboardType="email-address" // Clavier optimisé pour saisie email
        />
      </View>

      {/* Champ de saisie pour le mot de passe avec icône */}
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#555" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry               // Cache les caractères saisis (mot de passe)
        />
      </View>

      {/* Bouton cliquable pour lancer la connexion */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>
          Login {/* Texte du bouton */}
          <Ionicons name="arrow-forward" size={16} color="white" /> {/* Icône flèche */}
        </Text>
      </TouchableOpacity>

      {/* Lien vers l'écran d'inscription */}
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles CSS en JS pour les composants
const styles = StyleSheet.create({
  container: {
    paddingTop: 100,       // Espace en haut
    paddingHorizontal: 20, // Marges horizontales
    backgroundColor: '#fff', // Fond blanc
    flex: 1,               // Prend toute la hauteur disponible
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#003b57',      // Couleur bleu foncé
    marginBottom: 30,      // Marge en dessous
    alignSelf: 'center',   // Centre horizontalement
  },
  inputContainer: {
    flexDirection: 'row',  // Aligne icône et input sur la même ligne
    backgroundColor: '#f1f1f1',
    alignItems: 'center',  // Centre verticalement
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,               // Prend tout l'espace restant
    padding: 10,
  },
  button: {
    backgroundColor: '#007AFF', // Bleu vif
    borderRadius: 8,
    paddingVertical: 12,
    marginTop: 10,
    alignItems: 'center',   // Centre le texte du bouton
  },
  buttonText: {
    color: '#fff',          // Texte blanc
    fontSize: 15,
    fontWeight: '600',
  },
  link: {
    marginTop: 15,
    color: '#007AFF',
    textAlign: 'center',
  },
});
