import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';

export default function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isAgree, setIsAgree] = useState(false);

  const handlePayment = () => {
    if (isAgree) {
      alert('Payment Confirmed');
    } else {
      alert('You must agree to the terms and conditions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Details</Text>

      <Text style={styles.label}>Payment Method</Text>
      <View style={styles.paymentMethodRow}>
        <TouchableOpacity
          style={[styles.paymentMethodButton, paymentMethod === 'creditCard' && styles.selected]}
          onPress={() => setPaymentMethod('creditCard')}
        >
          <Ionicons name="card-outline" size={18} color={paymentMethod === 'creditCard' ? '#fff' : '#50b8e7'} />
          <Text style={[styles.paymentMethodText, paymentMethod === 'creditCard' && styles.paymentMethodTextSelected]}>
            Credit Card
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentMethodButton, paymentMethod === 'cash' && styles.selected]}
          onPress={() => setPaymentMethod('cash')}
        >
          <Ionicons name="cash-outline" size={18} color={paymentMethod === 'cash' ? '#fff' : '#50b8e7'} />
          <Text style={[styles.paymentMethodText, paymentMethod === 'cash' && styles.paymentMethodTextSelected]}>
            Cash
          </Text>
        </TouchableOpacity>
      </View>

      {paymentMethod === 'creditCard' && (
        <>
          <Text style={styles.label}>Card Number</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter your card number"
              keyboardType="numeric"
              value={cardNumber}
              onChangeText={setCardNumber}
            />
            <Ionicons name="card-outline" size={20} color="#50b8e7" />
          </View>

          <Text style={styles.label}>Expiry Date</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              keyboardType="numeric"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
            <Ionicons name="calendar-outline" size={20} color="#50b8e7" />
          </View>

          <Text style={styles.label}>CVV</Text>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="CVV"
              keyboardType="numeric"
              value={cvv}
              onChangeText={setCvv}
            />
            <Ionicons name="shield-checkmark-outline" size={20} color="#50b8e7" />
          </View>
        </>
      )}

      <View style={styles.checkboxRow}>
        <Checkbox
          status={isAgree ? 'checked' : 'unchecked'}
          onPress={() => setIsAgree(!isAgree)}
          color="#50b8e7"
        />
        <Text style={styles.checkboxLabel}>I agree to the terms and conditions</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handlePayment}>
        <Text style={styles.buttonText}>Confirm Payment</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#ffffff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#50b8e7',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: '600',
    color: 'rgb(0, 68, 146)',
    marginTop: 12,
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'rgb(159, 215, 243)',
    backgroundColor: 'rgb(245, 253, 255)',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#003b57',
  },
  paymentMethodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  paymentMethodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    margin: 4,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#b9e2f5',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '600',
    color: ' #50b8e7',
  },
  paymentMethodTextSelected: {
    color: ' #ffffff',
  },
  selected: {
    backgroundColor: '#50b8e7',
    borderColor: ' #50b8e7',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    color: ' #003b57',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
