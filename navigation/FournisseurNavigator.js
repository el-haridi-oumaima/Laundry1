import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import homeScreen from '../screen_fournisseurs/homeScreen'; // fournisseur home
import FormulaireInscription from '../screen_fournisseurs/FormulaireInscription';
import ActivateAccount from '../screen_fournisseurs/ActivateAccount';
import FournisseurLoginScreen from '../screen_fournisseurs/FournisseurLoginScreen';

const Stack = createNativeStackNavigator();

export default function FournisseurStack() {
  return (
    <Stack.Navigator initialRouteName="FormulaireInscription" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FormulaireInscription" component={FormulaireInscription} />
      <Stack.Screen name="ActivateAccount" component={ActivateAccount} />
      <Stack.Screen name="FournisseurLoginScreen" component={FournisseurLoginScreen} />

      <Stack.Screen name="homeScreen" component={homeScreen} />
    </Stack.Navigator>
  );
}
