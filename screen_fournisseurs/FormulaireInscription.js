import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, SafeAreaView, StatusBar, Modal, FlatList, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Upload, ArrowLeft, Check } from 'lucide-react-native';

export default function FormulaireInscription() {
  const navigation = useNavigation();
  
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [workHours, setWorkHours] = React.useState('');
  const [services, setServices] = React.useState([]); 
  const [availability, setAvailability] = React.useState('');
  const [shopImage, setShopImage] = React.useState(null);
  const [licenseImage, setLicenseImage] = React.useState(null);
  const [email, setEmail] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Modal states for dropdowns
  const [showWorkHoursModal, setShowWorkHoursModal] = React.useState(false);
  const [showServicesModal, setShowServicesModal] = React.useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = React.useState(false);

  const workHoursOptions = [
    '8:00 AM - 6:00 PM',
    '9:00 AM - 7:00 PM',
    '7:00 AM - 8:00 PM',
    '24/7',
    '8:00 AM - 5:00 PM',
    '10:00 AM - 6:00 PM'
  ];

  const servicesOptions = [
    'Washing & Drying',
    'Dry Cleaning',
    'Ironing',
    'Washing Only',
    'Express Service',
    'Pickup & Delivery',
    'All Services'
  ];

  const availabilityOptions = [
    'Available Now',
    'Available Tomorrow',
    'Available This Week',
    'Busy - Next Week',
    'Available Weekends Only',
    'Custom Schedule'
  ];

  const pickImage = async (setter) => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert("Permission to access camera roll is required!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setter(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image: ' + error.message);
    }
  };

  // Upload image as base64 string to backend
  const convertUriToBase64 = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
  // Client-side validation
  if (!name || !address || !workHours || services.length === 0 || !availability || !email) {
    Alert.alert('Error', 'Please fill all required fields before submitting.');
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert('Error', 'Please enter a valid email address.');
    return;
  }

  setIsSubmitting(true);

  try {
    // Convert images to base64 if available
    let shopImageBase64 = null;
    let licenseImageBase64 = null;

    if (shopImage) {
      shopImageBase64 = await convertUriToBase64(shopImage);
    }
    if (licenseImage) {
      licenseImageBase64 = await convertUriToBase64(licenseImage);
    }

    const formData = {
      name: name.trim(),
      address: address.trim(),
      workHours,
      services,
      availability,
      email: email.trim().toLowerCase(),
      shopImage: shopImageBase64,
      licenseImage: licenseImageBase64,
    };

    console.log('Sending form data:', { ...formData, shopImage: shopImage ? 'base64_data' : null, licenseImage: licenseImage ? 'base64_data' : null });

    // Option 1: Basic Authentication (replace with your actual credentials)
    const username = 'your_username'; // Replace with actual username
    const password = 'your_password'; // Replace with actual password
    const basicAuth = 'Basic ' + btoa(username + ':' + password);

    // Option 2: Bearer Token (if you're using JWT or API key)
    // const bearerToken = 'Bearer your_api_token_here';

    const response = await fetch('http://192.168.1.107:8080/api/laundry/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': basicAuth, // Use basicAuth or bearerToken
        // Add any other required headers your backend expects
        'Accept': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    let responseData;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        const textResponse = await response.text();
        console.log('Raw response:', textResponse);
        responseData = { success: response.ok, message: textResponse || 'Unknown error occurred' };
      }
    } else {
      // Handle non-JSON response
      const textResponse = await response.text();
      console.log('Non-JSON response:', textResponse);
      responseData = { success: response.ok, message: textResponse || 'Unknown error occurred' };
    }

    // In your FormulaireInscription.js, update the success alert:
