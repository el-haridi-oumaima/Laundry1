import React, { useState, useEffect } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from '@react-navigation/native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OrderScreen() {
  const navigation = useNavigation();

  const [address, setAddress] = useState('');
  const [clientId, setClientId] = useState(null);
  const [services, setServices] = useState({
    washing: false,
    ironing: false,
    drying: false,
    delivery: false,
    full: false,
  });

  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isPickupPickerVisible, setPickupPickerVisible] = useState(false);
  const [isDeliveryPickerVisible, setDeliveryPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  // Récupération du clientId depuis AsyncStorage au montage du composant
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const storedClientId = await AsyncStorage.getItem('clientId');
        if (storedClientId !== null) {
          setClientId(JSON.parse(storedClientId)); // si c'est un nombre ou objet JSON
        } else {
          Alert.alert('Erreur', "Client non connecté");
        }
      } catch (error) {
        Alert.alert('Erreur', 'Impossible de récupérer l’identifiant client');
      }
    };
    fetchClientId();
  }, []);

  const formatDate = (date) =>
    date
      ? date.toLocaleDateString() +
        ' ' +
        date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';

  const serviceOptions = [
    {
      key: 'washing',
      label: 'Washing - 20 MAD',
      icon: (
        <MaterialCommunityIcons name="washing-machine" size={22} color="#50b8e7" />
      ),
    },
    {
      key: 'ironing',
      label: 'Ironing - 15 MAD',
      icon: <MaterialCommunityIcons name="iron" size={22} color="#50b8e7" />,
    },
    {
      key: 'drying',
      label: 'Drying - 10 MAD',
      icon: (
        <MaterialCommunityIcons name="tumble-dryer" size={22} color="#50b8e7" />
      ),
    },
    {
      key: 'delivery',
      label: 'Delivery - 10 MAD',
      icon: <Ionicons name="bicycle-outline" size={22} color="#50b8e7" />,
    },
    {
      key: 'full',
      label: 'Full Package - 40 MAD',
      icon: <Ionicons name="sparkles-outline" size={22} color="#50b8e7" />,
    },
  ];

  const submitOrder = async () => {
    if (!address.trim()) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse de prise en charge');
      return;
    }
    if (!pickupDate || !deliveryDate) {
      Alert.alert('Erreur', 'Veuillez sélectionner les dates de prise en charge et de livraison');
      return;
    }
    if (
      !services.washing &&
      !services.ironing &&
      !services.drying &&
      !services.delivery &&
      !services.full
    ) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un service');
      return;
    }
    if (!clientId) {
      Alert.alert('Erreur', 'Client non identifié. Veuillez vous reconnecter.');
      return;
    }

    setLoading(true);

    const orderData = {
      clientId: clientId,
      address,
      pickupDate: pickupDate.toISOString(),
      deliveryDate: deliveryDate.toISOString(),
      washing: services.washing || services.full,
      ironing: services.ironing || services.full,
      drying: services.drying || services.full,
      delivery: services.delivery,
      status: 'pending',
    };

    try {
      const response = await fetch('http://100.72.105.219:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la commande');
      }

      const data = await response.json();
      Alert.alert('Succès', 'Commande créée avec succès !');
      navigation.navigate('Payment', { order: data });
    } catch (error) {
      Alert.alert('Erreur', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Choose Your Services</Text>

      <View style={styles.servicesContainer}>
        {serviceOptions.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[styles.serviceCard, services[item.key] && styles.serviceCardSelected]}
            onPress={() => setServices((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
          >
            {item.icon}
            <Text style={styles.serviceText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.subtitle}>Schedule</Text>

      <Text style={styles.label}>Pickup Address:</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter your pickup address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <Ionicons name="home-outline" size={20} color="#50b8e7" />
      </View>

      <Text style={styles.label}>Pickup Time:</Text>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => setPickupPickerVisible(true)}
      >
        <Text style={styles.input}>
          {formatDate(pickupDate) || 'dd/mm/yyyy --:--'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#50b8e7" />
      </TouchableOpacity>

      <Text style={styles.label}>Delivery Time:</Text>
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => setDeliveryPickerVisible(true)}
      >
        <Text style={styles.input}>
          {formatDate(deliveryDate) || 'dd/mm/yyyy --:--'}
        </Text>
        <Ionicons name="calendar-outline" size={20} color="#50b8e7" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={submitOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Confirm & Proceed to Payment</Text>
        )}
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isPickupPickerVisible}
        mode="datetime"
        onConfirm={(date) => {
          setPickupDate(date);
          setPickupPickerVisible(false);
        }}
        onCancel={() => setPickupPickerVisible(false)}
      />
      <DateTimePickerModal
        isVisible={isDeliveryPickerVisible}
        mode="datetime"
        onConfirm={(date) => {
          setDeliveryDate(date);
          setDeliveryPickerVisible(false);
        }}
        onCancel={() => setDeliveryPickerVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#50b8e7',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#50b8e7',
    marginTop: 15,
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    color: '#50b8e7',
    marginTop: 6,
    marginBottom: 4,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    padding: 10,
    marginVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderColor: '#b9e2f5',
    borderWidth: 1,
  },
  serviceCardSelected: {
    backgroundColor: '#84cdee',
    borderColor: '#50b8e7',
  },
  serviceText: {
    flexShrink: 1,
    fontSize: 15,
    color: '#003b57',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#b9e2f5',
    backgroundColor: '#f5fcff',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    minHeight: 44,
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#333',
  },
  button: {
    backgroundColor: '#50b8e7',
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
