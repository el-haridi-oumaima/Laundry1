import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import homeScreen from './screen_fournisseurs/homeScreen';
import FormulaireInscription from './screen_fournisseurs/FormulaireInscription';
import ActivateAccount from './screen_fournisseurs/ActivateAccount';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="ActivateAccount" screenOptions={{ headerShown: false }}>
          
          <Stack.Screen name="FormulaireInscription" component={FormulaireInscription} />
          <Stack.Screen name="ActivateAccount" component={ActivateAccount} />
          <Stack.Screen name="homeScreen" component={homeScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});