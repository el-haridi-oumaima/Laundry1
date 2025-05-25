import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function RoleSelectionScreen() {
  const navigation = useNavigation();

  const handleCustomer = () => {
    navigation.navigate('ClientStack');
  };

  const handleOwner = () => {
    navigation.navigate('FournisseurStack');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to LaundryApp</Text>
      <Text style={styles.subtitle}>Choose your role to continue</Text>

      <TouchableOpacity style={styles.card} onPress={handleCustomer} activeOpacity={0.8}>
        <Image source={require('../assets/customer.png')} style={styles.image} />
        <Text style={styles.cardTitle}>I'm a Customer</Text>
        <Text style={styles.cardDesc}>Find and use laundry services</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card} onPress={handleOwner} activeOpacity={0.8}>
        <Image source={require('../assets/laundryowner.jpg')} style={styles.image} />
        <Text style={styles.cardTitle}>I'm a Laundry Owner</Text>
        <Text style={styles.cardDesc}>Manage your laundry business</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#003b57',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 24,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  image: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
    marginBottom: 20,
    borderRadius: 70, // Optionnel : rond ou arrondi
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#003b57',
    marginBottom: 8,
  },
  cardDesc: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    lineHeight: 20,
  },
});
