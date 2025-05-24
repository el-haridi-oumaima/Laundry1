import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image, SafeAreaView, StatusBar, Modal, FlatList } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Upload, ArrowLeft, Check } from 'lucide-react-native';

export default function FormulaireInscription() {
  const navigation = useNavigation();
  
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [workHours, setWorkHours] = React.useState('');
  const [services, setServices] = React.useState([]); // Changed to array for multiple selection
  const [availability, setAvailability] = React.useState('');
  const [shopImage, setShopImage] = React.useState(null);
  const [licenseImage, setLicenseImage] = React.useState(null);
  const [email, setEmail] = React.useState('');

  
  // Modal states for dropdowns
  const [showWorkHoursModal, setShowWorkHoursModal] = React.useState(false);
  const [showServicesModal, setShowServicesModal] = React.useState(false);
  const [showAvailabilityModal, setShowAvailabilityModal] = React.useState(false);

  // Dropdown options
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

  // Fonction asynchrone pour sélectionner une image depuis la bibliothèque de l'utilisateur
  const pickImage = async (setter) => {
    try {
      // Demander les permissions d'abord
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }

      // Ouvre la bibliothèque d'images avec certaines options
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fixed deprecated MediaTypeOptions
        allowsEditing: true,                             // Permet à l'utilisateur de recadrer l'image
        aspect: [4, 3],                                   // Définit le ratio de recadrage (4:3)
        quality: 1,                                       // Qualité maximale de l'image sélectionnée
      });

      console.log('Image picker result:', result);

      // Vérifie si l'utilisateur n'a pas annulé la sélection
      if (!result.canceled && result.assets && result.assets.length > 0) {
        // Appelle la fonction setter avec l'URI de l'image choisie
        console.log('Setting image URI:', result.assets[0].uri);
        setter(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error picking image: ' + error.message);
    }
  };

  // Fonction pour soumettre le formulaire et naviguer vers la page d'accueil
  const handleSubmit = () => {
    console.log('Submitted form data:', {
      name,
      address,
      workHours,
      services: services.join(', '), // Convert array to string for logging
      availability,
      shopImage: shopImage ? 'Image uploaded' : 'No image',
      licenseImage: licenseImage ? 'Image uploaded' : 'No image',
    });
    
    // Navigation vers la page d'accueil après soumission
    navigation.navigate('homeScreen'); // Fixed navigation name
  };

  const goBack = () => {
    navigation.goBack();
  };

  // Dropdown selection handlers
  const selectWorkHours = (option) => {
    setWorkHours(option);
    setShowWorkHoursModal(false);
  };

  // Modified for multiple selection
  const toggleService = (option) => {
    setServices(prevServices => {
      if (prevServices.includes(option)) {
        return prevServices.filter(service => service !== option);
      } else {
        return [...prevServices, option];
      }
    });
  };

  const selectAvailability = (option) => {
    setAvailability(option);
    setShowAvailabilityModal(false);
  };

  // Render dropdown modal for single selection
  const renderDropdownModal = (visible, onClose, options, onSelect, title) => (
    <Modal
      visible={visible}
      transparent={true}
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

  // Render services modal for multiple selection
  const renderServicesModal = () => (
    <Modal
      visible={showServicesModal}
      transparent={true}
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
                style={[
                  styles.modalOption,
                  services.includes(item) && styles.selectedOption
                ]}
                onPress={() => toggleService(item)}
              >
                <Text style={[
                  styles.modalOptionText,
                  services.includes(item) && styles.selectedOptionText
                ]}>
                  {item}
                </Text>
                {services.includes(item) && (
                  <Check size={20} color="#1e4ed4" />
                )}
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
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Fill your informations</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Name Input - Custom styled to match dropdowns */}
        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={name ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Name of the laundry
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
            />
          </View>
        </View>

        {/* Address Input - Custom styled to match dropdowns */}
        <View style={styles.dropdownButton}>
          <View style={styles.dropdownContent}>
            <Text style={address ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Adresse
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
            />
          </View>
        </View>
        {/* Email Input */}
<View style={styles.dropdownButton}>
  <View style={styles.dropdownContent}>
    <Text style={email ? styles.dropdownLabelActive : styles.dropdownLabel}>
      Email
    </Text>
    <TextInput
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      autoCorrect={false}
      style={styles.customTextInput}
      placeholder=""
      underlineColor="transparent"
      activeUnderlineColor="transparent"
      selectionColor="#1e4ed4"
      cursorColor="#1e4ed4"
      theme={{ colors: { background: 'transparent', primary: '#1e4ed4' } }}
    />
  </View>
</View>

        {/* Work Hours Dropdown */}
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setShowWorkHoursModal(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={workHours ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Work Hours
            </Text>
            <Text style={workHours ? styles.dropdownValueText : styles.dropdownPlaceholder}>
              {workHours || ''}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Services Dropdown */}
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setShowServicesModal(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={services.length > 0 ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Services you provide
            </Text>
            <Text style={services.length > 0 ? styles.dropdownValueText : styles.dropdownPlaceholder}>
              {services.length > 0 ? services.join(', ') : ''}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Availability Dropdown */}
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setShowAvailabilityModal(true)}
        >
          <View style={styles.dropdownContent}>
            <Text style={availability ? styles.dropdownLabelActive : styles.dropdownLabel}>
              Availability
            </Text>
            <Text style={availability ? styles.dropdownValueText : styles.dropdownPlaceholder}>
              {availability || ''}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Shop Images */}
        <Text style={styles.label}>Shop Images</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage(setShopImage)}>
          {shopImage ? (
            <Image source={{ uri: shopImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadContent}>
              <Upload size={24} color="#8E8E93" />
              <Text style={styles.uploadText}>Upload the images here</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* License picture */}
        <Text style={styles.label}>License picture</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage(setLicenseImage)}>
          {licenseImage ? (
            <Image source={{ uri: licenseImage }} style={styles.uploadedImage} />
          ) : (
            <View style={styles.uploadContent}>
              <Upload size={24} color="#8E8E93" />
              <Text style={styles.uploadText}>Upload the image here</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Confirm Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.confirmButton}
          contentStyle={{ paddingVertical: 8 }}
          labelStyle={{ fontSize: 16 }}
        >
          Confirm
        </Button>
      </ScrollView>

      {/* Dropdown Modals */}
      {renderDropdownModal(
        showWorkHoursModal,
        () => setShowWorkHoursModal(false),
        workHoursOptions,
        selectWorkHours,
        'Select Work Hours'
      )}
      
      {renderServicesModal()}
      
      {renderDropdownModal(
        showAvailabilityModal,
        () => setShowAvailabilityModal(false),
        availabilityOptions,
        selectAvailability,
        'Select Availability'
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#1e4ed4', // Changed to blue
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#f5f7fa',
    minHeight: 56,
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  dropdownLabelActive: {
    fontSize: 12,
    color: '#1e4ed4', // Changed to blue
    marginBottom: 2,
  },
  dropdownValueText: {
    fontSize: 16,
    color: '#000',
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#999',
  },
  customTextInput: {
    backgroundColor: 'transparent',
    paddingHorizontal: 0,
    paddingVertical: 0,
    fontSize: 16,
    height: 24,
    marginTop: 2,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 5,
    color: '#000',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#1e4ed4', // Changed to blue
    borderRadius: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f7fa',
  },
  uploadContent: {
    alignItems: 'center',
  },
  uploadText: {
    color: '#555',
    fontSize: 14,
    marginTop: 8,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  confirmButton: {
    marginTop: 10,
    backgroundColor: '#1e4ed4',
    borderRadius: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e4ed4', // Blue accent color
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalOptionText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  selectedOption: {
    backgroundColor: '#f0f8ff', // Light blue background for selected items
  },
  selectedOptionText: {
    color: '#1e4ed4', // Blue text for selected items
    fontWeight: '600',
  },
  modalCloseButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 16,
    color: '#666',
  },
  modalDoneButton: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#1e4ed4', // Blue background for done button
    borderRadius: 8,
    alignItems: 'center',
  },
  modalDoneText: {
    fontSize: 16,
    color: '#fff', // White text
    fontWeight: '600',
  },
});