import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper'; //bibliothèque UI pour un design plus propre 
import * as ImagePicker from 'expo-image-picker'; //permet de sélectionner des images depuis la galerie du téléphone

export default function LaundryForm() { //creation du composant de formulaire 
    // tous cela se sont des UseState pour stocker les données entrées par l'utilisateur 
    // les hooks useState servent à définir les "variables" qui vont être remplies automatiquement par l'utilisateur via le formulaire
    // utilisation : const [valeurActuelle, fonctionPourMettreÀJour] = React.useState(valeurInitiale);

  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [workHours, setWorkHours] = React.useState('');
  const [services, setServices] = React.useState('');
  const [availability, setAvailability] = React.useState('');
  const [shopImage, setShopImage] = React.useState(null);
  const [licenseImage, setLicenseImage] = React.useState(null);

  // Fonction asynchrone pour sélectionner une image depuis la bibliothèque de l'utilisateur
const pickImage = async (setter) => {
  // Ouvre la bibliothèque d'images avec certaines options
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images, // Autorise uniquement les images
    allowsEditing: true,                             // Permet à l'utilisateur de recadrer l'image
    aspect: [4, 3],                                   // Définit le ratio de recadrage (4:3)
    quality: 1,                                       // Qualité maximale de l'image sélectionnée
  });

  // Vérifie si l'utilisateur n'a pas annulé la sélection
  if (!result.canceled) {
    // Appelle la fonction setter avec l'URI de l'image choisie
    setter(result.assets[0].uri);
  }
};


  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Fill your informations</Text>

     <TextInput
  label="Name of the laundry"     // Label affiché dans le champ de texte
  value={name}                    // Valeur actuelle du champ (lié à l'état `name`)
  onChangeText={setName}          // Fonction appelée à chaque changement de texte
  mode="outlined"                 // Style du champ (bordure extérieure visible)
  style={styles.input}            // Style personnalisé défini dans un objet `styles`
  theme={{ roundness: 12 }}       // Personnalisation du thème, ici les coins arrondis
/>


      <TextInput
        label="Adresse"
        value={address}
        onChangeText={setAddress}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 12 }}
      />

      <TextInput
        label="Work Hours"
        value={workHours}
        onChangeText={setWorkHours}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 12 }}
      />

      <TextInput
        label="Services you provide"
        value={services}
        onChangeText={setServices}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 12 }}
      />

      <TextInput
        label="Availability"
        value={availability}
        onChangeText={setAvailability}
        mode="outlined"
        style={styles.input}
        theme={{ roundness: 12 }}
      />

      <Text style={styles.label}>Shop Images</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage(setShopImage)}>
        {shopImage ? (
          <Image source={{ uri: shopImage }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.uploadText}>Upload the images here</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.label}>License picture</Text>
      <TouchableOpacity style={styles.imageUpload} onPress={() => pickImage(setLicenseImage)}>
        {licenseImage ? (
          <Image source={{ uri: licenseImage }} style={styles.uploadedImage} />
        ) : (
          <Text style={styles.uploadText}>Upload the image here</Text>
        )}
      </TouchableOpacity>

      <Button
        mode="contained"
        onPress={() => console.log('Submitted')}
        style={styles.button}
        contentStyle={{ paddingVertical: 8 }}
        labelStyle={{ fontSize: 16 }}
      >
        Confirm
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  header: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#f5f7fa',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    marginTop: 10,
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#9db2ce',
    borderRadius: 12,
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f5f7fa',
  },
  uploadText: {
    color: '#555',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#1e4ed4',
    borderRadius: 12,
  },
});
