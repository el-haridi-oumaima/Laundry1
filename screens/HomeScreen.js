import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
const DATA = [
  {
    id: '1',
    name: 'Pressing IK SEC Souissi',
    location: 'Av. Malak 10000',
    time: '8:00am - 6:30pm',
    day: 'Sunday Closed',
    rating: 4.5,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    name: 'So Clean Pressing',
    location: 'Rue 118',
    time: '8:30am - 7:00pm',
    day: 'Sunday',
    rating: 4.0,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    name: 'La Perle Blanche Pressing',
    location: 'Rue de Fès',
    time: '9:00am - 5:00pm',
    day: 'Sunday Closed',
    rating: 4.7,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    name: 'The Laundry Room RABAT',
    location: 'Rue Témara',
    time: '8:00am - 6:00pm',
    day: 'Sunday',
    rating: 4.2,
    image: 'https://via.placeholder.com/150',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation(); // 👈 C’est ici qu’on peut l’utiliser

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.details}>{item.time} • {item.day}</Text>
      <Text style={styles.details}>{item.location}</Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Order')} // 👈 Navigue vers OrderScreen
      >
        <Text style={styles.buttonText}>Book Now</Text>
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      {/* Search and Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#aaa" />
          <TextInput placeholder="Search" style={styles.input} />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cards List */}
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomBar}>
        <Ionicons name="compass-outline" size={24} color="#007AFF" />
        <Ionicons name="grid-outline" size={24} color="#aaa" />
        <Ionicons name="bookmark-outline" size={24} color="#aaa" />
        <Ionicons name="person-outline" size={24} color="#aaa" />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4', paddingTop: 50 },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 8,
    flex: 1,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  details: {
    fontSize: 12,
    color: '#555',
  },
  rating: {
    fontSize: 12,
    marginTop: 2,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 6,
    marginTop: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: '#fff',
  },
});
