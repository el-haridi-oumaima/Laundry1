import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import FormulaireInscription from './screen_fournisseurs/FormulaireInscription'; // chemin selon l’emplacement du fichier

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <FormulaireInscription />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
