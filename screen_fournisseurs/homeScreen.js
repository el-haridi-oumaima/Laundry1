import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView, 
  StatusBar,
  ActivityIndicator,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [pendingOrders, setPendingOrders] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);

  // Get user name from navigation params or AsyncStorage
  useEffect(() => {
    const getUserName = async () => {
      try {
        // If passed through navigation
        if (route?.params?.userName) {
          setUserName(route.params.userName);
        } else {
          // Try to get from AsyncStorage or your preferred storage method
          // const storedName = await AsyncStorage.getItem('userName');
          // setUserName(storedName || 'User');
          setUserName('User'); // Fallback
        }
      } catch (error) {
        console.error('Error getting user name:', error);
        setUserName('User');
      }
    };

    getUserName();
  }, [route]);

  // Fetch orders from Spring Boot backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      
      // Get clientId from storage (adjust based on your auth implementation)
      // const clientId = await AsyncStorage.getItem('clientId');
      const clientId = route?.params?.clientId || 1; // Fallback for testing
      
      // Spring Boot API endpoints
      const baseUrl = 'http://192.168.43.107:8080'; // Replace with your Spring Boot server URL
      // For production: 'https://your-domain.com'
      
      const [pendingResponse, activeResponse] = await Promise.all([
        fetch(`${baseUrl}/api/orders/pending?clientId=${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add JWT token if using Spring Security
            // 'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${baseUrl}/api/orders/active?clientId=${clientId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            // Add JWT token if using Spring Security
            // 'Authorization': `Bearer ${token}`,
          },
        })
      ]);

      if (pendingResponse.ok && activeResponse.ok) {
        const pendingData = await pendingResponse.json();
        const activeData = await activeResponse.json();
        
        setPendingOrders(pendingData);
        setActiveOrders(activeData);
      } else {
        // Handle Spring Boot error responses
        const errorData = await pendingResponse.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      Alert.alert(
        'Connection Error', 
        'Failed to load orders. Please check your internet connection and try again.',
        [
          { text: 'Retry', onPress: () => fetchOrders() },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      
      // Fallback to empty arrays
      setPendingOrders([]);
      setActiveOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuPress = () => {
    setMenuVisible(!menuVisible);
  };

  const getOrderIcon = (orderType) => {
    switch (orderType?.toLowerCase()) {
      case 'laundry':
        return '🧺';
      case 'washing':
        return '🧼';
      case 'ironing':
        return '👕';
      case 'drying':
        return '🌪️';
      case 'general':
        return '🧹';
      default:
        return '🧺';
    }
  };

  const renderOrderCard = (order, index) => (
    <TouchableOpacity key={order.id || index} style={styles.orderCard}>
      <View style={styles.orderIconContainer}>
        <View style={styles.orderIcon}>
          <Text style={styles.orderIconText}>
            {getOrderIcon(order.type)}
          </Text>
        </View>
      </View>
      <View style={styles.orderDetails}>
        <Text style={styles.orderIdText}>Order: {order.orderNumber}</Text>
        <Text style={styles.orderTotalText}>Total: {order.total} DH</Text>
        {order.services && (
          <Text style={styles.orderServicesText}>Services: {order.services}</Text>
        )}
        {order.status && (
          <Text style={styles.orderStatusText}>Status: {order.status}</Text>
        )}
        {order.estimatedDelivery && (
          <Text style={styles.orderDeliveryText}>
            Delivery: {order.estimatedDelivery}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>Welcome, </Text>
            <Text style={styles.headerNameText}>{userName}</Text>
          </View>
          <Text style={styles.locationText}>Bayt Al Maarifa, El Irfane</Text>
        </View>
        
        {/* Menu Button */}
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <View style={styles.menuIcon}>
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
            <View style={styles.menuLine} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View style={styles.dropdownMenu}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Profile Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Order History</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Pending Orders */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Pending Orders</Text>
          {pendingOrders.length === 0 ? (
            <View style={styles.pendingOrderCard}>
              <Text style={styles.pendingOrderText}>
                All caught up | No pending orders at the moment
              </Text>
            </View>
          ) : (
            <View style={styles.pendingOrdersList}>
              {pendingOrders.map((order, index) => renderOrderCard(order, index))}
            </View>
          )}
        </View>
        
        {/* Active Orders */}
        <View style={styles.sectionContainer}>
          <View style={styles.activeOrdersHeader}>
            <Text style={styles.sectionTitle}>Active Orders</Text>
            {activeOrders.length > 3 && (
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {activeOrders.length === 0 ? (
            <View style={styles.emptyOrderCard}>
              <Text style={styles.emptyOrderText}>No active orders</Text>
            </View>
          ) : (
            <View style={styles.activeOrdersList}>
              {activeOrders.slice(0, 5).map((order, index) => renderOrderCard(order, index))}
            </View>
          )}
        </View>

        {/* Refresh Button */}
        <View style={styles.refreshContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={fetchOrders}>
            <Text style={styles.refreshButtonText}>Refresh Orders</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#8E8E93',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  headerTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333333',
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
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  menuIcon: {
    width: 20,
    height: 16,
    justifyContent: 'space-between',
  },
  menuLine: {
    height: 2,
    backgroundColor: '#333333',
    borderRadius: 1,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 80,
    right: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingVertical: 8,
    minWidth: 150,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItemText: {
    fontSize: 14,
    color: '#333333',
  },
  scrollContainer: {
    flex: 1,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333333',
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
    textAlign: 'center',
  },
  pendingOrdersList: {
    gap: 10,
  },
  activeOrdersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  activeOrdersList: {
    gap: 10,
  },
  emptyOrderCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyOrderText: {
    color: '#8E8E93',
    fontSize: 14,
    textAlign: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  orderIconContainer: {
    marginRight: 15,
  },
  orderIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
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
    fontWeight: '600',
    marginBottom: 4,
    color: '#333333',
  },
  orderTotalText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  orderServicesText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  orderStatusText: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
  },
  orderDeliveryText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  refreshContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  refreshButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;