import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tous les services disponibles avec icônes, étiquettes et noms officiels
const allServiceOptions = [
  { key: 'washing',    label: 'Washing & Drying - 20 MAD', icon: <MaterialCommunityIcons name="washing-machine" size={22} color="#50b8e7" />, officialName: 'Washing & Drying' },
  { key: 'dryCleaning',label: 'Dry Cleaning - 25 MAD',     icon: <MaterialCommunityIcons name="tshirt-crew" size={22} color="#50b8e7" />,     officialName: 'Dry Cleaning' },
  { key: 'washingOnly',label: 'Washing Only - 15 MAD',      icon: <MaterialCommunityIcons name="washing-machine" size={22} color="#50b8e7" />, officialName: 'Washing Only' },
  { key: 'ironing',    label: 'Ironing - 15 MAD',           icon: <MaterialCommunityIcons name="iron" size={22} color="#50b8e7" />,    officialName: 'Ironing' },
  { key: 'express',    label: 'Express Service - 30 MAD',   icon: <Ionicons name="flash-outline" size={22} color="#50b8e7" />,          officialName: 'Express Service' },
  { key: 'full',       label: 'All Services - 40 MAD',      icon: <Ionicons name="sparkles-outline" size={22} color="#50b8e7" />,       officialName: 'All Services' },
];

// Formatte une date pour affichage
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' +
         d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function OrderScreen() {
  const route = useRoute();
  const {
    storeName,
    services = [],    // la liste des noms officiels passés depuis HomeScreen
    laundryId,        // l’ID du pressing
  } = route.params || {};

  // On ne garde que les services proposés par ce pressing
  const availableServices = allServiceOptions.filter(svc =>
    services.includes(svc.officialName)
  );

  // États locaux
  const [selected, setSelected] = useState({});    // { washing: true, ironing: false, ... }
  const [address, setAddress] = useState('');
  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [showPickup, setShowPickup] = useState(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [loading, setLoading] = useState(false);

  // Nouveau : état clientId
  const [clientId, setClientId] = useState(null);

  // Récupérer le clientId depuis AsyncStorage au montage
  useEffect(() => {
    AsyncStorage.getItem('clientId')
      .then(id => {
        if (id) setClientId(Number(id));
      })
      .catch(console.error);
  }, []);

  // Toggle sélection d'un service
  const toggleService = key => {
    setSelected(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Soumission de la commande
  const submitOrder = async () => {
    if (clientId === null) {
      alert('Chargement des données utilisateur…');
      return;
    }

    const chosenKeys = Object.keys(selected).filter(k => selected[k]);
    if (!address || !pickupDate || !deliveryDate || chosenKeys.length === 0) {
      alert('Merci de remplir tous les champs');
      return;
    }

    // Construit la liste des noms officiels à envoyer
    const chosenServices = chosenKeys.map(key => {
      const svc = allServiceOptions.find(s => s.key === key);
      return svc.officialName;
    });

    const payload = {
      clientId,                        // ID du client connecté
      laundryId,                       // ID du pressing
      address,
      pickupDate: pickupDate.toISOString().slice(0,19),
      deliveryDate: deliveryDate.toISOString().slice(0,19),
      services: chosenServices,        // ex. ["Washing & Drying","Ironing"]
      // status, createdAt, updatedAt gérés côté backend
    };

    try {
      setLoading(true);
      const res = await fetch('http://192.168.43.107:8080/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      alert(`Commande créée (ID ${data.orderId}) !`);
    } catch (e) {
      console.error(e);
      alert('Erreur réseau ou serveur, réessaye plus tard.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{storeName}</Text>
      <Text style={styles.title}>Choose Your Services</Text>

      <View style={styles.servicesContainer}>
        {availableServices.map(item => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.serviceCard,
              selected[item.key] && styles.serviceCardSelected
            ]}
            onPress={() => toggleService(item.key)}
            activeOpacity={0.7}
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
          placeholder="Enter pickup address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <Ionicons name="home-outline" size={20} color="#50b8e7" />
      </View>

      <Text style={styles.label}>Pickup Time:</Text>
      <TouchableOpacity style={styles.inputRow} onPress={() => setShowPickup(true)}>
        <Text style={styles.input}>{formatDate(pickupDate) || 'dd/mm/yyyy --:--'}</Text>
        <Ionicons name="calendar-outline" size={20} color="#50b8e7" />
      </TouchableOpacity>

      <Text style={styles.label}>Delivery Time:</Text>
      <TouchableOpacity style={styles.inputRow} onPress={() => setShowDelivery(true)}>
        <Text style={styles.input}>{formatDate(deliveryDate) || 'dd/mm/yyyy --:--'}</Text>
        <Ionicons name="calendar-outline" size={20} color="#50b8e7" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.7 }]}
        onPress={submitOrder}
        disabled={loading}
      >
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Confirm & Proceed</Text>
        }
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showPickup}
        mode="datetime"
        onConfirm={date => { setPickupDate(date); setShowPickup(false); }}
        onCancel={() => setShowPickup(false)}
      />
      <DateTimePickerModal
        isVisible={showDelivery}
        mode="datetime"
        onConfirm={date => { setDeliveryDate(date); setShowDelivery(false); }}
        onCancel={() => setShowDelivery(false)}
      />
    </ScrollView>
  );
}

// Styles de la page
const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
    textAlign: 'center',
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
