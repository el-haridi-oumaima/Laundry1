import React, { useState } from 'react';
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

// Tous les services disponibles avec icônes, étiquettes et noms officiels
const allServiceOptions = [
  {
    key: 'washing',
    label: 'Washing & Drying - 20 MAD',
    icon: <MaterialCommunityIcons name="washing-machine" size={22} color="#50b8e7" />,
    officialName: 'Washing & Drying',
  },
  {
    key: 'dryCleaning',
    label: 'Dry Cleaning - 25 MAD',
    icon: <MaterialCommunityIcons name="tshirt-crew" size={22} color="#50b8e7" />,
    officialName: 'Dry Cleaning',
  },
  {
    key: 'washingOnly',
    label: 'Washing Only - 15 MAD',
    icon: <MaterialCommunityIcons name="washing-machine" size={22} color="#50b8e7" />,
    officialName: 'Washing Only',
  },
  {
    key: 'ironing',
    label: 'Ironing - 15 MAD',
    icon: <MaterialCommunityIcons name="iron" size={22} color="#50b8e7" />,
    officialName: 'Ironing',
  },
  {
    key: 'express',
    label: 'Express Service - 30 MAD',
    icon: <Ionicons name="flash-outline" size={22} color="#50b8e7" />,
    officialName: 'Express Service',
  },
  {
    key: 'full',
    label: 'All Services - 40 MAD',
    icon: <Ionicons name="sparkles-outline" size={22} color="#50b8e7" />,
    officialName: 'All Services',
  },
  {
    key: 'delivery',
    label: 'Pickup & Delivery - 10 MAD',
    icon: <Ionicons name="bicycle-outline" size={22} color="#50b8e7" />,
    officialName: 'Pickup & Delivery',
  },
];

// Fonction utilitaire pour formater une date
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default function OrderScreen() {
  const route = useRoute();
  const { storeName, providerName, services = [] } = route.params || {};

  // Ne garder que les services disponibles pour ce pressing
  const filteredServices = allServiceOptions.filter(svc =>
    services.includes(svc.officialName)
  );

  // État local des services sélectionnés
  const [selectedServices, setSelectedServices] = useState({});

  // Adresse de ramassage
  const [address, setAddress] = useState('');

  // États pour les dates et les pickers
  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isPickupPickerVisible, setPickupPickerVisible] = useState(false);
  const [isDeliveryPickerVisible, setDeliveryPickerVisible] = useState(false);

  // Indicateur de chargement
  const [loading, setLoading] = useState(false);

  // Sélection / désélection d'un service
  const toggleService = (key) => {
    setSelectedServices(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Fonction de soumission de la commande
  const submitOrder = () => {
    const chosen = Object.keys(selectedServices).filter(k => selectedServices[k]);

    if (!address) {
      alert('Please enter pickup address');
      return;
    }
    if (!pickupDate || !deliveryDate) {
      alert('Please select pickup and delivery dates');
      return;
    }
    if (chosen.length === 0) {
      alert('Please select at least one service');
      return;
    }

    setLoading(true);

    // Simulation d'une confirmation
    setTimeout(() => {
      setLoading(false);
      alert(`Order confirmed for ${storeName}.\nServices: ${chosen.join(', ')}\nPickup: ${formatDate(pickupDate)}\nDelivery: ${formatDate(deliveryDate)}`);
    }, 1500);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{storeName}</Text>
      <Text style={styles.title}>Choose Your Services</Text>

      {/* Affichage des services disponibles */}
      <View style={styles.servicesContainer}>
        {filteredServices.map((item) => (
          <TouchableOpacity
            key={item.key}
            style={[
              styles.serviceCard,
              selectedServices[item.key] && styles.serviceCardSelected,
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

      {/* Adresse */}
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

      {/* Date de ramassage */}
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

      {/* Date de livraison */}
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

      {/* Bouton de validation */}
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

      {/* Modaux de sélection de date */}
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
  subHeader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
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
