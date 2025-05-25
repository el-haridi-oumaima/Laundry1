import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import RoleSelectionScreen from '../screens/RoleSelectionScreen';
import ClientStack from './AppNavigator';        // stack client
import FournisseurStack from './FournisseurNavigator';  // stack fournisseur

const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="RoleSelection">
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="ClientStack" component={ClientStack} />
        <Stack.Screen name="FournisseurStack" component={FournisseurStack} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
