import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation();

  // Fonction pour naviguer vers le formulaire
  const navigateToForm = () => {
    navigation.navigate('FormulaireInscription');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Hello, </Text>
            <Text style={styles.headerNameText}>Rabat Washer</Text>
          </View>
          <Text style={styles.locationText}>Bayt Al Maarifa, El Irfane</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <View style={styles.notificationIcon}>
            <Text style={styles.bellIcon}>🔔</Text>
          </View>
        </TouchableOpacity>
      </View>
      
      {/* Pending Orders */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Pending Orders</Text>
        <View style={styles.pendingOrderCard}>
          <Text style={styles.pendingOrderText}>All caught up | No pending orders at the moment</Text>
        </View>
      </View>
      
      {/* Active Orders */}
      <View style={styles.sectionContainer}>
        <View style={styles.activeOrdersHeader}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>View all</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.activeOrdersList}>
          {/* Order 1 */}
          <View style={styles.orderCard}>
            <View style={styles.orderIconContainer}>
              <View style={styles.orderIcon}>
                <Text style={styles.orderIconText}>🛏️</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderIdText}>Order: 12457895621102</Text>
              <Text style={styles.orderTotalText}>Total: 150 DH</Text>
            </View>
          </View>
          
          {/* Order 2 */}
          <View style={styles.orderCard}>
            <View style={styles.orderIconContainer}>
              <View style={styles.orderIcon}>
                <Text style={styles.orderIconText}>👕</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderIdText}>Order: 12457895621102</Text>
              <Text style={styles.orderTotalText}>Total: 150 DH</Text>
            </View>
          </View>
          
          {/* Order 3 */}
          <View style={styles.orderCard}>
            <View style={styles.orderIconContainer}>
              <View style={styles.orderIcon}>
                <Text style={styles.orderIconText}>🧺</Text>
              </View>
            </View>
            <View style={styles.orderDetails}>
              <Text style={styles.orderIdText}>Order: 12457895621102</Text>
              <Text style={styles.orderTotalText}>Total: 150 DH</Text>
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>💬</Text>
          </View>
          <Text style={styles.activeTabText}>Explore</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>⊞</Text>
          </View>
          <Text style={styles.tabText}>Categories</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>🏪</Text>
          </View>
          <Text style={styles.tabText}>Stores</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.tabItem}>
          <View style={styles.tabIcon}>
            <Text style={styles.tabIconText}>👤</Text>
          </View>
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
  },
  headerNameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  locationText: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  pendingOrderCard: {
    backgroundColor: '#F2F7FF',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  pendingOrderText: {
    color: '#5F6368',
    fontSize: 14,
  },
  activeOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
  },
  activeOrdersList: {
    marginBottom: 100,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  orderIconContainer: {
    marginRight: 15,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#F2F7FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1ECFF',
  },
  orderIconText: {
    fontSize: 24,
  },
  orderDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  orderIdText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderTotalText: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tabBar: {
    flexDirection: 'row',
    height: 70,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabIconText: {
    fontSize: 20,
  },
  tabText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 4,
  },
  activeTabText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4,
  },
});

export default HomeScreen;