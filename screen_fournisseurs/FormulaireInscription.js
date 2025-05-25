import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, SafeAreaView, StatusBar, Modal, FlatList, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Upload, ArrowLeft, Check, ChevronDown } from 'lucide-react-native';

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
    ' Always Available',
    'Available On Monday only',
    'Available On Tuesday only',
    'Available On Wednsday only',
    'Available On Thursday only',
    'Available On Friday only',
    'Available Weekends Only',
    'Available Mon-Tue-Wed',
    'Available Thur-Fri-Weekend',


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

      const response = await fetch('http://192.168.1.107:8080/api/laundry/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth,
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
        const textResponse = await response.text();
        console.log('Non-JSON response:', textResponse);
        responseData = { success: response.ok, message: textResponse || 'Unknown error occurred' };
      }

      if (response.ok && responseData.success) {
        Alert.alert(
          'Registration Successful!', 
          'Your registration has been submitted successfully! A temporary password has been sent to your email address. Please check your email and use it to activate your account.',
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ActivateAccount', { 
                email: email.trim().toLowerCase()
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

  const goToLogin = () => {
    navigation.navigate('FournisseurLoginScreen');
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
                {services.includes(item) && <Check size={20} color="#2563EB" />}
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
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill your informations</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Name Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Name of the laundry</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.textInput}
              placeholder="Enter laundry name"
              placeholderTextColor="#9CA3AF"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#2563EB"
              cursorColor="#2563EB"
              theme={{ 
                colors: { 
                  background: '#FFFFFF', 
                  primary: '#2563EB',
                  text: '#1F2937'
                } 
              }}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Address Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Address</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              value={address}
              onChangeText={setAddress}
              style={styles.textInput}
              placeholder="Enter address"
              placeholderTextColor="#9CA3AF"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#2563EB"
              cursorColor="#2563EB"
              theme={{ 
                colors: { 
                  background: '#FFFFFF', 
                  primary: '#2563EB',
                  text: '#1F2937'
                } 
              }}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Work Hours Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Work Hours</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => !isSubmitting && setShowWorkHoursModal(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.dropdownText, !workHours && styles.placeholderText]}>
              {workHours || 'Select work hours'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Services Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Services you provide</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => !isSubmitting && setShowServicesModal(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.dropdownText, services.length === 0 && styles.placeholderText]}>
              {services.length > 0 ? services.join(', ') : 'Select services'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Availability Dropdown */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Availability</Text>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => !isSubmitting && setShowAvailabilityModal(true)}
            disabled={isSubmitting}
          >
            <Text style={[styles.dropdownText, !availability && styles.placeholderText]}>
              {availability || 'Select availability'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email</Text>
          <View style={styles.textInputWrapper}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.textInput}
              keyboardType="email-address"
              placeholder="Enter email address"
              placeholderTextColor="#9CA3AF"
              underlineColor="transparent"
              activeUnderlineColor="transparent"
              selectionColor="#2563EB"
              cursorColor="#2563EB"
              theme={{ 
                colors: { 
                  background: '#FFFFFF', 
                  primary: '#2563EB',
                  text: '#1F2937'
                } 
              }}
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>
        </View>

        {/* Shop Images Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Shop Images</Text>
          
          <TouchableOpacity
            onPress={() => !isSubmitting && pickImage(setShopImage)}
            style={[styles.imageUploadButton, isSubmitting && styles.disabledButton]}
            disabled={isSubmitting}
          >
            <View style={styles.uploadIcon}>
              <Upload size={24} color="#2563EB" />
            </View>
            <Text style={styles.uploadText}>Upload the images here</Text>
          </TouchableOpacity>
          
          {shopImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: shopImage }} style={styles.uploadedImage} />
            </View>
          )}
        </View>

        {/* License Picture Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>License picture</Text>
          
          <TouchableOpacity
            onPress={() => !isSubmitting && pickImage(setLicenseImage)}
            style={[styles.imageUploadButton, isSubmitting && styles.disabledButton]}
            disabled={isSubmitting}
          >
            <View style={styles.uploadIcon}>
              <Upload size={24} color="#2563EB" />
            </View>
            <Text style={styles.uploadText}>Upload the image here</Text>
          </TouchableOpacity>
          
          {licenseImage && (
            <View style={styles.imagePreviewContainer}>
              <Image source={{ uri: licenseImage }} style={styles.uploadedImage} />
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledSubmitButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Confirm'}
          </Text>
        </TouchableOpacity>

        {/* Already have an account section */}
        <View style={styles.loginSection}>
          <Text style={styles.loginPrompt}>Already have an account?</Text>
          <TouchableOpacity onPress={goToLogin} style={styles.loginLink}>
            <Text style={styles.loginLinkText}>Login</Text>
          </TouchableOpacity>
        </View>

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
    backgroundColor: '#F8FAFC',
    paddingTop :20,
    paddingBottom :20,
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  headerTitle: {
    flex: 1,
    fontWeight: '600',
    fontSize: 18,
    textAlign: 'center',
    color: '#1F2937',
  },
  placeholder: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  inputContainer: {
    marginBottom: 20,
    
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  textInputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  textInput: {
    fontSize: 16,
    color: '#1F2937',
    paddingVertical: 0,
    height: 48,
    backgroundColor: '#FFFFFF',

  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  imageUploadButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.5,
  },
  imagePreviewContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  uploadedImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledSubmitButton: {
    opacity: 0.6,
    shadowOpacity: 0.1,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loginSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  loginPrompt: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 6,
  },
  loginLink: {
    paddingHorizontal: 4,
  },
  loginLinkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: '70%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#1F2937',
    flex: 1,
  },
  selectedOption: {
    backgroundColor: '#EEF2FF',
  },
  selectedOptionText: {
    color: '#2563EB',
    fontWeight: '600',
  },
  modalCloseButton: {
    paddingVertical: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  modalDoneButton: {
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  modalDoneText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});