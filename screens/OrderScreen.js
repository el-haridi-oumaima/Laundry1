import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, CheckBox, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

export default function OrderScreen() {
  const [address, setAddress] = useState('');
  const [services, setServices] = useState({
    washing: false,
    ironing: false,
    drying: false,
    full: false,
  });

  const [pickupDate, setPickupDate] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState(null);
  const [isPickupPickerVisible, setPickupPickerVisible] = useState(false);
  const [isDeliveryPickerVisible, setDeliveryPickerVisible] = useState(false);

  const formatDate = (date) =>
    date ? date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Services</Text>

      {[
        { key: 'washing', label: 'Washing - 20 MAD' },
        { key: 'ironing', label: 'Ironing - 15 MAD' },
        { key: 'drying', label: 'Drying - 10 MAD' },
        { key: 'full', label: 'Full Package - 40 MAD' },
      ].map((item) => (
        <View style={styles.checkboxRow} key={item.key}>
          <CheckBox
            value={services[item.key]}
            onValueChange={(value) => setServices({ ...services, [item.key]: value })}
          />
          <Text style={styles.checkboxLabel}>{item.label}</Text>
        </View>
      ))}

      <Text style={styles.subtitle}>Schedule</Text>

      <Text style={styles.label}>Your Address:</Text>
      <View style={styles.inputRow}>
        <TextInput
          placeholder="Enter Your Pickup Address"
          style={styles.input}
          value={address}
          onChangeText={setAddress}
        />
        <Ionicons name="home-outline" size={20} color="#aaa" />
      </View>

      <Text style={styles.label}>Pickup Time:</Text>
      <TouchableOpacity style={styles.inputRow} onPress={() => setPickupPickerVisible(true)}>
        <Text style={styles.input}>{formatDate(pickupDate) || 'dd/mm/yyyy --:--'}</Text>
        <Ionicons name="calendar-outline" size={20} color="#aaa" />
      </TouchableOpacity>

      <Text style={styles.label}>Delivery Time:</Text>
      <TouchableOpacity style={styles.inputRow} onPress={() => setDeliveryPickerVisible(true)}>
        <Text style={styles.input}>{formatDate(deliveryDate) || 'dd/mm/yyyy --:--'}</Text>
        <Ionicons name="calendar-outline" size={20} color="#aaa" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Confirm & Go to Payment</Text>
      </TouchableOpacity>

      {/* Date Pickers */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontWeight: '600',
    marginTop: 10,
    marginBottom: 5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxLabel: {
    marginLeft: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 6,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
});