if (response.ok && responseData.success) {
  Alert.alert(
    'Registration Successful!', 
    'Your registration has been submitted successfully! A temporary password has been sent to your email address. Please check your email and use it to activate your account.',
    [
      {
        text: 'OK',
        onPress: () => navigation.navigate('ActivateAccount', { 
          email: email.trim().toLowerCase() // Make sure to pass the email
        })
      }
    ]
  );
} else {
  Alert.alert('Registration Failed', responseData.message || 'Something went wrong. Please try again.');
}
  } catch (error) {
    console.error('Submission error:', error);
    Alert.alert('Error', 'Network error occurred. Please check your connection and try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  const goBack = () => {
    navigation.goBack();
  };

  const selectWorkHours = (option) => {
    setWorkHours(option);
    setShowWorkHoursModal(false);
  };

  const toggleService = (option) => {
    setServices(prev => prev.includes(option) ? prev.filter(s => s !== option) : [...prev, option]);
  };

  const selectAvailability = (option) => {
    setAvailability(option);
    setShowAvailabilityModal(false);
  };

  const renderDropdownModal = (visible, onClose, options, onSelect, title) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={options}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => onSelect(item)}
              >
                <Text style={styles.modalOptionText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
            <Text style={styles.modalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderServicesModal = () => (
    <Modal
      visible={showServicesModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowServicesModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Services</Text>
          <FlatList
            data={servicesOptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.modalOption, services.includes(item) && styles.selectedOption]}
                onPress={() => toggleService(item)}
              >
                <Text style={[styles.modalOptionText, services.includes(item) && styles.selectedOptionText]}>
                  {item}
                </Text>
                {services.includes(item) && <Check size={20} color="#1e4ed4" />}
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalDoneButton}
            onPress={() => setShowServicesModal(false)}
          >
            <Text style={styles.modalDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill your informations</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={name ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Name of the laundry *
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.customTextInput}
              placeholder=""
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              editable={!isSubmitting}
            />
          </View>
        </View>

        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={address ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Address *
            </Text>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.customTextInput}
              placeholder=""
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              editable={!isSubmitting}
            />
          </View>
        </View>

        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={workHours ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Work hours *
            </Text>
            <TouchableOpacity
              style={styles.customTextInput}
              onPress={() => !isSubmitting && setShowWorkHoursModal(true)}
              disabled={isSubmitting}
            >
              <Text style={workHours ? styles.dropdownLabelActive : styles.dropdownLabel}>
                {workHours || 'Select work hours'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={services.length ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Services *
            </Text>
            <TouchableOpacity
              style={styles.customTextInput}
              onPress={() => !isSubmitting && setShowServicesModal(true)}
              disabled={isSubmitting}
            >
              <Text style={services.length ? styles.dropdownLabelActive : styles.dropdownLabel}>
                {services.length > 0 ? services.join(', ') : 'Select services'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={availability ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Availability *
            </Text>
            <TouchableOpacity
              style={styles.customTextInput}
              onPress={() => !isSubmitting && setShowAvailabilityModal(true)}
              disabled={isSubmitting}
            >
              <Text style={availability ? styles.dropdownLabelActive : styles.dropdownLabel}>
                {availability || 'Select availability'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={email ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Email *
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.customTextInput}
              keyboardType="email-address"
              placeholder=""
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#1e4ed4"
              cursorColor="#1e4ed4"
              theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Upload Shop Image */}
        <TouchableOpacity
          onPress={() => !isSubmitting && pickImage(setShopImage)}
          style={[styles.imageUploadButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Upload size={28} color={isSubmitting ? "#ccc" : "#1e4ed4"} />
          <Text style={[styles.imageUploadText, isSubmitting && styles.disabledText]}>Upload Shop Image</Text>
        </TouchableOpacity>
        {shopImage && <Image source={{ uri: shopImage }} style={styles.uploadedImage} />}

        {/* Upload License Image */}
        <TouchableOpacity
          onPress={() => !isSubmitting && pickImage(setLicenseImage)}
          style={[styles.imageUploadButton, isSubmitting && styles.disabledButton]}
          disabled={isSubmitting}
        >
          <Upload size={28} color={isSubmitting ? "#ccc" : "#1e4ed4"} />
          <Text style={[styles.imageUploadText, isSubmitting && styles.disabledText]}>Upload License Image</Text>
        </TouchableOpacity>
        {licenseImage && <Image source={{ uri: licenseImage }} style={styles.uploadedImage} />}

        <Button
          mode="contained"
          style={[styles.submitButton, isSubmitting && styles.disabledSubmitButton]}
          labelStyle={{ fontWeight: 'bold' }}
          onPress={handleSubmit}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>

        <Text style={styles.requiredNote}>* Required fields</Text>

      </ScrollView>

      {renderDropdownModal(showWorkHoursModal, () => setShowWorkHoursModal(false), workHoursOptions, selectWorkHours, 'Select Work Hours')}
      {renderServicesModal()}
      {renderDropdownModal(showAvailabilityModal, () => setShowAvailabilityModal(false), availabilityOptions, selectAvailability, 'Select Availability')}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
  },
  backButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingTop: 20,
    paddingBottom: 50,
  },
  dropdownButton: {
    marginBottom: 15,
  },
  dropdownContent: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 4,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#888',
  },
  dropdownLabelActive: {
    fontSize: 12,
    color: '#1e4ed4',
    fontWeight: 'bold',
  },
  customTextInput: {
    paddingVertical: 6,
    fontSize: 16,
    color: '#000',
  },
  imageUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  imageUploadText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1e4ed4',
    fontWeight: 'bold',
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    color: '#ccc',
  },
  uploadedImage: {
    width: 150,
    height: 100,
    marginTop: 5,
    borderRadius: 5,
    resizeMode: 'cover',
  },
  submitButton: {
    marginTop: 25,
    paddingVertical: 8,
  },
  disabledSubmitButton: {
    opacity: 0.6,
  },
  requiredNote: {
    marginTop: 10,
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  modalOption: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalOptionText: {
    fontSize: 16,
  },
  selectedOption: {
    backgroundColor: '#dbeafe',
  },
  selectedOptionText: {
    color: '#1e4ed4',
    fontWeight: 'bold',
  },
  modalCloseButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#555',
  },
  modalDoneButton: {
    padding: 15,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#1e4ed4',
  },
  modalDoneText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
});