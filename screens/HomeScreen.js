import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Données locales de démonstration (au cas où le fetch distant échoue)
const DATA = [
  {
    id: 'local-11',
    name: 'Pressing IK SEC Souissi',
    location: 'Av. Malak 10000',
    time: '8:00am - 6:30pm',
    day: 'Sunday Closed',
    rating: 4.5,
    image: require('../assets/ksec.png'),
  },
  {
    id: 'local-22',
    name: 'So Clean Pressing',
    location: 'Rue 118',
    time: '8:30am - 7:00pm',
    day: 'Sunday',
    rating: 4.0,
    image: require('../assets/soclean .png'),
  },
  {
    id: 'local-33',
    name: 'La Perle Blanche Pressing',
    location: 'Rue de Fès',
    time: '9:00am - 5:00pm',
    day: 'Sunday Closed',
    rating: 4.7,
    image: require('../assets/pressing.png'),
  },
  {
    id: 'local-43',
    name: 'The Laundry Room RABAT',
    location: 'Rue Témara',
    time: '8:00am - 6:00pm',
    day: 'Sunday',
    rating: 4.2,
    image: require('../assets/laundryroom.png'),
  },
];

export default function HomeScreen() {
  const navigation = useNavigation();

  // État local des pressing (laundries) : on initialise avec les données locales
  const [laundries, setLaundries] = useState(DATA);

  // Texte de recherche pour filtrer la liste des pressing
  const [searchText, setSearchText] = useState('');

  // URL de l'API backend pour récupérer les pressing activés
  const API_URL = 'http://100.72.105.219:8080/api/laundries/activated';

  // useEffect appelé une fois au montage du composant pour récupérer les données distantes
  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then(json => {
        // On filtre uniquement les pressing activés (isActivated === true)
        // puis on mappe pour adapter les données au format attendu par la liste
        const filtered = json
          .filter(item => item.isActivated)
          .map(item => ({
            id: `remote-${item.id}`, // id unique (préfixé "remote-")
            name: item.name,
            location: item.address, // adresse dans le backend
            time: item.workHours,   // horaires dans le backend
            day: '',                // non fourni par le backend, on laisse vide
            services: item.services || [],  // <-- ajouter ici la liste des services
            rating: item.rating || 0, // note (si absente, on met 0)
            image: item.shopImage
              ? { uri: item.shopImage } // image depuis une URL
              : require('../assets/laundryowner.jpg'), // image par défaut locale
          }));

        // On met à jour l'état en ajoutant les données distantes aux données locales
        setLaundries([...DATA, ...filtered]);
      })
      .catch(error => {
        // En cas d'erreur, on affiche dans la console
        console.error('Erreur fetch laundries:', error);
      });
  }, []);

  // Fonction pour gérer le clic sur "Book Now" : redirige vers l'écran Order
  // avec les infos du pressing sélectionné en paramètre
  // Cette fonction est une action qui se déclenche quand on clique sur le bouton "Book Now".
  //transmet les données du pressing sélectionné à cet écran, sous forme de paramètres :
  //storeName: nom du pressing,

  const handlePress = (store) => {
  navigation.navigate('Order', {
    storeName: store.name,
    services: store.services || [],
  });
};


  // Filtrage de la liste en fonction du texte recherché (insensible à la casse)
  const filteredList = laundries.filter(item =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // Rendu d'un élément de la FlatList : une carte avec infos et bouton "Book Now"
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.details}>
          {item.time} {item.day ? `• ${item.day}` : ''}
        </Text>
        <Text style={styles.details}>{item.location}</Text>
        <Text style={styles.rating}>⭐ {item.rating.toFixed(1)}</Text>

         

        <TouchableOpacity
          style={styles.button}
          onPress={() => handlePress(item)}
        >
          <Text style={styles.buttonText}>
            Book Now <Ionicons name="arrow-forward" size={14} color="white" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche + bouton filtre */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput
            placeholder="Search"
            style={styles.input}
            value={searchText}
            onChangeText={setSearchText} // met à jour searchText à chaque saisie
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Liste des pressing filtrée */}
      <FlatList
        data={filteredList}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Barre de navigation en bas (non fonctionnelle ici) */}
      <View style={styles.bottomBar}>
        <TouchableOpacity>
          <Ionicons name="cart-outline" size={24} color="#aaa" />
          <Text style={styles.menuText}>Order</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.exploreButton}>
          <Ionicons name="compass" size={26} color="white" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="person-outline" size={24} color="#aaa" />
          <Text style={styles.menuText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#aaa" />
          <Text style={styles.menuText}>Notif</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles pour le composant
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: 50, // pour ne pas être sous la barre status
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginRight: 8,
  },
  input: {
    flex: 1,
    padding: 8,
  },
  filterButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 10,
  },
  list: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginVertical: 10,
    flexDirection: 'row',
    elevation: 3, // ombre Android
    padding: 10,
    borderColor: '#b9e2f5',
    borderWidth: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#003b57',
    marginBottom: 4,
  },
  details: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  rating: {
    fontSize: 12,
    marginTop: 2,
    color: '#444',
  },
  button: {
    marginTop: 8,
    backgroundColor: 'rgb(74, 146, 240)',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 13,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#fff',
  },
  exploreButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 50,
    marginBottom: 10,
    marginHorizontal: 15,
  },
  menuText: {
    fontSize: 11,
    textAlign: 'center',
    color: '#555',
    marginTop: 2,
  },
});
